import { type FC, useRef } from 'react';
import Input from './Input';
import { type AddProjectFormData } from '../App';
import Modal, { type ModalHandle } from './Modal';
type NewProjectProps = {
    onAdd: (projectData: AddProjectFormData) => void;
    onCancel: () => void;
};

const NewProject: FC<NewProjectProps> = ({ onAdd, onCancel }) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const dueDateRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<ModalHandle>(null);

    const handleSave = () => {
        const title = titleRef.current!.value;
        const description = descriptionRef.current!.value;
        const dueDate = dueDateRef.current!.value;

        if (title.trim() === '' || description.trim() === '' || dueDate.trim() === '') {
            modalRef.current!.open();
            return;
        }

        const projectData = {
            title,
            description,
            dueDate,
        };

        onAdd(projectData);

        titleRef.current!.value = '';
        descriptionRef.current!.value = '';
        dueDateRef.current!.value = '';
    };
    return (
        <>
            <Modal ref={modalRef} buttonCaption="OK">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h2 className="text-xl font-bold text-stone-700 my-4">Error</h2>
                    <p className="text-stone-600 mb-4">Please fill out all fields.</p>
                </div>
            </Modal>
            <div className="w-[35rem] mt-16">
                <menu className="flex items-center justify-end gap-4 my-4">
                    <li>
                        <button className="text-stone-800 hover:text-stone-950" onClick={onCancel}>
                            Cancel
                        </button>
                    </li>
                    <li>
                        <button
                            className="px-6 py-2 rounded-md bg-stone-800 text-stone-50 hover:bg-stone-950"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </li>
                </menu>
                <div>
                    <Input type="text" label="Title" ref={titleRef} />
                    <Input label="Description" textarea ref={descriptionRef} />
                    <Input type="date" label="Due Date" ref={dueDateRef} />
                </div>
            </div>
        </>
    );
};

export default NewProject;
