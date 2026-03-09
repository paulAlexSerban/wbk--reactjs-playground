import { type FC, useState, useEffect } from 'react';

type QuestionTimerProps = {
    timeout: number;
    onTimeout: (() => void) | null;
    mode: string;
};

const FREQUENCY = 50;

const QuestionTimer: FC<QuestionTimerProps> = ({ timeout, onTimeout, mode }) => {
    const [remainingTime, setRemainingTime] = useState<number>(timeout);

    useEffect(() => {
        if (onTimeout === null) {
            return;
        }
        const timer = setTimeout(onTimeout, timeout);
        return () => {
            clearTimeout(timer);
        };
    }, [timeout, onTimeout]);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevRemainingTime) => prevRemainingTime - FREQUENCY);
        }, FREQUENCY);

        return () => {
            clearInterval(interval);
        };
    }, [timeout]);

    return <progress id="question-time" max={timeout} value={remainingTime} className={mode} />;
};

export default QuestionTimer;
