import React from 'react';
import type { InterviewSession } from '../types';

interface FeedbackViewProps {
  session: InterviewSession;
  onRestart: () => void;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ session, onRestart }) => {
  const averageScore = Math.round(
    session.answers.reduce((acc, curr) => acc + curr.score, 0) / session.answers.length
  );

  return (
    <div className="feedback-view">
      <h2>Interview Feedback</h2>
      <div className="overall-score">
        Overall Score: <span className="score-value">{averageScore}%</span>
      </div>

      <div className="answers-list">
        {session.questions.map((q, index) => {
          const answer = session.answers.find(a => a.questionId === q.id);
          return (
            <div key={q.id} className="answer-item">
              <h4>Q{index + 1}: {q.question}</h4>
              <p><strong>Your Answer:</strong> {answer?.transcript || "(No answer)"}</p>
              <p><strong>Score:</strong> {answer?.score}%</p>

              <div className="keywords">
                <span className="label">Keywords Matched:</span> {answer?.matchedKeywords.join(', ') || 'None'}
              </div>

              <div className="correct-info">
                <p><strong>Correct Answer:</strong> {q.correct_answer}</p>
                <p><strong>NEC Reference:</strong> {q.nec_reference}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onRestart} className="restart-btn">Try Another Session</button>
    </div>
  );
};

export default FeedbackView;
