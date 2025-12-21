import { useState, useRef } from 'react';

import ResultModal, { type ResultModalHandle } from './ResultModal.js';

type TimerChallengeProps = {
    title: string;
    targetTime: number;
};

export default function TimerChallenge({ title, targetTime }: TimerChallengeProps) {
    const timerRef = useRef<NodeJS.Timeout>();
    const dialogRef = useRef<ResultModalHandle>(null);

    const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

    const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

    if (timeRemaining <= 0) {
        clearInterval(timerRef.current);
        if (dialogRef.current) {
            dialogRef.current.open();
        }
    }

    function handleReset() {
        setTimeRemaining(targetTime * 1000);
    }

    function handleStart() {
        timerRef.current = setInterval(() => {
            setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 10);
        }, 10);
    }

    function handleStop() {
        if (!timerRef.current) {
            return;
        }
        if (dialogRef.current) {
            dialogRef.current.open();
        }
        clearInterval(timerRef.current);
    }

    return (
        <>
            <ResultModal ref={dialogRef} targetTime={targetTime} remainingTime={timeRemaining} onReset={handleReset} />
            <section className="challenge">
                <h2>{title}</h2>
                <p className="challenge-time">
                    {targetTime} second{targetTime > 1 ? 's' : ''}
                </p>
                <p>
                    <button onClick={timerIsActive ? handleStop : handleStart}>
                        {timerIsActive ? 'Stop' : 'Start'} Challenge
                    </button>
                </p>
                <p className={timerIsActive ? 'active' : undefined}>
                    {timerIsActive ? 'Time is running...' : 'Timer inactive'}
                </p>
            </section>
        </>
    );
}
