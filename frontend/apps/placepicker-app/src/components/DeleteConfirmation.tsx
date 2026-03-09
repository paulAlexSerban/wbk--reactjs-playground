import { type FC, useEffect } from 'react';
import ProgressBar from './ProgressBar';

type DeleteConfirmationProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

const TIMER = 3000;

const DeleteConfirmation: FC<DeleteConfirmationProps> = ({ onConfirm, onCancel }) => {
    /**
     * ProgressBar as a child component improves performance because it does not
     * cause the parent component to re-render every time the progress bar is
     * updated (every 10ms)
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            onConfirm();
        }, TIMER);
        return () => {
            clearTimeout(timer);
        };
    }, [onConfirm]);

    return (
        <div id="delete-confirmation">
            <h2>Are you sure?</h2>
            <p>Do you really want to remove this place?</p>
            <div id="confirmation-actions">
                <button onClick={onCancel} className="button-text">
                    No
                </button>
                <button onClick={onConfirm} className="button">
                    Yes
                </button>
            </div>
            <ProgressBar timer={TIMER} />
        </div>
    );
};

export default DeleteConfirmation;
