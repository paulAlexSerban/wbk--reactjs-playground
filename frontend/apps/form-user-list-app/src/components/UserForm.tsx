import { useState, FC, FormEvent, ChangeEvent } from 'react';
import { User } from '../types.d';

type UserFormProps = {
    onUserAdd: (user: User) => void;
};

const UserForm: FC<UserFormProps> = ({ onUserAdd }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onUserAdd({ name, email });
        setEmail('');
        setName('');
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Names</label>
                <input id="name" value={name} onChange={handleNameChange} aria-label="Names" />
            </div>
            <div>
                <label htmlFor="email">Enter Email</label>
                <input id="email" value={email} onChange={handleEmailChange} aria-label="Email" />
            </div>
            <button>Add User</button>
        </form>
    );
};

export default UserForm;
