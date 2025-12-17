import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Smartphone, Hand, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
            const progress = Math.min((elapsed / duration) * 100, 100);
            setCaptureProgress(progress);

            if (elapsed >= duration) {
                clearInterval(interval);
                setIsCapturing(false);
                haptics.success();

                // Save calibration data for this step
                setCalibrationData((prev: any) => ({
                    ...prev,
                    [step.id]: motionData || { alpha: 0, beta: 0, gamma: 0 },
                }));

                // Move to next step or finish
                if (currentStep < STEPS.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    finishCalibration();
                }
            }
        }, 50);
    }, [step, currentStep, motionData, haptics]);

    const finishCalibration = async () => {
        // Calculate calibration factor from pour durations
        const calibrationFactor = 0.5; // oz per second (simplified)

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
            <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
                <Card className="p-6 text-center max-w-sm">
                    <Smartphone className="w-16 h-16 text-destructive mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Motion Sensors Not Available</h2>
                    <p className="text-muted-foreground mb-4">
                        Your device doesn't support motion sensors. You can still use manual timing mode.
                    </p>
                    <Button onClick={() => navigate('/')}>Continue Anyway</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background safe-top safe-bottom">
            {/* Header */}
            <header className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-xl font-bold">Calibration</h1>
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {STEPS.length}
                        </p>
                    </div>
                </div>
                <Progress value={progress} className="mt-4 h-2" />
            </header>

            {/* Main Content */}
            <main className="px-6 flex-1 flex flex-col items-center justify-center py-12">
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

            {/* Step indicators */}
            <footer className="px-6 pb-8">
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
        </div>
    );
}
