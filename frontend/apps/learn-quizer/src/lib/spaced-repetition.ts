import type { StoredQuestion } from '@/types/quiz';

/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Quality ratings:
 * 0 - Complete blackout, no recall
 * 1 - Incorrect, but recognized answer when shown
 * 2 - Incorrect, but correct answer seemed easy to recall
 * 3 - Correct with serious difficulty
 * 4 - Correct with hesitation
 * 5 - Perfect response
 */

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

export function calculateNextReview(
  question: StoredQuestion,
  quality: number
): Pick<StoredQuestion, 'easeFactor' | 'interval' | 'repetitions' | 'nextReviewDate' | 'lastReviewDate'> {
  const now = Date.now();
  let { easeFactor, interval, repetitions } = question;

  // Quality must be between 0 and 5
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  if (quality < 3) {
    // Failed review - reset repetitions but keep some ease factor memory
    repetitions = 0;
    interval = 1;
  } else {
    // Successful review
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);

  // Calculate next review date (interval is in days)
  const nextReviewDate = now + interval * 24 * 60 * 60 * 1000;

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate,
    lastReviewDate: now,
  };
}

export function createNewQuestion(
  questionId: string,
  prompt: string,
  answers: string[],
  correctAnswer: number,
  sourcePostSlug: string,
  sourcePostTitle: string,
  subject: string,
  tags: string[]
): StoredQuestion {
  return {
    id: `${sourcePostSlug}-${questionId}`,
    questionId,
    prompt,
    answers,
    correctAnswer,
    sourcePostSlug,
    sourcePostTitle,
    subject,
    tags,
    status: 'active',
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    nextReviewDate: Date.now(), // Due immediately
    lastReviewDate: null,
  };
}

export function isDue(question: StoredQuestion): boolean {
  return question.status === 'active' && question.nextReviewDate <= Date.now();
}

export function getDueQuestions(questions: StoredQuestion[]): StoredQuestion[] {
  return questions.filter(isDue).sort((a, b) => a.nextReviewDate - b.nextReviewDate);
}

export function getQualityFromCorrectness(isCorrect: boolean, confidence: 'easy' | 'medium' | 'hard'): number {
  if (!isCorrect) {
    return confidence === 'easy' ? 2 : confidence === 'medium' ? 1 : 0;
  }
  return confidence === 'easy' ? 5 : confidence === 'medium' ? 4 : 3;
}

export function formatNextReview(nextReviewDate: number): string {
  const now = Date.now();
  const diff = nextReviewDate - now;
  
  if (diff <= 0) return 'Due now';
  
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) return `Due in ${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Due in ${hours} hour${hours > 1 ? 's' : ''}`;
  return 'Due soon';
}
