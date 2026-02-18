# Agent Topology (How the team manifests)

This project uses **persistent role agents** coordinated by PM behavior in the main session.

## Principle
Use separate specialist agents for role-quality output, but keep continuity in shared repository artifacts.

## Agent labels (recommended)
- `dreamatlas-pm`
- `dreamatlas-product`
- `dreamatlas-design`
- `dreamatlas-techlead`
- `dreamatlas-dev`
- `dreamatlas-qa`

## Collaboration pattern
1. PM creates/updates phase plan in `docs/status/PROJECT-STATE.yaml`
2. Role agents deliver artifacts to phase folders/templates
3. PM runs gate checklist
4. If gate passes, promote phase; otherwise loop on gaps

## Context durability rules
- Every significant decision goes in an ADR: `docs/phase-gates/ADR-XXXX.md`
- Every handoff uses `docs/templates/HANDOFF.md`
- Every phase closes with explicit exit report
