import { useMemo } from 'react';
import { PeriodData, CyclePhase, Anomaly } from '@/types/period';
import { format, parseISO, differenceInDays, addDays, startOfDay, isSameDay, isAfter, isBefore } from 'date-fns';

export function useCycleCalculations(data: PeriodData) {
    // Find the last period start date
    const lastPeriodStart = useMemo(() => {
        const periodDays = Object.values(data.logs)
            .filter((log) => log.isPeriod)
            .map((log) => log.date)
            .sort()
            .reverse();

        if (periodDays.length === 0) return null;

        // Find the start of the most recent period (consecutive period days)
        let currentStart = periodDays[0];
        for (let i = 1; i < periodDays.length; i++) {
            const diff = differenceInDays(parseISO(currentStart), parseISO(periodDays[i]));
            if (diff === 1) {
                currentStart = periodDays[i];
            } else {
                break;
            }
        }

        return currentStart;
    }, [data.logs]);

    // Calculate average cycle length from history
    const averageCycleLength = useMemo(() => {
        const completeCycles = data.cycles.filter((c) => c.length && c.length > 0);
        if (completeCycles.length === 0) return data.profile.averageCycleLength;

        const sum = completeCycles.reduce((acc, c) => acc + (c.length || 0), 0);
        return Math.round(sum / completeCycles.length);
    }, [data.cycles, data.profile.averageCycleLength]);

    // Calculate average period length
    const averagePeriodLength = useMemo(() => {
        const periodLengths: number[] = [];
        const periodDays = Object.values(data.logs)
            .filter((log) => log.isPeriod)
            .map((log) => log.date)
            .sort();

        let currentLength = 0;
        let lastDate: string | null = null;

        for (const date of periodDays) {
            if (lastDate && differenceInDays(parseISO(date), parseISO(lastDate)) === 1) {
                currentLength++;
            } else {
                if (currentLength > 0) periodLengths.push(currentLength);
                currentLength = 1;
            }
            lastDate = date;
        }
        if (currentLength > 0) periodLengths.push(currentLength);

        if (periodLengths.length === 0) return data.profile.averagePeriodLength;
        return Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length);
    }, [data.logs, data.profile.averagePeriodLength]);

    // Get current cycle phase
    const currentPhase = useMemo((): CyclePhase | null => {
        if (!lastPeriodStart) return null;

        const today = startOfDay(new Date());
        const cycleDay = differenceInDays(today, parseISO(lastPeriodStart)) + 1;
        const nextPeriodDate = addDays(parseISO(lastPeriodStart), averageCycleLength);
        const daysUntilPeriod = differenceInDays(nextPeriodDate, today);

        // Check if currently on period
        const todayLog = data.logs[format(today, 'yyyy-MM-dd')];
        if (todayLog?.isPeriod) {
            return { phase: 'period', day: cycleDay, daysUntilPeriod: daysUntilPeriod > 0 ? daysUntilPeriod : 0 };
        }

        // Determine phase based on cycle day
        if (cycleDay <= averagePeriodLength) {
            return { phase: 'period', day: cycleDay, daysUntilPeriod };
        } else if (cycleDay <= 13) {
            return { phase: 'follicular', day: cycleDay, daysUntilPeriod };
        } else if (cycleDay <= 16) {
            return { phase: 'ovulation', day: cycleDay, daysUntilPeriod };
        } else {
            return { phase: 'luteal', day: cycleDay, daysUntilPeriod };
        }
    }, [lastPeriodStart, averageCycleLength, averagePeriodLength, data.logs]);

    // Get next period prediction
    const nextPeriodDate = useMemo(() => {
        if (!lastPeriodStart) return null;
        return addDays(parseISO(lastPeriodStart), averageCycleLength);
    }, [lastPeriodStart, averageCycleLength]);

    // Get fertile window (typically days 10-17 of cycle)
    const fertileWindow = useMemo(() => {
        if (!lastPeriodStart) return null;
        const start = addDays(parseISO(lastPeriodStart), 9); // Day 10
        const end = addDays(parseISO(lastPeriodStart), 16); // Day 17
        return { start, end };
    }, [lastPeriodStart]);

    // Ovulation day (typically day 14)
    const ovulationDate = useMemo(() => {
        if (!lastPeriodStart) return null;
        return addDays(parseISO(lastPeriodStart), 13); // Day 14
    }, [lastPeriodStart]);

    // Check if a date is predicted period
    const isPredictedPeriod = (date: Date): boolean => {
        if (!nextPeriodDate) return false;
        const dayDiff = differenceInDays(date, nextPeriodDate);
        return dayDiff >= 0 && dayDiff < averagePeriodLength;
    };

    // Check if a date is in fertile window
    const isInFertileWindow = (date: Date): boolean => {
        if (!fertileWindow) return false;
        return !isBefore(date, fertileWindow.start) && !isAfter(date, fertileWindow.end);
    };

    // Check if date is ovulation
    const isOvulationDay = (date: Date): boolean => {
        if (!ovulationDate) return false;
        return isSameDay(date, ovulationDate);
    };

    // Detect anomalies
    const anomalies = useMemo((): Anomaly[] => {
        const detected: Anomaly[] = [];

        // Check for long cycles (>35 days)
        data.cycles.forEach((cycle) => {
            if (cycle.length && cycle.length > 35) {
                detected.push({
                    type: 'long_cycle',
                    message: `Your cycle starting ${format(parseISO(cycle.startDate), 'MMM d')} was ${cycle.length} days - longer than typical (21-35 days).`,
                    severity: 'warning',
                    date: cycle.startDate,
                });
            }
            if (cycle.length && cycle.length < 21) {
                detected.push({
                    type: 'short_cycle',
                    message: `Your cycle starting ${format(parseISO(cycle.startDate), 'MMM d')} was ${cycle.length} days - shorter than typical (21-35 days).`,
                    severity: 'warning',
                    date: cycle.startDate,
                });
            }
        });

        // Check for missed period (if prediction is more than 7 days overdue)
        if (nextPeriodDate && currentPhase) {
            const daysOverdue = differenceInDays(new Date(), nextPeriodDate);
            if (daysOverdue > 7) {
                detected.push({
                    type: 'missed_period',
                    message: `Your period is ${daysOverdue} days late. Consider taking a pregnancy test or consulting a doctor if this is unusual for you.`,
                    severity: 'alert',
                });
            }
        }

        // Check for heavy flow lasting too long
        const heavyFlowDays = Object.values(data.logs).filter(
            (log) => log.isPeriod && log.flowIntensity === 'heavy'
        ).length;

        if (heavyFlowDays > 3) {
            detected.push({
                type: 'heavy_flow',
                message: `You've logged ${heavyFlowDays} days of heavy flow. If this is unusual, consider speaking with a healthcare provider.`,
                severity: 'info',
            });
        }

        return detected;
    }, [data.cycles, data.logs, nextPeriodDate, currentPhase]);

    return {
        lastPeriodStart,
        averageCycleLength,
        averagePeriodLength,
        currentPhase,
        nextPeriodDate,
        fertileWindow,
        ovulationDate,
        isPredictedPeriod,
        isInFertileWindow,
        isOvulationDay,
        anomalies,
    };
}
