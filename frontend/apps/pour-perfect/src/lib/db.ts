import type { 
  CalibrationProfile, 
  PourSession, 
  Recipe, 
  Challenge, 
  ChallengeProgress, 
  UserPreferences 
} from '@/types';

const DB_NAME = 'jigger-free-db';
const DB_VERSION = 1;

let dbInstance: IDBDatabase | null = null;

export async function getDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Calibration profiles
      if (!db.objectStoreNames.contains('calibration_profiles')) {
        const profileStore = db.createObjectStore('calibration_profiles', { keyPath: 'id' });
        profileStore.createIndex('device_spout', ['device_id', 'spout_id'], { unique: false });
      }

      // Pour sessions
      if (!db.objectStoreNames.contains('pour_sessions')) {
        const sessionStore = db.createObjectStore('pour_sessions', { keyPath: 'id' });
        sessionStore.createIndex('timestamp', 'timestamp', { unique: false });
        sessionStore.createIndex('recipe', 'recipe_name', { unique: false });
        sessionStore.createIndex('ingredient', 'ingredient_name', { unique: false });
      }

      // Recipes
      if (!db.objectStoreNames.contains('recipes')) {
        const recipeStore = db.createObjectStore('recipes', { keyPath: 'id' });
        recipeStore.createIndex('difficulty', 'difficulty', { unique: false });
      }

      // Challenges
      if (!db.objectStoreNames.contains('challenges')) {
        db.createObjectStore('challenges', { keyPath: 'id' });
      }

      // Challenge progress
      if (!db.objectStoreNames.contains('challenge_progress')) {
        db.createObjectStore('challenge_progress', { keyPath: 'challenge_id' });
      }

      // User preferences
      if (!db.objectStoreNames.contains('preferences')) {
        db.createObjectStore('preferences', { keyPath: 'id' });
      }
    };
  });
}

// Generic CRUD operations
async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function get<T>(storeName: string, key: string): Promise<T | undefined> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function put<T>(storeName: string, data: T): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function remove(storeName: string, key: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Calibration profiles
export const calibrationDB = {
  getAll: () => getAll<CalibrationProfile>('calibration_profiles'),
  get: (id: string) => get<CalibrationProfile>('calibration_profiles', id),
  save: (profile: CalibrationProfile) => put('calibration_profiles', profile),
  delete: (id: string) => remove('calibration_profiles', id),
};

// Pour sessions
export const sessionsDB = {
  getAll: () => getAll<PourSession>('pour_sessions'),
  get: (id: string) => get<PourSession>('pour_sessions', id),
  save: (session: PourSession) => put('pour_sessions', session),
  delete: (id: string) => remove('pour_sessions', id),
  
  async getRecent(limit: number = 100): Promise<PourSession[]> {
    const all = await getAll<PourSession>('pour_sessions');
    return all.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  },

  async getByDateRange(start: number, end: number): Promise<PourSession[]> {
    const all = await getAll<PourSession>('pour_sessions');
    return all.filter(s => s.timestamp >= start && s.timestamp <= end);
  },

  async getStats() {
    const sessions = await getAll<PourSession>('pour_sessions');
    if (sessions.length === 0) return null;

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    const recentSessions = sessions.filter(s => s.timestamp > sevenDaysAgo);
    const monthSessions = sessions.filter(s => s.timestamp > thirtyDaysAgo);

    const avgAccuracy = (arr: PourSession[]) => 
      arr.length ? arr.reduce((sum, s) => sum + s.accuracy_percentage, 0) / arr.length : 0;

    // Group by ingredient
    const byIngredient = sessions.reduce((acc, s) => {
      if (!acc[s.ingredient_name]) acc[s.ingredient_name] = [];
      acc[s.ingredient_name].push(s);
      return acc;
    }, {} as Record<string, PourSession[]>);

    const ingredientStats = Object.entries(byIngredient).map(([name, sessions]) => ({
      name,
      avgAccuracy: avgAccuracy(sessions),
      count: sessions.length,
    }));

    // Find weaknesses (< 85% accuracy with 5+ attempts)
    const weaknesses = ingredientStats
      .filter(s => s.count >= 5 && s.avgAccuracy < 85)
      .sort((a, b) => a.avgAccuracy - b.avgAccuracy);

    return {
      totalSessions: sessions.length,
      avgAccuracy7Day: avgAccuracy(recentSessions),
      avgAccuracy30Day: avgAccuracy(monthSessions),
      overallAccuracy: avgAccuracy(sessions),
      ingredientStats,
      weaknesses,
    };
  },
};

// Recipes
export const recipesDB = {
  getAll: () => getAll<Recipe>('recipes'),
  get: (id: string) => get<Recipe>('recipes', id),
  save: (recipe: Recipe) => put('recipes', recipe),
  delete: (id: string) => remove('recipes', id),
};

// Challenges
export const challengesDB = {
  getAll: () => getAll<Challenge>('challenges'),
  get: (id: string) => get<Challenge>('challenges', id),
  save: (challenge: Challenge) => put('challenges', challenge),
};

// Challenge progress
export const progressDB = {
  getAll: () => getAll<ChallengeProgress>('challenge_progress'),
  get: (id: string) => get<ChallengeProgress>('challenge_progress', id),
  save: (progress: ChallengeProgress) => put('challenge_progress', progress),
};

// User preferences
export const preferencesDB = {
  async get(): Promise<UserPreferences> {
    const prefs = await get<UserPreferences & { id: string }>('preferences', 'user');
    return prefs || {
      handedness: 'right',
      counting_method: 'seconds',
      spout_id: 'standard',
      high_contrast: false,
      haptic_enabled: true,
    };
  },
  async save(prefs: UserPreferences): Promise<void> {
    await put('preferences', { ...prefs, id: 'user' });
  },
};