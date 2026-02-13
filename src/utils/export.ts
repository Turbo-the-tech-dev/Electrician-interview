import type { InterviewSession } from '../types';

export const exportToCSV = (sessions: InterviewSession[]): void => {
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
