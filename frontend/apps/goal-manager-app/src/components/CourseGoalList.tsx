import CourseGoal from './CourseGoal';
import InfoBox from './InfoBox';
import { type CourseGoal as Goal } from '../App';
import { ReactNode } from 'react';

type CourseGoalListProps = {
    goals: Goal[];
    onDeleteGoal: (id: number) => void;
};

const CourseGoalList: React.FC<CourseGoalListProps> = ({ goals, onDeleteGoal }) => {
    let WarningBox: ReactNode = null;

    if (goals.length >= 4) {
        WarningBox = (
            <InfoBox mode="warning" severity="high">
                <p>You are collecting a lot of goals. Don't put too much on your plate!</p>
            </InfoBox>
        );
    }
    return (
        <>
            {goals.length === 0 && (
                <InfoBox mode="hint">
                    <p>No goals found. Maybe add one?</p>
                </InfoBox>
            )}

            {goals.length > 0 && (
                <>
                    {WarningBox}
                    <h2>Your Goals</h2>
                    <ul>
                        {goals.map((goal) => (
                            <li key={goal.id}>
                                <CourseGoal id={goal.id} title={goal.title} onDelete={onDeleteGoal}>
                                    <p>{goal.description}</p>
                                </CourseGoal>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

export default CourseGoalList;
