import { InputState, InputReducerAction } from './Login.types';

export const emailReducer = (state: InputState, action: InputReducerAction) => {
    if (action.type === 'USER_INPUT') {
        const value = action.val || '';
        const isValid = value.includes('@');

        return { value, isValid, touched: true };
    }
    if (action.type === 'INPUT_BLUR') {
        const { value } = state;
        const isValid = value.includes('@');
        return { value, isValid, touched: true };
    }
    return { value: '', isValid: false };
};

export const passwordReducer = (state: InputState, action: InputReducerAction) => {
    if (action.type === 'USER_INPUT') {
        const value = action.val || '';
        const isValid = value.trim().length > 6;
        return { value, isValid, touched: true };
    }

    if (action.type === 'INPUT_BLUR') {
        const { value } = state;
        const isValid = value.trim().length > 6;
        return { value, isValid, touched: true };
    }

    return { value: '', isValid: false, touched: false };
};
