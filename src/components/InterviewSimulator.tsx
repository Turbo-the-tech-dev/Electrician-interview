import React, { useState, useEffect } from 'react';
import type { Question, InterviewQuestion, Category, Difficulty } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { evaluateAnswer } from '../utils/scoring';
import { Mic, MicOff, Play, SkipForward } from 'lucide-react';

interface InterviewSimulatorProps {
  questions: Question[];
  onComplete: (sessionQuestions: InterviewQuestion[]) => void;
}

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<InterviewQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleNext();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (isListening) stopListening();

    const result = evaluateAnswer(transcript, currentQuestion);

    const answeredQuestion: InterviewQuestion = {
      ...currentQuestion,
      transcription: transcript,
      isCorrect: result.isCorrect,
      points: result.score
    };

    const newSessionQuestions = [...sessionQuestions, answeredQuestion];
    setSessionQuestions(newSessionQuestions);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(60);
    } else {
      onComplete(newSessionQuestions);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-8">
        <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${timeLeft < 10 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
          <span className="font-mono text-xl">{timeLeft}s</span>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-left">{currentQuestion.question}</h2>
        <div className="flex gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {currentQuestion.category}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider px-2 py-1 bg-purple-100 text-purple-800 rounded">
            {currentQuestion.difficulty}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-8 min-h-[150px] flex flex-col justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
        {transcript ? (
          <p className="text-lg italic text-gray-700 dark:text-gray-300">"{transcript}"</p>
        ) : (
          <p className="text-gray-400">Your answer will appear here as you speak...</p>
        )}
      </div>

      <div className="flex justify-center gap-4">
        {!isListening ? (
          <button
            onClick={startListening}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105"
          >
            <Mic size={20} />
            Start Answering
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105"
          >
            <MicOff size={20} />
            Stop & Review
          </button>
        )}

        <button
          onClick={handleNext}
          className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-6 py-3 rounded-full transition-all"
        >
          <SkipForward size={20} />
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </button>
      </div>

      {!browserSupportsSpeechRecognition && (
        <p className="mt-4 text-red-500 text-sm">
          Warning: Speech recognition is not supported in your browser. Please use Chrome for best experience.
        </p>
      )}
    </div>
  );
};
