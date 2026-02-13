import type { UserProgress, InterviewSession, InterviewQuestion } from '../types';

export function isValidUserProgress(data: any): data is Record<string, UserProgress> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return false;
  }

  for (const key in data) {
    const item = data[key];
    if (
      typeof item !== 'object' ||
      item === null ||
      typeof item.questionId !== 'string' ||
      typeof item.easeFactor !== 'number' ||
      typeof item.interval !== 'number' ||
      typeof item.repetitions !== 'number' ||
      typeof item.nextReview !== 'number'
    ) {
      return false;
    }
  }

  return true;
}

function isValidInterviewQuestion(q: any): q is InterviewQuestion {
  return (
    typeof q === 'object' &&
    q !== null &&
    typeof q.id === 'string' &&
    typeof q.category === 'string' &&
    typeof q.difficulty === 'string' &&
    typeof q.question === 'string' &&
    typeof q.answer === 'string' &&
    Array.isArray(q.keywords) &&
    typeof q.points === 'number'
  );
}

export function isValidInterviewSessions(data: any): data is InterviewSession[] {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(session => (
    typeof session === 'object' &&
    session !== null &&
    typeof session.id === 'string' &&
    typeof session.date === 'number' &&
    typeof session.startTime === 'number' &&
    typeof session.score === 'number' &&
    Array.isArray(session.questions) &&
    session.questions.every(isValidInterviewQuestion)
  ));
}
