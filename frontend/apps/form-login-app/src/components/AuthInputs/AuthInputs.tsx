import { useState } from 'react';
import classes from './authInputs.module.scss';
import styled from 'styled-components';
import Button from './Button';
import CustomInput from './Input';

const ControlContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
`;

type AuthInputsProps = {
    email: string;
    password: string;
};

export default function AuthInputs() {
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredPassword, setEnteredPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);

    function handleInputChange(identifier: keyof AuthInputsProps, value: string) {
        if (identifier === 'email') {
            setEnteredEmail(value);
        } else {
            setEnteredPassword(value);
        }
    }

    function handleLogin() {
        setSubmitted(true);
    }

    const emailNotValid = submitted && !enteredEmail.includes('@');
    const passwordNotValid = submitted && enteredPassword.trim().length < 6;

    return (
        <div id="auth-inputs" className={classes['auth-inputs']}>
            <ControlContainer>
                <CustomInput
                    label="Email"
                    type="email"
                    invalid={emailNotValid}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <CustomInput
                    label="Password"
                    type="password"
                    invalid={passwordNotValid}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                />
            </ControlContainer>
            <div className={classes.actions}>
                <button type="button" className={classes['text-button']}>
                    Create a new account
                </button>
                <Button onClick={handleLogin} />
            </div>
        </div>
    );
}
