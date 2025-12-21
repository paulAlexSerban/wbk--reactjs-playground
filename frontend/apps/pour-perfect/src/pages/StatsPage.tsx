import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { PageHeader } from '@/components/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    TrendingUp,
    TrendingDown,
    Target,
    Clock,
    AlertTriangle,
    Calendar,
    Filter,
    ChevronDown,
    BarChart3,
} from 'lucide-react';
import { sessionsDB, preferencesDB } from '@/lib/db';
import { formatVolume } from '@/lib/volume-utils';
import type { PourSession, VolumeUnit } from '@/types';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

interface Stats {
    totalSessions: number;
    avgAccuracy7Day: number;
    avgAccuracy30Day: number;
    overallAccuracy: number;
    ingredientStats: { name: string; avgAccuracy: number; count: number }[];
    weaknesses: { name: string; avgAccuracy: number; count: number }[];
}

export default function StatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [sessions, setSessions] = useState<PourSession[]>([]);
    const [filteredSessions, setFilteredSessions] = useState<PourSession[]>([]);
    const [dateFilter, setDateFilter] = useState<'7d' | '30d' | 'all'>('7d');
    const [ingredientFilter, setIngredientFilter] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [unit, setUnit] = useState<VolumeUnit>('oz');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        filterSessions();
    }, [sessions, dateFilter, ingredientFilter]);

    const loadData = async () => {
        const [statsData, sessionList, prefs] = await Promise.all([
            sessionsDB.getStats(),
            sessionsDB.getRecent(500),
            preferencesDB.get(),
        ]);
        setStats(statsData);
        setSessions(sessionList);
        setUnit(prefs.volume_unit);
        setIsLoading(false);
    };

    const filterSessions = () => {
        let filtered = [...sessions];

        // Date filter
        const now = Date.now();
        if (dateFilter === '7d') {
            filtered = filtered.filter((s) => s.timestamp > now - 7 * 24 * 60 * 60 * 1000);
        } else if (dateFilter === '30d') {
            filtered = filtered.filter((s) => s.timestamp > now - 30 * 24 * 60 * 60 * 1000);
        }

        // Ingredient filter
        if (ingredientFilter !== 'all') {
            filtered = filtered.filter((s) => s.ingredient_name === ingredientFilter);
        }

        setFilteredSessions(filtered);
    };

    const uniqueIngredients = [...new Set(sessions.map((s) => s.ingredient_name))];

    const getAccuracyColor = (accuracy: number) => {
        if (accuracy >= 90) return 'text-green-400';
        if (accuracy >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getAccuracyBg = (accuracy: number) => {
        if (accuracy >= 90) return 'bg-green-500/20';
        if (accuracy >= 70) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    if (isLoading) {
        return (
            <AppLayout>
                <PageHeader title="Statistics" showBack />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <PageHeader title="Statistics" showBack />

            <div className="px-4 pb-24">
                <Tabs defaultValue="dashboard" className="space-y-4">
                    <TabsList className="w-full">
                        <TabsTrigger value="dashboard" className="flex-1">
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex-1">
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Tab */}
                    <TabsContent value="dashboard" className="space-y-4">
                        {!stats || stats.totalSessions === 0 ? (
                            <Card className="p-8 text-center bg-card border-border">
                                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                                <h3 className="font-semibold text-foreground mb-1">No Data Yet</h3>
                                <p className="text-sm text-muted-foreground">
                                    Complete some practice sessions to see your stats
                                </p>
                            </Card>
                        ) : (
                            <>
                                {/* Overview Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Card className="p-4 bg-card border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-muted-foreground">7-Day Avg</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getAccuracyColor(stats.avgAccuracy7Day)}`}>
                                            {stats.avgAccuracy7Day.toFixed(1)}%
                                        </p>
                                    </Card>

                                    <Card className="p-4 bg-card border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-muted-foreground">30-Day Avg</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getAccuracyColor(stats.avgAccuracy30Day)}`}>
                                            {stats.avgAccuracy30Day.toFixed(1)}%
                                        </p>
                                    </Card>

                                    <Card className="p-4 bg-card border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-muted-foreground">Total Pours</span>
                                        </div>
                                        <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
                                    </Card>

                                    <Card className="p-4 bg-card border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                            <TrendingUp className="h-4 w-4 text-primary" />
                                            <span className="text-xs text-muted-foreground">Overall</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getAccuracyColor(stats.overallAccuracy)}`}>
                                            {stats.overallAccuracy.toFixed(1)}%
                                        </p>
                                    </Card>
                                </div>

                                {/* Weaknesses */}
                                {stats.weaknesses.length > 0 && (
                                    <Card className="p-4 bg-card border-border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                            <h3 className="font-semibold text-foreground">Areas to Improve</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {stats.weaknesses.slice(0, 3).map((weakness, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <span className="text-sm text-foreground">{weakness.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-sm font-medium ${getAccuracyColor(weakness.avgAccuracy)}`}
                                                        >
                                                            {weakness.avgAccuracy.toFixed(0)}%
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            ({weakness.count} pours)
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                )}

                                {/* Ingredient Breakdown */}
                                <Card className="p-4 bg-card border-border">
                                    <h3 className="font-semibold text-foreground mb-3">By Ingredient</h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {stats.ingredientStats
                                            .sort((a, b) => b.count - a.count)
                                            .map((ing, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`flex items-center justify-between p-2 rounded ${getAccuracyBg(ing.avgAccuracy)}`}
                                                >
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">
                                                            {ing.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            {ing.count} pours
                                                        </span>
                                                    </div>
                                                    <span className={`font-bold ${getAccuracyColor(ing.avgAccuracy)}`}>
                                                        {ing.avgAccuracy.toFixed(0)}%
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </Card>
                            </>
                        )}
                    </TabsContent>

                    {/* History Tab */}
                    <TabsContent value="history" className="space-y-4">
                        {/* Filters */}
                        <div className="flex gap-2">
                            <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
                                <SelectTrigger className="flex-1">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="all">All time</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={ingredientFilter} onValueChange={setIngredientFilter}>
                                <SelectTrigger className="flex-1">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All ingredients</SelectItem>
                                    {uniqueIngredients.map((ing) => (
                                        <SelectItem key={ing} value={ing}>
                                            {ing}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Session List */}
                        {filteredSessions.length === 0 ? (
                            <Card className="p-8 text-center bg-card border-border">
                                <Clock className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                                <p className="text-muted-foreground">No sessions found</p>
                            </Card>
                        ) : (
                            <div className="space-y-2">
                                {filteredSessions.map((session) => (
                                    <Card key={session.id} className="p-3 bg-card border-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-foreground truncate">
                                                        {session.ingredient_name}
                                                    </span>
                                                    {session.recipe_name && (
                                                        <Badge variant="outline" className="text-xs shrink-0">
                                                            {session.recipe_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                    <span>{format(new Date(session.timestamp), 'MMM d, h:mm a')}</span>
                                                    <span>
                                                        {formatVolume(session.volume_actual, unit)} /{' '}
                                                        {formatVolume(session.volume_target, unit)}
                                                    </span>
                                                    <span>{session.pour_duration.toFixed(1)}s</span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-xl font-bold shrink-0 ${getAccuracyColor(session.accuracy_percentage)}`}
                                            >
                                                {session.accuracy_percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
