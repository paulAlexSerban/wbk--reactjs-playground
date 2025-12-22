import { usePeriod } from '@/contexts/PeriodContext';
import { TrendingUp, Calendar, Droplets, Activity } from 'lucide-react';
import { AnomalyAlerts } from '@/components/AnomalyAlerts';

export default function Insights() {
    const { averageCycleLength, averagePeriodLength, data } = usePeriod();

    const totalLogged = Object.keys(data.logs).length;
    const periodDays = Object.values(data.logs).filter((l) => l.isPeriod).length;

    const stats = [
        { label: 'Avg Cycle', value: `${averageCycleLength} days`, icon: Calendar },
        { label: 'Avg Period', value: `${averagePeriodLength} days`, icon: Droplets },
        { label: 'Days Logged', value: totalLogged.toString(), icon: Activity },
        { label: 'Cycles Tracked', value: data.cycles.length.toString(), icon: TrendingUp },
    ];

    return (
        <div className="min-h-screen bg-background pb-20 safe-top">
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-display font-bold text-foreground">Insights</h1>
                <p className="text-sm text-muted-foreground">Your cycle patterns</p>
            </header>

            <main className="px-4 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-card rounded-2xl p-4 border border-border">
                            <Icon className="w-5 h-5 text-primary mb-2" />
                            <p className="text-2xl font-display font-bold text-foreground">{value}</p>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                    ))}
                </div>

                <AnomalyAlerts />

                {totalLogged === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Start logging to see your insights!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
