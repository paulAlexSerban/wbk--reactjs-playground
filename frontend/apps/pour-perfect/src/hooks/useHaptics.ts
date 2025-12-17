import { useCallback } from 'react';

export function useHaptics() {
    const vibrate = useCallback((pattern: number | number[]) => {
        if ('vibrate' in navigator) {
            try {
                navigator.vibrate(pattern);
            } catch {
                // Silently fail if vibration not available
            }
        }
    }, []);

    const success = useCallback(() => {
        vibrate([50, 30, 50]); // Short double pulse
    }, [vibrate]);

    const warning = useCallback(() => {
        vibrate(100); // Single medium pulse
    }, [vibrate]);

    const error = useCallback(() => {
        vibrate([100, 50, 100, 50, 100]); // Triple pulse
    }, [vibrate]);

    const tap = useCallback(() => {
        vibrate(10); // Very short tap
    }, [vibrate]);

    const pourStart = useCallback(() => {
        vibrate(30); // Quick pulse
    }, [vibrate]);

    const pourEnd = useCallback(() => {
        vibrate([30, 20, 50]); // End signature
    }, [vibrate]);

    const excellent = useCallback(() => {
        vibrate([50, 30, 50, 30, 100]); // Celebration pattern
    }, [vibrate]);

    return {
        vibrate,
        success,
        warning,
        error,
        tap,
        pourStart,
        pourEnd,
        excellent,
    };
}
