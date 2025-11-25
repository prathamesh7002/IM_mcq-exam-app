
interface ModalIntroProps {
  onContinue: () => void;
}

/**
 * Introduction modal shown on first load
 * Contains educational purpose message and GitHub link
 */
export const ModalIntro = ({ onContinue }: ModalIntroProps) => {
  const handleVisitGitHub = () => {
    window.open('https://github.com/yogendra-08', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-fadeIn">
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">🪧</div>
          <h2 
            id="modal-title" 
            className="text-2xl sm:text-3xl font-bold text-gray-800"
          >
            🎓 Educational Purpose Only
          </h2>
        </div>
        
        <div className="text-gray-700 mb-6 leading-relaxed space-y-3">
          <p>
            This MCQ Exam website is a personal educational project made by{' '}
            <span className="font-semibold text-blue-600">Yogendra (Yogi)</span>{' '}
            using <span className="font-medium">React + TypeScript</span>.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm">
              <span className="font-semibold">⚠️ Disclaimer:</span> This project is created for learning and practice purposes only. 
              Some answers or features may contain mistakes — please do not rely on it 100%.
            </p>
          </div>
          
          <p className="text-center">
            If you'd like to explore more of my work, you can visit my GitHub profile 😄{' '}
            <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              @yogendra-08
            </span>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleVisitGitHub}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            aria-label="Visit Yogendra's GitHub profile"
          >
            Visit GitHub →
          </button>
          
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Continue to exam"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
};
