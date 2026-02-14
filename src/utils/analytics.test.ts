import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateCategoryStats } from './analytics.ts';

const MOCK_CATEGORIES = ['NEC code', 'theory', 'safety'] as any;

describe('calculateCategoryStats', () => {
  it('should calculate stats correctly for a single session', () => {
    const sessions = [
      {
        id: '1',
        date: 1234567890,
        startTime: 1234567800,
        endTime: 1234567900,
        score: 80,
        questions: [
          {
            id: 'q1',
            category: 'NEC code',
            points: 100,
            question: 'q', answer: 'a', keywords: [], difficulty: 'apprentice'
          },
          {
            id: 'q2',
            category: 'NEC code',
            points: 50,
            question: 'q', answer: 'a', keywords: [], difficulty: 'apprentice'
          },
          {
            id: 'q3',
            category: 'theory',
            points: 0,
            question: 'q', answer: 'a', keywords: [], difficulty: 'apprentice'
          }
        ]
      }
    ] as any;

    const stats = calculateCategoryStats(sessions, MOCK_CATEGORIES);

    const necStats = stats.find(s => s.category === 'NEC code');
    assert.strictEqual(necStats?.count, 2);
    assert.strictEqual(necStats?.average, 75);

    const theoryStats = stats.find(s => s.category === 'theory');
    assert.strictEqual(theoryStats?.count, 1);
    assert.strictEqual(theoryStats?.average, 0);

    const otherStats = stats.find(s => s.category === 'safety');
    assert.strictEqual(otherStats?.count, 0);
    assert.strictEqual(otherStats?.average, 0);
  });

  it('should handle empty sessions', () => {
    const sessions: any[] = [];
    const stats = calculateCategoryStats(sessions, MOCK_CATEGORIES);

    const necStats = stats.find(s => s.category === 'NEC code');
    assert.strictEqual(necStats?.count, 0);
    assert.strictEqual(necStats?.average, 0);
  });
});
