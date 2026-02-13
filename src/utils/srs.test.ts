import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateNextReview, scoreToPerformance } from './srs.ts';

describe('srs', () => {
  describe('calculateNextReview', () => {
    it('should initialize review for new item', () => {
      const performance = 5;
      const result = calculateNextReview(performance);

      assert.strictEqual(result.interval, 1);
      assert.strictEqual(result.repetitions, 1);
      assert.ok(result.easeFactor > 2.5); // increased due to perfect score
      assert.ok(result.nextReview > Date.now());
    });

    it('should handle correct answer (performance >= 3)', () => {
      const performance = 4;
      const previous = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 1,
        nextReview: 0
      };

      const result = calculateNextReview(performance, previous);

      assert.strictEqual(result.interval, 6); // 1 -> 6
      assert.strictEqual(result.repetitions, 2);
      assert.strictEqual(result.easeFactor, 2.5); // No change for performance 4
    });

    it('should apply ease factor for subsequent repetitions', () => {
      const performance = 4;
      const previous = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: 0
      };

      const result = calculateNextReview(performance, previous);

      // interval = round(6 * 2.5) = 15
      assert.strictEqual(result.interval, 15);
      assert.strictEqual(result.repetitions, 3);
    });

    it('should handle incorrect answer (performance < 3)', () => {
      const performance = 2;
      const previous = {
        questionId: 'q1',
        easeFactor: 2.5,
        interval: 6,
        repetitions: 2,
        nextReview: 0
      };

      const result = calculateNextReview(performance, previous);

      assert.strictEqual(result.interval, 1); // Reset to 1
      assert.strictEqual(result.repetitions, 0); // Reset to 0
      assert.ok(result.easeFactor < 2.5); // Decreased
    });

    it('should clamp ease factor at 1.3', () => {
      const performance = 0;
      const previous = {
        questionId: 'q1',
        easeFactor: 1.35,
        interval: 6,
        repetitions: 2,
        nextReview: 0
      };

      // repeatedly failing should lower ease factor
      let current = previous;
      for (let i = 0; i < 5; i++) {
        current = calculateNextReview(0, current);
      }

      assert.strictEqual(current.easeFactor, 1.3);
    });
  });

  describe('scoreToPerformance', () => {
    it('should return 5 for score >= 90', () => {
      assert.strictEqual(scoreToPerformance(100), 5);
      assert.strictEqual(scoreToPerformance(90), 5);
    });

    it('should return 4 for score >= 70', () => {
      assert.strictEqual(scoreToPerformance(89), 4);
      assert.strictEqual(scoreToPerformance(70), 4);
    });

    it('should return 3 for score >= 50', () => {
      assert.strictEqual(scoreToPerformance(69), 3);
      assert.strictEqual(scoreToPerformance(50), 3);
    });

    it('should return 2 for score >= 30', () => {
      assert.strictEqual(scoreToPerformance(49), 2);
      assert.strictEqual(scoreToPerformance(30), 2);
    });

    it('should return 1 for score >= 10', () => {
      assert.strictEqual(scoreToPerformance(29), 1);
      assert.strictEqual(scoreToPerformance(10), 1);
    });

    it('should return 0 for score < 10', () => {
      assert.strictEqual(scoreToPerformance(9), 0);
      assert.strictEqual(scoreToPerformance(0), 0);
    });
  });
});
