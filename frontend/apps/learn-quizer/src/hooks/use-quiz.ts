import { useState, useEffect, useCallback } from 'react';
import type { StoredQuestion, BlogPost } from '@/types/quiz';
import * as repo from '@/lib/db/quiz-repository';
import { calculateNextReview, createNewQuestion } from '@/lib/spaced-repetition';

export function useQuiz() {
    const [questions, setQuestions] = useState<StoredQuestion[]>([]);
    const [dueQuestions, setDueQuestions] = useState<StoredQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        due: 0,
        subjects: [] as string[],
        tags: [] as string[],
    });

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const [allQuestions, due, newStats] = await Promise.all([
                repo.getAllQuestions(),
                repo.getDueQuestions(),
                repo.getStats(),
            ]);
            setQuestions(allQuestions);
            setDueQuestions(due);
            setStats(newStats);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const addQuestionsFromPost = useCallback(
        async (post: BlogPost) => {
            const newQuestions = post.questions.map((q) =>
                createNewQuestion(
                    q.id,
                    q.prompt,
                    q.answers,
                    q.correctAnswer,
                    post.slug,
                    post.title,
                    post.subject,
                    post.tags
                )
            );
            await repo.addQuestions(newQuestions);
            await refresh();
        },
        [refresh]
    );

    const isPostAdded = useCallback(async (slug: string): Promise<boolean> => {
        return repo.arePostQuestionsAdded(slug);
    }, []);

    const reviewQuestion = useCallback(
        async (questionId: string, quality: number) => {
            const question = await repo.getQuestionById(questionId);
            if (!question) return;

            const updates = calculateNextReview(question, quality);
            const updatedQuestion = { ...question, ...updates };
            await repo.updateQuestion(updatedQuestion);
            await refresh();
        },
        [refresh]
    );

    const updateStatus = useCallback(
        async (questionId: string, status: StoredQuestion['status']) => {
            await repo.updateQuestionStatus(questionId, status);
            await refresh();
        },
        [refresh]
    );

    const removeQuestionsByPost = useCallback(
        async (slug: string) => {
            await repo.deleteQuestionsByPost(slug);
            await refresh();
        },
        [refresh]
    );

    const deactivateByTag = useCallback(
        async (tag: string) => {
            await repo.updateQuestionsStatusByTag(tag, 'inactive');
            await refresh();
        },
        [refresh]
    );

    const reactivateByTag = useCallback(
        async (tag: string) => {
            await repo.updateQuestionsStatusByTag(tag, 'active');
            await refresh();
        },
        [refresh]
    );

    const reactivateAll = useCallback(async () => {
        const inactive = await repo.getQuestionsByStatus('inactive');
        for (const q of inactive) {
            await repo.updateQuestionStatus(q.id, 'active');
        }
        await refresh();
    }, [refresh]);

    return {
        questions,
        dueQuestions,
        loading,
        stats,
        refresh,
        addQuestionsFromPost,
        isPostAdded,
        reviewQuestion,
        updateStatus,
        removeQuestionsByPost,
        deactivateByTag,
        reactivateByTag,
        reactivateAll,
    };
}
