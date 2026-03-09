import { FC, useEffect, useState } from 'react';

type ProgressBarProps = {
    timer: number;
};

/**
 * ProgressBar as a child component improves performance because it does not
 * cause the parent component to re-render every time the progress bar is
 * updated (every 10ms)
 */

const ProgressBar: FC<ProgressBarProps> = ({ timer }) => {
    const [remainingTime, setRemainingTime] = useState(timer);

    useEffect(() => {
        setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 0) {
                    return prevTime;
                }
                return prevTime - 10;
            });
        }, 10);
    }, []);

    return <progress max={timer} value={remainingTime} />;
};

export default ProgressBar;
