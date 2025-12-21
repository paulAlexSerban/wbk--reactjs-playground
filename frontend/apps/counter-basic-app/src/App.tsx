import { useState } from 'react';

import Counter from './components/Counter/Counter.tsx';
import ConfigureCounter from './components/Counter/ConfigureCounter.tsx';
import Header from './components/Header.tsx';
import { log } from './log.js';

function App() {
    log('<App /> rendered');
    const [chosenCount, setChosenCount] = useState(0);

    const handleSetCount = (newCount: number) => {
        // when calling a state updating function, the state update will be scheduled by React and not happen immediately
        setChosenCount(newCount);
        // logging here will show the old state value
        log(`Chosen count: ${chosenCount}`);
        // the new state will be available the next time the component renders
    };

    return (
        <>
            <Header />
            <main>
                <ConfigureCounter onSet={handleSetCount} />
                {/* use "key" with "chosenCount" to force resetting component if "chosenCount" changes without using "useEffect" inside the component and force an extra re-render */}
                <Counter key={chosenCount} initialCount={chosenCount} />
            </main>
        </>
    );
}

export default App;
