// Importing the necessary libraries, hooks, and styles.
import { useDispatch, useSelector } from 'react-redux';
import '../../styles/unit.css';
import { useEffect } from 'react';
// Importing the LessonModule component and Redux actions.
import LessonModule from './LessonModule';
import { updateUnit, updateLesson } from '../../redux/unitSlice';

// Importing the RootState type for the Redux store.
import type { RootState } from '../../redux/store';

/**
 * The properties interface for the Unit component.
 * @interface
 * @property {Object} unit - The unit object.
 * @property {number} unit.id - The id of the unit.
 * @property {string} unit.title - The title of the unit.
 * @property {string} unit.description - The description of the unit.
 * @property {boolean} unit.enabled - Indicates if the unit is enabled.
 * @property {boolean} unit.finished - Indicates if the unit is finished.
 * @property {Array} unit.lessons - The lessons within the unit.
 * @property {number} unit.lessons.id - The id of the lesson.
 * @property {string} unit.lessons.title - The title of the lesson.
 * @property {string} unit.lessons.description - The description of the lesson.
 * @property {string} unit.lessons.avatar - The avatar for the lesson.
 * @property {boolean} unit.lessons.enabled - Indicates if the lesson is enabled.
 * @property {boolean} unit.lessons.finished - Indicates if the lesson is finished.
 */
interface UnitProps {
    unit: {
        id: number;
        title: string;
        description: string;
        enabled: boolean;
        finished: boolean;
        lessons: {
            id: Number;
            title: string;
            description: string;
            avatar: string;
            enabled: boolean;
            finished: boolean;
        }[];
    };
}

/**
 * A functional component representing a Unit.
 * @param {UnitProps} unit - The props for the Unit component.
 * @returns {JSX.Element} The JSX for the Unit component.
 */
const Unit = ({ unit }: UnitProps) => {
    // Using the Redux useSelector hook to select units from the Redux store.
    const units = useSelector((state: RootState) => state.units);
    // Using the Redux useDispatch hook to dispatch actions.
    const dispatch = useDispatch();

    // Using the React useEffect hook to update the unit and lesson status.
    useEffect(() => {
        // If all lessons are finished, update the unit to finished.
        if (!unit.lessons.filter((lesson) => !lesson.finished).length) {
            dispatch(updateUnit({ id: unit.id, state: 'finished' }));

            // If the next unit exists, enable it.
            if (units[unit.id] !== undefined) {
                dispatch(updateUnit({ id: unit.id + 1, state: 'enabled' }));
                dispatch(
                    updateLesson({
                        unitId: unit.id + 1,
                        lessonId: 1,
                        lessonState: 'enabled',
                    })
                );
            }
        }
    });

    // The JSX for the Unit component.
    return (
        <div id="unit__container">
            <div className={`unit__header ${!unit.enabled && 'disable'} ${unit.finished && 'finished'}`}>
                <h2>{unit.title}</h2>
                <h3>{unit.description}</h3>
            </div>
            <div className="lessons__container">
                {unit.lessons.map((lesson: any) => (
                    <LessonModule key={lesson.id} unitId={unit.id} lesson={lesson} />
                ))}
            </div>
        </div>
    );
};

// Exporting the Unit component as the default export.
export default Unit;
