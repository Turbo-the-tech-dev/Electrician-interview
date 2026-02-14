import type { Category } from '../types';

export const getRecommendation = (cat: Category): string => {
  switch (cat) {
    case 'NEC code': return 'Review NFPA 70 Articles related to your missed questions. Focus on grounding and bonding.';
    case 'theory': return 'Brush up on Ohms Law and complex circuit calculations.';
    case 'safety': return 'Re-read OSHA standards and NFPA 70E requirements.';
    case 'troubleshooting': return 'Practice diagnostic flowcharts and testing equipment usage.';
    default: return `Keep practicing ${cat} questions to improve your score.`;
  }
};
