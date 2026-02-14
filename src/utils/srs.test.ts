import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNextReview, scoreToPerformance } from './srs.ts';
import type { UserProgress } from '../types.ts';

describe('srs', () => {
  describe('calculateNextReview', () => {
    it('should reset interval and repetitions on failed performance', () => {
      const performance = 2; // Failed (< 3)
      const previousProgress: UserProgress = {
        questionId: '123',
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReview: Date.now()
      };

      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 0);
      assert.strictEqual(result.interval, 1);
      assert.strictEqual(result.questionId, '123');
      // Ease factor should decrease
      // calculation: 2.5 + (0.1 - (5-2)*(0.08+(5-2)*0.02))
      // = 2.5 + (0.1 - 3*(0.08 + 0.06))
      // = 2.5 + (0.1 - 3*0.14)
      // = 2.5 + (0.1 - 0.42)
      // = 2.5 - 0.32 = 2.18
      assert.ok(Math.abs(result.easeFactor - 2.18) < 0.0001);
    });

    it('should set initial interval for new question with success', () => {
      const performance = 5; // Perfect
      const previousProgress = undefined;

      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 1);
      assert.strictEqual(result.interval, 1);
      assert.strictEqual(result.easeFactor, 2.6); // 2.5 + 0.1
      assert.strictEqual(result.questionId, '');
    });

    it('should set second interval to 6 days for success', () => {
      const performance = 4; // Good
      const previousProgress: UserProgress = {
        questionId: '123',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReview: Date.now()
      };

      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 2);
      assert.strictEqual(result.interval, 6);
    });

    it('should increase interval based on ease factor for subsequent successes', () => {
      const performance = 3; // Pass
      const previousProgress: UserProgress = {
        questionId: '123',
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: Date.now()
      };

      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 3);
      // interval = round(6 * 2.5) = 15
      assert.strictEqual(result.interval, 15);
      // ease factor change: 2.5 + (0.1 - (5-3)*(0.08+(5-3)*0.02))
      // = 2.5 + (0.1 - 2*(0.08 + 0.04))
      // = 2.5 + (0.1 - 2*0.12)
      // = 2.5 + (0.1 - 0.24)
      // = 2.5 - 0.14 = 2.36
      assert.ok(Math.abs(result.easeFactor - 2.36) < 0.0001);
    });

    it('should clamp ease factor at 1.3 minimum', () => {
      const performance = 0; // Fail badly
      const previousProgress: UserProgress = {
        questionId: '123',
        easeFactor: 1.3,
        interval: 10,
        repetitions: 5,
        nextReview: Date.now()
      };

      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.easeFactor, 1.3);
      assert.strictEqual(result.repetitions, 0);
      assert.strictEqual(result.interval, 1);
    });
  });

  describe('scoreToPerformance', () => {
    it('should return correct performance levels', () => {
      assert.strictEqual(scoreToPerformance(100), 5);
      assert.strictEqual(scoreToPerformance(90), 5);
      assert.strictEqual(scoreToPerformance(89), 4);
      assert.strictEqual(scoreToPerformance(70), 4);
      assert.strictEqual(scoreToPerformance(69), 3);
      assert.strictEqual(scoreToPerformance(50), 3);
      assert.strictEqual(scoreToPerformance(49), 2);
      assert.strictEqual(scoreToPerformance(30), 2);
      assert.strictEqual(scoreToPerformance(29), 1);
      assert.strictEqual(scoreToPerformance(10), 1);
      assert.strictEqual(scoreToPerformance(9), 0);
      assert.strictEqual(scoreToPerformance(0), 0);
    });
  });
});
