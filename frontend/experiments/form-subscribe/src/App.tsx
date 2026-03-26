import Input from './Input.tsx';
import { useRef } from 'react';

export const userData = {
    name: '',
    email: '',
};

function App() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    function handleSaveData() {
        if (!nameRef.current || !emailRef.current) {
            return;
        }
        userData.name = nameRef.current.value;
        userData.email = emailRef.current.value;

        console.log(userData);
    }

    return (
        <div id="app">
            <Input ref={nameRef} type="text" label="Your Name" />
            <Input ref={emailRef} type="email" label="Your E-Mail" />
            <p id="actions">
                <button onClick={handleSaveData}>Save Data</button>
            </p>
        </div>
    );
}

export default App;
