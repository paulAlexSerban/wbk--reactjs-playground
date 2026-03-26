import { useEffect, useRef, useState } from 'react';

import Container from './UI/Container.tsx';
import { type Timer as TimerProps } from '../store/timers-context.tsx';
import { useTimersContext } from '../store/timers-context.tsx';

export default function Timer({ name, duration }: TimerProps) {
    const interval = useRef<number | null>(null);
    const [remainingTime, setRemainingTime] = useState(duration * 1000);
    const { isRunning } = useTimersContext();

    if (remainingTime <= 0 && interval.current) {
        clearInterval(interval.current);
    }

    useEffect(() => {
        let timer: number;
        if (isRunning) {
            timer = setInterval(function () {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 0) {
                        return prevTime;
                    }
                    return prevTime - 50;
                });
                // this is needed because setInterval returns a NodeJS.Timeout as the project is configured to use NodeJS
            }, 50) as unknown as number;
            interval.current = timer;
        } else if (interval.current) {
            clearInterval(interval.current);
        }

        // Cleanup function so React.StrictMode doesn't start the timer twice
        return () => clearInterval(timer);
    }, [isRunning]);

    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);

    return (
        <Container as="article">
            <h2>{name}</h2>
            <p>
                <progress max={duration * 1000} value={remainingTime} />
            </p>
            <p>{formattedRemainingTime}</p>
        </Container>
    );
}
