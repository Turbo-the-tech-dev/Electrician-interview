export type Difficulty = 'apprentice' | 'journeyman' | 'master';

export type Category =
  | 'NEC code'
  | 'theory'
  | 'practical'
  | 'safety'
  | 'troubleshooting'
  | 'management'
  | 'behavioral'
  | 'scenario';

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  question: string;
  answer: string;
  keywords: string[];
  nec_reference?: string;
  explanation?: string;
}

export interface InterviewSession {
  id: string;
  date: number;
  startTime: number;
  endTime?: number;
  questions: InterviewQuestion[];
  score: number;
}

export interface InterviewQuestion extends Question {
  userAnswer?: string;
  transcription?: string;
  isCorrect?: boolean;
  points: number;
}

export interface UserProgress {
  questionId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
}
