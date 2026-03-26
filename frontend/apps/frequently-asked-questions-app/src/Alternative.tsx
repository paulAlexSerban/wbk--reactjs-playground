import { useState } from 'react';
import data from './data';
import Questions from './components/Questions';

function App() {
    const [questions] = useState(data);
    const [activeId, setActiveId] = useState<string | null>(null);

    const toggleQuestion = (id: string) => {
        const newActiveId = id === activeId ? null : id;
        setActiveId(newActiveId);
    };

    return (
        <main>
            <Questions questions={questions} activeId={activeId ? activeId : null} toggleQuestion={toggleQuestion} />
        </main>
    );
}

export default App;
