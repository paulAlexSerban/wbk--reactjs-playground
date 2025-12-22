import { format } from 'date-fns';
import { Plus, Droplets } from 'lucide-react';
import { usePeriod } from '@/contexts/PeriodContext';
import { Button } from '@/components/ui/button';
import { SYMPTOM_LABELS, MOOD_LABELS, Symptom } from '@/types/period';
import { cn } from '@/lib/utils';

interface QuickLogProps {
    onOpenLog: (date: Date) => void;
}

export function QuickLog({ onOpenLog }: QuickLogProps) {
    const { getLog, updateLog, togglePeriodDay } = usePeriod();
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayLog = getLog(todayStr);

    const quickSymptoms: Symptom[] = ['cramps', 'headache', 'fatigue', 'bloating'];

    const handleQuickSymptom = (symptom: Symptom) => {
        const currentSymptoms = todayLog?.symptoms ?? [];
        const newSymptoms = currentSymptoms.includes(symptom)
            ? currentSymptoms.filter((s) => s !== symptom)
            : [...currentSymptoms, symptom];

        updateLog(todayStr, { symptoms: newSymptoms });
    };

    return (
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold text-foreground">Today</h3>
                <span className="text-sm text-muted-foreground">{format(today, 'MMM d')}</span>
            </div>

            {/* Period toggle */}
            <Button
                variant={todayLog?.isPeriod ? 'default' : 'outline'}
                className={cn(
                    'w-full justify-start gap-3 h-11 rounded-xl',
                    todayLog?.isPeriod && 'bg-period hover:bg-period/90'
                )}
                onClick={() => togglePeriodDay(todayStr)}
            >
                <Droplets className="w-4 h-4" />
                {todayLog?.isPeriod ? 'Period today' : 'Log period'}
            </Button>

            {/* Quick symptoms */}
            <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Quick add symptoms</p>
                <div className="flex flex-wrap gap-2">
                    {quickSymptoms.map((symptom) => (
                        <button
                            key={symptom}
                            onClick={() => handleQuickSymptom(symptom)}
                            className={cn(
                                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                                todayLog?.symptoms?.includes(symptom)
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            )}
                        >
                            {SYMPTOM_LABELS[symptom]}
                        </button>
                    ))}
                </div>
            </div>

            {/* More options */}
            <Button
                variant="ghost"
                className="w-full justify-center gap-2 text-primary hover:text-primary/80"
                onClick={() => onOpenLog(today)}
            >
                <Plus className="w-4 h-4" />
                Log more details
            </Button>

            {/* Today's logged info */}
            {todayLog && (todayLog.symptoms.length > 0 || todayLog.mood || todayLog.painLevel) && (
                <div className="pt-3 border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground">Logged today:</p>
                    <div className="flex flex-wrap gap-1.5">
                        {todayLog.mood && (
                            <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                                {MOOD_LABELS[todayLog.mood]}
                            </span>
                        )}
                        {todayLog.painLevel && (
                            <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                                Pain: {todayLog.painLevel}/5
                            </span>
                        )}
                        {todayLog.symptoms.map((s) => (
                            <span key={s} className="px-2 py-0.5 bg-accent/30 rounded-full text-xs">
                                {SYMPTOM_LABELS[s]}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
