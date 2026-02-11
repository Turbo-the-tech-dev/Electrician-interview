import type { UserProgress } from '../types';

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
