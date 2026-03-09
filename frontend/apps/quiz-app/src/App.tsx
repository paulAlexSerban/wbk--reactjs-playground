import { type FC } from 'react';
import Header from './components/Header';
import Quiz from './components/Quiz';
const App: FC = () => {
    return (
        <>
            <Header />
            <main>
                <Quiz />
            </main>
        </>
    );
};

export default App;
