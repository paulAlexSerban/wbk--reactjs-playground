import { useState, useMemo } from 'react';
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuizContext } from './QuizContext';
import { cn } from '@/lib/utils';

interface PracticeSessionProps {
    onClose: () => void;
}

export function PracticeSession({ onClose }: PracticeSessionProps) {
    const { dueQuestions, reviewQuestion } = useQuizContext();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

    const currentQuestion = dueQuestions[currentIndex];
    const isComplete = currentIndex >= dueQuestions.length;

    const handleSelectAnswer = (index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
    };

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setShowResult(true);

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        setSessionStats((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        }));
    };

    const handleNext = async () => {
        if (selectedAnswer === null || !currentQuestion) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        // Simple grading: 5 for correct, 1 for incorrect
        const quality = isCorrect ? 5 : 1;

        await reviewQuestion(currentQuestion.id, quality);

        setSelectedAnswer(null);
        setShowResult(false);
        setCurrentIndex((prev) => prev + 1);
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setSessionStats({ correct: 0, incorrect: 0 });
    };

    if (isComplete) {
        return (
            <div className="p-6 text-center space-y-6">
                <h3 className="text-lg font-mono font-bold">Session Complete</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border-2 border-border bg-secondary">
                        <div className="text-3xl font-mono font-bold text-foreground">{sessionStats.correct}</div>
                        <div className="text-xs font-mono text-muted-foreground uppercase">Correct</div>
                    </div>
                    <div className="p-4 border-2 border-border">
                        <div className="text-3xl font-mono font-bold">{sessionStats.incorrect}</div>
                        <div className="text-xs font-mono text-muted-foreground uppercase">Incorrect</div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Button onClick={onClose} className="w-full font-mono">
                        Done
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground font-mono">No questions due.</p>
                <Button onClick={onClose} variant="outline" className="mt-4 font-mono">
                    Close
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Progress */}
            <div className="px-4 py-2 border-b border-border bg-secondary/50">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                    <span>
                        Question {currentIndex + 1} of {dueQuestions.length}
                    </span>
                    <span>{currentQuestion.subject}</span>
                </div>
                <div className="mt-2 h-1 bg-secondary">
                    <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${((currentIndex + 1) / dueQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 p-4 space-y-4 overflow-auto">
                <div className="text-xs font-mono text-muted-foreground">From: {currentQuestion.sourcePostTitle}</div>

                <p className="font-serif text-lg leading-relaxed">{currentQuestion.prompt}</p>

                {/* Answer Options */}
                <div className="space-y-2">
                    {currentQuestion.answers.map((answer, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correctAnswer;

                        let stateClasses = '';
                        if (showResult) {
                            if (isCorrect) {
                                stateClasses = 'border-primary bg-primary/10';
                            } else if (isSelected && !isCorrect) {
                                stateClasses = 'border-destructive bg-destructive/10';
                            }
                        } else if (isSelected) {
                            stateClasses = 'border-primary bg-secondary';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={showResult}
                                className={cn(
                                    'w-full p-3 text-left',
                                    'border-2 border-border',
                                    'font-mono text-sm',
                                    'transition-colors',
                                    !showResult && 'hover:bg-secondary hover:border-primary',
                                    stateClasses
                                )}
                            >
                                <span className="inline-flex items-center gap-3">
                                    <span className="w-6 h-6 flex items-center justify-center border border-current text-xs">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <span>{answer}</span>
                                    {showResult && isCorrect && <Check className="w-4 h-4 ml-auto text-primary" />}
                                    {showResult && isSelected && !isCorrect && (
                                        <X className="w-4 h-4 ml-auto text-destructive" />
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t-2 border-border">
                {!showResult ? (
                    <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full font-mono">
                        Check Answer
                    </Button>
                ) : (
                    <Button onClick={handleNext} className="w-full font-mono">
                        {currentIndex < dueQuestions.length - 1 ? 'Next Question' : 'Finish'}
                    </Button>
                )}
            </div>
        </div>
    );
}
