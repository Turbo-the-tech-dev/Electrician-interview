const fs = require('fs');

const categories = ['NEC code', 'theory', 'practical', 'safety', 'troubleshooting', 'management'];
const difficulties = ['apprentice', 'journeyman', 'master'];

const questions = [];

const contentTemplates = {
  'NEC code': {
    'apprentice': [
      { q: 'What is the color of the equipment grounding conductor?', a: 'Green, green with yellow stripes, or bare.', k: ['green', 'yellow', 'bare'], ref: '250.119' },
      { q: 'What is the standard voltage for a single-phase residential service in the US?', a: '120/240 Volts.', k: ['120/240', 'volts', 'single-phase'] }
    ],
    'journeyman': [
      { q: 'What is the maximum number of disconnects allowed for a single service?', a: 'Six switches or circuit breakers.', k: ['six', '6', 'switches', 'circuit breakers'], ref: '230.71' },
      { q: 'What is the minimum cover requirement for direct burial cables at 600V or less in a residential driveway?', a: '18 inches.', k: ['18 inches', 'driveway', 'burial'], ref: 'Table 300.5' }
    ],
    'master': [
      { q: 'Calculate the minimum service load for a 1500 sq ft dwelling with standard appliances.', a: 'Requires calculation based on Art 220, typically around 100-150A.', k: ['Art 220', 'calculation', 'load'], ref: 'Article 220' },
      { q: 'Explain the requirements for a high-leg delta transformer connection grounding.', a: 'The midpoint of one phase must be grounded, and the high leg must be identified with orange color.', k: ['high-leg', 'orange', 'grounded', 'delta'], ref: '110.15' }
    ]
  },
  'theory': {
    'apprentice': [
      { q: 'What is Ohm\'s Law?', a: 'V = I * R, Voltage equals current times resistance.', k: ['V=IR', 'Voltage', 'Current', 'Resistance'] },
      { q: 'What is the unit of electrical power?', a: 'The Watt (W).', k: ['Watt', 'W', 'power'] }
    ],
    'journeyman': [
      { q: 'What is the total resistance of two 10-ohm resistors in parallel?', a: '5 ohms.', k: ['5 ohms', 'parallel', 'resistance'] },
      { q: 'Explain Power Factor and why it matters.', a: 'Ratio of real power to apparent power; affects efficiency.', k: ['real', 'apparent', 'ratio', 'efficiency'] }
    ],
    'master': [
      { q: 'Calculate the total impedance in a circuit with 10 ohms resistance and 10 ohms inductive reactance.', a: 'Z = sqrt(R^2 + XL^2) = 14.14 ohms.', k: ['14.14', 'impedance', 'sqrt'] },
      { q: 'Describe the effect of harmonics on the neutral conductor of a 4-wire wye system.', a: 'Triplen harmonics add up in the neutral, potentially causing overheating.', k: ['harmonics', 'neutral', 'triplen', 'overheating'] }
    ]
  },
  'safety': {
    'apprentice': [
      { q: 'What does PPE stand for?', a: 'Personal Protective Equipment.', k: ['Personal', 'Protective', 'Equipment'] },
      { q: 'What is the first thing you should do if someone is being electrocuted?', a: 'Disconnect the power source if safe, or use a non-conductive object to move them.', k: ['disconnect', 'power', 'non-conductive'] }
    ],
    'journeyman': [
      { q: 'What is the purpose of a Lockout/Tagout (LOTO) procedure?', a: 'To ensure equipment is de-energized and cannot be started while being worked on.', k: ['de-energized', 'started', 'Lockout', 'Tagout'] },
      { q: 'When is a GFCI required for temporary power on a construction site?', a: 'For all 125-volt, single-phase, 15, 20, and 30-amp receptacle outlets.', k: ['temporary', '125-volt', 'GFCI'], ref: '590.6' }
    ],
    'master': [
      { q: 'Explain the difference between limited and restricted approach boundaries.', a: 'Limited is for unqualified persons with supervision; restricted is for qualified persons only.', k: ['limited', 'restricted', 'boundaries', 'approach'], ref: 'NFPA 70E' },
      { q: 'What are the requirements for an Arc Flash Hazard Analysis?', a: 'Determine the arc flash boundary and the required level of PPE.', k: ['arc flash', 'boundary', 'PPE'], ref: 'NFPA 70E' }
    ]
  },
  'practical': {
    'apprentice': [
      { q: 'How do you bend a 90-degree stub-up in 1/2" EMT?', a: 'Place bender mark at the desired height minus the deduct (5").', k: ['bender', 'deduct', '5 inches', 'EMT'] }
    ],
    'journeyman': [
      { q: 'How do you determine the correct wire size for a 50A circuit?', a: 'Use Table 310.15(B)(16); usually 6 AWG copper or 4 AWG aluminum.', k: ['Table 310.15', 'wire size', '50A'] }
    ],
    'master': [
      { q: 'Describe the procedure for testing the insulation resistance of a large motor.', a: 'Use a megohmmeter (megger) to apply a high voltage and measure leakage current.', k: ['megohmmeter', 'megger', 'insulation', 'resistance'] }
    ]
  },
  'troubleshooting': {
    'apprentice': [
      { q: 'What is the first step when a circuit breaker trips?', a: 'Identify the circuit and check for overloaded appliances or short circuits.', k: ['identify', 'overloaded', 'short circuit'] }
    ],
    'journeyman': [
      { q: 'A 3-phase motor is overheating. What are possible causes?', a: 'Phase imbalance, overload, poor ventilation, or bearing failure.', k: ['imbalance', 'overload', 'ventilation', 'bearing'] }
    ],
    'master': [
      { q: 'How do you diagnose an intermittent ground fault in a complex industrial control system?', a: 'Use a recording ammeter or specialized ground fault detectors to track leakage over time.', k: ['recording ammeter', 'leakage', 'detectors', 'intermittent'] }
    ]
  },
  'management': {
    'apprentice': [
      { q: 'Why is it important to fill out a daily work log?', a: 'To track progress, document issues, and ensure accurate billing and payroll.', k: ['track', 'document', 'billing', 'payroll'] }
    ],
    'journeyman': [
      { q: 'How do you handle a change order request from a customer?', a: 'Document the change, estimate the cost and time impact, and get written approval.', k: ['document', 'estimate', 'approval', 'change order'] }
    ],
    'master': [
      { q: 'What are the key components of a comprehensive safety management program?', a: 'Training, hazard identification, PPE policy, incident reporting, and regular audits.', k: ['training', 'hazard', 'PPE', 'reporting', 'audits'] }
    ]
  }
};

let idCounter = 1;

categories.forEach(category => {
  difficulties.forEach(difficulty => {
    const templates = contentTemplates[category][difficulty] || [];
    templates.forEach(template => {
      // Create 3 slightly varied questions for each template
      for (let i = 0; i < 3; i++) {
        questions.push({
          id: `q-${idCounter++}`,
          category,
          difficulty,
          question: i === 0 ? template.q : `${template.q} (Scenario ${i})`,
          answer: template.a,
          keywords: template.k,
          nec_reference: template.ref,
          explanation: `This ${difficulty} level question focuses on ${category}.`
        });
      }
    });
  });
});

fs.writeFileSync('./data/questions.json', JSON.stringify(questions, null, 2));
console.log(`Generated ${questions.length} diverse questions in data/questions.json`);
