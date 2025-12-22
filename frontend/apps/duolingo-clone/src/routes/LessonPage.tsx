import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import Exercise from '../components/Unit/Exercise';
import { useSelector, useDispatch } from 'react-redux';
import { updateLesson } from '../redux/unitSlice';
import { updateNetCoins, updateCompletedLessons, updateExperience } from '../redux/statusSlice';
import type { RootState } from '../redux/store';

import '../styles/lesson.css';

const Lesson = () => {
    const navigate = useNavigate();
    const units = useSelector((state: RootState) => state.units);
    const dispatch = useDispatch();
    const { unitId, lessonId } = useParams();
    const [listIndex, setListIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [netCoins, setNetCoins] = useState(0);
    const [experience, setExperience] = useState(0);

    const unit = units.find((unit) => unit.id === Number(unitId));
    const lesson = unit?.lessons.find((lesson) => lesson.id === Number(lessonId));

    const filterExerciseById = useMemo(() => lesson?.exercises, [lesson]);
    const progressIncrement = useMemo(() => {
        return filterExerciseById ? 100 / filterExerciseById.length : 0;
    }, [filterExerciseById]);

    const setSelectedAnswer = (valid: boolean) => {
        if (valid) {
            setNetCoins((prevCoins) => prevCoins + 5);
            setExperience((prevExp) => prevExp + 5);
            setListIndex((prevIndex) => prevIndex + 1);
            setProgress((prevProgress) => prevProgress + progressIncrement);
        } else {
            setNetCoins((prevCoins) => prevCoins - 2);
        }
    };

    useEffect(() => {
        if (filterExerciseById && listIndex === filterExerciseById.length) {
            dispatch(updateNetCoins(netCoins));
            dispatch(updateExperience(experience));
            // @todo: update completed lessons, do not update already updated lessons
            dispatch(updateCompletedLessons());
            dispatch(
                updateLesson({
                    unitId: Number(unitId),
                    lessonId: Number(lessonId),
                    lessonState: 'finished',
                })
            );
            dispatch(
                updateLesson({
                    unitId: Number(unitId),
                    lessonId: Number(lessonId) + 1,
                    lessonState: 'enabled',
                })
            );
        }
    }, [listIndex, filterExerciseById, dispatch, experience, netCoins, lessonId, unitId]);

    return (
        <div className="lesson__container">
            <ProgressBar progress={progress} />
            {listIndex === filterExerciseById?.length ? (
                <div className="lesson_finished__container">
                    <h2>Good job!</h2>
                    <div className="status_finished__container">
                        <div className="single_status">
                            <h3>Experience gained:</h3>
                            <p>{experience} xp</p>
                        </div>
                        <div className="single_status">
                            <h3>Netcoins earned:</h3>
                            <p>{netCoins}</p>
                        </div>
                    </div>
                    <div className="buttons__container">
                        <button className="exit__button" onClick={() => navigate(-1)}>
                            Exit
                        </button>
                    </div>
                </div>
            ) : (
                <Exercise
                    exercise={
                        filterExerciseById ? filterExerciseById[listIndex] : { title: '', question: '', answers: [] }
                    }
                    selectAnswerHandler={(valid: boolean) => setSelectedAnswer(valid)}
                />
            )}
        </div>
    );
};

export default Lesson;
