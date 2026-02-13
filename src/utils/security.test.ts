import { test } from 'node:test';
import assert from 'node:assert';
import { sanitizeSession } from './security.ts';
import type { InterviewSession, InterviewQuestion } from '../types.ts';

test('sanitizeSession removes sensitive fields', () => {
  const mockQuestion: InterviewQuestion = {
    id: 'q1',
    category: 'NEC code',
    difficulty: 'apprentice',
    question: 'What is NEC?',
    answer: 'National Electrical Code',
    keywords: ['code'],
    points: 10,
    userAnswer: 'It is a code',
    transcription: 'it is a code',
    isCorrect: true
  };

  const mockSession: InterviewSession = {
    id: '123',
    date: Date.now(),
    startTime: 1000,
    endTime: 2000,
    score: 80,
    questions: [mockQuestion]
  };

  const sanitized = sanitizeSession(mockSession);

  // Check that sensitive fields are removed
  assert.strictEqual((sanitized.questions[0] as any).userAnswer, undefined);
  assert.strictEqual((sanitized.questions[0] as any).transcription, undefined);

  // Check that other fields are preserved
  assert.strictEqual(sanitized.questions[0].id, 'q1');
  assert.strictEqual(sanitized.questions[0].points, 10);
  assert.strictEqual(sanitized.id, '123');
  assert.strictEqual(sanitized.questions[0].isCorrect, true);

  // Ensure original object is not mutated
  assert.strictEqual(mockSession.questions[0].userAnswer, 'It is a code');
});
