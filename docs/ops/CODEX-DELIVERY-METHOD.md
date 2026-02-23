# Codex Delivery Method (Reusable)

## 1) Characterization

This project used an **artifact-driven, gate-based delivery system** with one integrator session coordinating all work.

Core traits:
1. **Phase-gated execution**: Discovery -> POC -> MVP, with explicit gate criteria and pass/loop decisions.
2. **Dual-track output**: product code changes and status/governance artifacts evolve together.
3. **Evidence-first quality**: every meaningful claim is backed by reproducible checks and stored evidence.
4. **Tight commit hygiene**: code commits and docs/status commits are separated and pushed in sequence.
5. **Live operational state**: a single up-to-date project state file + live status file drive next actions.
6. **Interplay transparency**: each discrete stage records what the integrator did, what was delegated, and validation outcomes.
7. **Momentum under constraints**: when approvals block one path, parallel prep artifacts are produced without falsifying state.

## 2) Operating Contract

Use these non-negotiables:
1. Never mark a gate passed without explicit approval evidence.
2. Never mark implementation done without validation evidence.
3. Keep the "next step" field singular and executable.
4. Separate commits by intent:
   - code/feature commits
   - docs/status/governance commits
5. Push after each completed stage.

## 3) Required Artifact Set

Minimum reusable artifact set:
1. `docs/status/PROJECT-STATE.yaml` (source of truth)
2. `docs/status/LIVE-STATUS.md` (human-readable heartbeat)
3. `docs/status/INTEGRATOR-AGENT-INTERPLAY.md` (stage log)
4. Phase gate checklists (e.g. `docs/phase-gates/*.md`)
5. Phase QA matrix and evidence directory
6. Sign-off record for each gate

## 4) Stage Execution Loop

For each discrete stage:
1. Read current state + gate conditions.
2. Implement the highest-leverage unblocked slice.
3. Validate with reproducible checks.
4. Capture evidence artifacts (json/png/gif/logs as needed).
5. Update status/state/interplay docs.
6. Commit code and docs separately.
7. Push and set one clear next step.

## 5) Validation Pattern

Validation should include:
1. Build/compile check.
2. API smoke checks for changed endpoints.
3. UI walkthrough for changed flows.
4. Negative-path checks when contract behavior changes.
5. Evidence files committed under `docs/.../evidence/`.

## 6) How To Reuse On Another Project

### Option A: AGENTS.md reference (simplest)

1. Copy this file into the new repo: `docs/ops/CODEX-DELIVERY-METHOD.md`.
2. Add to the new repo's `AGENTS.md`:

```md
## Delivery Method
- Follow `docs/ops/CODEX-DELIVERY-METHOD.md` as the default operating system for planning, execution, validation, commit hygiene, and gate handling.
- Keep code and docs/status commits separate.
- Keep `docs/status/PROJECT-STATE.yaml` as the single source of truth.
```

### Option B: Skill-based reuse (portable)

Install/use the local skill `codex-delivery-operating-system` from `~/.codex/skills/codex-delivery-operating-system/`.

Trigger pattern in prompts:
- "Use codex-delivery-operating-system for this repo."
- "Run this stage using the delivery OS skill."

## 7) Default Cadence Rules

1. Provide short progress updates while working.
2. Before edits, state what will change.
3. After edits, run validation and report objective outcomes.
4. End every stage with:
   - what shipped
   - what evidence exists
   - exact next step
