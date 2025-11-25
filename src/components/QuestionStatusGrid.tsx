import { QuestionState } from '../types';

interface QuestionStatusGridProps {
  questionStates: QuestionState[];
  currentQuestionIndex: number;
  onNavigateToQuestion: (index: number) => void;
}

/**
 * Grid component showing status of all questions
 * Green = Answered, Red = Answered Wrong, Grey/Light Blue = Skipped/Unanswered
 */
export const QuestionStatusGrid = ({
  questionStates,
  currentQuestionIndex,
  onNavigateToQuestion,
}: QuestionStatusGridProps) => {
  const getStatusColor = (state: QuestionState, index: number) => {
    const isCurrentQuestion = index === currentQuestionIndex;
    
    if (state.status === 'answered') {
      // Green for correct, Red for wrong
      if (state.isCorrect) {
        return isCurrentQuestion 
          ? 'bg-green-600 text-white ring-4 ring-green-300' 
          : 'bg-green-500 text-white hover:bg-green-600';
      } else {
        return isCurrentQuestion 
          ? 'bg-red-600 text-white ring-4 ring-red-300' 
          : 'bg-red-500 text-white hover:bg-red-600';
      }
    } else if (state.status === 'skipped') {
      // Light blue for skipped
      return isCurrentQuestion 
        ? 'bg-blue-400 text-white ring-4 ring-blue-200' 
        : 'bg-blue-300 text-white hover:bg-blue-400';
    } else {
      // Grey for unanswered
      return isCurrentQuestion 
        ? 'bg-gray-400 text-white ring-4 ring-gray-300' 
        : 'bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Question Navigator</h3>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-600">Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-600">Wrong</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-300 rounded"></div>
          <span className="text-gray-600">Skipped</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span className="text-gray-600">Unanswered</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-2 max-h-64 overflow-y-auto">
        {questionStates.map((state, index) => (
          <button
            key={state.questionId}
            onClick={() => onNavigateToQuestion(index)}
            className={`
              w-8 h-8 sm:w-9 sm:h-9 rounded font-semibold text-xs sm:text-sm
              transition-all duration-200 flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${getStatusColor(state, index)}
            `}
            aria-label={`Go to question ${index + 1}, status: ${state.status}`}
            title={`Question ${index + 1} - ${state.status}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap gap-3 text-xs text-gray-600">
        <span>
          <strong>Answered:</strong> {questionStates.filter(s => s.status === 'answered').length}
        </span>
        <span>
          <strong>Skipped:</strong> {questionStates.filter(s => s.status === 'skipped').length}
        </span>
        <span>
          <strong>Remaining:</strong> {questionStates.filter(s => s.status === 'unanswered').length}
        </span>
      </div>
    </div>
  );
};
