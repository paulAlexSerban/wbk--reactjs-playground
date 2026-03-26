import SingleQuestion from './SingleQuestion';
import { FC } from 'react';
type Question = {
    id: string;
    title: string;
    info: string;
};

type QuestionsProps = {
    questions: Question[];
    activeId?: string | null;
    toggleQuestion?: (id: string) => void;
};

const Questions: FC<QuestionsProps> = ({ questions, activeId, toggleQuestion }) => {
    return (
        <section className="container">
            <h1>Questions</h1>
            {questions.map((question) => {
                return (
                    <SingleQuestion
                        key={question.id}
                        {...question}
                        activeId={activeId}
                        toggleQuestion={toggleQuestion ? toggleQuestion : undefined}
                    ></SingleQuestion>
                );
            })}
        </section>
    );
};
export default Questions;
