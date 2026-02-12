# Electrician Interview Prep App

A comprehensive mock interview simulator designed to help electricians prepare for commercial and residential certification exams and job interviews.

## Features

- **Categorized Question Bank**: Over 500 questions covering:
  - NEC Code (NFPA 70)
  - Electrical Theory
  - Practical Applications
  - Safety Protocols (LOTO, PPE)
  - Troubleshooting
  - Management & Behavioral Scenarios
- **Mock Interview Simulator**:
  - Timed sessions (60 seconds per question).
  - Voice-to-text answer input using the Web Speech API.
  - Real-time transcription.
- **Intelligent Scoring**:
  - Keyword-based scoring system.
  - Immediate feedback with correct answers and NEC references.
- **Spaced Repetition System (SRS)**:
  - Uses the SM2 algorithm to track your progress.
  - Automatically schedules review for questions you find difficult.
  - Progress is persisted locally in your browser.
- **Difficulty Levels**:
  - Apprentice
  - Journeyman
  - Master

## Tech Stack

- **React** (Vite + TypeScript)
- **Tailwind CSS** for styling
- **Lucide React** for iconography
- **Web Speech API** for voice recognition

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- A modern web browser (Chrome or Edge recommended for Speech Recognition support)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd electrician-interview
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`.

## How to Use

1. **Setup**: Select the categories and difficulty level you want to practice.
2. **Interview**: Click "Start Mock Interview".
3. **Answering**: For each question, click "Start Answering" and speak your answer clearly. Click "Stop & Review" when finished.
4. **Scoring**: The app will transcribe your voice and match it against key technical terms to calculate your score.
5. **Review**: Check your results at the end of the session to see where you can improve.

## License

This project is for educational purposes. All NEC references are based on the NFPA 70 standards.
