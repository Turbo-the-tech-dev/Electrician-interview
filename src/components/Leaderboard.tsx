import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';
import type { LeaderboardEntry } from '../types';
import { ALL_ACHIEVEMENTS } from '../utils/achievements';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
          <Trophy className="text-yellow-600" size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">Peer Leaderboard</h2>
          <p className="text-gray-500">Top performers in Peer Practice mode</p>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-100 dark:border-gray-800">
              <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Rank</th>
              <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-wider">User</th>
              <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Avg Score</th>
              <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Sessions</th>
              <th className="pb-4 font-bold text-gray-400 uppercase text-xs tracking-wider">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {sortedEntries.length > 0 ? (
              sortedEntries.map((entry, index) => (
                <tr key={entry.name} className="group">
                  <td className="py-4">
                    {index === 0 && <Medal className="text-yellow-500" size={24} />}
                    {index === 1 && <Medal className="text-gray-400" size={24} />}
                    {index === 2 && <Medal className="text-amber-600" size={24} />}
                    {index > 2 && <span className="text-lg font-bold text-gray-400 ml-1">#{index + 1}</span>}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <User size={20} className="text-indigo-600" />
                      </div>
                      <span className="font-bold text-lg">{entry.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1">
                      <span className={`text-xl font-black ${entry.averageScore >= 85 ? 'text-green-500' : 'text-blue-500'}`}>
                        {entry.averageScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-500 font-medium">
                    {entry.sessionsCount}
                  </td>
                  <td className="py-4">
                    <div className="flex gap-1">
                      {entry.badges.slice(0, 3).map((badgeId, i) => {
                        const achievement = ALL_ACHIEVEMENTS.find(a => a.id === badgeId);
                        return (
                          <div key={i} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm" title={achievement?.name || badgeId}>
                            {achievement?.icon || '🏆'}
                          </div>
                        );
                      })}
                      {entry.badges.length > 3 && (
                        <span className="text-xs text-gray-400 ml-1">+{entry.badges.length - 3}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                  No peer practice data yet. Start a session to see your name here!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
