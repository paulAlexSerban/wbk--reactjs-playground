import { type FC, type FormEvent, useRef } from 'react';

type Goal = {
    id: number;
    title: string;
    description: string;
};

type NewGoalProps = {
    onAddGoal: (goal: Goal) => void;
};

const NewGoal: FC<NewGoalProps> = ({ onAddGoal }) => {
    const goalInputRef = useRef<HTMLInputElement>(null);
    const summaryInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const goal = goalInputRef.current!.value;
        const summary = summaryInputRef.current!.value;

        if (goal.trim().length === 0 || summary.trim().length === 0) {
            return;
        }

        onAddGoal({ id: 0, title: goal, description: summary });

        event.currentTarget.reset();
    };

    return (
        <form onSubmit={handleSubmit}>
            <p>
                <label htmlFor="goal">Your goal</label>
                <input type="text" id="goal" name="goal" ref={goalInputRef} />
            </p>
            <p>
                <label htmlFor="summary">Short summary</label>
                <input type="text" id="summary" name="summary" ref={summaryInputRef} />
            </p>
            <p>
                <button>Add goal</button>
            </p>
        </form>
    );
};

export default NewGoal;
