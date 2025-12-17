import { useState, useEffect, useRef, useCallback } from 'react';

interface PourEvent {
    duration: number;
    volume: number;
    target: number;
    delta: number;
    timestamp: number;
}

interface PourTrackerConfig {
    pourRateMlPerSec?: number;
    tiltStartDeg?: number;
    tiltEndDeg?: number;
}

export function usePourTracker(beta: number | null, config: PourTrackerConfig = {}) {
    const { pourRateMlPerSec = 15, tiltStartDeg = 40, tiltEndDeg = 25 } = config;

    const [pouring, setPouring] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentVolume, setCurrentVolume] = useState(0);
    const [target, setTarget] = useState(45);
    const [history, setHistory] = useState<PourEvent[]>([]);

    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const updateCurrent = useCallback(() => {
        if (!pouring || startTimeRef.current === null) return;

        const now = performance.now();
        const durationSec = (now - startTimeRef.current) / 1000;
        const volumeMl = durationSec * pourRateMlPerSec;

        setCurrentTime(durationSec);
        setCurrentVolume(volumeMl);

        animationFrameRef.current = requestAnimationFrame(updateCurrent);
    }, [pouring, pourRateMlPerSec]);

    useEffect(() => {
        if (beta === null) return;

        const angle = Math.abs(beta);
        const now = performance.now();

        // Start pouring
        if (!pouring && angle > tiltStartDeg) {
            setPouring(true);
            startTimeRef.current = now;
            setCurrentTime(0);
            setCurrentVolume(0);
            animationFrameRef.current = requestAnimationFrame(updateCurrent);
        }
        // Stop pouring
        else if (pouring && angle < tiltEndDeg) {
            setPouring(false);

            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            if (startTimeRef.current !== null) {
                const durationSec = (now - startTimeRef.current) / 1000;
                const volumeMl = durationSec * pourRateMlPerSec;
                const delta = volumeMl - target;

                const pourEvent: PourEvent = {
                    duration: durationSec,
                    volume: volumeMl,
                    target,
                    delta,
                    timestamp: Date.now(),
                };

                setHistory((prev) => [pourEvent, ...prev.slice(0, 9)]);
                setCurrentTime(durationSec);
                setCurrentVolume(volumeMl);
            }

            startTimeRef.current = null;
        }
    }, [beta, pouring, target, tiltStartDeg, tiltEndDeg, pourRateMlPerSec, updateCurrent]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const delta = currentVolume - target;

    return {
        pouring,
        currentTime,
        currentVolume,
        target,
        delta,
        history,
        setTarget,
    };
}
