import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Clock, ChefHat, Play, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { recipesDB, sessionsDB, preferencesDB } from '@/lib/db';
import { useDeviceMotion } from '@/hooks/useDeviceMotion';
import { useHaptics } from '@/hooks/useHaptics';
import { formatVolume, convertVolume, getUnitLabel } from '@/lib/volume-utils';
import type { Recipe, RecipeIngredient, PourSession, VolumeUnit } from '@/types';
import { toast } from 'sonner';

type SessionState = 'library' | 'practicing' | 'results';

interface IngredientResult {
    ingredient: RecipeIngredient;
    actual: number;
    accuracy: number;
    duration: number;
}

export default function RecipePracticePage() {
    const navigate = useNavigate();
    const haptics = useHaptics();

    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [sessionState, setSessionState] = useState<SessionState>('library');
    const [currentIngredientIndex, setCurrentIngredientIndex] = useState(0);
    const [ingredientResults, setIngredientResults] = useState<IngredientResult[]>([]);
    const [sessionStartTime, setSessionStartTime] = useState<number>(0);
    const [totalSessionTime, setTotalSessionTime] = useState<number>(0);
    const [unit, setUnit] = useState<VolumeUnit>('oz');

    const handlePourEnd = useCallback(
        (duration: number) => {
            if (!selectedRecipe || sessionState !== 'practicing') return;

            const currentIngredient = selectedRecipe.ingredients[currentIngredientIndex];
            const estimatedVolume = duration * 0.5; // Use calibration factor
            const accuracy = Math.max(
                0,
                100 - (Math.abs(estimatedVolume - currentIngredient.volume_oz) / currentIngredient.volume_oz) * 100
            );

            const result: IngredientResult = {
                ingredient: currentIngredient,
                actual: estimatedVolume,
                accuracy,
                duration,
            };

            setIngredientResults((prev) => [...prev, result]);

            if (accuracy >= 90) {
                haptics.success();
            } else if (accuracy >= 70) {
                haptics.tap();
            } else {
                haptics.warning();
            }

            // Move to next ingredient or finish
            if (currentIngredientIndex < selectedRecipe.ingredients.length - 1) {
                setCurrentIngredientIndex((prev) => prev + 1);
                toast.success(
                    `${currentIngredient.name} complete! Next: ${selectedRecipe.ingredients[currentIngredientIndex + 1].name}`
                );
            } else {
                setTotalSessionTime((Date.now() - sessionStartTime) / 1000);
                setSessionState('results');
                haptics.excellent();
                toast.success('Recipe complete!');
            }
        },
        [selectedRecipe, currentIngredientIndex, sessionState, sessionStartTime, haptics]
    );

    const { pourState, requestPermission, startListening, startManualPour, stopManualPour, permissionGranted } =
        useDeviceMotion({
            onPourEnd: handlePourEnd,
        });

    useEffect(() => {
        recipesDB.getAll().then(setRecipes);
        preferencesDB.get().then((prefs) => setUnit(prefs.volume_unit));
    }, []);

    useEffect(() => {
        if (permissionGranted) {
            startListening();
        }
    }, [permissionGranted, startListening]);

    const filteredRecipes = recipes.filter(
        (r) =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const difficultyColors: Record<string, string> = {
        beginner: 'bg-green-500/20 text-green-400',
        intermediate: 'bg-yellow-500/20 text-yellow-400',
        advanced: 'bg-orange-500/20 text-orange-400',
        expert: 'bg-red-500/20 text-red-400',
        master: 'bg-purple-500/20 text-purple-400',
    };

    const startPractice = async (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        setCurrentIngredientIndex(0);
        setIngredientResults([]);
        setSessionStartTime(Date.now());

        if (!permissionGranted) {
            const granted = await requestPermission();
            if (!granted) {
                toast.error('Motion sensors required for practice');
                return;
            }
        }

        setSessionState('practicing');
        haptics.tap();
    };

    const saveSessionResults = async () => {
        if (!selectedRecipe) return;

        // Save each pour as a session
        for (const result of ingredientResults) {
            const session: PourSession = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                timestamp: Date.now(),
                volume_actual: result.actual,
                volume_target: result.ingredient.volume_oz,
                accuracy_percentage: result.accuracy,
                pour_duration: result.duration,
                ingredient_name: result.ingredient.name,
                recipe_name: selectedRecipe.name,
                spout_used: 'standard',
                handedness: 'right',
                counting_method: 'seconds',
            };
            await sessionsDB.save(session);
        }

        toast.success('Session saved!');
        setSessionState('library');
        setSelectedRecipe(null);
    };

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 90) return 'text-green-400';
        if (accuracy >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const overallAccuracy =
        ingredientResults.length > 0
            ? ingredientResults.reduce((sum, r) => sum + r.accuracy, 0) / ingredientResults.length
            : 0;

    // Library View
    if (sessionState === 'library') {
        return (
            <AppLayout>
                <PageHeader title="Recipe Practice" />

                <div className="px-4 pb-24 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search recipes or ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-card border-border"
                        />
                    </div>

                    <div className="space-y-3">
                        {filteredRecipes.map((recipe) => (
                            <Card
                                key={recipe.id}
                                className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => startPractice(recipe)}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground truncate">{recipe.name}</h3>
                                            <Badge className={difficultyColors[recipe.difficulty]}>
                                                {recipe.difficulty}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                            {recipe.description || recipe.ingredients.map((i) => i.name).join(' • ')}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <ChefHat className="h-3 w-3" />
                                                {recipe.ingredients.length} ingredients
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />~{recipe.total_time_target}s
                                            </span>
                                        </div>
                                    </div>
                                    <Button size="icon" variant="ghost" className="shrink-0">
                                        <Play className="h-5 w-5 text-primary" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {filteredRecipes.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <ChefHat className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No recipes found</p>
                        </div>
                    )}
                </div>
            </AppLayout>
        );
    }

    // Practice View
    if (sessionState === 'practicing' && selectedRecipe) {
        const currentIngredient = selectedRecipe.ingredients[currentIngredientIndex];
        const progress = (currentIngredientIndex / selectedRecipe.ingredients.length) * 100;

        return (
            <AppLayout hideNav>
                <PageHeader
                    title={selectedRecipe.name}
                    showBack
                    onBack={() => {
                        setSessionState('library');
                        setSelectedRecipe(null);
                    }}
                />

                <div className="px-4 pb-8 space-y-6">
                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Progress</span>
                            <span>
                                {currentIngredientIndex + 1} of {selectedRecipe.ingredients.length}
                            </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    {/* Current Ingredient */}
                    <Card className="p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/30">
                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground uppercase tracking-wide">Pour Now</p>
                            <h2 className="text-3xl font-bold text-foreground">{currentIngredient.name}</h2>
                            <div className="text-5xl font-mono font-bold text-primary">
                                {formatVolume(currentIngredient.volume_oz, unit)}
                            </div>
                        </div>
                    </Card>

                    {/* Pour Visualization */}
                    <Card className="p-6 bg-card border-border">
                        <div className="text-center space-y-4">
                            <div
                                className={`text-6xl font-mono font-bold transition-colors ${
                                    pourState.isPouring ? 'text-primary animate-pulse' : 'text-muted-foreground'
                                }`}
                            >
                                {pourState.duration.toFixed(1)}s
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {pourState.isPouring ? 'Pouring...' : 'Tilt to pour'}
                            </p>
                            <div className="text-2xl font-mono text-foreground">
                                ~{formatVolume(pourState.estimatedVolume, unit)}
                            </div>
                        </div>
                    </Card>

                    {/* Manual Controls (for testing) */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1"
                            variant={pourState.isPouring ? 'destructive' : 'default'}
                            onTouchStart={startManualPour}
                            onTouchEnd={stopManualPour}
                            onMouseDown={startManualPour}
                            onMouseUp={stopManualPour}
                            onMouseLeave={pourState.isPouring ? stopManualPour : undefined}
                        >
                            {pourState.isPouring ? 'Release to Stop' : 'Hold to Pour'}
                        </Button>
                    </div>

                    {/* Upcoming Ingredients */}
                    {currentIngredientIndex < selectedRecipe.ingredients.length - 1 && (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Up Next</p>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {selectedRecipe.ingredients.slice(currentIngredientIndex + 1).map((ing, idx) => (
                                    <Badge key={idx} variant="outline" className="whitespace-nowrap">
                                        {ing.name} ({formatVolume(ing.volume_oz, unit)})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        );
    }

    // Results View
    if (sessionState === 'results' && selectedRecipe) {
        return (
            <AppLayout hideNav>
                <PageHeader title="Session Complete" />

                <div className="px-4 pb-8 space-y-6">
                    {/* Summary Card */}
                    <Card className="p-6 bg-gradient-to-br from-primary/20 to-transparent border-primary/30">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">{selectedRecipe.name}</h2>
                            <div className={`text-5xl font-bold ${getAccuracyColor(overallAccuracy)}`}>
                                {overallAccuracy.toFixed(0)}%
                            </div>
                            <p className="text-muted-foreground">Overall Accuracy</p>
                            <div className="flex justify-center gap-6 pt-4 text-sm">
                                <div>
                                    <p className="text-2xl font-mono font-bold text-foreground">
                                        {totalSessionTime.toFixed(1)}s
                                    </p>
                                    <p className="text-muted-foreground">Total Time</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-mono font-bold text-foreground">
                                        {selectedRecipe.total_time_target}s
                                    </p>
                                    <p className="text-muted-foreground">Target</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Per-Ingredient Results */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Ingredient Breakdown</h3>
                        {ingredientResults.map((result, idx) => (
                            <Card key={idx} className="p-4 bg-card border-border">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {result.accuracy >= 90 ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-foreground">{result.ingredient.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatVolume(result.actual, unit)} /{' '}
                                                {formatVolume(result.ingredient.volume_oz, unit)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xl font-bold ${getAccuracyColor(result.accuracy)}`}>
                                        {result.accuracy.toFixed(0)}%
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" className="flex-1" onClick={() => startPractice(selectedRecipe)}>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button className="flex-1" onClick={saveSessionResults}>
                            Save & Exit
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return null;
}
