import { useState, useMemo } from 'react';
import { Trash2, Pause, Play, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizContext } from './QuizContext';
import { cn } from '@/lib/utils';
import { formatNextReview } from '@/lib/spaced-repetition';

type FilterType = 'all' | 'active' | 'inactive';

export function QuestionManager() {
    const { questions, stats, updateStatus, removeQuestionsByPost, deactivateByTag, reactivateByTag, reactivateAll } =
        useQuizContext();

    const [filter, setFilter] = useState<FilterType>('all');
    const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
    const [tagFilter, setTagFilter] = useState<string | null>(null);

    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            if (q.status === 'removed') return false;
            if (filter === 'active' && q.status !== 'active') return false;
            if (filter === 'inactive' && q.status !== 'inactive') return false;
            if (subjectFilter && q.subject !== subjectFilter) return false;
            if (tagFilter && !q.tags.includes(tagFilter)) return false;
            return true;
        });
    }, [questions, filter, subjectFilter, tagFilter]);

    const groupedByPost = useMemo(() => {
        const groups: Record<string, typeof filteredQuestions> = {};
        for (const q of filteredQuestions) {
            if (!groups[q.sourcePostSlug]) {
                groups[q.sourcePostSlug] = [];
            }
            groups[q.sourcePostSlug].push(q);
        }
        return groups;
    }, [filteredQuestions]);

    const clearFilters = () => {
        setFilter('all');
        setSubjectFilter(null);
        setTagFilter(null);
    };

    const hasFilters = filter !== 'all' || subjectFilter || tagFilter;

    return (
        <div className="flex flex-col h-[500px]">
            {/* Filters */}
            <div className="p-3 border-b border-border space-y-3">
                <div className="flex gap-1">
                    {(['all', 'active', 'inactive'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                'px-2 py-1 text-xs font-mono border border-border',
                                filter === f && 'bg-primary text-primary-foreground'
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Subject filter */}
                {stats.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {stats.subjects.map((subject) => (
                            <button
                                key={subject}
                                onClick={() => setSubjectFilter(subjectFilter === subject ? null : subject)}
                                className={cn(
                                    'px-2 py-0.5 text-xs font-mono border border-border',
                                    subjectFilter === subject && 'bg-secondary'
                                )}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                )}

                {/* Tag filter */}
                {stats.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {stats.tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                                className={cn(
                                    'px-2 py-0.5 text-xs font-mono border border-border',
                                    tagFilter === tag && 'bg-secondary'
                                )}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-xs font-mono text-muted-foreground hover:text-foreground"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Bulk Actions */}
            {tagFilter && (
                <div className="p-2 border-b border-border flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateByTag(tagFilter)}
                        className="font-mono text-xs"
                    >
                        <Pause className="w-3 h-3 mr-1" />
                        Pause #{tagFilter}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reactivateByTag(tagFilter)}
                        className="font-mono text-xs"
                    >
                        <Play className="w-3 h-3 mr-1" />
                        Resume #{tagFilter}
                    </Button>
                </div>
            )}

            {/* Questions List */}
            <div className="flex-1 overflow-auto">
                {Object.keys(groupedByPost).length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground font-mono text-sm">
                        No questions match filters.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {Object.entries(groupedByPost).map(([slug, postQuestions]) => (
                            <div key={slug} className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-mono font-bold truncate flex-1">
                                        {postQuestions[0].sourcePostTitle}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeQuestionsByPost(slug)}
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <div className="space-y-1">
                                    {postQuestions.map((q) => (
                                        <div
                                            key={q.id}
                                            className={cn(
                                                'flex items-center gap-2 p-2 text-xs font-mono',
                                                'border border-border',
                                                q.status === 'inactive' && 'opacity-50'
                                            )}
                                        >
                                            <span className="flex-1 truncate">{q.prompt}</span>
                                            <span className="text-muted-foreground shrink-0">
                                                {formatNextReview(q.nextReviewDate)}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateStatus(q.id, q.status === 'active' ? 'inactive' : 'active')
                                                }
                                                className="p-1 hover:bg-secondary"
                                            >
                                                {q.status === 'active' ? (
                                                    <Pause className="w-3 h-3" />
                                                ) : (
                                                    <Play className="w-3 h-3" />
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {stats.inactive > 0 && (
                <div className="p-3 border-t border-border">
                    <Button variant="outline" size="sm" onClick={reactivateAll} className="w-full font-mono text-xs">
                        <Play className="w-3 h-3 mr-2" />
                        Reactivate all paused ({stats.inactive})
                    </Button>
                </div>
            )}
        </div>
    );
}
