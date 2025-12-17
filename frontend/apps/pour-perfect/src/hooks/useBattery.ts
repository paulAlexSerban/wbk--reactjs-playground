import { useState, useEffect } from 'react';

export function useBattery() {
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const [usageStartTime] = useState(Date.now());

    useEffect(() => {
        const getBattery = async () => {
            try {
                if ('getBattery' in navigator) {
                    const battery = await (navigator as any).getBattery();

                    const updateBattery = () => {
                        setBatteryLevel(battery.level * 100);
                        setIsCharging(battery.charging);
                    };

                    updateBattery();
                    battery.addEventListener('levelchange', updateBattery);
                    battery.addEventListener('chargingchange', updateBattery);

                    return () => {
                        battery.removeEventListener('levelchange', updateBattery);
                        battery.removeEventListener('chargingchange', updateBattery);
                    };
                }
            } catch {
                // Battery API not available
            }
        };

        getBattery();
    }, []);

    // Check for 30-minute usage warning
    useEffect(() => {
        const checkUsage = setInterval(() => {
            const usageMinutes = (Date.now() - usageStartTime) / 1000 / 60;
            if (usageMinutes >= 30 && !showWarning) {
                setShowWarning(true);
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkUsage);
    }, [usageStartTime, showWarning]);

    const dismissWarning = () => setShowWarning(false);

    const shouldThrottle = batteryLevel !== null && batteryLevel < 15 && !isCharging;

    return {
        batteryLevel,
        isCharging,
        showWarning,
        shouldThrottle,
        dismissWarning,
    };
}
