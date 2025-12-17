import { useState, useEffect, useCallback } from 'react';
import { preferencesDB, calibrationDB, recipesDB, challengesDB, progressDB } from '@/lib/db';
import { SEED_RECIPES, SEED_CHALLENGES } from '@/lib/seed-data';
import type { UserPreferences, CalibrationProfile, ChallengeProgress } from '@/types';

export function useAppState() {
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [currentProfile, setCurrentProfile] = useState<CalibrationProfile | null>(null);
    const [needsCalibration, setNeedsCalibration] = useState(true);

    // Initialize app data
    const initialize = useCallback(async () => {
        try {
            // Load preferences
            const prefs = await preferencesDB.get();
            setPreferences(prefs);

            // Check if we have calibration profiles
            const profiles = await calibrationDB.getAll();
            if (profiles.length > 0) {
                const active = prefs.current_profile_id
                    ? profiles.find((p) => p.id === prefs.current_profile_id)
                    : profiles[0];
                if (active) {
                    setCurrentProfile(active);
                    setNeedsCalibration(false);
                }
            }

            // Seed recipes if empty
            const existingRecipes = await recipesDB.getAll();
            if (existingRecipes.length === 0) {
                await Promise.all(SEED_RECIPES.map((r) => recipesDB.save(r)));
            }

            // Seed challenges if empty
            const existingChallenges = await challengesDB.getAll();
            if (existingChallenges.length === 0) {
                await Promise.all(SEED_CHALLENGES.map((c) => challengesDB.save(c)));

                // Initialize progress for beginner challenges (unlocked)
                const beginnerChallenges = SEED_CHALLENGES.filter((c) => c.unlock_requirement === 0);
                await Promise.all(
                    beginnerChallenges.map((c) =>
                        progressDB.save({
                            challenge_id: c.id,
                            unlocked: true,
                            attempts: 0,
                            completions: 0,
                        })
                    )
                );
            }

            setIsInitialized(true);
        } catch (error) {
            console.error('Failed to initialize app:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const updatePreferences = useCallback(
        async (updates: Partial<UserPreferences>) => {
            if (!preferences) return;
            const newPrefs = { ...preferences, ...updates };
            await preferencesDB.save(newPrefs);
            setPreferences(newPrefs);
        },
        [preferences]
    );

    const saveCalibrationProfile = useCallback(
        async (profile: CalibrationProfile) => {
            await calibrationDB.save(profile);
            setCurrentProfile(profile);
            setNeedsCalibration(false);
            if (preferences) {
                await updatePreferences({ current_profile_id: profile.id });
            }
        },
        [preferences, updatePreferences]
    );

    return {
        isLoading,
        isInitialized,
        preferences,
        currentProfile,
        needsCalibration,
        updatePreferences,
        saveCalibrationProfile,
        setNeedsCalibration,
    };
}
