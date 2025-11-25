import { useState, useEffect } from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onSubmitAnswer: (selectedIndex: number, isCorrect: boolean) => void;
  onNext: () => void;
  onSkip: () => void;
  isAnswered: boolean;
}

/**
 * Card component displaying a single question with options
 * Handles answer selection, submission, and feedback display
 */
export const QuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  onSubmitAnswer,
  onNext,
  onSkip,
  isAnswered,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Reset state when question changes
  useEffect(() => {
    // If question was already answered, restore its state
    if (isAnswered) {
      setIsSubmitted(true);
      // We don't have the selected option and correctness info here,
      // but the question is already answered so we'll just show it as submitted
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(null);
    }
  }, [question.id, isAnswered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) {
        if (e.key === 'Enter') {
          onNext();
        }
        return;
      }

      // Number keys 1-4 for option selection
      if (['1', '2', '3', '4'].includes(e.key)) {
        const index = parseInt(e.key) - 1;
        if (index < question.options.length) {
          setSelectedOption(index);
        }
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedOption(prev => {
          if (prev === null) return 0;
          if (e.key === 'ArrowDown') {
            return Math.min(prev + 1, question.options.length - 1);
          } else {
            return Math.max(prev - 1, 0);
          }
        });
      }

      // Enter to submit
      if (e.key === 'Enter' && selectedOption !== null) {
        handleSubmit();
      }

      // 'S' key to skip
      if (e.key === 's' || e.key === 'S') {
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOption, isSubmitted, question.options.length]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const correct = selectedOption === question.answerIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);
    onSubmitAnswer(selectedOption, correct);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-3xl">
      {/* Question header */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2 font-medium">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const isCorrectOption = index === question.answerIndex;
          
          let optionClass = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ';
          
          if (!isSubmitted) {
            optionClass += isSelected
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50';
          } else {
            if (isCorrectOption) {
              optionClass += 'border-green-500 bg-green-50 text-green-900';
            } else if (isSelected && !isCorrect) {
              optionClass += 'border-red-500 bg-red-50 text-red-900';
            } else {
              optionClass += 'border-gray-300 bg-gray-50 text-gray-600';
            }
          }

          return (
            <button
              key={index}
              onClick={() => !isSubmitted && setSelectedOption(index)}
              disabled={isSubmitted}
              className={optionClass}
              aria-label={`Option ${index + 1}: ${option}`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start gap-3">
                <span className="font-bold text-lg flex-shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1 text-left">{option}</span>
                {isSubmitted && isCorrectOption && (
                  <span className="text-green-600 font-bold" aria-label="Correct answer">✓</span>
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <span className="text-red-600 font-bold" aria-label="Wrong answer">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {isSubmitted && (
        <div 
          className={`mb-6 p-4 rounded-lg ${
            isCorrect 
              ? 'bg-green-100 border border-green-400 text-green-800' 
              : 'bg-red-100 border border-red-400 text-red-800'
          }`}
          role="alert"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              {isCorrect ? '✓ Correct!' : '✗ Wrong!'}
            </span>
          </div>
          {!isCorrect && (
            <p className="mt-2 text-sm">
              The correct answer is: <strong>{question.options[question.answerIndex]}</strong>
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between gap-3">
        {!isSubmitted ? (
          <>
            <button
              onClick={onSkip}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              aria-label="Skip this question"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedOption === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
              aria-label="Submit your answer"
            >
              Submit Answer
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go to next question"
          >
            Next Question →
          </button>
        )}
      </div>

      {/* Keyboard hints */}
      {!isSubmitted && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Tip: Use number keys (1-4) or arrow keys to select, Enter to submit, S to skip
        </div>
      )}
    </div>
  );
};
