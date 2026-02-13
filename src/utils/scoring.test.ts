import { calculateScore, evaluateAnswer } from './scoring.ts';
import assert from 'node:assert';
import { test } from 'node:test';

test('calculateScore should correctly score based on keywords', () => {
  const transcription = "The service disconnecting means shall consist of not more than six switches or six circuit breakers.";
  const keywords = ["six", "6", "switches", "circuit breakers", "disconnects"];

  const score = calculateScore(transcription, keywords);
  // "six" matches
  // "switches" matches
  // "circuit breakers" matches
  // "6" does not match
  // "disconnects" does not match

  // 3 out of 5 = 60%
  assert.strictEqual(score, 60);
});

test('calculateScore should be case insensitive', () => {
  const transcription = "SIX SWITCHES";
  const keywords = ["six", "switches"];
  const score = calculateScore(transcription, keywords);
  assert.strictEqual(score, 100);
});

test('calculateScore should return 0 for empty transcription', () => {
  assert.strictEqual(calculateScore("", ["test"]), 0);
});

test('evaluateAnswer should return correct structure', () => {
  const question: any = { keywords: ["test"] };
  const result = evaluateAnswer("test", question);
  assert.strictEqual(result.score, 100);
  assert.strictEqual(result.isCorrect, true);
});
