import type { PeerSession, Achievement, LeaderboardEntry } from '../types';

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    name: 'First Peer Session',
    description: 'Complete your first peer practice interview.',
    icon: '🤝'
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Get over 90% in a peer practice session.',
    icon: '🚀'
  },
  {
    id: 'perfect_rating',
    name: 'Perfect Rating',
    description: 'Get a 5-star rating from your peer.',
    icon: '⭐'
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Complete 5 peer practice sessions.',
    icon: '🎖️'
  }
];

export const checkAchievements = (
  session: PeerSession,
  existingLeaderboard: LeaderboardEntry[]
): { player1: string[]; player2: string[] } => {
  const p1Badges: string[] = [];
  const p2Badges: string[] = [];

  // P1 Badges
  if (session.player1.score >= 90) p1Badges.push('high_scorer');
  if (session.player1.peerRating === 5) p1Badges.push('perfect_rating');

  const p1Entry = existingLeaderboard.find(e => e.name === session.player1.name);
  if (!p1Entry) {
    p1Badges.push('first_session');
  } else if (p1Entry.sessionsCount === 4) {
    p1Badges.push('veteran');
  }

  // P2 Badges
  if (session.player2.score >= 90) p2Badges.push('high_scorer');
  if (session.player2.peerRating === 5) p2Badges.push('perfect_rating');

  const p2Entry = existingLeaderboard.find(e => e.name === session.player2.name);
  if (!p2Entry) {
    p2Badges.push('first_session');
  } else if (p2Entry.sessionsCount === 4) {
    p2Badges.push('veteran');
  }

  return { player1: p1Badges, player2: p2Badges };
};

export const updateLeaderboard = (
  session: PeerSession,
  currentLeaderboard: LeaderboardEntry[],
  newBadges: { player1: string[]; player2: string[] }
): LeaderboardEntry[] => {
  const updated = [...currentLeaderboard];

  const updatePlayer = (name: string, score: number, badges: string[]) => {
    const index = updated.findIndex(e => e.name === name);
    if (index >= 0) {
      const entry = updated[index];
      const newAverage = Math.round((entry.averageScore * entry.sessionsCount + score) / (entry.sessionsCount + 1));
      updated[index] = {
        ...entry,
        averageScore: newAverage,
        sessionsCount: entry.sessionsCount + 1,
        badges: Array.from(new Set([...entry.badges, ...badges]))
      };
    } else {
      updated.push({
        name,
        averageScore: score,
        sessionsCount: 1,
        badges
      });
    }
  };

  updatePlayer(session.player1.name, session.player1.score, newBadges.player1);
  updatePlayer(session.player2.name, session.player2.score, newBadges.player2);

  return updated;
};
