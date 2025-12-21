import { useState, useCallback, useEffect } from 'react';
import { Play, Square, RotateCcw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { useHaptics } from '@/hooks/useHaptics';
import { useAppState } from '@/hooks/useAppState';
import { sessionsDB } from '@/lib/db';
import { convertVolume, formatVolume, getUnitLabel } from '@/lib/volume-utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { PourSession } from '@/types';

const VOLUMES_OZ = [1, 1.5, 2];

export default function FreePracticePage() {
    const { currentProfile, preferences } = useAppState();
    const haptics = useHaptics();

    const [targetVolumeOz, setTargetVolumeOz] = useState(1.5);
    const [lastResult, setLastResult] = useState<{ accuracy: number; volume: number } | null>(null);
    const [showDebug, setShowDebug] = useState(false);

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

    const {
        pourState,
        startManualPour,
        stopManualPour,
        requestPermission,
        permissionGranted,
        isSupported,
        motionData,
        startListening,
    } = useDeviceMotion({
        onPourStart: handlePourStart,
        onPourEnd: handlePourEnd,
    });

    // Enable automatic pour detection when permission is granted
    useEffect(() => {
        if (permissionGranted && isSupported) {
            const cleanup = startListening();
            return cleanup;
        }
    }, [permissionGranted, isSupported, startListening]);

    // Auto-request permission on mount
    useEffect(() => {
        if (isSupported && !permissionGranted) {
            requestPermission();
        }
    }, [isSupported, permissionGranted, requestPermission]);

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 90) return 'text-success';
        if (accuracy >= 80) return 'text-warning';
        return 'text-destructive';
    };

    const progressPercent = Math.min((pourState.estimatedVolume / targetVolumeOz) * 100, 150);
    const progressColor =
        progressPercent <= 100 ? 'stroke-success' : progressPercent <= 120 ? 'stroke-warning' : 'stroke-destructive';

    // Calculate debug values
    const calculateBottleLikeMotion = (beta: number, gamma: number) => {
        const MIN_BETA_ANGLE = 30;
        const MAX_BETA_ANGLE = 85;
        const MAX_GAMMA_ANGLE = 45;
        const isForwardTilt = beta > MIN_BETA_ANGLE && beta < MAX_BETA_ANGLE;
        const isNotSideways = Math.abs(gamma) < MAX_GAMMA_ANGLE;
        const tiltRatio = Math.abs(beta) / (Math.abs(gamma) + 1);
        const isProperRatio = tiltRatio > 1.5;
        const isNotTooUpright = beta < MAX_BETA_ANGLE;
        return { isForwardTilt, isNotSideways, isProperRatio, tiltRatio, isNotTooUpright };
    };

    const debugInfo = motionData ? calculateBottleLikeMotion(motionData.beta, motionData.gamma) : null;

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
                    {pourState.isPouring
                        ? 'Pouring... level the bottle to stop'
                        : permissionGranted
                          ? 'Tilt your device forward to auto-start pouring'
                          : 'Enable motion sensors to auto-detect pours'}
                </p>

                {/* Debug Button */}
                <Button size="sm" variant="outline" className="mt-4" onClick={() => setShowDebug(!showDebug)}>
                    <Bug className="w-4 h-4 mr-2" />
                    Debug Sensors
                </Button>
            </div>

            {/* Manual Controls */}
            <div className="px-6 pb-24">
                <div className="flex gap-4">
                    {!pourState.isPouring ? (
                        <Button size="lg" className="flex-1 touch-target" onClick={startManualPour}>
                            <Play className="w-5 h-5 mr-2" />
                            Manual Start
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

            {/* Debug Modal */}
            <Dialog open={showDebug} onOpenChange={setShowDebug}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Bug className="w-5 h-5" />
                            Motion Sensor Debug
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* System Status */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">System Status</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center justify-between p-2 bg-secondary rounded">
                                    <span className="text-xs">Sensors Supported:</span>
                                    <Badge variant={isSupported ? 'default' : 'destructive'}>
                                        {isSupported ? 'Yes' : 'No'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-secondary rounded">
                                    <span className="text-xs">Permission:</span>
                                    <Badge variant={permissionGranted ? 'default' : 'secondary'}>
                                        {permissionGranted ? 'Granted' : 'Denied'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Current Motion Data */}
                        {motionData && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Current Motion Data</h3>
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div className="p-2 bg-secondary rounded">
                                        <div className="text-muted-foreground">Alpha (Z)</div>
                                        <div className="font-mono font-bold">{motionData.alpha.toFixed(1)}°</div>
                                    </div>
                                    <div className="p-2 bg-secondary rounded">
                                        <div className="text-muted-foreground">Beta (X)</div>
                                        <div className="font-mono font-bold">{motionData.beta.toFixed(1)}°</div>
                                    </div>
                                    <div className="p-2 bg-secondary rounded">
                                        <div className="text-muted-foreground">Gamma (Y)</div>
                                        <div className="font-mono font-bold">{motionData.gamma.toFixed(1)}°</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pour State */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Pour State</h3>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="p-2 bg-secondary rounded">
                                    <div className="text-muted-foreground">Pouring:</div>
                                    <div className="font-bold">
                                        <Badge variant={pourState.isPouring ? 'default' : 'secondary'}>
                                            {pourState.isPouring ? 'YES' : 'NO'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-2 bg-secondary rounded">
                                    <div className="text-muted-foreground">Tilt Angle:</div>
                                    <div className="font-mono font-bold">{pourState.tiltAngle.toFixed(1)}°</div>
                                </div>
                                <div className="p-2 bg-secondary rounded">
                                    <div className="text-muted-foreground">Velocity:</div>
                                    <div className="font-mono font-bold">{pourState.velocity.toFixed(1)} °/s</div>
                                </div>
                                <div className="p-2 bg-secondary rounded">
                                    <div className="text-muted-foreground">Duration:</div>
                                    <div className="font-mono font-bold">{pourState.duration.toFixed(2)}s</div>
                                </div>
                            </div>
                        </div>

                        {/* Detection Thresholds */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-sm">Auto-Detection Thresholds</h3>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between p-2 bg-secondary rounded">
                                    <span>Start Velocity Required:</span>
                                    <span className="font-mono font-bold">30 °/s</span>
                                </div>
                                <div className="flex justify-between p-2 bg-secondary rounded">
                                    <span>Start Angle Required:</span>
                                    <span className="font-mono font-bold">35°</span>
                                </div>
                                <div className="flex justify-between p-2 bg-secondary rounded">
                                    <span>Start Duration:</span>
                                    <span className="font-mono font-bold">150ms</span>
                                </div>
                                <div className="flex justify-between p-2 bg-secondary rounded">
                                    <span>Beta Range (Forward Tilt):</span>
                                    <span className="font-mono font-bold">30° - 85°</span>
                                </div>
                                <div className="flex justify-between p-2 bg-secondary rounded">
                                    <span>Max Sideways (Gamma):</span>
                                    <span className="font-mono font-bold">±45°</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottle-Like Motion Check */}
                        {motionData && debugInfo && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-sm">Bottle-Like Motion Check</h3>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between p-2 bg-secondary rounded">
                                        <span>In Pour Range (30° &lt; Beta &lt; 85°):</span>
                                        <Badge variant={debugInfo.isForwardTilt ? 'default' : 'destructive'}>
                                            {debugInfo.isForwardTilt ? '✓ Pass' : '✗ Fail'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between p-2 bg-secondary rounded">
                                        <span>Not Too Upright (Beta &lt; 85°):</span>
                                        <Badge variant={debugInfo.isNotTooUpright ? 'default' : 'destructive'}>
                                            {debugInfo.isNotTooUpright ? '✓ Pass' : '✗ Fail'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between p-2 bg-secondary rounded">
                                        <span>Not Sideways (|Gamma| &lt; 45°):</span>
                                        <Badge variant={debugInfo.isNotSideways ? 'default' : 'destructive'}>
                                            {debugInfo.isNotSideways ? '✓ Pass' : '✗ Fail'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between p-2 bg-secondary rounded">
                                        <span>Tilt Ratio (Beta/Gamma &gt; 1.5):</span>
                                        <Badge variant={debugInfo.isProperRatio ? 'default' : 'destructive'}>
                                            {debugInfo.tiltRatio.toFixed(2)} {debugInfo.isProperRatio ? '✓' : '✗'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="space-y-2 bg-blue-500/10 border border-blue-500/20 rounded p-3">
                            <h3 className="font-semibold text-sm text-blue-600 dark:text-blue-400">
                                How Auto-Detection Works
                            </h3>
                            <ul className="text-xs space-y-1 text-muted-foreground">
                                <li>
                                    1. Start with phone <strong>upright</strong> (bottle neck up, Beta ~70-90°)
                                </li>
                                <li>
                                    2. Tilt <strong>forward</strong> to pour position (Beta 30-85°)
                                </li>
                                <li>3. Move with velocity &gt; 30°/s (smooth, deliberate motion)</li>
                                <li>4. Keep minimal sideways tilt (|Gamma| &lt; 45°)</li>
                                <li>5. Hold conditions for 150ms → pour starts!</li>
                                <li>6. Level phone (velocity &lt; 8°/s) for 250ms → pour stops!</li>
                            </ul>
                        </div>

                        {!permissionGranted && (
                            <Button onClick={requestPermission} className="w-full">
                                Grant Motion Permission
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
