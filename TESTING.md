# Testing Strategy

This project uses the built-in [Node.js test runner](https://nodejs.org/api/test.html) (available in Node.js v20+) for unit testing. We leverage TypeScript support via the `--experimental-strip-types` flag to run `.ts` test files directly without a separate build step.

## Running Tests

To run the full test suite:

```bash
node --experimental-strip-types --test src/**/*.test.ts
```

To run a specific test file:

```bash
node --experimental-strip-types --test src/utils/srs.test.ts
```

## Test Structure

- **Location**: Test files are co-located with the source code they test (e.g., `src/utils/srs.ts` -> `src/utils/srs.test.ts`).
- **Naming Convention**: All test files must end with `.test.ts`.
- **Imports**:
    - Use `.ts` extensions for relative imports within the `src/` directory to ensure compatibility with the Node.js loader.
    - Note: This differs from the convention used in the main application code (which might omit extensions or use slightly different resolution rules depending on the bundler), but it is required for the native Node.js runner.

## Key Test Areas

### Spaced Repetition System (SRS)
The core learning algorithm is located in `src/utils/srs.ts`. Tests in `src/utils/srs.test.ts` verify:
- **Failed Performance**: Ensuring a score < 3 resets the repetition count and interval.
- **Success Scenarios**: Verifying that intervals grow exponentially based on the ease factor.
- **Ease Factor**: Checking that the difficulty multiplier adjusts correctly based on user performance.

### Scoring
The keyword matching logic in `src/utils/scoring.ts` is critical for evaluating user answers. Tests cover:
- Exact and partial matches.
- Case insensitivity.
- Edge cases like empty inputs or no matches.

## Writing New Tests

We use the standard `node:test` and `node:assert` modules.

Example template:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { myFunction } from './myFunction.ts';

describe('myFunction', () => {
  it('should do something correctly', () => {
    const result = myFunction();
    assert.strictEqual(result, expectedValue);
  });
});
```
