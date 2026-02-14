# Electrician Interview Prep

A comprehensive interview simulator for commercial and residential electricians, featuring voice-based practice, keyword scoring, and a spaced repetition study system.

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm

### Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    npm install
    ```

### Development

To start the development server:

```bash
npm run dev
```

## Testing

This project uses a custom testing setup leveraging the native Node.js test runner.

See [TESTING.md](./TESTING.md) for detailed instructions on running and writing tests.

## Features

-   **Mock Interviews**: Timed sessions with randomized questions covering NEC code, theory, safety, and more.
-   **Voice Recognition**: Answer questions verbally using speech-to-text.
-   **Automated Scoring**: Keyword-based analysis provides instant feedback on your answers.
-   **Spaced Repetition System (SRS)**: An intelligent algorithm (SuperMemo-2) schedules reviews based on your performance to maximize retention.
-   **Progress Tracking**: Detailed stats and history to track your improvement over time.
