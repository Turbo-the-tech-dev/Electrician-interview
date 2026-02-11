import { useState, useEffect } from 'react';
import type { Question, InterviewQuestion, Category, Difficulty, UserProgress } from './types';
import { CategorySelector } from './components/CategorySelector';
import { InterviewSimulator } from './components/InterviewSimulator';
import { ResultsView } from './components/ResultsView';
import { calculateNextReview, scoreToPerformance } from './utils/srs';
import questionsData from '../data/questions.json';

type AppState = 'setup' | 'interview' | 'results';

function App() {
  const [state, setState] = useState<AppState>('setup');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['NEC code', 'theory']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('apprentice');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<InterviewQuestion[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});

  useEffect(() => {
    const savedProgress = localStorage.getItem('electrician-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const startInterview = () => {
    const filtered = (questionsData as Question[]).filter(q =>
      selectedCategories.includes(q.category) && q.difficulty === selectedDifficulty
    );

    // SRS priority: questions due for review first
    const now = Date.now();
    const sorted = [...filtered].sort((a, b) => {
      const progressA = userProgress[a.id];
      const progressB = userProgress[b.id];

      const dueA = progressA ? progressA.nextReview < now : true;
      const dueB = progressB ? progressB.nextReview < now : true;

      if (dueA && !dueB) return -1;
      if (!dueA && dueB) return 1;
      return 0.5 - Math.random();
    });

    setActiveQuestions(sorted.slice(0, 5));
    setState('interview');
  };

  const completeInterview = (sessionResults: InterviewQuestion[]) => {
    setResults(sessionResults);

    // Update SRS progress
    const newProgress = { ...userProgress };
    sessionResults.forEach(result => {
      const performance = scoreToPerformance(result.points);
      newProgress[result.id] = calculateNextReview(performance, userProgress[result.id]);
      newProgress[result.id].questionId = result.id;
    });

    setUserProgress(newProgress);
    localStorage.setItem('electrician-progress', JSON.stringify(newProgress));

    setState('results');
  };

  const restart = () => {
    setState('setup');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 py-12 px-4">
      <header className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ELECTRICAL INTERVIEW PREP
        </h1>
        <p className="text-gray-500 font-medium">Master the NEC, Theory, and Safety</p>
      </header>

      <main>
        {state === 'setup' && (
          <CategorySelector
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            onStart={startInterview}
          />
        )}

        {state === 'interview' && (
          <InterviewSimulator
            questions={activeQuestions}
            onComplete={completeInterview}
          />
        )}

        {state === 'results' && (
          <ResultsView
            results={results}
            onRestart={restart}
          />
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-20 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Electrician Interview Simulator. All NEC references are based on NFPA 70.
      </footer>
    </div>
  );
}

export default App;
