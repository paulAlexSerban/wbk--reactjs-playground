import { useState, useEffect, useCallback, useRef } from 'react';
import type { MotionData, PourState } from '@/types';

interface UseDeviceMotionOptions {
    pollRate?: number; // Hz
    onPourStart?: () => void;
    onPourEnd?: (duration: number) => void;
}

interface DeviceMotionState {
    isSupported: boolean;
    permissionGranted: boolean;
    error: string | null;
    motionData: MotionData | null;
    pourState: PourState;
}

// Pour detection thresholds - optimized for bottle-like pouring motion
const POUR_START_VELOCITY = 30; // deg/sec - lowered for smoother detection
const POUR_START_ANGLE = 35; // degrees - bottle tip threshold (forward tilt)
const POUR_START_DURATION = 150; // ms - faster response
const POUR_END_VELOCITY = 8; // deg/sec - more sensitive end detection
const POUR_END_DURATION = 250; // ms

// Bottle-like motion constraints
const MIN_BETA_ANGLE = 30; // Minimum forward tilt (like tipping a bottle)
const MAX_GAMMA_ANGLE = 45; // Maximum side tilt allowed (prevents sideways detection)
const BOTTLE_ORIENTATION_TOLERANCE = 20; // degrees of acceptable deviation

export function useDeviceMotion(options: UseDeviceMotionOptions = {}) {
    const { pollRate = 100, onPourStart, onPourEnd } = options;

    const [state, setState] = useState<DeviceMotionState>({
        isSupported: false,
        permissionGranted: false,
        error: null,
        motionData: null,
        pourState: {
            isPouring: false,
            startTime: null,
            duration: 0,
            tiltAngle: 0,
            velocity: 0,
            estimatedVolume: 0,
        },
    });

    const lastMotionRef = useRef<MotionData | null>(null);
    const pourStartTimeRef = useRef<number | null>(null);
    const pourEndCheckRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);
    const calibrationFactorRef = useRef<number>(0.5); // oz per second default

    // Check if device motion is supported
    useEffect(() => {
        const isSupported = 'DeviceOrientationEvent' in window || 'DeviceMotionEvent' in window;
        setState((s) => ({ ...s, isSupported }));
    }, []);

    const requestPermission = useCallback(async () => {
        try {
            // iOS 13+ requires permission
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                const permission = await (DeviceOrientationEvent as any).requestPermission();
                if (permission === 'granted') {
                    setState((s) => ({ ...s, permissionGranted: true, error: null }));
                    return true;
                } else {
                    setState((s) => ({ ...s, error: 'Motion permission denied' }));
                    return false;
                }
            } else {
                // Android and older iOS - permission granted by default
                setState((s) => ({ ...s, permissionGranted: true, error: null }));
                return true;
            }
        } catch (err) {
            setState((s) => ({ ...s, error: 'Failed to request motion permission' }));
            return false;
        }
    }, []);

    const setCalibrationFactor = useCallback((factor: number) => {
        calibrationFactorRef.current = factor;
    }, []);

    const calculateTiltAngle = useCallback((beta: number, gamma: number) => {
        // Calculate effective tilt angle for pour position
        // Beta = forward/backward tilt (what we want for bottle pouring)
        // Gamma = left/right tilt (should be minimal for proper bottle motion)
        return Math.sqrt(beta * beta + gamma * gamma);
    }, []);

    // Check if motion is bottle-like (primarily forward tilt, not sideways)
    const isBottleLikeMotion = useCallback((beta: number, gamma: number) => {
        // Beta should be positive (tilting forward like pouring from a bottle)
        // Gamma should be relatively small (not tilting sideways too much)
        const isForwardTilt = beta > MIN_BETA_ANGLE;
        const isNotSideways = Math.abs(gamma) < MAX_GAMMA_ANGLE;

        // The ratio of forward tilt to side tilt should favor forward tilt
        const tiltRatio = Math.abs(beta) / (Math.abs(gamma) + 1);
        const isProperRatio = tiltRatio > 1.5; // Forward tilt should dominate

        return isForwardTilt && isNotSideways && isProperRatio;
    }, []);

    const calculateVelocity = useCallback((current: MotionData, previous: MotionData) => {
        const dt = (current.timestamp - previous.timestamp) / 1000;
        if (dt <= 0) return 0;

        const dalpha = Math.abs(current.alpha - previous.alpha);
        const dbeta = Math.abs(current.beta - previous.beta);
        const dgamma = Math.abs(current.gamma - previous.gamma);

        return Math.sqrt(dalpha * dalpha + dbeta * dbeta + dgamma * dgamma) / dt;
    }, []);

    const handleMotionUpdate = useCallback(
        (motionData: MotionData) => {
            const tiltAngle = calculateTiltAngle(motionData.beta, motionData.gamma);
            let velocity = 0;

            if (lastMotionRef.current) {
                velocity = calculateVelocity(motionData, lastMotionRef.current);
            }

            lastMotionRef.current = motionData;

            setState((s) => {
                const now = Date.now();
                let newPourState = { ...s.pourState, tiltAngle, velocity };

                // Pour start detection - requires bottle-like motion
                if (!s.pourState.isPouring) {
                    const bottleLike = isBottleLikeMotion(motionData.beta, motionData.gamma);
                    if (velocity > POUR_START_VELOCITY && tiltAngle > POUR_START_ANGLE && bottleLike) {
                        if (!pourStartTimeRef.current) {
                            pourStartTimeRef.current = now;
                        } else if (now - pourStartTimeRef.current > POUR_START_DURATION) {
                            newPourState.isPouring = true;
                            newPourState.startTime = now;
                            newPourState.duration = 0;
                            newPourState.estimatedVolume = 0;
                            pourEndCheckRef.current = 0;
                            onPourStart?.();
                        }
                    } else {
                        pourStartTimeRef.current = null;
                    }
                }
                // Pour end detection
                else {
                    const duration = (now - (s.pourState.startTime || now)) / 1000;
                    const estimatedVolume = duration * calibrationFactorRef.current;

                    newPourState.duration = duration;
                    newPourState.estimatedVolume = estimatedVolume;

                    if (velocity < POUR_END_VELOCITY) {
                        if (pourEndCheckRef.current === 0) {
                            pourEndCheckRef.current = now;
                        } else if (now - pourEndCheckRef.current > POUR_END_DURATION) {
                            newPourState.isPouring = false;
                            onPourEnd?.(duration);
                            pourEndCheckRef.current = 0;
                            pourStartTimeRef.current = null;
                        }
                    } else {
                        pourEndCheckRef.current = 0;
                    }
                }

                return { ...s, motionData, pourState: newPourState };
            });
        },
        [calculateTiltAngle, calculateVelocity, onPourStart, onPourEnd]
    );

    const startListening = useCallback(() => {
        if (!state.permissionGranted) return;

        const handleOrientation = (event: DeviceOrientationEvent) => {
            const motionData: MotionData = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0,
                timestamp: Date.now(),
            };
            handleMotionUpdate(motionData);
        };

        window.addEventListener('deviceorientation', handleOrientation);

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state.permissionGranted, handleMotionUpdate]);

    // Manual pour control for testing/demo
    const startManualPour = useCallback(() => {
        setState((s) => ({
            ...s,
            pourState: {
                ...s.pourState,
                isPouring: true,
                startTime: Date.now(),
                duration: 0,
                estimatedVolume: 0,
            },
        }));
        onPourStart?.();
    }, [onPourStart]);

    const stopManualPour = useCallback(() => {
        const duration = state.pourState.startTime ? (Date.now() - state.pourState.startTime) / 1000 : 0;

        setState((s) => ({
            ...s,
            pourState: {
                ...s.pourState,
                isPouring: false,
                duration,
                estimatedVolume: duration * calibrationFactorRef.current,
            },
        }));
        onPourEnd?.(duration);
    }, [state.pourState.startTime, onPourEnd]);

    // Update duration in real-time while pouring
    useEffect(() => {
        if (!state.pourState.isPouring || !state.pourState.startTime) return;

        const updateDuration = () => {
            const now = Date.now();
            const duration = (now - state.pourState.startTime!) / 1000;
            const estimatedVolume = duration * calibrationFactorRef.current;

            setState((s) => ({
                ...s,
                pourState: {
                    ...s.pourState,
                    duration,
                    estimatedVolume,
                },
            }));

            animationFrameRef.current = requestAnimationFrame(updateDuration);
        };

        animationFrameRef.current = requestAnimationFrame(updateDuration);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [state.pourState.isPouring, state.pourState.startTime]);

    return {
        ...state,
        requestPermission,
        startListening,
        setCalibrationFactor,
        startManualPour,
        stopManualPour,
    };
}
