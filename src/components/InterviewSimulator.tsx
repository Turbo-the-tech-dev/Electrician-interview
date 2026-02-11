import React, { useState } from 'react';
import type { Question, Answer, InterviewSession } from '../types';
import questionsData from '../../data/questions.json';
import QuestionView from './QuestionView';
import FeedbackView from './FeedbackView';

const InterviewSimulator: React.FC = () => {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [status, setStatus] = useState<'idle' | 'interviewing' | 'feedback'>('idle');

  const startInterview = () => {
    // Randomize and pick 5 questions
    const shuffled = [...(questionsData as Question[])].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, 5);

    setSession({
      questions: selectedQuestions,
      answers: [],
      startTime: Date.now(),
    });
    setCurrentQuestionIndex(0);
    setStatus('interviewing');
  };

  const handleAnswerSubmit = (answer: Answer) => {
    if (!session) return;

    const newAnswers = [...session.answers, answer];
    setSession({ ...session, answers: newAnswers });

    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setSession({ ...session, answers: newAnswers, endTime: Date.now() });
      setStatus('feedback');
    }
  };

  if (status === 'idle') {
    return (
      <div className="start-screen">
        <h1>Electrician Mock Interview</h1>
        <p>Test your knowledge of the NEC, safety, and electrical theory.</p>
        <button onClick={startInterview}>Start Interview Session</button>
      </div>
    );
  }

  if (status === 'interviewing' && session) {
    return (
      <QuestionView
        question={session.questions[currentQuestionIndex]}
        onAnswer={handleAnswerSubmit}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={session.questions.length}
      />
    );
  }

  if (status === 'feedback' && session) {
    return (
      <FeedbackView
        session={session}
        onRestart={() => setStatus('idle')}
      />
    );
  }

  return null;
};

export default InterviewSimulator;
