# Repository Guidelines

## Project Structure & Module Organization
This repository is an npm workspace with product code and delivery artifacts.

- `apps/web`: React + Vite + PixiJS frontend (`src/App.jsx`, `src/main.jsx`, `src/styles.css`)
- `services/api`: Node + Express API (`src/server.js`)
- `docs/ops`: team workflow, charter, and governance docs
- `docs/status`: live project state and heartbeat artifacts
- `docs/01-discovery`, `docs/02-poc`, `docs/phase-gates`: phase-specific planning and QA materials

Keep implementation changes in `apps/*` and `services/*`; keep process/state updates in `docs/*`.

## Build, Test, and Development Commands
- `npm install`: install all workspace dependencies
- `npm run dev`: run API and web app together (API `:8787`, web `:5173`)
- `npm run dev:web`: run only the frontend via Vite
- `npm run dev:api`: run only the backend with Node watch mode
- `npm run build:web`: production build for the frontend
- `npm --workspace @dream-atlas/web run preview`: preview built frontend locally

Quick API check: `curl http://localhost:8787/health`.

## Coding Style & Naming Conventions
- Use ES modules, 2-space indentation, semicolons, and double quotes (match existing files).
- React components use `PascalCase`; hooks/variables use `camelCase`; CSS classes use kebab-case.
- Keep files focused: UI logic in `apps/web/src`, API routes/middleware in `services/api/src`.
- No formatter/linter is currently configured; keep diffs tidy and style-consistent manually.

## Testing Guidelines
Automated tests are not yet configured. Validate changes with:
- `npm run dev` and manual smoke tests in browser/API
- `GET /health` and `POST /atlas/generate` endpoint checks
- Relevant QA notes in `docs/02-poc/12-QA-TEST-MATRIX.md`

When adding tests, colocate with source as `*.test.jsx` or `*.test.js` and add scripts in the relevant workspace `package.json`.

## Commit & Pull Request Guidelines
- Follow the observed commit style: `type(scope): summary` (for example, `feat(poc): ...`, `chore(status): ...`).
- Keep subject lines imperative and concise; separate status-only updates from product code changes when possible.
- PRs should include: goal, scope, acceptance criteria, test approach, dependencies, and rollback/safe-stop notes.
- Link related issue(s) and include screenshots/GIFs for UI-affecting changes.

## Agent Workflow Notes
- Treat repository docs as source of truth for decisions and execution state.
- OpenClaw-era token/WhatsApp coordination controls are retired; use repo artifacts, issues, and PRs for coordination.
- Before major implementation choices, capture rationale in an ADR (`docs/templates/ADR.md`).
