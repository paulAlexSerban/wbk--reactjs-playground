import { useState, useEffect, useCallback } from 'react';
import { PeriodData, DayLog, UserProfile, CycleData } from '@/types/period';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';

const STORAGE_KEY = 'period-tracker-data';

const defaultProfile: UserProfile = {
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lastUpdated: new Date().toISOString(),
    reminderEnabled: true,
    reminderDaysBefore: 3,
    dailyLogReminder: false,
    theme: 'system',
};

const defaultData: PeriodData = {
    logs: {},
    cycles: [],
    profile: defaultProfile,
};

export function usePeriodData() {
    const [data, setData] = useState<PeriodData>(defaultData);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load data from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setData({ ...defaultData, ...parsed, profile: { ...defaultProfile, ...parsed.profile } });
            }
        } catch (error) {
            console.error('Error loading period data:', error);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (error) {
                console.error('Error saving period data:', error);
            }
        }
    }, [data, isLoaded]);

    const updateLog = useCallback((date: string, log: Partial<DayLog>) => {
        setData((prev) => {
            const existingLog = prev.logs[date] || { date, isPeriod: false, symptoms: [] };
            const updatedLog = { ...existingLog, ...log, date };

            return {
                ...prev,
                logs: {
                    ...prev.logs,
                    [date]: updatedLog,
                },
            };
        });
    }, []);

    const getLog = useCallback(
        (date: string): DayLog | undefined => {
            return data.logs[date];
        },
        [data.logs]
    );

    const updateProfile = useCallback((profile: Partial<UserProfile>) => {
        setData((prev) => ({
            ...prev,
            profile: { ...prev.profile, ...profile, lastUpdated: new Date().toISOString() },
        }));
    }, []);

    const startPeriod = useCallback((date: string) => {
        setData((prev) => {
            // Close any open cycle
            const updatedCycles = prev.cycles.map((cycle, index) => {
                if (index === prev.cycles.length - 1 && !cycle.endDate) {
                    const length = differenceInDays(parseISO(date), parseISO(cycle.startDate));
                    return { ...cycle, endDate: format(addDays(parseISO(date), -1), 'yyyy-MM-dd'), length };
                }
                return cycle;
            });

            // Start new cycle
            const newCycle: CycleData = { startDate: date };

            return {
                ...prev,
                cycles: [...updatedCycles, newCycle],
                logs: {
                    ...prev.logs,
                    [date]: { ...prev.logs[date], date, isPeriod: true, symptoms: prev.logs[date]?.symptoms || [] },
                },
            };
        });
    }, []);

    const endPeriod = useCallback((date: string) => {
        setData((prev) => {
            const updatedLogs = { ...prev.logs };
            updatedLogs[date] = {
                ...updatedLogs[date],
                date,
                isPeriod: true,
                symptoms: updatedLogs[date]?.symptoms || [],
            };

            return {
                ...prev,
                logs: updatedLogs,
            };
        });
    }, []);

    const togglePeriodDay = useCallback((date: string) => {
        setData((prev) => {
            const existingLog = prev.logs[date];
            const isPeriod = !(existingLog?.isPeriod ?? false);

            return {
                ...prev,
                logs: {
                    ...prev.logs,
                    [date]: {
                        ...existingLog,
                        date,
                        isPeriod,
                        symptoms: existingLog?.symptoms || [],
                        flowIntensity: isPeriod ? existingLog?.flowIntensity || 'medium' : undefined,
                    },
                },
            };
        });
    }, []);

    const exportData = useCallback(() => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `period-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [data]);

    const importData = useCallback((jsonData: string) => {
        try {
            const parsed = JSON.parse(jsonData);
            setData({ ...defaultData, ...parsed, profile: { ...defaultProfile, ...parsed.profile } });
            return true;
        } catch {
            return false;
        }
    }, []);

    const clearAllData = useCallback(() => {
        setData(defaultData);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        data,
        isLoaded,
        updateLog,
        getLog,
        updateProfile,
        startPeriod,
        endPeriod,
        togglePeriodDay,
        exportData,
        importData,
        clearAllData,
    };
}
