import type { Question } from '../types';

export const calculateScore = (transcription: string, keywords: string[]): number => {
  if (!transcription) return 0;

  const lowerTranscription = transcription.toLowerCase();
  const lowerKeywords = keywords.map(k => k.toLowerCase());
  let matchedKeywords = 0;

  for (const keyword of lowerKeywords) {
    if (lowerTranscription.includes(keyword)) {
      matchedKeywords++;
    }
  }

  return Math.round((matchedKeywords / keywords.length) * 100);
};

export const evaluateAnswer = (transcription: string, question: Question) => {
  const score = calculateScore(transcription, question.keywords);
  return {
    score,
    isCorrect: score >= 70, // 70% threshold for "correct"
  };
};
