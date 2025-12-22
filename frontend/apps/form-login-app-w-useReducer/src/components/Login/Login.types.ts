// export type LoginProps = {
//     onLogin: (email: string, password: string) => void;
// };
export type InputState = {
    value: string;
    isValid: boolean;
};
export type InputReducerAction = {
    type: string;
    val?: string;
};
