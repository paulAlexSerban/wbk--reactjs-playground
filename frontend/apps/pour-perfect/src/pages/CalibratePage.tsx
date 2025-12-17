import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Hand, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { useHaptics } from '@/hooks/useHaptics';
import { useAppState } from '@/hooks/useAppState';
import type { CalibrationProfile } from '@/types';

const STEPS = [
    { id: 'baseline', title: 'Baseline Tilt', description: 'Place phone flat on table', icon: Smartphone, duration: 3 },
    { id: 'grip', title: 'Grip Offset', description: 'Hold phone like a bottle', icon: Hand, duration: 3 },
    { id: 'pour1', title: 'First Pour', description: 'Pour 1oz of water', icon: Droplets, duration: 5 },
    { id: 'pour2', title: 'Second Pour', description: 'Pour another 1oz', icon: Droplets, duration: 5 },
    { id: 'pour3', title: 'Third Pour', description: 'Final 1oz pour', icon: Droplets, duration: 5 },
];

export default function CalibratePage() {
    const navigate = useNavigate();
    const { saveCalibrationProfile, preferences } = useAppState();
    const { requestPermission, permissionGranted, isSupported, motionData } = useDeviceMotion();
    const haptics = useHaptics();

    const [currentStep, setCurrentStep] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [captureProgress, setCaptureProgress] = useState(0);
    const [calibrationData, setCalibrationData] = useState<any>({});

    const step = STEPS[currentStep];
    const progress = (currentStep / STEPS.length) * 100;

    const handleRequestPermission = async () => {
        const granted = await requestPermission();
        if (granted) {
            haptics.success();
        }
    };

    const startCapture = useCallback(() => {
        setIsCapturing(true);
        setCaptureProgress(0);
        haptics.tap();

        const duration = step.duration * 1000;
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const prog = Math.min((elapsed / duration) * 100, 100);
            setCaptureProgress(prog);

            if (elapsed >= duration) {
                clearInterval(interval);
                setIsCapturing(false);
                haptics.success();

                setCalibrationData((prev: any) => ({
                    ...prev,
                    [step.id]: motionData || { alpha: 0, beta: 0, gamma: 0 },
                }));

                if (currentStep < STEPS.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    finishCalibration();
                }
            }
        }, 50);
    }, [step, currentStep, motionData, haptics]);

    const finishCalibration = async () => {
        const calibrationFactor = 0.5;

        const profile: CalibrationProfile = {
            id: `profile-${Date.now()}`,
            spout_id: preferences?.spout_id || 'standard',
            device_id: navigator.userAgent.slice(0, 50),
            calibration_factor: calibrationFactor,
            baseline_tilt: calibrationData.baseline || { alpha: 0, beta: 0, gamma: 0 },
            grip_offset: calibrationData.grip || { alpha: 0, beta: 0, gamma: 0 },
            timestamp: Date.now(),
            handedness: preferences?.handedness || 'right',
        };

        await saveCalibrationProfile(profile);
        haptics.excellent();
        navigate('/');
    };

    if (!isSupported) {
        return (
            <AppLayout>
                <PageHeader title="Calibration" showBack />
                <div className="flex-1 flex items-center justify-center p-6">
                    <Card className="p-6 text-center max-w-sm">
                        <Smartphone className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h2 className="text-xl font-bold mb-2">Motion Sensors Not Available</h2>
                        <p className="text-muted-foreground mb-4">
                            Your device doesn't support motion sensors. You can still use manual timing mode.
                        </p>
                        <Button onClick={() => navigate('/')}>Continue Anyway</Button>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageHeader title={`Calibration (${currentStep + 1}/${STEPS.length})`} showBack />

            <div className="px-6 pt-2">
                <Progress value={progress} className="h-2" />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                {!permissionGranted ? (
                    <Card className="p-8 text-center max-w-sm">
                        <Smartphone className="w-20 h-20 text-primary mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">Enable Motion Sensors</h2>
                        <p className="text-muted-foreground mb-6">
                            We need access to your device's motion sensors to detect pours accurately.
                        </p>
                        <Button size="lg" className="w-full" onClick={handleRequestPermission}>
                            Enable Sensors
                        </Button>
                    </Card>
                ) : (
                    <div className="text-center w-full max-w-sm">
                        <div
                            className={`w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center transition-all ${
                                isCapturing ? 'bg-primary/20 animate-pulse' : 'bg-secondary'
                            }`}
                        >
                            <step.icon
                                className={`w-16 h-16 ${isCapturing ? 'text-primary' : 'text-muted-foreground'}`}
                            />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                        <p className="text-muted-foreground mb-8">{step.description}</p>

                        {isCapturing ? (
                            <div className="space-y-4">
                                <Progress value={captureProgress} className="h-3" />
                                <p className="text-sm text-muted-foreground">Hold steady...</p>
                            </div>
                        ) : (
                            <Button size="lg" className="w-full touch-target" onClick={startCapture}>
                                Start Capture
                            </Button>
                        )}
                    </div>
                )}
            </main>

            <footer className="px-6 pb-24">
                <div className="flex justify-center gap-2">
                    {STEPS.map((s, i) => (
                        <div
                            key={s.id}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/50' : 'bg-secondary'
                            }`}
                        />
                    ))}
                </div>
            </footer>
        </AppLayout>
    );
}
