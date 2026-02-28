import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateCategoryStats, getWeakAreas, getRecentSessions } from './analytics.ts';

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

describe('getWeakAreas', () => {
  it('should return categories with average below 70', () => {
    const stats: any[] = [
      { category: 'NEC code', average: 65, count: 3 },
      { category: 'theory', average: 80, count: 5 },
      { category: 'safety', average: 50, count: 2 },
    ];
    const weak = getWeakAreas(stats);
    assert.strictEqual(weak.length, 2);
    assert.ok(weak.some(s => s.category === 'NEC code'));
    assert.ok(weak.some(s => s.category === 'safety'));
  });

  it('should exclude categories with no attempts (count === 0)', () => {
    const stats: any[] = [
      { category: 'NEC code', average: 0, count: 0 },
      { category: 'theory', average: 60, count: 4 },
    ];
    const weak = getWeakAreas(stats);
    assert.strictEqual(weak.length, 1);
    assert.strictEqual(weak[0].category, 'theory');
  });

  it('should return empty array when all categories are at or above threshold', () => {
    const stats: any[] = [
      { category: 'NEC code', average: 70, count: 3 },
      { category: 'theory', average: 100, count: 5 },
    ];
    const weak = getWeakAreas(stats);
    assert.strictEqual(weak.length, 0);
  });

  it('should return empty array for empty input', () => {
    const weak = getWeakAreas([]);
    assert.strictEqual(weak.length, 0);
  });
});

describe('getRecentSessions', () => {
  const makeSessions = (dates: number[]) =>
    dates.map((date, i) => ({ id: `s${i}`, date } as any));

  it('should return sessions sorted by date descending', () => {
    const sessions = makeSessions([100, 300, 200]);
    const recent = getRecentSessions(sessions);
    assert.strictEqual(recent[0].date, 300);
    assert.strictEqual(recent[1].date, 200);
    assert.strictEqual(recent[2].date, 100);
  });

  it('should respect the limit parameter', () => {
    const sessions = makeSessions([1, 2, 3, 4, 5]);
    const recent = getRecentSessions(sessions, 3);
    assert.strictEqual(recent.length, 3);
    assert.strictEqual(recent[0].date, 5);
  });

  it('should default to a limit of 10', () => {
    const sessions = makeSessions(Array.from({ length: 15 }, (_, i) => i));
    const recent = getRecentSessions(sessions);
    assert.strictEqual(recent.length, 10);
  });

  it('should return empty array for empty input', () => {
    const recent = getRecentSessions([]);
    assert.strictEqual(recent.length, 0);
  });

  it('should not mutate the original sessions array', () => {
    const sessions = makeSessions([100, 300, 200]);
    const original = [...sessions];
    getRecentSessions(sessions);
    assert.deepStrictEqual(sessions.map(s => s.date), original.map(s => s.date));
  });
});
