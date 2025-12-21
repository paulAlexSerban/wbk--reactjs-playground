import { useState, type FC } from 'react';
import { log } from '../../log';
type ConfigureCounterProps = {
    onSet: (number: number) => void;
};

const ConfigureCounter: FC<ConfigureCounterProps> = ({ onSet }) => {
    log('<ConfigureCounter /> rendered', 1);
    const [enteredNumber, setEnteredNumber] = useState(0);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEnteredNumber(+event.target.value);
    }

    function handleSetClick() {
        onSet(enteredNumber);
        setEnteredNumber(0);
    }
    return (
        <section id="configure-counter">
            <h2>Set Counter</h2>
            <input type="number" onChange={handleChange} value={enteredNumber} />
            <button onClick={handleSetClick}>Set</button>
        </section>
    );
};

export default ConfigureCounter;
