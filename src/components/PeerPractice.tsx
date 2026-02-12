import React, { useState, useEffect } from 'react';
import type { Question, InterviewQuestion, PeerSession, Category, Difficulty } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { evaluateAnswer } from '../utils/scoring';
import { Mic, MicOff, SkipForward, User, Users, Star, Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import questionsData from '../../data/questions.json';

interface PeerPracticeProps {
  onComplete: (session: PeerSession) => void;
  onCancel: () => void;
}

type Step = 'setup' | 'p1_interviews_p2' | 'p1_rates_p2' | 'p2_interviews_p1' | 'p2_rates_p1' | 'comparison';

export const PeerPractice: React.FC<PeerPracticeProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<Step>('setup');
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['NEC code', 'theory']);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('apprentice');

  const [p1Questions, setP1Questions] = useState<Question[]>([]);
  const [p2Questions, setP2Questions] = useState<Question[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSessionQuestions, setCurrentSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [p2Results, setP2Results] = useState<InterviewQuestion[]>([]);
  const [p1Results, setP1Results] = useState<InterviewQuestion[]>([]);

  const [p2Rating, setP2Rating] = useState(0);
  const [p1Rating, setP1Rating] = useState(0);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const startPractice = () => {
    if (!player1Name || !player2Name) return;

    const filtered = (questionsData as Question[]).filter(q =>
      selectedCategories.includes(q.category) && q.difficulty === selectedDifficulty
    );

    if (filtered.length < 2) {
      alert("Not enough questions found for this selection. Please select more categories.");
      return;
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const mid = Math.floor(shuffled.length / 2);
    const limit = Math.min(mid, 3);

    setP1Questions(shuffled.slice(0, limit));
    setP2Questions(shuffled.slice(limit, limit * 2));

    setStep('p1_interviews_p2');
    setCurrentIndex(0);
    setCurrentSessionQuestions([]);
  };

  const handleNextQuestion = () => {
    if (isListening) stopListening();

    const currentQuestions = step === 'p1_interviews_p2' ? p2Questions : p1Questions;
    const currentQ = currentQuestions[currentIndex];
    const result = evaluateAnswer(transcript, currentQ);

    const answeredQuestion: InterviewQuestion = {
      ...currentQ,
      transcription: transcript,
      isCorrect: result.isCorrect,
      points: result.score
    };

    const updated = [...currentSessionQuestions, answeredQuestion];
    setCurrentSessionQuestions(updated);

    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (step === 'p1_interviews_p2') {
        setP2Results(updated);
        setStep('p1_rates_p2');
      } else {
        setP1Results(updated);
        setStep('p2_rates_p1');
      }
    }
  };

  const finalizeRating = (rating: number) => {
    if (step === 'p1_rates_p2') {
      setP2Rating(rating);
      setStep('p2_interviews_p1');
      setCurrentIndex(0);
      setCurrentSessionQuestions([]);
    } else {
      setP1Rating(rating);
      setStep('comparison');
    }
  };

  const completeSession = () => {
    const p1Score = Math.round(p1Results.reduce((acc, q) => acc + q.points, 0) / p1Results.length);
    const p2Score = Math.round(p2Results.reduce((acc, q) => acc + q.points, 0) / p2Results.length);

    const session: PeerSession = {
      id: crypto.randomUUID(),
      date: Date.now(),
      player1: {
        name: player1Name,
        score: p1Score,
        questions: p1Results,
        peerRating: p1Rating
      },
      player2: {
        name: player2Name,
        score: p2Score,
        questions: p2Results,
        peerRating: p2Rating
      }
    };
    onComplete(session);
  };

  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl text-indigo-600">
            <Users size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black">Peer Practice</h2>
            <p className="text-gray-500">Interview each other and grow together.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Player 1 Name</label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="e.g. Alice"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Player 2 Name</label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="e.g. Bob"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-4">Select Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['NEC code', 'theory', 'practical', 'safety', 'troubleshooting', 'management', 'behavioral', 'scenario'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (selectedCategories.includes(cat as Category)) {
                      setSelectedCategories(selectedCategories.filter(c => c !== cat));
                    } else {
                      setSelectedCategories([...selectedCategories, cat as Category]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedCategories.includes(cat as Category)
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-400 uppercase mb-4">Select Difficulty</label>
            <div className="flex gap-2">
              {(['apprentice', 'journeyman', 'master'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all capitalize ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={startPractice}
              disabled={!player1Name || !player2Name || selectedCategories.length === 0}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
            >
              Start Session
              <ArrowRight size={20} />
            </button>
            <button
              onClick={onCancel}
              className="px-8 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRound1 = step === 'p1_interviews_p2';
  const interviewer = isRound1 ? player1Name : player2Name;
  const interviewee = isRound1 ? player2Name : player1Name;
  const questions = isRound1 ? p2Questions : p1Questions;
  const currentQ = questions[currentIndex];

  if (step === 'p1_interviews_p2' || step === 'p2_interviews_p1') {
    return (
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-8">
              <span className="px-4 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-gray-500">
                <Users size={16} />
                <span className="text-sm font-bold">{interviewee} is answering</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6 leading-tight">{currentQ.question}</h2>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl min-h-[120px] mb-8 border-2 border-dashed border-gray-200 dark:border-gray-700">
              {transcript ? (
                <p className="text-xl italic text-gray-700 dark:text-gray-300">"{transcript}"</p>
              ) : (
                <p className="text-gray-400 text-center py-8 italic font-medium">Recording voice answer...</p>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!isListening ? (
                <button
                  onClick={startListening}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl transition-all font-bold shadow-lg shadow-indigo-100 dark:shadow-none"
                >
                  <Mic size={20} />
                  Start Microphone
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl transition-all font-bold"
                >
                  <MicOff size={20} />
                  Stop Recording
                </button>
              )}

              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 px-8 py-4 rounded-2xl transition-all font-bold"
              >
                <SkipForward size={20} />
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Interviewer Cheat Sheet */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-800/50">
          <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <ShieldCheck size={20} />
            <h3 className="font-bold uppercase text-xs tracking-widest">Interviewer Dashboard ({interviewer})</h3>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Ideal Answer</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{currentQ.answer}</p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Key Phrases to Listen For</p>
              <div className="flex flex-wrap gap-2">
                {currentQ.keywords.map(kw => (
                  <span key={kw} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-[10px] font-bold border border-indigo-100 dark:border-indigo-800">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {currentQ.nec_reference && (
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">NEC Reference</p>
                <p className="text-sm font-black">Article {currentQ.nec_reference}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'p1_rates_p2' || step === 'p2_rates_p1') {
    const rater = step === 'p1_rates_p2' ? player1Name : player2Name;
    const ratee = step === 'p1_rates_p2' ? player2Name : player1Name;

    return (
      <div className="max-w-xl mx-auto p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl text-center">
        <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Star className="text-yellow-600 fill-yellow-600" size={40} />
        </div>
        <h2 className="text-3xl font-black mb-2">{rater}, rate {ratee}'s performance!</h2>
        <p className="text-gray-500 mb-8">How well did they explain their answers and handle the pressure?</p>

        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => finalizeRating(star)}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 transition-all group"
            >
              <Star size={32} className="group-hover:fill-yellow-600" />
              <span className="block mt-2 text-xs font-bold">{star} Star</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'comparison') {
    const p1Avg = Math.round(p1Results.reduce((acc, q) => acc + q.points, 0) / p1Results.length);
    const p2Avg = Math.round(p2Results.reduce((acc, q) => acc + q.points, 0) / p2Results.length);
    const winner = p1Avg > p2Avg ? player1Name : p2Avg > p1Avg ? player2Name : 'Both';

    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-indigo-600 rounded-3xl p-10 text-white text-center shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Practice Complete!</h2>
            <div className="flex items-center justify-center gap-12">
              <div>
                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">{player1Name}</p>
                <p className="text-6xl font-black">{p1Avg}%</p>
                <div className="flex justify-center mt-2">
                   {[...Array(p1Rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
              <div className="h-20 w-px bg-indigo-500/50" />
              <div>
                <p className="text-indigo-200 font-bold uppercase tracking-widest text-xs mb-2">{player2Name}</p>
                <p className="text-6xl font-black">{p2Avg}%</p>
                <div className="flex justify-center mt-2">
                   {[...Array(p2Rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />)}
                </div>
              </div>
            </div>
            {winner !== 'Both' ? (
              <div className="mt-8 inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full font-bold">
                <Award size={20} />
                Winner: {winner}
              </div>
            ) : (
              <div className="mt-8 inline-flex items-center gap-2 bg-white/20 px-6 py-2 rounded-full font-bold">
                <CheckCircle size={20} />
                It's a tie!
              </div>
            )}
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Users size={200} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { name: player1Name, results: p1Results },
            { name: player2Name, results: p2Results }
          ].map((player, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <User size={20} className="text-indigo-600" />
                {player.name}'s Responses
              </h3>
              <div className="space-y-4">
                {player.results.map((q, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                    <p className="text-sm font-bold mb-1">{q.question}</p>
                    <p className="text-xs italic text-gray-500">"{q.transcription || 'No answer'}"</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-xs font-black ${q.points >= 70 ? 'text-green-600' : 'text-blue-600'}`}>
                        Score: {q.points}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={completeSession}
          className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 text-white py-5 rounded-3xl font-black text-xl hover:scale-[1.02] transition-all shadow-xl"
        >
          Save & Exit Practice
        </button>
      </div>
    );
  }

  return null;
};
