import { useState, FC, FormEvent } from 'react';
import { Task } from './Tasks';

type TaskFormProps = {
    addTask: (task: Task) => void;
};

const TaskForm: FC<TaskFormProps> = ({ addTask }) => {
    const [task, setTask] = useState('');

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!task) {
            alert('Enter a task!');
            return;
        }

        addTask({
            _id: Math.random().toString(36).substr(2, 9),
            text: task,
        });

        setTask('');
    };
    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="task">Task</label>
                <input type="text" placeholder="Add Task" value={task} onChange={(e) => setTask(e.target.value)} />
            </div>
            <button className="save-btn">Save Task</button>
        </form>
    );
};

export default TaskForm;
