import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNextReview, scoreToPerformance } from './srs.ts';
import type { UserProgress } from '../types.ts';

describe('srs', () => {
  describe('calculateNextReview', () => {
    it('should initialize progress correctly for new item with good performance', () => {
      const performance = 5;
      const result = calculateNextReview(performance);

      assert.strictEqual(result.repetitions, 1);
      assert.strictEqual(result.interval, 1);
      assert.ok(result.easeFactor > 2.5); // 2.5 + (0.1 - (5-5)*(...)) = 2.6
    });

    it('should initialize progress correctly for new item with bad performance', () => {
      const performance = 2;
      const result = calculateNextReview(performance);

      assert.strictEqual(result.repetitions, 0);
      assert.strictEqual(result.interval, 1);
      // Ease factor should decrease: 2.5 + (0.1 - (3)*(0.08 + 3*0.02)) = 2.5 + (0.1 - 3*0.14) = 2.5 + (0.1 - 0.42) = 2.5 - 0.32 = 2.18
      assert.ok(result.easeFactor < 2.5);
    });

    it('should handle repetitions correctly (repetition 1 -> interval 6)', () => {
      const previousProgress: UserProgress = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReview: Date.now(),
      };
      const performance = 4;
      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 2);
      assert.strictEqual(result.interval, 6);
    });

    it('should handle repetitions correctly (repetition 2+ -> interval * easeFactor)', () => {
      const previousProgress: UserProgress = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: Date.now(),
      };
      const performance = 4;
      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 3);
      // interval = 6 * 2.5 = 15
      assert.strictEqual(result.interval, 15);
    });

    it('should reset repetitions and interval on bad performance', () => {
      const previousProgress: UserProgress = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 10,
        repetitions: 5,
        nextReview: Date.now(),
      };
      const performance = 2; // Bad performance
      const result = calculateNextReview(performance, previousProgress);

      assert.strictEqual(result.repetitions, 0);
      assert.strictEqual(result.interval, 1);
    });

    it('should clamp easeFactor to minimum 1.3', () => {
        // Force ease factor to go below 1.3
        let progress: UserProgress = {
            questionId: 'q1',
            easeFactor: 1.3,
            interval: 10,
            repetitions: 5,
            nextReview: Date.now(),
        };

        // Repeated failures to drive down ease factor
        for (let i = 0; i < 5; i++) {
             progress = calculateNextReview(0, progress);
        }

        assert.ok(progress.easeFactor >= 1.3);
        assert.strictEqual(progress.easeFactor, 1.3);
    });
  });

  describe('scoreToPerformance', () => {
    it('should map scores correctly', () => {
      assert.strictEqual(scoreToPerformance(95), 5);
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
