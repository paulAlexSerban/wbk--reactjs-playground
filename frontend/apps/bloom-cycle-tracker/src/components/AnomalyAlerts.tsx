import { usePeriod } from '@/contexts/PeriodContext';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AnomalyAlerts() {
    const { anomalies } = usePeriod();

    if (anomalies.length === 0) return null;

    const severityConfig = {
        info: {
            icon: Info,
            bg: 'bg-secondary',
            border: 'border-secondary-foreground/20',
            iconColor: 'text-secondary-foreground',
        },
        warning: {
            icon: AlertCircle,
            bg: 'bg-warning/10',
            border: 'border-warning/30',
            iconColor: 'text-warning',
        },
        alert: {
            icon: AlertTriangle,
            bg: 'bg-destructive/10',
            border: 'border-destructive/30',
            iconColor: 'text-destructive',
        },
    };

    return (
        <div className="space-y-3">
            <h3 className="font-display font-semibold text-foreground">Heads Up</h3>
            {anomalies.slice(0, 3).map((anomaly, index) => {
                const config = severityConfig[anomaly.severity];
                const Icon = config.icon;

                return (
                    <div
                        key={`${anomaly.type}-${index}`}
                        className={cn('rounded-xl p-4 border flex gap-3', config.bg, config.border)}
                    >
                        <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', config.iconColor)} />
                        <p className="text-sm text-foreground/90">{anomaly.message}</p>
                    </div>
                );
            })}
        </div>
    );
}
