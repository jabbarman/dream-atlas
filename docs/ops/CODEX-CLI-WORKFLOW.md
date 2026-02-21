# Codex CLI Workflow

## Purpose
Define a Codex-native delivery loop that keeps role-quality outputs while using one primary implementation thread.

## Operating Model
- One primary Codex CLI session acts as the integrator for code, tests, and docs.
- Role lenses (PM/Product/Design/Tech/Dev/QA) are applied through artifacts and checklists, not persistent agent sessions.
- Repository docs and issues remain source of truth; session memory is not.

## Daily Delivery Loop
1. Pick one scoped work item with clear acceptance criteria.
2. Confirm context from `docs/status/PROJECT-STATE.yaml` and relevant phase docs.
3. Implement in small, reviewable steps (prefer one concern per commit).
4. Validate locally:
   - `npm run dev`
   - `curl http://localhost:8787/health`
   - manual smoke checks for affected UI/API flow
5. Update docs affected by the change (status, decisions, QA notes).
6. Commit using `type(scope): summary`.
7. Open/update PR with test evidence and risk notes.

## When to Spawn Sub-Agents
Use short-lived sub-agents only when parallelism materially reduces time.

Use sub-agents for:
- targeted codebase discovery (where is X implemented?)
- isolated draft work (test cases, migration notes, doc skeletons)
- bounded refactors with clear file ownership

Do not use sub-agents for:
- long-lived role simulation
- cross-cutting changes without a single integrator pass
- decisions that are not captured in repo artifacts

## PR Checklist
- Goal and scope are explicit.
- Acceptance criteria are mapped to implementation.
- Risks and rollback/safe-stop notes are included.
- UI changes include screenshot/GIF evidence.
- API changes include request/response examples.
- Docs and status files are updated where needed.
- Reviewer can run commands from PR description without extra context.

## Decision Hygiene
- Record significant architecture/process choices with an ADR (`docs/templates/ADR.md`).
- Keep handoffs concrete using `docs/templates/HANDOFF.md`.
- If work pauses, leave the next actionable step in `docs/status/PROJECT-STATE.yaml`.
