import React, { useState, useEffect, useRef } from 'react';
import type { Question, Answer } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { calculateScore } from '../utils/scoring';

interface QuestionViewProps {
  question: Question;
  onAnswer: (answer: Answer) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionView: React.FC<QuestionViewProps> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const { transcript, isListening, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setTimeLeft(60);
    startListening();

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopListening();
    };
  }, [question]);

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopListening();

    const scoringResult = calculateScore(transcript, question.keywords);
    onAnswer({
      questionId: question.id,
      transcript: transcript,
      score: scoringResult.score,
      matchedKeywords: scoringResult.matchedKeywords,
      missedKeywords: scoringResult.missedKeywords,
    });
  };

  return (
    <div className="question-view">
      <div className="header">
        <span>Question {questionNumber} of {totalQuestions}</span>
        <span className={`timer ${timeLeft < 10 ? 'low' : ''}`}>Time Left: {timeLeft}s</span>
      </div>

      <h3>{question.question}</h3>
      <div className="category-tag">{question.category} - {question.difficulty}</div>

      <div className="transcript-area">
        <p className="label">Your Answer (Voice-to-Text):</p>
        <div className="transcript-box">
          {transcript || (isListening ? "Listening..." : "Microphone is off. Click 'Start Mic' to begin speaking.")}
        </div>
      </div>

      {!browserSupportsSpeechRecognition && (
        <p className="error">Your browser does not support speech recognition. Please use Chrome or Edge.</p>
      )}

      <div className="controls">
        {!isListening && browserSupportsSpeechRecognition && (
          <button onClick={startListening} className="mic-btn" style={{ marginRight: '10px', backgroundColor: '#28a745' }}>
            Start Mic
          </button>
        )}
        <button onClick={handleFinish} className="submit-btn">Submit Answer</button>
      </div>
    </div>
  );
};

export default QuestionView;
