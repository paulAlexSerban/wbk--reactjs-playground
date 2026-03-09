import { type FC, useState } from 'react';
import QuestionTimer from './QuestionTimer';
import Answers from './Answers';
import QUESTIONS from '../questions';

type QuestionProps = {
    onSelectAnswer: (selectedAnswer: string) => void;
    onSkipAnswer: () => void;
    index: number;
};

type Answer = {
    selectedAnswer: string;
    isCorrect: boolean | null;
};
const Question: FC<QuestionProps> = ({ onSelectAnswer, onSkipAnswer, index }) => {
    const [answer, setAnswer] = useState<Answer>({ selectedAnswer: '', isCorrect: null });
    let timer = 10000;

    if (answer.selectedAnswer) {
        timer = 1000;
    }

    if (answer.isCorrect !== null) {
        timer = 2000;
    }

    const handleSelectAnswer = (answer: string) => {
        setAnswer({
            selectedAnswer: answer,
            isCorrect: null,
        });
        setTimeout(() => {
            setAnswer({
                selectedAnswer: answer,
                isCorrect: QUESTIONS[index].answers[0] === answer,
            });

            setTimeout(() => {
                onSelectAnswer(answer);
            }, 2000);
        }, 1000);
    };

    let answerState = '';
    if (answer.selectedAnswer && answer.isCorrect !== null) {
        answerState = answer.isCorrect ? 'correct' : 'wrong';
    } else if (answer.selectedAnswer) {
        answerState = 'answered';
    }
    return (
        <div id="question">
            <QuestionTimer
                timeout={timer}
                onTimeout={answer.selectedAnswer === '' ? onSkipAnswer : null}
                mode={answerState}
                key={timer}
            />
            <h2>{QUESTIONS[index].text}</h2>
            <Answers
                answers={QUESTIONS[index].answers}
                selectedAnswer={answer.selectedAnswer}
                answerState={answerState}
                onSelect={handleSelectAnswer}
            />
        </div>
    );
};

export default Question;
