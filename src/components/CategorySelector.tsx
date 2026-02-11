import React from 'react';
import type { Category, Difficulty } from '../types';

interface CategorySelectorProps {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  selectedDifficulty: Difficulty;
  setSelectedDifficulty: (difficulty: Difficulty) => void;
  onStart: () => void;
}

const CATEGORIES: Category[] = [
  'NEC code', 'theory', 'practical', 'safety', 'troubleshooting', 'management', 'behavioral', 'scenario'
];

const DIFFICULTIES: Difficulty[] = ['apprentice', 'journeyman', 'master'];

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart
}) => {
  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Select Interview Parameters</h2>

      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedCategories.includes(category)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-transparent border-gray-300 hover:border-blue-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Difficulty</h3>
        <div className="flex gap-2">
          {DIFFICULTIES.map(difficulty => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`px-4 py-2 rounded-full border transition-colors ${
                selectedDifficulty === difficulty
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-transparent border-gray-300 hover:border-green-400'
              }`}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onStart}
        disabled={selectedCategories.length === 0}
        className="mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start Mock Interview
      </button>
    </div>
  );
};
