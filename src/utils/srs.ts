import type { Question, UserProgress } from '../types';

export const sortQuestionsBySRS = (
  questions: Question[],
  userProgress: Record<string, UserProgress>,
  now: number = Date.now()
): Question[] => {
  return questions
    .map((q) => {
      const progress = userProgress[q.id];
      // If no progress exists, it's considered due
      const isDue = progress ? progress.nextReview < now : true;
      return {
        q,
        isDue,
        // Pre-calculate a random weight for stable sorting within groups
        weight: Math.random()
      };
    })
    .sort((a, b) => {
      // Primary sort: due questions first
      if (a.isDue && !b.isDue) return -1;
      if (!a.isDue && b.isDue) return 1;

      // Secondary sort: stable random within the same "due" status
      return a.weight - b.weight;
    })
    .map((item) => item.q);
};

export const calculateNextReview = (
  performance: number, // 0 to 5
  previousProgress?: UserProgress
): UserProgress => {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = previousProgress || {};

  if (performance >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    questionId: previousProgress?.questionId || '',
    easeFactor,
    interval,
    repetitions,
    nextReview
  };
};

export const scoreToPerformance = (score: number): number => {
  if (score >= 90) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  if (score >= 10) return 1;
  return 0;
};
