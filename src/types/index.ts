/**
 * Type definitions for the MCQ Exam Application
 */

export interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number; // zero-based index of correct option
}

export interface UserAnswer {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  correctIndex: number;
}

export type QuestionStatus = 'unanswered' | 'answered' | 'skipped';

export interface QuestionState {
  questionId: number;
  status: QuestionStatus;
  selectedIndex?: number;
  isCorrect?: boolean;
}

export type AppState = 
  | { stage: 'intro' }
  | { stage: 'exam'; currentQuestionIndex: number }
  | { stage: 'result' };

export interface ExamResults {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  answers: UserAnswer[];
  completedAt: string;
}
