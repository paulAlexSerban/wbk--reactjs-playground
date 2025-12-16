export interface QuizQuestion {
    id: string;
    prompt: string;
    answers: string[];
    correctAnswer: number;
}

export interface BlogPostMeta {
    slug: string;
    title: string;
    subject: string;
    tags: string[];
    questions: QuizQuestion[];
    publishedAt: string;
    excerpt: string;
}

export interface BlogPost extends BlogPostMeta {
    content: string;
}

export type QuestionStatus = 'active' | 'inactive' | 'removed';

export interface StoredQuestion {
    id: string;
    questionId: string;
    prompt: string;
    answers: string[];
    correctAnswer: number;
    sourcePostSlug: string;
    sourcePostTitle: string;
    subject: string;
    tags: string[];
    status: QuestionStatus;
    // SM-2 fields
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReviewDate: number;
    lastReviewDate: number | null;
}

export interface ReviewResult {
    questionId: string;
    quality: number; // 0-5 scale
    reviewedAt: number;
}
