import { useState, useCallback } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { useHaptics } from '@/hooks/useHaptics';
import { useAppState } from '@/hooks/useAppState';
import { sessionsDB } from '@/lib/db';
import { convertVolume, formatVolume, getUnitLabel } from '@/lib/volume-utils';
import type { PourSession } from '@/types';

const VOLUMES_OZ = [1, 1.5, 2];

export default function FreePracticePage() {
    const { currentProfile, preferences } = useAppState();
    const haptics = useHaptics();

    const [targetVolumeOz, setTargetVolumeOz] = useState(1.5);
    const [lastResult, setLastResult] = useState<{ accuracy: number; volume: number } | null>(null);

    const unit = preferences?.volume_unit || 'oz';

    const handlePourStart = useCallback(() => {
        haptics.pourStart();
        setLastResult(null);
    }, [haptics]);

    const handlePourEnd = useCallback(
        async (duration: number) => {
            haptics.pourEnd();

            const calibrationFactor = currentProfile?.calibration_factor || 0.5;
            const actualVolume = duration * calibrationFactor;
            const accuracy = Math.max(0, 100 - (Math.abs(actualVolume - targetVolumeOz) / targetVolumeOz) * 100);

            setLastResult({ accuracy, volume: actualVolume });

            if (accuracy >= 90) {
                haptics.excellent();
            } else if (accuracy >= 80) {
                haptics.success();
            } else {
                haptics.warning();
            }

            const session: PourSession = {
                id: `pour-${Date.now()}`,
                timestamp: Date.now(),
                volume_actual: actualVolume,
                volume_target: targetVolumeOz,
                accuracy_percentage: accuracy,
                pour_duration: duration,
                ingredient_name: 'Free Practice',
                spout_used: currentProfile?.spout_id || 'standard',
                handedness: preferences?.handedness || 'right',
                counting_method: preferences?.counting_method || 'seconds',
            };
            await sessionsDB.save(session);
        },
        [targetVolumeOz, currentProfile, preferences, haptics]
    );

    const { pourState, startManualPour, stopManualPour } = useDeviceMotion({
        onPourStart: handlePourStart,
        onPourEnd: handlePourEnd,
    });

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 90) return 'text-success';
        if (accuracy >= 80) return 'text-warning';
        return 'text-destructive';
    };

    const progressPercent = Math.min((pourState.estimatedVolume / targetVolumeOz) * 100, 150);
    const progressColor =
        progressPercent <= 100 ? 'stroke-success' : progressPercent <= 120 ? 'stroke-warning' : 'stroke-destructive';

    return (
        <AppLayout>
            <PageHeader title="Free Practice" showBack />

            {/* Volume Selector */}
            <div className="px-6 py-4">
                <p className="text-sm text-muted-foreground mb-2">Target Volume</p>
                <div className="flex gap-2">
                    {VOLUMES_OZ.map((vol) => (
                        <Button
                            key={vol}
                            variant={targetVolumeOz === vol ? 'default' : 'secondary'}
                            className="flex-1"
                            onClick={() => setTargetVolumeOz(vol)}
                        >
                            {formatVolume(vol, unit, unit === 'ml' ? 0 : 1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Pour Visualization */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="relative w-64 h-64">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            className={`${progressColor} transition-all duration-100`}
                            strokeWidth="8"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {pourState.isPouring ? (
                            <>
                                <p className="text-4xl font-bold text-foreground">
                                    {unit === 'ml'
                                        ? Math.round(convertVolume(pourState.estimatedVolume, unit))
                                        : convertVolume(pourState.estimatedVolume, unit).toFixed(2)}
                                </p>
                                <p className="text-muted-foreground">{getUnitLabel(unit)}</p>
                                <p className="text-sm text-muted-foreground mt-2">{pourState.duration.toFixed(1)}s</p>
                            </>
                        ) : lastResult ? (
                            <>
                                <p className={`text-5xl font-bold ${getAccuracyColor(lastResult.accuracy)}`}>
                                    {lastResult.accuracy.toFixed(0)}%
                                </p>
                                <p className="text-muted-foreground">
                                    {formatVolume(lastResult.volume, unit)} / {formatVolume(targetVolumeOz, unit)}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-5xl font-bold text-foreground">
                                    {unit === 'ml' ? Math.round(convertVolume(targetVolumeOz, unit)) : targetVolumeOz}
                                </p>
                                <p className="text-muted-foreground">{getUnitLabel(unit)} target</p>
                            </>
                        )}
                    </div>
                </div>

                <p className="text-center text-muted-foreground mt-8 max-w-xs">
                    {pourState.isPouring ? 'Pouring... level the bottle to stop' : 'Tilt your device to start pouring'}
                </p>
            </div>

            {/* Manual Controls */}
            <div className="px-6 pb-24">
                <div className="flex gap-4">
                    {!pourState.isPouring ? (
                        <Button size="lg" className="flex-1 touch-target" onClick={startManualPour}>
                            <Play className="w-5 h-5 mr-2" />
                            Start Pour
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            variant="destructive"
                            className="flex-1 touch-target"
                            onClick={stopManualPour}
                        >
                            <Square className="w-5 h-5 mr-2" />
                            Stop Pour
                        </Button>
                    )}
                    {lastResult && !pourState.isPouring && (
                        <Button size="lg" variant="secondary" onClick={() => setLastResult(null)}>
                            <RotateCcw className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
