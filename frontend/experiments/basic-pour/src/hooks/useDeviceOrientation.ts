import { useState, useEffect, useCallback } from 'react';

interface OrientationState {
    isSupported: boolean;
    isPermissionGranted: boolean | null;
    needsPermission: boolean;
    beta: number | null;
    gamma: number | null;
    alpha: number | null;
    error: string | null;
}

export function useDeviceOrientation() {
    const [orientation, setOrientation] = useState<OrientationState>(() => {
        const isSupported = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
        const needsPermission =
            isSupported && typeof (window.DeviceOrientationEvent as any)?.requestPermission === 'function';

        return {
            isSupported,
            isPermissionGranted: null,
            needsPermission,
            beta: null,
            gamma: null,
            alpha: null,
            error: null,
        };
    });

    const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
        setOrientation((prev) => ({
            ...prev,
            beta: event.beta,
            gamma: event.gamma,
            alpha: event.alpha,
        }));
    }, []);

    const requestPermission = useCallback(async () => {
        if (!orientation.isSupported) {
            setOrientation((prev) => ({
                ...prev,
                error: 'Device orientation is not supported on this device/browser.',
            }));
            return false;
        }

        if (orientation.needsPermission) {
            try {
                const DeviceOrientationEventConstructor = window.DeviceOrientationEvent as any;
                const permission = await DeviceOrientationEventConstructor.requestPermission();

                if (permission === 'granted') {
                    setOrientation((prev) => ({
                        ...prev,
                        isPermissionGranted: true,
                        error: null,
                    }));
                    window.addEventListener('deviceorientation', handleOrientation);
                    return true;
                } else {
                    setOrientation((prev) => ({
                        ...prev,
                        isPermissionGranted: false,
                        error: 'Permission denied. Please enable motion sensors in your browser settings.',
                    }));
                    return false;
                }
            } catch (err) {
                setOrientation((prev) => ({
                    ...prev,
                    error: `Permission request failed: ${err}`,
                }));
                return false;
            }
        } else {
            // No permission needed (Android/most browsers)
            setOrientation((prev) => ({
                ...prev,
                isPermissionGranted: true,
                error: null,
            }));
            window.addEventListener('deviceorientation', handleOrientation);
            return true;
        }
    }, [orientation.isSupported, orientation.needsPermission, handleOrientation]);

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [handleOrientation]);

    return {
        ...orientation,
        requestPermission,
    };
}
