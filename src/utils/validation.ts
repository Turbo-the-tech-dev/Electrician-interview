import type { UserProgress, InterviewSession } from '../types';

export const isValidUserProgress = (data: any): data is Record<string, UserProgress> => {
  if (!data || typeof data !== 'object') return false;
  return Object.values(data).every((item: any) => {
    return (
      typeof item.questionId === 'string' &&
      typeof item.easeFactor === 'number' &&
      typeof item.interval === 'number' &&
      typeof item.repetitions === 'number' &&
      typeof item.nextReview === 'number'
    );
  });
};

export const isValidInterviewSessions = (data: any): data is InterviewSession[] => {
  if (!Array.isArray(data)) return false;
  return data.every((session: any) => {
    return (
      typeof session.id === 'string' &&
      typeof session.date === 'number' &&
      typeof session.startTime === 'number' &&
      typeof session.score === 'number' &&
      Array.isArray(session.questions)
    );
  });
};
