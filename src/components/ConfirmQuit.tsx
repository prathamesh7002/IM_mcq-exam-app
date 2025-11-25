
interface ConfirmQuitProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation modal for quitting the exam
 */
export const ConfirmQuit = ({ onConfirm, onCancel }: ConfirmQuitProps) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="quit-modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8">
        <h2 
          id="quit-modal-title" 
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Quit Exam?
        </h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to quit the exam? Your progress will be saved and you'll see your current score.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            aria-label="Cancel and continue exam"
          >
            Cancel
          </button>
          
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Confirm quit exam"
          >
            Quit Exam
          </button>
        </div>
      </div>
    </div>
  );
};
