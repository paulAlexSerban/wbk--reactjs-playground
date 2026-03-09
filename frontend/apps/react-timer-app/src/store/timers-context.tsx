import { useReducer, createContext, type ReactNode, useContext } from 'react';

export type Timer = {
    name: string;
    duration: number;
};

type TimersState = {
    isRunning: boolean;
    timers: Timer[];
};

type TimersContextValue = TimersState & {
    addTimer: (timer: Timer) => void;
    startTimers: () => void;
    stopTimers: () => void;
};

// createContext is a generic function that takes one type argument
const TimersContext = createContext<TimersContextValue>({
    isRunning: false,
    timers: [],
    addTimer: () => {},
    startTimers: () => {},
    stopTimers: () => {},
});

// this is the common pattern for creating a context
export const useTimersContext = () => {
    const timersCtx = useContext(TimersContext);
    if (!timersCtx) {
        throw new Error('useTimersContext must be used within a TimersContextProvider');
    }
    return timersCtx;
};

type TimersContextProviderProps = {
    children: ReactNode;
};

type StartTimersAction = {
    type: 'START_TIMERS';
};

type StopTimersAction = {
    type: 'STOP_TIMERS';
};

type AddTimerAction = {
    type: 'ADD_TIMER';
    payload: Timer;
};

type TimersReducerAction = StartTimersAction | StopTimersAction | AddTimerAction;

const TimersContextProvider = ({ children }: TimersContextProviderProps) => {
    const initialState: TimersState = {
        isRunning: false,
        timers: [],
    };

    const timersReducer = (state: TimersState, action: TimersReducerAction) => {
        switch (action.type) {
            case 'ADD_TIMER':
                return {
                    ...state,
                    timers: state.timers.concat(action.payload as AddTimerAction['payload']),
                };
            case 'START_TIMERS':
                return {
                    ...state,
                    isRunning: true,
                };
            case 'STOP_TIMERS':
                return {
                    ...state,
                    isRunning: false,
                };
            default:
                return state;
        }
    };

    const [timersState, setTimersState] = useReducer(timersReducer, initialState);

    const addTimer = (timerData: Timer) => {
        setTimersState({ type: 'ADD_TIMER', payload: timerData });
    };

    const startTimers = () => {
        setTimersState({ type: 'START_TIMERS' });
    };

    const stopTimers = () => {
        setTimersState({ type: 'STOP_TIMERS' });
    };

    const ctx: TimersContextValue = {
        isRunning: timersState.isRunning,
        timers: timersState.timers,
        addTimer,
        startTimers,
        stopTimers,
    };

    return <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>;
};

export default TimersContextProvider;
