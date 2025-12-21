import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, Trophy, Timer, Target, Star, RotateCcw, Zap } from 'lucide-react';
import { challengesDB, progressDB, preferencesDB } from '@/lib/db';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { useHaptics } from '@/hooks/useHaptics';
import { formatVolume, convertVolume, getUnitLabel } from '@/lib/volume-utils';
import type { Challenge, ChallengeProgress, VolumeUnit } from '@/types';
import { toast } from 'sonner';
import confetti from '@/lib/confetti';

type ViewState = 'list' | 'playing' | 'results';

export default function ChallengePage() {
    const haptics = useHaptics();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [progress, setProgress] = useState<Map<string, ChallengeProgress>>(new Map());
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [viewState, setViewState] = useState<ViewState>('list');
    const [attemptStartTime, setAttemptStartTime] = useState<number>(0);
    const [pourCount, setPourCount] = useState(0);
    const [currentAccuracy, setCurrentAccuracy] = useState(0);
    const [attemptResults, setAttemptResults] = useState<{ time: number; accuracy: number } | null>(null);
    const [isNewPersonalBest, setIsNewPersonalBest] = useState(false);
    const [unit, setUnit] = useState<VolumeUnit>('oz');

    const handlePourEnd = useCallback(
        (duration: number) => {
            if (!selectedChallenge || viewState !== 'playing') return;

            const estimatedVolume = duration * 0.5;
            const accuracy = Math.max(
                0,
                100 -
                    (Math.abs(estimatedVolume - selectedChallenge.target_volume) / selectedChallenge.target_volume) *
                        100
            );

            setCurrentAccuracy((prev) => {
                const newCount = pourCount + 1;
                return (prev * pourCount + accuracy) / newCount;
            });
            setPourCount((prev) => prev + 1);

            const elapsed = (Date.now() - attemptStartTime) / 1000;

            // Check if challenge complete
            const poursRequired = selectedChallenge.pours_required || 1;
            if (pourCount + 1 >= poursRequired) {
                const finalAccuracy = (currentAccuracy * pourCount + accuracy) / (pourCount + 1);
                completeChallenge(elapsed, finalAccuracy);
            } else {
                if (accuracy >= 90) haptics.success();
                else haptics.tap();
                toast.info(`Pour ${pourCount + 1}/${poursRequired} complete`);
            }
        },
        [selectedChallenge, viewState, attemptStartTime, pourCount, currentAccuracy, haptics]
    );

    const { pourState, requestPermission, startListening, startManualPour, stopManualPour, permissionGranted } =
        useDeviceMotion({
            onPourEnd: handlePourEnd,
        });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (permissionGranted) {
            startListening();
        }
    }, [permissionGranted, startListening]);

    const loadData = async () => {
        const [challengeList, progressList, prefs] = await Promise.all([
            challengesDB.getAll(),
            progressDB.getAll(),
            preferencesDB.get(),
        ]);
        setChallenges(challengeList);
        setProgress(new Map(progressList.map((p) => [p.challenge_id, p])));
        setUnit(prefs.volume_unit);
    };

    const completeChallenge = async (time: number, accuracy: number) => {
        if (!selectedChallenge) return;

        const currentProgress = progress.get(selectedChallenge.id);
        const passed = accuracy >= selectedChallenge.accuracy_threshold && time <= selectedChallenge.time_limit;

        let newBest = false;
        if (passed && currentProgress) {
            if (!currentProgress.personal_best_accuracy || accuracy > currentProgress.personal_best_accuracy) {
                newBest = true;
            }
        }

        setIsNewPersonalBest(newBest);
        setAttemptResults({ time, accuracy });
        setViewState('results');

        if (passed) {
            haptics.excellent();
            if (newBest) {
                confetti.fire();
            }
        } else {
            haptics.warning();
        }

        // Update progress
        const updatedProgress: ChallengeProgress = {
            challenge_id: selectedChallenge.id,
            unlocked: currentProgress?.unlocked ?? true,
            personal_best_time:
                passed && (!currentProgress?.personal_best_time || time < currentProgress.personal_best_time)
                    ? time
                    : currentProgress?.personal_best_time,
            personal_best_accuracy:
                passed &&
                (!currentProgress?.personal_best_accuracy || accuracy > currentProgress.personal_best_accuracy)
                    ? accuracy
                    : currentProgress?.personal_best_accuracy,
            attempts: (currentProgress?.attempts || 0) + 1,
            completions: (currentProgress?.completions || 0) + (passed ? 1 : 0),
        };

        await progressDB.save(updatedProgress);

        // Check for tier unlocks
        if (passed) {
            await checkTierUnlocks(accuracy);
        }

        await loadData();
    };

    const checkTierUnlocks = async (accuracy: number) => {
        // Unlock challenges based on accuracy thresholds
        const thresholds: Record<string, number> = {
            intermediate: 85,
            advanced: 92,
            expert: 95,
            master: 98,
        };

        for (const challenge of challenges) {
            const prog = progress.get(challenge.id);
            if (!prog?.unlocked && accuracy >= challenge.unlock_requirement) {
                await progressDB.save({
                    challenge_id: challenge.id,
                    unlocked: true,
                    attempts: 0,
                    completions: 0,
                });
                toast.success(`Unlocked: ${challenge.name}!`);
            }
        }
    };

    const startChallenge = async (challenge: Challenge) => {
        if (!permissionGranted) {
            const granted = await requestPermission();
            if (!granted) {
                toast.error('Motion sensors required');
                return;
            }
        }

        setSelectedChallenge(challenge);
        setAttemptStartTime(Date.now());
        setPourCount(0);
        setCurrentAccuracy(0);
        setAttemptResults(null);
        setViewState('playing');
        haptics.tap();
    };

    const tierOrder = ['beginner', 'intermediate', 'advanced', 'expert', 'master'];
    const tierColors: Record<string, string> = {
        beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
        intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        expert: 'bg-red-500/20 text-red-400 border-red-500/30',
        master: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };

    const groupedChallenges = tierOrder.reduce(
        (acc, tier) => {
            acc[tier] = challenges.filter((c) => c.tier === tier);
            return acc;
        },
        {} as Record<string, Challenge[]>
    );

    // List View
    if (viewState === 'list') {
        return (
            <AppLayout>
                <PageHeader title="Challenges" />

                <div className="px-4 pb-24 space-y-6">
                    {tierOrder.map((tier) => {
                        const tierChallenges = groupedChallenges[tier];
                        if (!tierChallenges?.length) return null;

                        return (
                            <div key={tier} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Trophy className={`h-5 w-5 ${tierColors[tier].split(' ')[1]}`} />
                                    <h2 className="font-semibold text-foreground capitalize">{tier}</h2>
                                </div>

                                {tierChallenges.map((challenge) => {
                                    const prog = progress.get(challenge.id);
                                    const isUnlocked = prog?.unlocked ?? tier === 'beginner';

                                    return (
                                        <Card
                                            key={challenge.id}
                                            className={`p-4 border transition-all ${
                                                isUnlocked
                                                    ? 'bg-card border-border hover:border-primary/50 cursor-pointer'
                                                    : 'bg-muted/30 border-border/50 opacity-60'
                                            }`}
                                            onClick={() => isUnlocked && startChallenge(challenge)}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {isUnlocked ? (
                                                            <Unlock className="h-4 w-4 text-primary" />
                                                        ) : (
                                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                        <h3 className="font-medium text-foreground">
                                                            {challenge.name}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {challenge.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        <Badge variant="outline" className="gap-1">
                                                            <Target className="h-3 w-3" />
                                                            {formatVolume(challenge.target_volume, unit)}
                                                        </Badge>
                                                        <Badge variant="outline" className="gap-1">
                                                            <Timer className="h-3 w-3" />
                                                            {challenge.time_limit}s
                                                        </Badge>
                                                        <Badge variant="outline" className="gap-1">
                                                            <Zap className="h-3 w-3" />
                                                            {challenge.accuracy_threshold}%
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {prog && (prog.personal_best_accuracy || prog.completions > 0) && (
                                                    <div className="text-right shrink-0">
                                                        {prog.personal_best_accuracy && (
                                                            <div className="flex items-center gap-1 text-primary">
                                                                <Star className="h-4 w-4 fill-primary" />
                                                                <span className="font-bold">
                                                                    {prog.personal_best_accuracy.toFixed(0)}%
                                                                </span>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-muted-foreground">
                                                            {prog.completions}/{prog.attempts}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </AppLayout>
        );
    }

    // Playing View
    if (viewState === 'playing' && selectedChallenge) {
        const elapsed = attemptStartTime ? (Date.now() - attemptStartTime) / 1000 : 0;
        const timeProgress = Math.min(100, (elapsed / selectedChallenge.time_limit) * 100);
        const poursRequired = selectedChallenge.pours_required || 1;

        return (
            <AppLayout hideNav>
                <PageHeader title={selectedChallenge.name} showBack onBack={() => setViewState('list')} />

                <div className="px-4 pb-8 space-y-6">
                    {/* Timer */}
                    <Card className="p-4 bg-card border-border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Time Limit</span>
                            <span
                                className={`font-mono font-bold ${elapsed > selectedChallenge.time_limit ? 'text-red-400' : 'text-foreground'}`}
                            >
                                {elapsed.toFixed(1)}s / {selectedChallenge.time_limit}s
                            </span>
                        </div>
                        <Progress value={timeProgress} className="h-2" />
                    </Card>

                    {/* Target */}
                    <Card className="p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/30">
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">Target Pour</p>
                            <div className="text-5xl font-mono font-bold text-primary">
                                {formatVolume(selectedChallenge.target_volume, unit)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Pour {pourCount + 1} of {poursRequired}
                            </p>
                        </div>
                    </Card>

                    {/* Current Pour */}
                    <Card className="p-6 bg-card border-border">
                        <div className="text-center space-y-4">
                            <div
                                className={`text-6xl font-mono font-bold transition-colors ${
                                    pourState.isPouring ? 'text-primary animate-pulse' : 'text-muted-foreground'
                                }`}
                            >
                                {pourState.duration.toFixed(1)}s
                            </div>
                            <div className="text-2xl font-mono text-foreground">
                                ~{formatVolume(pourState.estimatedVolume, unit)}
                            </div>
                        </div>
                    </Card>

                    {/* Manual Control */}
                    <Button
                        className="w-full h-16 text-lg"
                        variant={pourState.isPouring ? 'destructive' : 'default'}
                        onTouchStart={startManualPour}
                        onTouchEnd={stopManualPour}
                        onMouseDown={startManualPour}
                        onMouseUp={stopManualPour}
                    >
                        {pourState.isPouring ? 'Release to Stop' : 'Hold to Pour'}
                    </Button>
                </div>
            </AppLayout>
        );
    }

    // Results View
    if (viewState === 'results' && selectedChallenge && attemptResults) {
        const passed =
            attemptResults.accuracy >= selectedChallenge.accuracy_threshold &&
            attemptResults.time <= selectedChallenge.time_limit;

        return (
            <AppLayout hideNav>
                <PageHeader title="Challenge Complete" />

                <div className="px-4 pb-8 space-y-6">
                    <Card
                        className={`p-6 border ${passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}
                    >
                        <div className="text-center space-y-4">
                            {passed ? (
                                <>
                                    <Trophy className="h-16 w-16 mx-auto text-yellow-400" />
                                    <h2 className="text-2xl font-bold text-green-400">Challenge Passed!</h2>
                                    {isNewPersonalBest && (
                                        <Badge className="bg-yellow-500/20 text-yellow-400">
                                            <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                                            New Personal Best!
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-16 w-16 mx-auto text-red-400" />
                                    <h2 className="text-2xl font-bold text-red-400">Not Quite...</h2>
                                </>
                            )}
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 bg-card border-border text-center">
                            <p className="text-sm text-muted-foreground mb-1">Your Time</p>
                            <p
                                className={`text-2xl font-bold ${attemptResults.time <= selectedChallenge.time_limit ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {attemptResults.time.toFixed(1)}s
                            </p>
                            <p className="text-xs text-muted-foreground">Target: {selectedChallenge.time_limit}s</p>
                        </Card>

                        <Card className="p-4 bg-card border-border text-center">
                            <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                            <p
                                className={`text-2xl font-bold ${attemptResults.accuracy >= selectedChallenge.accuracy_threshold ? 'text-green-400' : 'text-red-400'}`}
                            >
                                {attemptResults.accuracy.toFixed(0)}%
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Target: {selectedChallenge.accuracy_threshold}%
                            </p>
                        </Card>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => startChallenge(selectedChallenge)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button className="flex-1" onClick={() => setViewState('list')}>
                            Back to List
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return null;
}

// Missing import placeholder
const XCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6M9 9l6 6" />
    </svg>
);
