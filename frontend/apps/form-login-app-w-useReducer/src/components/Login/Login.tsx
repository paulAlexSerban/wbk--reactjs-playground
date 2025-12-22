import { type FC, useState, type ChangeEvent, useEffect, useReducer, useRef } from 'react';

import Card from '../UI/Card/Card';
import Button from '../UI/Button/Button';
import Input, { InputHandle } from '../UI/Input/Input';

import { emailReducer, passwordReducer } from './Login.reducers';
import { useAuthContext } from '../../store/auth-context';

import classes from './Login.module.scss';

const Login: FC = () => {
    const { onLogin } = useAuthContext();
    const [formIsValid, setFormIsValid] = useState<boolean>(false);
    const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: false, touched: false });
    const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
        value: '',
        isValid: false,
        touched: false,
    });

    // emailIsValid and passwordIsValid are aliases for emailState.isValid and passwordState.isValid
    // this is a destructuring assignment pattern with renaming
    const { isValid: emailIsValid } = emailState;
    const { isValid: passwordIsValid } = passwordState;

    useEffect(() => {
        // debounce pattern to avoid checking form validity on every keystroke
        const timer = setTimeout(() => {
            console.log('checking form validity');
            setFormIsValid(emailIsValid && passwordIsValid);
        }, 500);

        return () => {
            console.log('CLEANUP');
            clearTimeout(timer);
        };
    }, [emailIsValid, passwordIsValid]);

    const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        dispatchEmail({ type: 'USER_INPUT', val: value });
    };

    const passwordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        dispatchPassword({ type: 'USER_INPUT', val: value });
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: 'INPUT_BLUR' });
    };

    const validatePasswordHandler = () => {
        dispatchPassword({ type: 'INPUT_BLUR' });
    };

    const emailInputRef = useRef<InputHandle>(null);
    const passwordInputRef = useRef<InputHandle>(null);

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (formIsValid) {
            onLogin(emailState.value, passwordState.value);
        } else if (!emailIsValid) {
            emailInputRef.current?.focus();
        } else if (!passwordIsValid) {
            passwordInputRef.current?.focus();
        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    type="email"
                    id="email"
                    label="E-Mail"
                    value={emailState.value}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                    isValid={emailState.isValid}
                    isTouched={emailState.touched}
                    ref={emailInputRef}
                />
                <Input
                    type="password"
                    id="password"
                    label="Password"
                    value={passwordState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                    isValid={passwordState.isValid}
                    isTouched={passwordState.touched}
                    ref={passwordInputRef}
                />

                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn} disabled={!formIsValid}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
