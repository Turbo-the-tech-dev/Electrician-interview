import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateScore } from './scoring.ts';

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
