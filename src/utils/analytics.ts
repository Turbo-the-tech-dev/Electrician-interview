import type { InterviewSession, CategoryStat, Category } from '../types';

export const calculateCategoryStats = (sessions: InterviewSession[], categories: Category[]): CategoryStat[] => {
  return categories.map(cat => {
    let totalPoints = 0;
    let count = 0;

    sessions.forEach(session => {
      session.questions.forEach(q => {
        if (q.category === cat) {
          totalPoints += q.points;
          count++;
        }
      });
    });

    const average = count > 0 ? Math.round(totalPoints / count) : 0;
    return { category: cat, average, count };
  });
};

export const getWeakAreas = (stats: CategoryStat[]): CategoryStat[] => {
  return stats.filter(stat => stat.count > 0 && stat.average < 70);
};

export const getRecentSessions = (sessions: InterviewSession[], limit: number = 10): InterviewSession[] => {
  return [...sessions].sort((a, b) => b.date - a.date).slice(0, limit);
};
