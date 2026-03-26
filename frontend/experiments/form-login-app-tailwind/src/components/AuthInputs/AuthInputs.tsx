import { useState } from 'react';
import Button from './Button';
import Input from './Input';

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
        <div
            id="auth-inputs"
            className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-b from-stone-700 to-stone-800"
        >
            <div className="flex flex-col gap-2 mb-6">
                <Input
                    label="Email"
                    type="email"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    invalid={emailNotValid}
                />
                <Input
                    label="Password"
                    type="password"
                    invalid={passwordNotValid}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                />
            </div>
            <div className="flex justify-end gap-4">
                <button type="button" className="text-amber-400 hover:text-amber-500">
                    Create a new account
                </button>
                <Button onClick={handleLogin} type="button">
                    Login
                </Button>
            </div>
        </div>
    );
}
