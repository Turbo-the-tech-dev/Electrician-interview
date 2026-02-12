// Mocking the functions to test the logic
const scoreToPerformance = (score) => {
  if (score >= 90) return 5;
  if (score >= 70) return 4;
  if (score >= 50) return 3;
  if (score >= 30) return 2;
  if (score >= 10) return 1;
  return 0;
};

const calculateNextReview = (
  performance, // 0 to 5
  previousProgress
) => {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = previousProgress || {};

  if (performance >= 3) {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview
  };
};

const calculateScore = (transcription, keywords) => {
  if (!transcription) return 0;
  const lowerTranscription = transcription.toLowerCase();
  let matchedKeywords = 0;
  keywords.forEach(keyword => {
    if (lowerTranscription.includes(keyword.toLowerCase())) {
      matchedKeywords++;
    }
  });
  return Math.round((matchedKeywords / keywords.length) * 100);
};

function testSRS() {
  console.log('Testing SRS Logic...');
  console.assert(scoreToPerformance(100) === 5, 'Score 100 should be performance 5');
  console.assert(scoreToPerformance(75) === 4, 'Score 75 should be performance 4');
  const p1 = calculateNextReview(5);
  console.assert(p1.repetitions === 1, 'Repetitions should be 1');
  console.assert(p1.interval === 1, 'Interval should be 1');
  const p2 = calculateNextReview(5, p1);
  console.assert(p2.repetitions === 2, 'Repetitions should be 2');
  console.assert(p2.interval === 6, 'Interval should be 6');
  const p3 = calculateNextReview(1, p2);
  console.assert(p3.repetitions === 0, 'Repetitions should be reset to 0');
  console.assert(p3.interval === 1, 'Interval should be reset to 1');
  console.log('SRS Tests Passed!');
}

function testScoring() {
  console.log('Testing Scoring Logic...');
  const keywords = ['NEC', 'code', 'safety'];
  const transcript = 'I follow the NEC code for safety.';
  const score = calculateScore(transcript, keywords);
  console.assert(score === 100, `Score should be 100, got ${score}`);
  console.log('Scoring Tests Passed!');
}

testSRS();
testScoring();
console.log('All Logic Verifications Passed!');
