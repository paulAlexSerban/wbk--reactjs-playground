import { NavLink } from 'react-router-dom';
import CheckedIcon from '../../assets/checked.svg';
import '../../styles/lessonmodule.css';

interface lessonModuleProps {
    unitId: number;
    lesson: {
        id: number;
        title: string;
        description: string;
        avatar: string;
        enabled: boolean;
        finished: boolean;
    };
}

const LessonModule = ({ unitId, lesson }: lessonModuleProps) => {
    return (
        <div className="lesson_module__container">
            <div>
                <img src={lesson.avatar} alt="lesson" />
            </div>
            <div>
                <div className="heading">
                    <h1>{lesson.title}</h1>
                    {lesson.finished && <img src={CheckedIcon} alt="checked" />}
                </div>
                <p>{lesson.description}</p>
                <NavLink
                    to={`unit/${unitId}/lesson/${lesson.id}`}
                    onClick={(e) => {
                        if (!lesson.enabled) {
                            e.preventDefault();
                        }
                    }}
                    className={lesson.enabled ? 'enabled' : 'disabled'}
                >
                    Start
                </NavLink>
            </div>
        </div>
    );
};

export default LessonModule;
