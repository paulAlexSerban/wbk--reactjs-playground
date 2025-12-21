import { useState, FC, memo, useCallback, useMemo } from 'react';

import IconButton from '../UI/IconButton.tsx';
import MinusIcon from '../UI/Icons/MinusIcon.tsx';
import PlusIcon from '../UI/Icons/PlusIcon.tsx';
import CounterOutput from './CounterOutput.tsx';
import { log } from '../../log.js';

function isPrime(number: number) {
    log('Calculating if is prime number', 2, 'other');
    if (number <= 1) {
        return false;
    }

    const limit = Math.sqrt(number);

    for (let i = 2; i <= limit; i++) {
        if (number % i === 0) {
            return false;
        }
    }

    return true;
}

type CounterProps = {
    initialCount: number;
};

/**
 * using memo here is useless because of the restructuring and implementing
 * ConfigureCounter.tsx
 *
 * left here for example purposes, it should be remove in real life scenario
 */
const Counter: FC<CounterProps> = memo(({ initialCount }) => {
    log('<Counter /> rendered', 1);
    /**
     * using useMemo here to memoize the result and avoid re-rendering of the
     * Counter component
     *
     * useMemo should only be used for complex calculations and expensive operations
     */
    const initialCountIsPrime = useMemo(() => isPrime(initialCount), [initialCount]);

    const [counter, setCounter] = useState<number>(initialCount);

    /**
     * using useCallback here to memoize the function and avoid re-rendering of the
     * IconButton component
     */
    const handleDecrement = useCallback(() => {
        // using the arrow function form of the state updating function, React guarantees that the state update will be scheduled correctly
        setCounter((prevCounter) => prevCounter - 1);
    }, []);

    const handleIncrement = useCallback(() => {
        setCounter((prevCounter) => prevCounter + 1);
    }, []);

    return (
        <section className="counter">
            <p className="counter-info">
                The initial counter value was <strong>{initialCount}</strong>. It{' '}
                <strong>is {initialCountIsPrime ? 'a' : 'not a'}</strong> prime number.
            </p>
            <p>
                {/* as we pass handleDecrement here as prop we have to make sure we always pass the same instance of the handler function */}
                <IconButton icon={MinusIcon} onClick={handleDecrement}>
                    Decrement
                </IconButton>
                <CounterOutput value={counter} />
                <IconButton icon={PlusIcon} onClick={handleIncrement}>
                    Increment
                </IconButton>
            </p>
        </section>
    );
});

export default Counter;
