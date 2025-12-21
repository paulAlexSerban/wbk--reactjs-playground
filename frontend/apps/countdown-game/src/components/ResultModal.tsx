import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ResultModalProps = {
    targetTime: number;
    remainingTime: number;
    onReset: () => void;
};

export type ResultModalHandle = {
    open: () => void;
};

const ResultModal = forwardRef<ResultModalHandle, ResultModalProps>(function ResultModal(
    { targetTime, remainingTime, onReset },
    ref
) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const userLost = remainingTime <= 0;
    const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
    const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

    useImperativeHandle(ref, () => {
        return {
            open() {
                if (dialogRef.current) {
                    dialogRef.current.showModal();
                }
            },
        };
    });

    // to close modal on ESC key press onClose is used as a prop on dialog element
    // onClose is called when the dialog is dismissed by the user using native UI event from button in the dialog
    return createPortal(
        <dialog ref={dialogRef} className="result-modal" onClose={onReset}>
            {userLost && <h2>You lost</h2>}
            {!userLost && <h2>Your Score: {score}</h2>}
            <p>
                The target time was <strong>{targetTime} seconds.</strong>
            </p>
            <p>
                You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
            </p>
            <form method="dialog" onSubmit={onReset}>
                <button>Close</button>
            </form>
        </dialog>,
        document.getElementById('modal') as HTMLElement
    );
});

export default ResultModal;
