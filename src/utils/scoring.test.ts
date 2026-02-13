import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateScore, evaluateAnswer } from './scoring.ts';

describe('calculateScore', () => {
  test('should return 100 for perfect match', () => {
    const transcription = 'This is a test transcription with keywords';
    const keywords = ['test', 'transcription', 'keywords'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  test('should be case insensitive', () => {
    const transcription = 'THIS IS A TEST TRANSCRIPTION WITH KEYWORDS';
    const keywords = ['test', 'transcription', 'keywords'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  test('should return 0 for no match', () => {
    const transcription = 'This is a random sentence';
    const keywords = ['banana', 'apple', 'orange'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 0);
  });

  test('should return partial score for partial match', () => {
    const transcription = 'I like apples and bananas';
    const keywords = ['apples', 'bananas', 'oranges'];
    // 2 out of 3 match -> 66.66 -> 67
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 67);
  });

  test('should return 0 for empty transcription', () => {
    const transcription = '';
    const keywords = ['test'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 0);
  });

  test('should return 0 for undefined/null transcription (if passed as any)', () => {
    const score = calculateScore(null as any, ['test']);
    assert.strictEqual(score, 0);
  });

  test('should handle keywords appearing multiple times in transcription correctly (count once)', () => {
    const transcription = 'apple apple apple';
    const keywords = ['apple'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  test('should handle keywords list with duplicates (count each instance in list if present in transcription)', () => {
    const transcription = 'I have an apple';
    const keywords = ['apple', 'apple'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  test('should return 0 if keywords is empty', () => {
      // Improved behavior: return 0 instead of NaN
      const transcription = 'hello';
      const keywords: string[] = [];
      const score = calculateScore(transcription, keywords);
      assert.strictEqual(score, 0);
  });
});

describe('evaluateAnswer', () => {
  test('should return correct status for score >= 70', () => {
    const transcription = 'apple banana orange';
    const question = { keywords: ['apple', 'banana', 'orange'] } as any;
    const result = evaluateAnswer(transcription, question);
    assert.strictEqual(result.score, 100);
    assert.strictEqual(result.isCorrect, true);
  });

  test('should return incorrect status for score < 70', () => {
    const transcription = 'apple';
    const question = { keywords: ['apple', 'banana', 'orange'] } as any;
    // 1/3 = 33%
    const result = evaluateAnswer(transcription, question);
    assert.strictEqual(result.score, 33);
    assert.strictEqual(result.isCorrect, false);
  });

  test('should handle empty keywords in question gracefully', () => {
     const transcription = 'hello';
     const question = { keywords: [] } as any;
     const result = evaluateAnswer(transcription, question);
     assert.strictEqual(result.score, 0);
     assert.strictEqual(result.isCorrect, false);
  });
});
