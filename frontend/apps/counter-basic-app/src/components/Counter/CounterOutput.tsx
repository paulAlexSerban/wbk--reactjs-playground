import { log } from '../../log.js';
import type { FC } from 'react';
type CounterOutputProps = {
    value: number;
};

const CounterOutput: FC<CounterOutputProps> = ({ value }) => {
    log('<CounterOutput /> rendered', 2);

    const cssClass = value >= 0 ? 'counter-output' : 'counter-output negative';
    return <span className={cssClass}>{value}</span>;
};

export default CounterOutput;
