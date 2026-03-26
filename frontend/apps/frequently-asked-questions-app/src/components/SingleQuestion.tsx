import { useState, type FC } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

type SingleQuestionProps = {
    id: string;
    title: string;
    info: string;
    activeId?: string | null;
    toggleQuestion?: (id: string) => void;
};

const SingleQuestion: FC<SingleQuestionProps> = ({ id, title, info, activeId, toggleQuestion }) => {
    const [showInfo, setShowInfo] = useState(false);
    const isActive = id === activeId;

    const handleToggle = () => {
        if (toggleQuestion) {
            toggleQuestion(id);
        } else {
            setShowInfo(!showInfo);
        }
    };
    return (
        <article className="question">
            <header>
                <h5>{title}</h5>
                <button className="question-btn" onClick={handleToggle}>
                    {isActive || showInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </button>
            </header>
            {isActive && <p>{info}</p>}
        </article>
    );
};

export default SingleQuestion;
