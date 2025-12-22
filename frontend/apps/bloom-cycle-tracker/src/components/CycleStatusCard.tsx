import { usePeriod } from '@/contexts/PeriodContext';
import { format, differenceInDays } from 'date-fns';
import { Droplets, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CycleStatusCard() {
    const { currentPhase, nextPeriodDate, lastPeriodStart, averageCycleLength, data } = usePeriod();

    const phaseConfig = {
        period: {
            icon: Droplets,
            title: 'On Your Period',
            color: 'text-period',
            bg: 'bg-period/10',
            description: 'Take it easy and be gentle with yourself',
        },
        follicular: {
            icon: Sun,
            title: 'Follicular Phase',
            color: 'text-fertile-foreground',
            bg: 'bg-fertile/20',
            description: 'Energy is rising – great time for new projects',
        },
        ovulation: {
            icon: Sparkles,
            title: 'Ovulation Window',
            color: 'text-ovulation-foreground',
            bg: 'bg-ovulation/30',
            description: 'Peak energy and fertility',
        },
        luteal: {
            icon: Moon,
            title: 'Luteal Phase',
            color: 'text-predicted-foreground',
            bg: 'bg-predicted/30',
            description: 'Winding down – self-care is important',
        },
    };

    if (!currentPhase || !lastPeriodStart) {
        return (
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-secondary mx-auto flex items-center justify-center">
                        <Droplets className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-display font-semibold">Welcome!</h2>
                    <p className="text-muted-foreground text-sm">Log your first period to start tracking your cycle</p>
                </div>
            </div>
        );
    }

    const config = phaseConfig[currentPhase.phase];
    const Icon = config.icon;
    const daysUntilPeriod = currentPhase.daysUntilPeriod ?? 0;

    return (
        <div className={cn('rounded-2xl p-6 shadow-sm border border-border', config.bg)}>
            <div className="flex items-start gap-4">
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center', config.bg)}>
                    <Icon className={cn('w-7 h-7', config.color)} />
                </div>

                <div className="flex-1">
                    <h2 className={cn('text-xl font-display font-semibold', config.color)}>{config.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">Day {currentPhase.day} of your cycle</p>
                    <p className="text-foreground/80 text-sm mt-2">{config.description}</p>
                </div>
            </div>

            {nextPeriodDate && currentPhase.phase !== 'period' && (
                <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Next period expected</span>
                        <span className="font-medium">
                            {daysUntilPeriod <= 0
                                ? 'Any day now'
                                : daysUntilPeriod === 1
                                  ? 'Tomorrow'
                                  : `In ${daysUntilPeriod} days`}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Around {format(nextPeriodDate, 'MMMM d')}</p>
                </div>
            )}
        </div>
    );
}
