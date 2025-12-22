import { useState } from 'react';
import { format } from 'date-fns';
import { X, Droplets, ThermometerSun } from 'lucide-react';
import { usePeriod } from '@/contexts/PeriodContext';
import { DayLog, Symptom, Mood, FlowIntensity, SYMPTOM_LABELS, MOOD_LABELS, FLOW_LABELS } from '@/types/period';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface DayLogEditorProps {
    date: Date;
    onClose: () => void;
}

export function DayLogEditor({ date, onClose }: DayLogEditorProps) {
    const { getLog, updateLog, togglePeriodDay } = usePeriod();
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingLog = getLog(dateStr);

    const [log, setLog] = useState<Partial<DayLog>>({
        isPeriod: existingLog?.isPeriod ?? false,
        flowIntensity: existingLog?.flowIntensity,
        painLevel: existingLog?.painLevel,
        symptoms: existingLog?.symptoms ?? [],
        mood: existingLog?.mood,
        notes: existingLog?.notes ?? '',
    });

    const handleSave = () => {
        updateLog(dateStr, log);
        onClose();
    };

    const toggleSymptom = (symptom: Symptom) => {
        setLog((prev) => ({
            ...prev,
            symptoms: prev.symptoms?.includes(symptom)
                ? prev.symptoms.filter((s) => s !== symptom)
                : [...(prev.symptoms || []), symptom],
        }));
    };

    const symptoms = Object.entries(SYMPTOM_LABELS) as [Symptom, string][];
    const moods = Object.entries(MOOD_LABELS) as [Mood, string][];
    const flows = Object.entries(FLOW_LABELS) as [FlowIntensity, string][];

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
            <div className="bg-card w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-xl border border-border overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-display font-semibold">{format(date, 'EEEE')}</h2>
                        <p className="text-sm text-muted-foreground">{format(date, 'MMMM d, yyyy')}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-4 space-y-6 max-h-[calc(90vh-140px)]">
                    {/* Period Toggle */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Period</label>
                        <Button
                            variant={log.isPeriod ? 'default' : 'outline'}
                            className={cn(
                                'w-full justify-start gap-3 h-12 rounded-xl',
                                log.isPeriod && 'bg-period hover:bg-period/90'
                            )}
                            onClick={() => setLog((prev) => ({ ...prev, isPeriod: !prev.isPeriod }))}
                        >
                            <Droplets className="w-5 h-5" />
                            {log.isPeriod ? 'On my period' : 'Not on period'}
                        </Button>
                    </div>

                    {/* Flow Intensity */}
                    {log.isPeriod && (
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-foreground">Flow Intensity</label>
                            <div className="grid grid-cols-4 gap-2">
                                {flows.map(([value, label]) => (
                                    <button
                                        key={value}
                                        onClick={() => setLog((prev) => ({ ...prev, flowIntensity: value }))}
                                        className={cn(
                                            'p-3 rounded-xl border-2 text-xs font-medium transition-all',
                                            log.flowIntensity === value
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50'
                                        )}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pain Level */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Pain Level</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    onClick={() =>
                                        setLog((prev) => ({
                                            ...prev,
                                            painLevel: prev.painLevel === level ? undefined : level,
                                        }))
                                    }
                                    className={cn(
                                        'flex-1 aspect-square rounded-xl border-2 font-medium transition-all flex items-center justify-center',
                                        log.painLevel === level
                                            ? level <= 2
                                                ? 'border-pain-mild bg-pain-mild/30 text-foreground'
                                                : level <= 4
                                                  ? 'border-pain-moderate bg-pain-moderate/30 text-foreground'
                                                  : 'border-pain-severe bg-pain-severe/30 text-foreground'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground text-center">1 = None, 5 = Severe</p>
                    </div>

                    {/* Mood */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Mood</label>
                        <div className="flex flex-wrap gap-2">
                            {moods.map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() =>
                                        setLog((prev) => ({ ...prev, mood: prev.mood === value ? undefined : value }))
                                    }
                                    className={cn(
                                        'px-3 py-2 rounded-xl border-2 text-sm transition-all',
                                        log.mood === value
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border hover:border-primary/50'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Symptoms */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Symptoms</label>
                        <div className="flex flex-wrap gap-2">
                            {symptoms.map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => toggleSymptom(value)}
                                    className={cn(
                                        'px-3 py-2 rounded-xl border-2 text-sm transition-all',
                                        log.symptoms?.includes(value)
                                            ? 'border-accent bg-accent/30 text-accent-foreground'
                                            : 'border-border hover:border-accent/50'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">Notes</label>
                        <Textarea
                            placeholder="How are you feeling today?"
                            value={log.notes}
                            onChange={(e) => setLog((prev) => ({ ...prev, notes: e.target.value }))}
                            className="rounded-xl resize-none"
                            rows={3}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
                    <Button onClick={handleSave} className="w-full h-12 rounded-xl text-base font-semibold">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
