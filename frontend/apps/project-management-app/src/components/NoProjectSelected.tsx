import { type FC } from 'react';
import noProjectImage from '../assets/no-projects.png';
import Button from './Button';

type NoProjectSelectedProps = {
    onStartAddProject: () => void;
};

const NoProjectSelected: FC<NoProjectSelectedProps> = ({ onStartAddProject }) => {
    return (
        <div className="mt-24 text-center w-2/3">
            <img src={noProjectImage} alt="Empty task list" className="w-16 h-16 object-contain mx-auto" />
            <h2 className="text-xl font-bold text-stone-500 my-4">No Project Selected</h2>
            <p className="text-stone-400 mb-4">Select a project.</p>
            <Button onClick={onStartAddProject}>Create New Project</Button>
        </div>
    );
};

export default NoProjectSelected;
