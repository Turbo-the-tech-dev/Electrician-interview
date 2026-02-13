import type { UserProgress } from '../types';

// SRS Algorithm Constants
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const MIN_PERFORMANCE_FOR_PROGRESS = 3;
const INITIAL_INTERVAL = 1;
const SECOND_INTERVAL = 6;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Ease Factor Calculation Constants
const EASE_FACTOR_ADJUSTMENT_BASE = 0.1;
const PERFORMANCE_MAX = 5;
const EASE_FACTOR_COEFF_1 = 0.08;
const EASE_FACTOR_COEFF_2 = 0.02;

// Score Thresholds
const SCORE_THRESHOLD_5 = 90;
const SCORE_THRESHOLD_4 = 70;
const SCORE_THRESHOLD_3 = 50;
const SCORE_THRESHOLD_2 = 30;
const SCORE_THRESHOLD_1 = 10;

// Performance Ratings
const PERFORMANCE_5 = 5;
const PERFORMANCE_4 = 4;
const PERFORMANCE_3 = 3;
const PERFORMANCE_2 = 2;
const PERFORMANCE_1 = 1;
const PERFORMANCE_0 = 0;

export const calculateNextReview = (
  performance: number, // 0 to 5
  previousProgress?: UserProgress
): UserProgress => {
  let {
    easeFactor = DEFAULT_EASE_FACTOR,
    interval = 0,
    repetitions = 0
  } = previousProgress || {};

  if (performance >= MIN_PERFORMANCE_FOR_PROGRESS) {
    if (repetitions === 0) {
      interval = INITIAL_INTERVAL;
    } else if (repetitions === 1) {
      interval = SECOND_INTERVAL;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = INITIAL_INTERVAL;
  }

  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const q = performance;
  easeFactor = easeFactor + (EASE_FACTOR_ADJUSTMENT_BASE - (PERFORMANCE_MAX - q) * (EASE_FACTOR_COEFF_1 + (PERFORMANCE_MAX - q) * EASE_FACTOR_COEFF_2));

  if (easeFactor < MIN_EASE_FACTOR) easeFactor = MIN_EASE_FACTOR;

  const nextReview = Date.now() + interval * MS_PER_DAY;

  return {
    questionId: previousProgress?.questionId || '',
    easeFactor,
    interval,
    repetitions,
    nextReview
  };
};

export const scoreToPerformance = (score: number): number => {
  if (score >= SCORE_THRESHOLD_5) return PERFORMANCE_5;
  if (score >= SCORE_THRESHOLD_4) return PERFORMANCE_4;
  if (score >= SCORE_THRESHOLD_3) return PERFORMANCE_3;
  if (score >= SCORE_THRESHOLD_2) return PERFORMANCE_2;
  if (score >= SCORE_THRESHOLD_1) return PERFORMANCE_1;
  return PERFORMANCE_0;
};
