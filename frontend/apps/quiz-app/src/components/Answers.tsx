import { type FC, useRef } from 'react';

type AnswersProps = {
    answers: string[];
    selectedAnswer: string;
    answerState: string;
    onSelect: (selectedAnswer: string) => void;
};

const Answers: FC<AnswersProps> = ({ answers, selectedAnswer, answerState, onSelect }) => {
    const shuffledAnswers = useRef<string[] | undefined>(undefined);
    if (!shuffledAnswers.current) {
        // sort() is a destructive method, so we need to make a copy of the array before sorting it.
        // using Math.random() - 0.5 will return a random number between -0.5 and 0.5 and will sort the array randomly.
        shuffledAnswers.current = [...answers].sort(() => Math.random() - 0.5);
    }
    return (
        <ul id="answers">
            {shuffledAnswers.current?.map((answer, index) => {
                const isSelectedAnswer = selectedAnswer === answer;
                let cssClasses = '';

                if (answerState === 'answered' && isSelectedAnswer) {
                    cssClasses = 'selected';
                } else if ((answerState === 'correct' || answerState === 'wrong') && isSelectedAnswer) {
                    cssClasses = answerState;
                }
                return (
                    <li key={index} className="answer">
                        <button onClick={() => onSelect(answer)} className={cssClasses} disabled={answerState !== ''}>
                            {answer}
                        </button>
                    </li>
                );
            })}
        </ul>
    );
};

export default Answers;
