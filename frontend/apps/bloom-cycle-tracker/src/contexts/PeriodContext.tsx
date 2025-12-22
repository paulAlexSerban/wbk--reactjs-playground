import { createContext, useContext, ReactNode } from 'react';
import { usePeriodData } from '@/hooks/usePeriodData';
import { useCycleCalculations } from '@/hooks/useCycleCalculations';

type PeriodContextType = ReturnType<typeof usePeriodData> & ReturnType<typeof useCycleCalculations>;

const PeriodContext = createContext<PeriodContextType | null>(null);

export function PeriodProvider({ children }: { children: ReactNode }) {
    const periodData = usePeriodData();
    const cycleCalculations = useCycleCalculations(periodData.data);

    const value = {
        ...periodData,
        ...cycleCalculations,
    };

    if (!periodData.isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse-soft text-primary text-xl font-display">Loading...</div>
            </div>
        );
    }

    return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>;
}

export function usePeriod() {
    const context = useContext(PeriodContext);
    if (!context) {
        throw new Error('usePeriod must be used within a PeriodProvider');
    }
    return context;
}
