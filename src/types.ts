export interface QuizOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  tag?: string;
}

export interface QuizFlashcardPayload {
  title: string;
  summary: string;
  multipleChoiceQuestions: QuizQuestion[];
  flashcards: Flashcard[];
}

export interface QuizStats {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  scorePercentage: number;
  timeSpentSeconds: number;
}
