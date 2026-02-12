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

export interface PeerSession {
  id: string;
  date: number;
  player1: {
    name: string;
    score: number;
    questions: InterviewQuestion[];
    peerRating: number;
  };
  player2: {
    name: string;
    score: number;
    questions: InterviewQuestion[];
    peerRating: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface LeaderboardEntry {
  name: string;
  averageScore: number;
  sessionsCount: number;
  badges: string[];
}
