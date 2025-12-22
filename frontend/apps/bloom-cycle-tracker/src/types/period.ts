export type FlowIntensity = 'light' | 'medium' | 'heavy' | 'spotting';

export type Mood = 'happy' | 'neutral' | 'sad' | 'irritable' | 'anxious' | 'energetic' | 'tired';

export type Symptom =
    | 'cramps'
    | 'headache'
    | 'backache'
    | 'bloating'
    | 'breast_tenderness'
    | 'fatigue'
    | 'acne'
    | 'cravings'
    | 'nausea'
    | 'diarrhea'
    | 'constipation'
    | 'insomnia'
    | 'hot_flashes';

export interface DayLog {
    date: string; // ISO date string YYYY-MM-DD
    isPeriod: boolean;
    flowIntensity?: FlowIntensity;
    painLevel?: number; // 1-5
    symptoms: Symptom[];
    mood?: Mood;
    notes?: string;
    stressLevel?: number; // 1-5 (manual input)
    weight?: number; // kg
    temperature?: number; // BBT in celsius
}

export interface CycleData {
    startDate: string;
    endDate?: string;
    length?: number; // calculated when cycle ends
}

export interface UserProfile {
    name?: string;
    age?: number;
    averageCycleLength: number; // defaults to 28
    averagePeriodLength: number; // defaults to 5
    lastUpdated: string;
    reminderEnabled: boolean;
    reminderDaysBefore: number;
    dailyLogReminder: boolean;
    dailyLogReminderTime?: string;
    theme: 'light' | 'dark' | 'system';
}

export interface PeriodData {
    logs: Record<string, DayLog>; // keyed by date
    cycles: CycleData[];
    profile: UserProfile;
}

export interface CyclePhase {
    phase: 'period' | 'follicular' | 'ovulation' | 'luteal';
    day: number;
    daysUntilPeriod?: number;
}

export interface Anomaly {
    type: 'long_cycle' | 'short_cycle' | 'long_period' | 'heavy_flow' | 'missed_period' | 'irregular';
    message: string;
    severity: 'info' | 'warning' | 'alert';
    date?: string;
}

export interface PainAdvice {
    title: string;
    description: string;
    icon: string;
    category: 'heat' | 'exercise' | 'diet' | 'rest' | 'medical';
}

export const SYMPTOM_LABELS: Record<Symptom, string> = {
    cramps: 'Cramps',
    headache: 'Headache',
    backache: 'Backache',
    bloating: 'Bloating',
    breast_tenderness: 'Breast Tenderness',
    fatigue: 'Fatigue',
    acne: 'Acne',
    cravings: 'Cravings',
    nausea: 'Nausea',
    diarrhea: 'Diarrhea',
    constipation: 'Constipation',
    insomnia: 'Insomnia',
    hot_flashes: 'Hot Flashes',
};

export const MOOD_LABELS: Record<Mood, string> = {
    happy: '😊 Happy',
    neutral: '😐 Neutral',
    sad: '😢 Sad',
    irritable: '😤 Irritable',
    anxious: '😰 Anxious',
    energetic: '⚡ Energetic',
    tired: '😴 Tired',
};

export const FLOW_LABELS: Record<FlowIntensity, string> = {
    spotting: 'Spotting',
    light: 'Light',
    medium: 'Medium',
    heavy: 'Heavy',
};
