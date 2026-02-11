const fs = require('fs');

const categories = ['NEC code', 'theory', 'practical', 'safety', 'troubleshooting', 'management', 'behavioral', 'scenario'];
const difficulties = ['apprentice', 'journeyman', 'master'];

const questions = [];

// Sample generator
for (let i = 0; i < 50; i++) {
  const category = categories[i % categories.length];
  const difficulty = difficulties[i % difficulties.length];
  questions.push({
    id: `gen-${i}`,
    category,
    difficulty,
    question: `Generated question #${i} for ${category} at ${difficulty} level?`,
    answer: `This is a generated answer for question #${i}. It contains several keywords like alpha, beta, and gamma.`,
    keywords: ['alpha', 'beta', 'gamma', 'generated'],
    nec_reference: category === 'NEC code' ? '110.16' : undefined,
    explanation: 'This is an automatically generated explanation.'
  });
}

// Write to data/questions.json
// fs.writeFileSync('./data/questions.json', JSON.stringify(questions, null, 2));
console.log('Question generation script ready.');
