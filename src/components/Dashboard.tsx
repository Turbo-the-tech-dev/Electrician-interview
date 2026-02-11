import React from 'react';
import type { InterviewSession, UserProgress, Category } from '../types';
import { BarChart, TrendingUp, AlertTriangle, Lightbulb, Download, Calendar } from 'lucide-react';

interface DashboardProps {
  sessions: InterviewSession[];
  userProgress: Record<string, UserProgress>;
}

export const Dashboard: React.FC<DashboardProps> = ({ sessions, userProgress }) => {
  // 1. Data Processing Logic
  const categories: Category[] = [
    'NEC code', 'theory', 'practical', 'safety', 'troubleshooting', 'management', 'behavioral', 'scenario'
  ];

  const categoryStats = categories.map(cat => {
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

  const weakAreas = categoryStats.filter(stat => stat.count > 0 && stat.average < 70);
  const strongAreas = categoryStats.filter(stat => stat.count > 0 && stat.average >= 70);

  const recentSessions = [...sessions].sort((a, b) => b.date - a.date).slice(0, 10);

  const getRecommendation = (cat: Category) => {
    switch (cat) {
      case 'NEC code': return 'Review NFPA 70 Articles related to your missed questions. Focus on grounding and bonding.';
      case 'theory': return 'Brush up on Ohms Law and complex circuit calculations.';
      case 'safety': return 'Re-read OSHA standards and NFPA 70E requirements.';
      case 'troubleshooting': return 'Practice diagnostic flowcharts and testing equipment usage.';
      default: return `Keep practicing ${cat} questions to improve your score.`;
    }
  };

  // 2. Export Functionality
  const exportToCSV = () => {
    const headers = ['Date', 'Score', 'Duration (s)', 'Questions Count'];
    const rows = sessions.map(s => [
      new Date(s.date).toLocaleDateString(),
      s.score,
      Math.round(((s.endTime || 0) - s.startTime) / 1000),
      s.questions.length
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `interview_report_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-gray-500">Track your progress and apprenticeship documentation.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Performance */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <BarChart size={20} />
            <h3 className="font-bold text-lg">Performance by Category</h3>
          </div>
          <div className="space-y-4">
            {categoryStats.map(stat => (
              <div key={stat.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium capitalize">{stat.category}</span>
                  <span className="text-gray-500">{stat.count > 0 ? `${stat.average}%` : 'No data'}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-1000 ${
                      stat.average >= 70 ? 'bg-green-500' : stat.average >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stat.count > 0 ? stat.average : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Trends */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-6 text-blue-600">
            <TrendingUp size={20} />
            <h3 className="font-bold text-lg">Recent Trends</h3>
          </div>
          <div className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm font-medium">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-sm font-bold ${s.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                    {s.score}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm text-center py-8">No sessions completed yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-400">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-lg">Areas for Improvement</h3>
          </div>
          {weakAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {weakAreas.map(wa => (
                <span key={wa.category} className="px-3 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-full text-sm font-bold capitalize">
                  {wa.category} ({wa.average}%)
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {sessions.length > 0 ? "Great job! You're performing well across all categories." : "Complete some interviews to identify weak areas."}
            </p>
          )}
        </div>

        {/* Study Recommendations */}
        <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
          <div className="flex items-center gap-2 mb-4 text-green-600 dark:text-green-400">
            <Lightbulb size={20} />
            <h3 className="font-bold text-lg">Study Recommendations</h3>
          </div>
          <ul className="space-y-3">
            {weakAreas.length > 0 ? (
              weakAreas.slice(0, 3).map(wa => (
                <li key={wa.category} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                  <span className="font-bold text-green-600">•</span>
                  <span><strong>{wa.category}:</strong> {getRecommendation(wa.category)}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-700 dark:text-gray-300">
                Continue with regular practice to maintain your knowledge base across all electrical domains.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
