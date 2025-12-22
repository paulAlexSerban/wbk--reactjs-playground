// Importing necessary functions from Redux toolkit.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Represents the state of the user's status.
export interface StatusState {
    netCoins: number;
    experience: number;
    completedLessons: number;
}

// The initial state of the user's status.
const initialState: StatusState = {
    netCoins: 0,
    experience: 0,
    completedLessons: 0,
};

// The status slice of the Redux store.
export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        // Updates the net coins of the user by a given amount. If the amount is negative, it will be treated as zero.
        updateNetCoins: (state, action: PayloadAction<number>) => {
            const amountToAdd = Math.max(action.payload, 0);
            state.netCoins += amountToAdd;
        },
        // Updates the experience of the user by a given amount. If the amount is negative, it will be treated as zero.
        updateExperience: (state, action: PayloadAction<number>) => {
            const amountToAdd = Math.max(action.payload, 0);
            state.experience += amountToAdd;
        },
        // Increments the count of completed lessons of the user by one.
        updateCompletedLessons: (state) => {
            state.completedLessons += 1;
        },
    },
});

// Action for adding a certain amount to the user's net coins. Will treat negative inputs as zero.
export const { updateNetCoins } = statusSlice.actions;

// Action for adding a certain amount to the user's experience. Will treat negative inputs as zero.
export const { updateExperience } = statusSlice.actions;

// Action for incrementing the count of the user's completed lessons by one.
export const { updateCompletedLessons } = statusSlice.actions;

// The reducer function for this slice of the state.
export default statusSlice.reducer;
