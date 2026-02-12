import React from 'react';
import theoryData from '../../data/theory_curriculum.json';
import type { Curriculum } from '../types/theory';

export const TheoryGuide: React.FC = () => {
  const curriculum = theoryData as Curriculum;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Electrical Theory Study Guide</h2>
        <p className="text-gray-500 text-lg">Master the core concepts of electrical engineering and the NEC.</p>
      </div>

      <div className="grid gap-8">
        {curriculum.modules.map(module => (
          <div key={module.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-indigo-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white">{module.title}</h3>
            </div>
            <div className="p-6 space-y-6">
              {module.topics.map(topic => (
                <div key={topic.id} className="border-l-4 border-indigo-200 dark:border-indigo-900 pl-4">
                  <h4 className="text-lg font-bold mb-2">{topic.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{topic.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {topic.keyConcepts.map(concept => (
                      <span key={concept} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
