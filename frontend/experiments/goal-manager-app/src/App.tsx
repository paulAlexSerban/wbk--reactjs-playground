import { useState } from 'react';

import Header from './components/Header';
import NewGoal from './components/NewGoal';
import CourseGoalList from './components/CourseGoalList';
import goalsImg from './assets/goals.jpg';

export type CourseGoal = {
    id: number;
    title: string;
    description: string;
};

const goalsData: CourseGoal[] = [];

export default function App() {
    const [goals, setGoals] = useState<CourseGoal[]>(goalsData);
    const handleAddGoal = (goal: CourseGoal) => {
        setGoals((prevState) => {
            const { title, description } = goal;
            const updatedGoals = [...prevState];
            const newGoal = {
                id: prevState.length + 1,
                title: title,
                description: description,
            };
            updatedGoals.unshift(newGoal);
            return updatedGoals;
        });
    };

    const handleDeleteGoal = (goalId: number) => {
        setGoals((prevState) => {
            const updatedGoals = prevState.filter((goal) => goal.id !== goalId);
            return updatedGoals;
        });
    };

    return (
        <main>
            <Header image={{ src: goalsImg, alt: 'A list of goals.' }}>
                <h1>Goal Manager</h1>
            </Header>
            <NewGoal onAddGoal={handleAddGoal} />
            <CourseGoalList goals={goals} onDeleteGoal={handleDeleteGoal} />
        </main>
    );
}
