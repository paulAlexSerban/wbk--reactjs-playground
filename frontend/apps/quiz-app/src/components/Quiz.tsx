import { type FC, useState, useCallback } from 'react';
import QUESTIONS from '../questions';
import Summary from './Summary';
import Question from './Question';

const Quiz: FC = () => {
    // const [userAnswers, setUserAnswers] = useState<string[] | >([]);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const activeQuestionIndex = userAnswers.length;

    const handleSelectAnswer = useCallback((selectedAnswer: string | null) => {
        if (selectedAnswer === null) {
            setUserAnswers((prevUserAnswers) => [...prevUserAnswers, null]);
        } else {
            setUserAnswers((prevUserAnswers) => [...prevUserAnswers, selectedAnswer]);
        }
    }, []);

    const handleSkipAnswer = useCallback(() => handleSelectAnswer(null), [handleSelectAnswer]);
    const quizIsComplete = activeQuestionIndex === QUESTIONS.length;

    if (quizIsComplete) {
        return <Summary userAnswers={userAnswers} />;
    }

    return (
        <div id="quiz">
            <Question
                // use the key prop to force React to re-render the component when the activeQuestionIndex changes.
                key={activeQuestionIndex}
                onSelectAnswer={handleSelectAnswer}
                onSkipAnswer={handleSkipAnswer}
                index={activeQuestionIndex}
            />
        </div>
    );
};

export default Quiz;
