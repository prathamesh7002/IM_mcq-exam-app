import { useState, useEffect } from 'react';
import { Question, UserAnswer, AppState, ExamResults, QuestionState } from './types';
import { ModalIntro } from './components/ModalIntro';
import { QuestionCard } from './components/QuestionCard';
import { ProgressBar } from './components/ProgressBar';
import { Result } from './components/Result';
import { ConfirmQuit } from './components/ConfirmQuit';
import { QuestionStatusGrid } from './components/QuestionStatusGrid';

/**
 * Main App Component
 * Manages the entire exam flow and state
 */
function App() {
  const [appState, setAppState] = useState<AppState>({ stage: 'intro' });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>([]);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load questions from JSON file
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Failed to load questions');
        }
        const data: Question[] = await response.json();
        
        // Validate questions
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid questions format');
        }
        
        setQuestions(data);
        // Initialize question states
        const initialStates: QuestionState[] = data.map(q => ({
          questionId: q.id,
          status: 'unanswered' as const,
        }));
        setQuestionStates(initialStates);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleContinue = () => {
    setAppState({ stage: 'exam', currentQuestionIndex: 0 });
  };

  const handleSkip = () => {
    if (appState.stage !== 'exam') return;

    // Mark current question as skipped
    setQuestionStates(prev => {
      const updated = [...prev];
      const currentState = updated[appState.currentQuestionIndex];
      if (currentState.status === 'unanswered') {
        updated[appState.currentQuestionIndex] = {
          ...currentState,
          status: 'skipped',
        };
      }
      return updated;
    });

    // Move to next question
    handleNext();
  };

  const handleSubmitAnswer = (selectedIndex: number, isCorrect: boolean) => {
    if (appState.stage !== 'exam') return;

    const currentQuestion = questions[appState.currentQuestionIndex];
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedIndex,
      isCorrect,
      correctIndex: currentQuestion.answerIndex,
    };

    setUserAnswers(prev => [...prev, answer]);

    // Update question state
    setQuestionStates(prev => {
      const updated = [...prev];
      updated[appState.currentQuestionIndex] = {
        questionId: currentQuestion.id,
        status: 'answered',
        selectedIndex,
        isCorrect,
      };
      return updated;
    });
  };

  const handleNext = () => {
    if (appState.stage !== 'exam') return;

    const nextIndex = appState.currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      // Exam completed
      setAppState({ stage: 'result' });
    } else {
      setAppState({ stage: 'exam', currentQuestionIndex: nextIndex });
    }
  };

  const handleQuit = () => {
    setShowQuitModal(true);
  };

  const confirmQuit = () => {
    setShowQuitModal(false);
    setAppState({ stage: 'result' });
  };

  const cancelQuit = () => {
    setShowQuitModal(false);
  };

  const handleRestart = () => {
    setUserAnswers([]);
    // Reset all question states
    setQuestionStates(questions.map(q => ({
      questionId: q.id,
      status: 'unanswered' as const,
    })));
    setAppState({ stage: 'intro' });
  };

  const handleNavigateToQuestion = (index: number) => {
    if (appState.stage !== 'exam') return;
    setAppState({ stage: 'exam', currentQuestionIndex: index });
  };

  const getResults = (): ExamResults => {
    const correctAnswers = userAnswers.filter(a => a.isCorrect).length;
    const wrongAnswers = userAnswers.filter(a => !a.isCorrect).length;
    const totalQuestions = userAnswers.length;
    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      answers: userAnswers,
      completedAt: new Date().toISOString(),
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Error Loading Exam</h2>
          <p className="text-gray-600 mb-6 text-center">{error}</p>
          <p className="text-sm text-gray-500 text-center">
            Please ensure <code className="bg-gray-100 px-2 py-1 rounded">questions.json</code> exists in the public folder.
          </p>
        </div>
      </div>
    );
  }

  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const wrongCount = userAnswers.filter(a => !a.isCorrect).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      {/* Intro Modal */}
      {appState.stage === 'intro' && (
        <ModalIntro onContinue={handleContinue} />
      )}

      {/* Exam Stage */}
      {appState.stage === 'exam' && (
        <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8">
          {/* Header with Quit button */}
          <div className="w-full max-w-3xl mx-auto mb-4 flex justify-end">
            <button
              onClick={handleQuit}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Quit exam"
            >
              Quit Exam
            </button>
          </div>

          {/* Main content */}
          <main id="main-content" className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-3xl">
              <ProgressBar
                current={appState.currentQuestionIndex + 1}
                total={questions.length}
                correct={correctCount}
                wrong={wrongCount}
              />

              {/* Question Status Grid */}
              <QuestionStatusGrid
                questionStates={questionStates}
                currentQuestionIndex={appState.currentQuestionIndex}
                onNavigateToQuestion={handleNavigateToQuestion}
              />

              <QuestionCard
                question={questions[appState.currentQuestionIndex]}
                questionNumber={appState.currentQuestionIndex + 1}
                totalQuestions={questions.length}
                onSubmitAnswer={handleSubmitAnswer}
                onNext={handleNext}
                onSkip={handleSkip}
                isAnswered={questionStates[appState.currentQuestionIndex]?.status === 'answered'}
              />
            </div>
          </main>
        </div>
      )}

      {/* Result Stage */}
      {appState.stage === 'result' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <main id="main-content">
            <Result results={getResults()} onRestart={handleRestart} />
          </main>
        </div>
      )}

      {/* Quit Confirmation Modal */}
      {showQuitModal && (
        <ConfirmQuit onConfirm={confirmQuit} onCancel={cancelQuit} />
      )}
    </div>
  );
}

export default App;
