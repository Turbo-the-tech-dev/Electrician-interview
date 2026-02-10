export interface Question {
  id: number;
  question: string;
  category: 'NEC code' | 'theory' | 'practical' | 'safety' | 'troubleshooting' | 'management';
  difficulty: 'apprentice' | 'journeyman' | 'master';
  keywords: string[];
  correct_answer: string;
  nec_reference: string;
}

export interface Answer {
  questionId: number;
  transcript: string;
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
}

export interface InterviewSession {
  questions: Question[];
  answers: Answer[];
  startTime: number;
  endTime?: number;
}
