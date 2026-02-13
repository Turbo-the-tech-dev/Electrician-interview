import { test } from 'node:test';
import assert from 'node:assert';
import { calculateScore, evaluateAnswer } from '../src/utils/scoring.ts';

test('calculateScore should match keywords correctly', () => {
  const keywords = ['alpha', 'beta', 'gamma'];
  const transcript = 'This contains alpha and beta but not the third one.';

  const score = calculateScore(transcript, keywords);
  assert.strictEqual(score, 67); // 2/3 * 100
});

test('evaluateAnswer should return correct status', () => {
  const question = {
    id: 'q1',
    category: 'theory',
    difficulty: 'apprentice',
    question: '...',
    answer: '...',
    keywords: ['alpha', 'beta', 'gamma']
  } as any;

  const result1 = evaluateAnswer('alpha beta gamma', question);
  assert.strictEqual(result1.score, 100);
  assert.strictEqual(result1.isCorrect, true);

  const result2 = evaluateAnswer('nothing', question);
  assert.strictEqual(result2.score, 0);
  assert.strictEqual(result2.isCorrect, false);
});
