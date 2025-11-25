
interface ProgressBarProps {
  current: number;
  total: number;
  correct: number;
  wrong: number;
}

/**
 * Progress bar showing exam progress and score statistics
 */
export const ProgressBar = ({ 
  current, 
  total, 
  correct, 
  wrong 
}: ProgressBarProps) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="w-full mb-6">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
        <div 
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`Progress: ${current} of ${total} questions`}
        />
      </div>
      
      {/* Statistics */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">
          Question {current} of {total}
        </span>
        
        <div className="flex gap-4">
          <span className="text-green-600 font-semibold" aria-label={`Correct answers: ${correct}`}>
            ✓ {correct}
          </span>
          <span className="text-red-600 font-semibold" aria-label={`Wrong answers: ${wrong}`}>
            ✗ {wrong}
          </span>
        </div>
      </div>
    </div>
  );
};
