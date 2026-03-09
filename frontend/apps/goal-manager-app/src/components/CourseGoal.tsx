// import { type ReactNode } from 'react';
// the type decorator is special for TS to tell the compiler that ReactNode is a type
// interface CourseGoalProps {
//     title: string;
//     description: string;
//     children?: ReactNode;
// }

import { type FC, type PropsWithChildren } from 'react';

type CourseGoalProps = PropsWithChildren<{
    title: string;
    id: number;
    onDelete: (id: number) => void;
}>;
// ALTERNATIVE: const CourseGoal = ({ title, description }: CourseGoalProps) => {
const CourseGoal: FC<CourseGoalProps> = ({ title, onDelete, id, children }) => {
    return (
        <article>
            <div>
                <h2>{title}</h2>
                {children}
            </div>
            <button onClick={() => onDelete(id)}>Delete</button>
        </article>
    );
};

export default CourseGoal;
