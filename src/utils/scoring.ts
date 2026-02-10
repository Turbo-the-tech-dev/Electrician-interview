export const calculateScore = (transcript: string, keywords: string[]): {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
} => {
  const normalizedTranscript = transcript.toLowerCase();
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];

  keywords.forEach(keyword => {
    if (normalizedTranscript.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missedKeywords.push(keyword);
    }
  });

  const score = keywords.length > 0
    ? Math.round((matchedKeywords.length / keywords.length) * 100)
    : 0;

  return { score, matchedKeywords, missedKeywords };
};
