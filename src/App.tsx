import { useState, useEffect } from 'react';
import type { Question, InterviewQuestion, Category, Difficulty, UserProgress, InterviewSession } from './types';
import { CategorySelector } from './components/CategorySelector';
import { InterviewSimulator } from './components/InterviewSimulator';
import { ResultsView } from './components/ResultsView';
import { Dashboard } from './components/Dashboard';
import { calculateNextReview, scoreToPerformance } from './utils/srs';
import questionsData from '../data/questions.json';

type AppState = 'setup' | 'interview' | 'results' | 'dashboard';

function App() {
  const [state, setState] = useState<AppState>('setup');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['NEC code', 'theory']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('apprentice');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<InterviewQuestion[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem('electrician-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    const savedSessions = localStorage.getItem('electrician-sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  const startInterview = () => {
    const filtered = (questionsData as Question[]).filter(q =>
      selectedCategories.includes(q.category) && q.difficulty === selectedDifficulty
    );

    setSessionStartTime(Date.now());

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
    const endTime = Date.now();
    const averageScore = Math.round(sessionResults.reduce((acc, curr) => acc + curr.points, 0) / sessionResults.length);

    const newSession: InterviewSession = {
      id: crypto.randomUUID(),
      date: Date.now(),
      startTime: sessionStartTime,
      endTime,
      questions: sessionResults,
      score: averageScore
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('electrician-sessions', JSON.stringify(updatedSessions));

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
      <header className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ELECTRICAL INTERVIEW PREP
          </h1>
          <p className="text-gray-500 font-medium">Master the NEC, Theory, and Safety</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setState('setup')}
            className={`px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${state === 'setup' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
          >
            Practice
          </button>
          <button
            onClick={() => setState('dashboard')}
            className={`px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-all ${state === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
          >
            Analytics
          </button>
        </div>
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

        {state === 'dashboard' && (
          <Dashboard
            sessions={sessions}
            userProgress={userProgress}
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
