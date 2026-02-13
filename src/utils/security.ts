import type { InterviewSession, InterviewQuestion } from '../types';

/**
 * Sanitizes an interview session by removing sensitive user input (transcripts and answers).
 * This ensures that personal information is not stored in localStorage, mitigating XSS risks.
 *
 * @param session The full interview session object
 * @returns A new session object with sensitive fields removed from questions
 */
export const sanitizeSession = (session: InterviewSession): InterviewSession => {
  const sanitizedQuestions = session.questions.map((q) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userAnswer, transcription, ...rest } = q;
    return rest as InterviewQuestion;
  });

  return {
    ...session,
    questions: sanitizedQuestions
  };
};
