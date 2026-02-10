import { calculateScore } from './scoring';

const testCases = [
  {
    transcript: "The limit was 42 overcurrent devices in a panelboard.",
    keywords: ["42", "overcurrent", "devices", "panelboard"],
    expectedScore: 100
  },
  {
    transcript: "A GFCI protects against ground faults and shock.",
    keywords: ["ground fault", "shock", "leakage", "current"],
    expectedScore: 50
  },
  {
    transcript: "I don't know the answer.",
    keywords: ["NEC", "code"],
    expectedScore: 0
  }
];

testCases.forEach((tc, index) => {
  const result = calculateScore(tc.transcript, tc.keywords);
  console.log(`Test Case ${index + 1}:`);
  console.log(`Transcript: ${tc.transcript}`);
  console.log(`Keywords: ${tc.keywords.join(', ')}`);
  console.log(`Result Score: ${result.score}, Expected: ${tc.expectedScore}`);
  console.log(`Matched: ${result.matchedKeywords.join(', ')}`);
  console.log(`Missed: ${result.missedKeywords.join(', ')}`);
  console.log('---');
});
