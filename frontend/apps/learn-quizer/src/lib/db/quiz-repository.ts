import { openDB, type IDBPDatabase } from 'idb';
import type { StoredQuestion, QuestionStatus } from '@/types/quiz';

const DB_NAME = 'engineer-learning-blog';
const DB_VERSION = 1;
const QUESTIONS_STORE = 'questions';

let dbPromise: Promise<IDBPDatabase> | null = null;

async function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(QUESTIONS_STORE)) {
          const store = db.createObjectStore(QUESTIONS_STORE, { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('sourcePostSlug', 'sourcePostSlug');
          store.createIndex('subject', 'subject');
          store.createIndex('nextReviewDate', 'nextReviewDate');
        }
      },
    });
  }
  return dbPromise;
}

export async function getAllQuestions(): Promise<StoredQuestion[]> {
  const db = await getDB();
  return db.getAll(QUESTIONS_STORE);
}

export async function getQuestionById(id: string): Promise<StoredQuestion | undefined> {
  const db = await getDB();
  return db.get(QUESTIONS_STORE, id);
}

export async function getQuestionsByPost(sourcePostSlug: string): Promise<StoredQuestion[]> {
  const db = await getDB();
  const index = db.transaction(QUESTIONS_STORE).store.index('sourcePostSlug');
  return index.getAll(sourcePostSlug);
}

export async function getQuestionsByStatus(status: QuestionStatus): Promise<StoredQuestion[]> {
  const db = await getDB();
  const index = db.transaction(QUESTIONS_STORE).store.index('status');
  return index.getAll(status);
}

export async function addQuestion(question: StoredQuestion): Promise<void> {
  const db = await getDB();
  await db.put(QUESTIONS_STORE, question);
}

export async function addQuestions(questions: StoredQuestion[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
  await Promise.all([
    ...questions.map(q => tx.store.put(q)),
    tx.done,
  ]);
}

export async function updateQuestion(question: StoredQuestion): Promise<void> {
  const db = await getDB();
  await db.put(QUESTIONS_STORE, question);
}

export async function updateQuestionStatus(id: string, status: QuestionStatus): Promise<void> {
  const db = await getDB();
  const question = await db.get(QUESTIONS_STORE, id);
  if (question) {
    question.status = status;
    await db.put(QUESTIONS_STORE, question);
  }
}

export async function updateQuestionsStatusByPost(sourcePostSlug: string, status: QuestionStatus): Promise<void> {
  const db = await getDB();
  const questions = await getQuestionsByPost(sourcePostSlug);
  const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
  await Promise.all([
    ...questions.map(q => {
      q.status = status;
      return tx.store.put(q);
    }),
    tx.done,
  ]);
}

export async function updateQuestionsStatusByTag(tag: string, status: QuestionStatus): Promise<void> {
  const db = await getDB();
  const allQuestions = await db.getAll(QUESTIONS_STORE);
  const questionsWithTag = allQuestions.filter(q => q.tags.includes(tag));
  const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
  await Promise.all([
    ...questionsWithTag.map(q => {
      q.status = status;
      return tx.store.put(q);
    }),
    tx.done,
  ]);
}

export async function deleteQuestion(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(QUESTIONS_STORE, id);
}

export async function deleteQuestionsByPost(sourcePostSlug: string): Promise<void> {
  const db = await getDB();
  const questions = await getQuestionsByPost(sourcePostSlug);
  const tx = db.transaction(QUESTIONS_STORE, 'readwrite');
  await Promise.all([
    ...questions.map(q => tx.store.delete(q.id)),
    tx.done,
  ]);
}

export async function isQuestionAdded(questionId: string, sourcePostSlug: string): Promise<boolean> {
  const id = `${sourcePostSlug}-${questionId}`;
  const question = await getQuestionById(id);
  return question !== undefined && question.status !== 'removed';
}

export async function arePostQuestionsAdded(sourcePostSlug: string): Promise<boolean> {
  const questions = await getQuestionsByPost(sourcePostSlug);
  return questions.length > 0 && questions.some(q => q.status !== 'removed');
}

export async function getDueQuestions(): Promise<StoredQuestion[]> {
  const db = await getDB();
  const allQuestions = await db.getAll(QUESTIONS_STORE);
  const now = Date.now();
  return allQuestions
    .filter(q => q.status === 'active' && q.nextReviewDate <= now)
    .sort((a, b) => a.nextReviewDate - b.nextReviewDate);
}

export async function getStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  due: number;
  subjects: string[];
  tags: string[];
}> {
  const allQuestions = await getAllQuestions();
  const now = Date.now();
  
  const subjects = [...new Set(allQuestions.map(q => q.subject))];
  const tags = [...new Set(allQuestions.flatMap(q => q.tags))];
  
  return {
    total: allQuestions.length,
    active: allQuestions.filter(q => q.status === 'active').length,
    inactive: allQuestions.filter(q => q.status === 'inactive').length,
    due: allQuestions.filter(q => q.status === 'active' && q.nextReviewDate <= now).length,
    subjects,
    tags,
  };
}
