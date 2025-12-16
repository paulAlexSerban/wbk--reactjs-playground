import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizContext } from './QuizContext';
import { PracticeSession } from './PracticeSession';
import { QuestionManager } from './QuestionManager';
import { cn } from '@/lib/utils';

type WidgetView = 'closed' | 'overview' | 'practice' | 'manage';

export function QuizWidget() {
    const [view, setView] = useState<WidgetView>('closed');
    const { stats, dueQuestions, loading } = useQuizContext();

    if (view === 'closed') {
        return (
            <button
                onClick={() => setView('overview')}
                className={cn(
                    'fixed bottom-6 right-6 z-50',
                    'flex items-center gap-3 px-4 py-3',
                    'bg-primary text-primary-foreground',
                    'border-2 border-border shadow-md',
                    'hover:shadow-lg transition-shadow',
                    'font-mono text-sm'
                )}
            >
                <BookOpen className="w-5 h-5" />
                <span>Quiz</span>
                {stats.due > 0 && (
                    <span className="bg-background text-foreground px-2 py-0.5 text-xs font-bold">{stats.due}</span>
                )}
            </button>
        );
    }

    return (
        <div
            className={cn(
                'fixed bottom-6 right-6 z-50',
                'w-[400px] max-h-[600px]',
                'bg-card border-2 border-border shadow-lg',
                'flex flex-col'
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-border">
                <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span className="font-mono font-bold">Learning Queue</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setView(view === 'manage' ? 'overview' : 'manage')}
                        className="h-8 w-8"
                    >
                        <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setView('closed')} className="h-8 w-8">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground font-mono">Loading...</div>
                ) : view === 'practice' ? (
                    <PracticeSession onClose={() => setView('overview')} />
                ) : view === 'manage' ? (
                    <QuestionManager />
                ) : (
                    <OverviewPanel
                        stats={stats}
                        dueCount={dueQuestions.length}
                        onStartPractice={() => setView('practice')}
                    />
                )}
            </div>
        </div>
    );
}

function OverviewPanel({
    stats,
    dueCount,
    onStartPractice,
}: {
    stats: {
        total: number;
        active: number;
        inactive: number;
        due: number;
        subjects: string[];
        tags: string[];
    };
    dueCount: number;
    onStartPractice: () => void;
}) {
    return (
        <div className="p-4 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Questions" value={stats.total} />
                <StatCard label="Due Now" value={dueCount} highlight={dueCount > 0} />
                <StatCard label="Active" value={stats.active} />
                <StatCard label="Paused" value={stats.inactive} />
            </div>

            {/* Subjects */}
            {stats.subjects.length > 0 && (
                <div>
                    <h4 className="text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wide">Subjects</h4>
                    <div className="flex flex-wrap gap-2">
                        {stats.subjects.map((subject) => (
                            <span
                                key={subject}
                                className="px-2 py-1 text-xs font-mono bg-secondary border border-border"
                            >
                                {subject}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Start Practice Button */}
            {dueCount > 0 ? (
                <Button onClick={onStartPractice} className="w-full font-mono" size="lg">
                    Start Practice ({dueCount} due)
                </Button>
            ) : stats.total > 0 ? (
                <div className="text-center py-4">
                    <p className="text-muted-foreground font-mono text-sm">No questions due right now.</p>
                    <p className="text-muted-foreground font-mono text-xs mt-1">Check back later.</p>
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-muted-foreground font-mono text-sm">No questions in your queue.</p>
                    <p className="text-muted-foreground font-mono text-xs mt-1">Add questions from blog posts.</p>
                </div>
            )}
        </div>
    );
}

function StatCard({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
    return (
        <div className={cn('p-3 border-2 border-border', highlight && 'bg-primary text-primary-foreground')}>
            <div className="text-2xl font-mono font-bold">{value}</div>
            <div
                className={cn(
                    'text-xs font-mono uppercase tracking-wide',
                    highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'
                )}
            >
                {label}
            </div>
        </div>
    );
}
