import { type FC, useState, type ChangeEvent } from 'react';

type NewTaskProps = {
    onAdd: (text: string) => void;
};

const NewTask: FC<NewTaskProps> = ({ onAdd }) => {
    const [enteredTask, setEnteredTask] = useState('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEnteredTask(event.target.value);
    };

    const handleClick = () => {
        if (enteredTask.trim() === '') {
            return;
        }
        onAdd(enteredTask);
        setEnteredTask('');
    };
    return (
        <div className="flex items-center gap-4">
            <input
                onChange={handleChange}
                value={enteredTask}
                type="text"
                className="w-64 px-2 py-1 border-b-2 rounded-sm border-stone-300 bg-stone-200 focus:outline-none focus:border-stone-600"
            />
            <button className="text-stone-700 hover:text-stone-950" onClick={handleClick}>
                Add task
            </button>
        </div>
    );
};

export default NewTask;
