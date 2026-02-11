import React from 'react';
import type { InterviewQuestion } from '../types';
import { CheckCircle, XCircle, ChevronRight, BookOpen } from 'lucide-react';

interface ResultsViewProps {
  results: InterviewQuestion[];
  onRestart: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ results, onRestart }) => {
  const averageScore = Math.round(results.reduce((acc, curr) => acc + curr.points, 0) / results.length);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">Interview Results</h2>
        <div className="inline-flex items-center justify-center p-8 rounded-full border-8 border-blue-500 text-5xl font-bold mb-4">
          {averageScore}%
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          {averageScore >= 70 ? 'Great job! You passed the mock interview.' : 'Keep practicing to improve your score.'}
        </p>
      </div>

      <div className="space-y-6 mb-12">
        {results.map((q, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold flex-1">{q.question}</h3>
              {q.isCorrect ? (
                <CheckCircle className="text-green-500 ml-4 shrink-0" />
              ) : (
                <XCircle className="text-red-500 ml-4 shrink-0" />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Your Answer</p>
                <p className="italic text-gray-700 dark:text-gray-300">
                  {q.transcription || 'No answer recorded'}
                </p>
                <div className="mt-2 text-sm font-bold text-blue-600">
                  Score: {q.points}%
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-xs font-semibold text-green-600 uppercase mb-2">Correct Answer / Keywords</p>
                <p className="text-gray-800 dark:text-gray-200 mb-2">{q.answer}</p>
                {q.nec_reference && (
                  <div className="flex items-center gap-1 text-sm font-bold text-green-700">
                    <BookOpen size={14} />
                    NEC {q.nec_reference}
                  </div>
                )}
              </div>
            </div>

            {q.explanation && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
      >
        Try Another Interview
      </button>
    </div>
  );
};
