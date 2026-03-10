# IMPERIAL ENGINEERING: BEST PRACTICES & CONTRIBUTING GUIDE
> "Precision. Power. Absolute Velocity."

To maintain the integrity of the Imperial Grid and ensure 100% uptime of the Kyber-Core, all station engineers must adhere strictly to the following protocols. Failure to comply will result in immediate termination.

## 1. Isolate Your Circuits (Branching Strategy)
* **Never commit directly to `main`.** The main line carries lethal voltage.
* Create a localized feature branch for all modifications.
* Use standard Imperial prefixes: `feat/` for new circuits, `fix/` for blown fuses, and `docs/` for manifesto updates.
* Example: `git checkout -b fix/substation-alpha-grounding`

## 2. Atomic Diagnostics (Commit Messages)
* Write clear, declarative commit messages using Conventional Commits.
* Commits should represent a single, testable change to the grid.
* **Acceptable:** `fix(grid): reroute 3-phase power around faulty relay`
* **Unacceptable:** `fixed stuff` or `more updates`

## 3. Peer Interrogation (Pull Requests)
* All branches must be merged via Pull Requests.
* Provide a complete schematic of your changes in the PR description.
* Link to the specific Issue/Exam your PR resolves using `Resolves #X`.
* At least one other Sith Journeyman must review and approve your logic before the merge.

## 4. Continuous Safety Checks (CI/CD)
* Do not bypass the automated GitHub Actions workflows.
* Ensure all localized voltage tests pass before requesting a review.
* Code with warnings or errors is considered Rebel contraband.

*Enforced by Imperial Command.*
