// Importing the Redux toolkit configuration and the reducers.
import { configureStore } from '@reduxjs/toolkit';
import unitReducer from './unitSlice';
import statusSlice from './statusSlice';

/**
 * Creates and configures the Redux store.
 * The store is created with a root reducer consisting of `unitReducer` and `statusSlice`.
 * @type {Store}
 */
export const store = configureStore({
    reducer: {
        units: unitReducer,
        status: statusSlice,
    },
});

/**
 * Infers and exports the `RootState` type from the store's state.
 * The `RootState` type represents the complete state of the Redux store.
 * @type {State}
 */
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {units: UnitsState, status: StatusState}

/**
 * Infers and exports the `AppDispatch` type from the store's dispatch function.
 * The `AppDispatch` type represents the dispatch function to interact with the Redux store.
 * @type {Dispatch}
 */
export type AppDispatch = typeof store.dispatch;
