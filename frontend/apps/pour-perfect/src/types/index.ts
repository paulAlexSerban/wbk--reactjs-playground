export type Handedness = 'left' | 'right';
export type CountingMethod = '1-and-a-2' | 'beats' | 'seconds';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';

export interface CalibrationProfile {
    id: string;
    spout_id: string;
    device_id: string;
    calibration_factor: number; // oz per second
    baseline_tilt: { alpha: number; beta: number; gamma: number };
    grip_offset: { alpha: number; beta: number; gamma: number };
    timestamp: number;
    handedness: Handedness;
}

export interface PourSession {
    id: string;
    timestamp: number;
    volume_actual: number;
    volume_target: number;
    accuracy_percentage: number;
    pour_duration: number;
    ingredient_name: string;
    recipe_name?: string;
    spout_used: string;
    handedness: Handedness;
    counting_method: CountingMethod;
}

export interface RecipeIngredient {
    name: string;
    volume_oz: number;
    sugar_density: number; // 0-60 g/L
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: RecipeIngredient[];
    difficulty: Difficulty;
    total_time_target: number; // seconds
    description?: string;
}

export interface Challenge {
    id: string;
    name: string;
    description: string;
    tier: Difficulty;
    target_volume: number;
    time_limit: number;
    accuracy_threshold: number;
    unlock_requirement: number; // accuracy % needed to unlock
    pours_required?: number;
}

export interface ChallengeProgress {
    challenge_id: string;
    unlocked: boolean;
    personal_best_time?: number;
    personal_best_accuracy?: number;
    attempts: number;
    completions: number;
}

export interface UserPreferences {
    handedness: Handedness;
    counting_method: CountingMethod;
    spout_id: string;
    current_profile_id?: string;
    high_contrast: boolean;
    haptic_enabled: boolean;
}

export interface SpoutType {
    id: string;
    name: string;
    flow_rate_multiplier: number;
    description: string;
}

export interface MotionData {
    alpha: number; // z-axis rotation
    beta: number; // x-axis rotation (tilt forward/back)
    gamma: number; // y-axis rotation (tilt left/right)
    timestamp: number;
}

export interface AccelerometerData {
    x: number;
    y: number;
    z: number;
    timestamp: number;
}

export interface PourState {
    isPouring: boolean;
    startTime: number | null;
    duration: number;
    tiltAngle: number;
    velocity: number;
    estimatedVolume: number;
}
