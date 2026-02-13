import React, { useState } from 'react';
import type { Curriculum, Module, Topic } from '../types/theory';
import theoryData from '../../data/theory_curriculum.json';
import { Book, ChevronRight, CheckCircle2 } from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  const curriculum = theoryData as Curriculum;
  const [selectedModule, setSelectedModule] = useState<Module>(curriculum.modules[0]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(curriculum.modules[0].topics[0]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 p-6">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Book className="text-blue-600" />
          Curriculum
        </h2>
        <div className="space-y-4">
          {curriculum.modules.map(module => (
            <div key={module.id}>
              <button
                onClick={() => {
                  setSelectedModule(module);
                  setSelectedTopic(module.topics[0]);
                }}
                className={`w-full text-left font-bold p-2 rounded transition-colors ${
                  selectedModule.id === module.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                }`}
              >
                {module.title}
              </button>
              {selectedModule.id === module.id && (
                <div className="ml-4 mt-2 space-y-1">
                  {module.topics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full text-left text-sm p-2 rounded flex items-center justify-between ${
                        selectedTopic.id === topic.id ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {topic.title}
                      {selectedTopic.id === topic.id && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2 block">
            {selectedModule.title}
          </span>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            {selectedTopic.title}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            {selectedTopic.content}
          </p>

          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            Key Learning Points
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
            {selectedTopic.keyPoints.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                <CheckCircle2 className="text-green-500 shrink-0 mt-1" size={18} />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Ready to test your knowledge?</h4>
          <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
            Practice questions related to this topic are available in the Mock Interview section.
          </p>
        </div>
      </div>
    </div>
  );
};
