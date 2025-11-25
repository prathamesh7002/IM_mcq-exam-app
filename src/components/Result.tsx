import { ExamResults } from '../types';

interface ResultProps {
  results: ExamResults;
  onRestart: () => void;
}

/**
 * Final results screen showing score and download options
 */
export const Result = ({ results, onRestart }: ResultProps) => {
  const { totalQuestions, correctAnswers, wrongAnswers, percentage } = results;

  const handleDownloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVisitGitHub = () => {
    window.open('https://github.com/yogendra-08', '_blank', 'noopener,noreferrer');
  };

  // Determine performance level
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: 'Excellent! 🎉', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'Great Job! 👏', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Good Effort! 👍', color: 'text-yellow-600' };
    if (percentage >= 40) return { text: 'Keep Practicing! 📚', color: 'text-orange-600' };
    return { text: 'Need More Practice 💪', color: 'text-red-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="bg-white rounded-lg shadow-2xl p-6 sm:p-10 w-full max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
          Exam Completed!
        </h1>
        <p className={`text-2xl font-semibold ${performance.color}`}>
          {performance.text}
        </p>
      </div>

      {/* Score display */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 sm:p-8 mb-6">
        <div className="text-center mb-6">
          <div className="text-6xl sm:text-7xl font-bold text-blue-600 mb-2">
            {percentage.toFixed(1)}%
          </div>
          <div className="text-gray-600 font-medium">Your Score</div>
        </div>

        {/* Statistics grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-gray-800">
              {totalQuestions}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Total</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-green-600">
              {correctAnswers}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Correct</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl sm:text-3xl font-bold text-red-600">
              {wrongAnswers}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">Wrong</div>
          </div>
        </div>
      </div>

      {/* Completion time */}
      <div className="text-center text-sm text-gray-500 mb-6">
        Completed on: {new Date(results.completedAt).toLocaleString()}
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Restart the exam"
        >
          🔄 Restart Exam
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownloadResults}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Download results as JSON"
          >
            📥 Download Results
          </button>

          <button
            onClick={handleVisitGitHub}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Visit Yogendra's GitHub profile"
          >
            🔗 Visit GitHub
          </button>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Made with ❤️ by <span className="font-semibold">Yogendra (yogi)</span>
      </div>
    </div>
  );
};
