import { test } from 'node:test';
import assert from 'node:assert';
import { calculateNextReview, scoreToPerformance, sortQuestionsBySRS } from '../src/utils/srs.ts';
import type { UserProgress } from '../src/types.ts';

test('scoreToPerformance should return correct values', () => {
  assert.strictEqual(scoreToPerformance(100), 5);
  assert.strictEqual(scoreToPerformance(80), 4);
  assert.strictEqual(scoreToPerformance(60), 3);
  assert.strictEqual(scoreToPerformance(40), 2);
  assert.strictEqual(scoreToPerformance(20), 1);
  assert.strictEqual(scoreToPerformance(5), 0);
});

test('calculateNextReview should increase interval on good performance', () => {
  const result = calculateNextReview(5);
  assert.strictEqual(result.interval, 1);
  assert.strictEqual(result.repetitions, 1);

  const result2 = calculateNextReview(5, result);
  assert.strictEqual(result2.interval, 6);
  assert.strictEqual(result2.repetitions, 2);
});

test('sortQuestionsBySRS should prioritize due questions', () => {
  const now = Date.now();
  const questions = [
    { id: 'q1' },
    { id: 'q2' }
  ];
  const userProgress: Record<string, UserProgress> = {
    q1: { questionId: 'q1', easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: now + 100000 },
    q2: { questionId: 'q2', easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: now - 100000 }
  };

  const sorted = sortQuestionsBySRS(questions, userProgress);
  assert.strictEqual(sorted[0].id, 'q2');
  assert.strictEqual(sorted[1].id, 'q1');
});
