import { usePeriod } from '@/contexts/PeriodContext';
import { format } from 'date-fns';
import { painAdviceData, redFlags, getAdviceForPainLevel, getAgeAppropriateAdvice } from '@/lib/painAdvice';
import {
    Flame,
    Activity,
    Apple,
    Moon,
    Pill,
    AlertTriangle,
    Droplets,
    Bath,
    Footprints,
    Wind,
    Coffee,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
    Flame,
    Activity,
    Apple,
    Moon,
    Pill,
    Droplets,
    Bath,
    Footprints,
    Wind,
    Coffee,
};

export default function Advice() {
    const { getLog, data } = usePeriod();
    const todayLog = getLog(format(new Date(), 'yyyy-MM-dd'));
    const painLevel = todayLog?.painLevel ?? 0;
    const advice = painLevel > 0 ? getAdviceForPainLevel(painLevel) : painAdviceData.slice(0, 4);
    const ageAdvice = getAgeAppropriateAdvice(data.profile.age);

    return (
        <div className="min-h-screen bg-background pb-20 safe-top">
            <header className="px-4 pt-6 pb-4">
                <h1 className="text-2xl font-display font-bold text-foreground">Pain Relief</h1>
                <p className="text-sm text-muted-foreground">Tips to feel better</p>
            </header>

            <main className="px-4 space-y-6">
                {painLevel > 0 && (
                    <div className="bg-accent/20 rounded-2xl p-4 border border-accent/30">
                        <p className="text-sm text-accent-foreground">
                            Based on your pain level ({painLevel}/5), here are some suggestions:
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {advice.map((item) => {
                        const Icon = iconMap[item.icon] || Flame;
                        return (
                            <div key={item.title} className="bg-card rounded-2xl p-4 border border-border">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {ageAdvice.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="font-display font-semibold text-foreground">For You</h3>
                        {ageAdvice.map((tip, i) => (
                            <p key={i} className="text-sm text-muted-foreground bg-secondary rounded-xl p-3">
                                {tip}
                            </p>
                        ))}
                    </div>
                )}

                <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
                    <div className="flex gap-3 items-start">
                        <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-foreground">When to See a Doctor</h3>
                            <ul className="mt-2 space-y-1">
                                {redFlags.slice(0, 4).map((flag, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">
                                        • {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
