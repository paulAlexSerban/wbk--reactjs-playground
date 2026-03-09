import { type FC } from 'react';
import quizCompleteImage from '../assets/quiz-complete.png';
import QUESTIONS from '../questions';

type SummaryProps = {
    userAnswers: (string | null)[];
};

const Summary: FC<SummaryProps> = ({ userAnswers }) => {
    const skippedAnswers = userAnswers.filter((userAnswer) => userAnswer === null).length;
    const correctAnswers = userAnswers.filter((userAnswer, index) => QUESTIONS[index].answers[0] === userAnswer).length;
    const wrongAnswers = userAnswers.filter(
        (userAnswer, index) => QUESTIONS[index].answers[0] !== userAnswer && userAnswer !== null
    ).length;

    const skippedAnswersPercentage = Math.round((skippedAnswers / QUESTIONS.length) * 100);
    const correctAnswersPercentage = Math.round((correctAnswers / QUESTIONS.length) * 100);
    const wrongAnswersPercentage = Math.round((wrongAnswers / QUESTIONS.length) * 100);
    return (
        <div id="summary">
            <img src={quizCompleteImage} alt="Trophy icon." />
            <h2>Quiz Completed!</h2>
            <div id="summary-stats">
                <p>
                    <span className="number">{skippedAnswersPercentage}%</span>
                    <span className="text">skipped</span>
                </p>
                <p>
                    <span className="number">{correctAnswersPercentage}%</span>
                    <span className="text">answered correctly</span>
                </p>
                <p>
                    <span className="number">{wrongAnswersPercentage}%</span>
                    <span className="text">answered incorrectly</span>
                </p>
            </div>
            <ol>
                {userAnswers.map((userAnswer, index) => {
                    let cssClass = 'user-answer';
                    if (userAnswer === null) {
                        cssClass += ' skipped';
                    } else if (QUESTIONS[index].answers[0] === userAnswer) {
                        cssClass += ' correct';
                    } else {
                        cssClass += ' wrong';
                    }
                    return (
                        <li key={index}>
                            <h3>{index + 1}</h3>
                            <p className="question">{QUESTIONS[index].text}</p>
                            <p className={cssClass}>{userAnswer ?? 'Skipped'}</p>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
};

export default Summary;
