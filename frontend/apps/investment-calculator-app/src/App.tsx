import { useState } from 'react';

import Header from './components/Header/Header.tsx';
import UserInput from './components/UserInput/UserInput.tsx';
import ResultsTable from './components/ResultsTable/ResultsTable.tsx';

export type UserInputTypes = {
    initialInvestment: number;
    annualInvestment: number;
    expectedReturn: number;
    duration: number;
};

function App() {
    const [userInput, setUserInput] = useState<UserInputTypes>({
        initialInvestment: 10000,
        annualInvestment: 1200,
        expectedReturn: 6,
        duration: 10,
    });

    const inputIsValid = userInput.duration >= 1;

    const handleChange = (key: keyof UserInputTypes, value: string) => {
        setUserInput((prevUserInput: UserInputTypes) => {
            return {
                ...prevUserInput,
                [key]: parseFloat(value), // Convert string to number
            };
        });
    };

    return (
        <>
            <Header />
            <UserInput userInput={userInput} onChange={handleChange} />
            {!inputIsValid && <p className="center">Please enter a duration greater than zero.</p>}
            {inputIsValid && <ResultsTable input={userInput} />}
        </>
    );
}

export default App;
