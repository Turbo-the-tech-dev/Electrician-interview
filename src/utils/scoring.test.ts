import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateScore, evaluateAnswer } from './scoring.ts';

describe('calculateScore', () => {
  it('should return 100 for exact keyword matches', () => {
    const transcription = 'voltage equals current times resistance';
    const keywords = ['Voltage', 'Current', 'Resistance'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  it('should be case insensitive', () => {
    const transcription = 'VOLTAGE equals Current times RESISTANCE';
    const keywords = ['voltage', 'current', 'resistance'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  it('should return 0 for no matches', () => {
    const transcription = 'hello world';
    const keywords = ['Voltage', 'Current'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 0);
  });

  it('should handle partial matches', () => {
    const transcription = 'voltage equals something else';
    const keywords = ['Voltage', 'Current'];
    const score = calculateScore(transcription, keywords);
    // 1 match out of 2 = 50%
    assert.strictEqual(score, 50);
  });

  it('should handle empty transcription', () => {
    const transcription = '';
    const keywords = ['Voltage'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 0);
  });

  it('should handle mixed case in keywords', () => {
    const transcription = 'some text with KeywordOne';
    const keywords = ['KeywordOne', 'keywordTwo'];
    const score = calculateScore(transcription, keywords);
    // 1 match out of 2 = 50%
    assert.strictEqual(score, 50);
  });

  it('should count each keyword match independently', () => {
    const transcription = 'apple';
    const keywords = ['apple', 'apple'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  it('should match keywords as substrings', () => {
    const transcription = 'The generator is running';
    const keywords = ['gen', 'run'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  it('should handle partial keyword matches within larger words', () => {
    const transcription = 'concatenation';
    const keywords = ['cat', 'nation'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 100);
  });

  it('should not match if substring is not present', () => {
    const transcription = 'The generator is running';
    const keywords = ['xyz', 'abc'];
    const score = calculateScore(transcription, keywords);
    assert.strictEqual(score, 0);
  });
});

describe('evaluateAnswer', () => {
  const makeQuestion = (keywords: string[]) => ({
    id: 'q1', category: 'theory' as any, difficulty: 'apprentice' as any,
    question: 'q', answer: 'a', keywords,
  });

  it('should mark as correct when score is exactly 70', () => {
    // 7 out of 10 keywords matched = 70%
    const question = makeQuestion(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
    const result = evaluateAnswer('a b c d e f g', question);
    assert.strictEqual(result.score, 70);
    assert.strictEqual(result.isCorrect, true);
  });

  it('should mark as incorrect when score is below 70', () => {
    const question = makeQuestion(['voltage', 'current', 'resistance']);
    const result = evaluateAnswer('only voltage here', question);
    assert.ok(result.score < 70);
    assert.strictEqual(result.isCorrect, false);
  });

  it('should mark as correct when all keywords match', () => {
    const question = makeQuestion(['voltage', 'current']);
    const result = evaluateAnswer('voltage and current', question);
    assert.strictEqual(result.score, 100);
    assert.strictEqual(result.isCorrect, true);
  });

  it('should return score 0 and isCorrect false for empty transcription', () => {
    const question = makeQuestion(['voltage']);
    const result = evaluateAnswer('', question);
    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.isCorrect, false);
  });
});
