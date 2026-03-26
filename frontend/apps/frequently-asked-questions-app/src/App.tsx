import { useState } from 'react';
import data from './data';
import Questions from './components/Questions';

function App() {
    const [questions] = useState(data);
    return (
        <main>
            <Questions questions={questions} />
        </main>
    );
}

export default App;
