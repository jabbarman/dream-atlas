# POC Spike #1 — Work Assignment (Execution Batch 1)

Date: 2026-02-20
Phase: POC
Source inputs:
- `docs/status/PROJECT-STATE.yaml`
- `docs/02-poc/01-SPIKE-1-ARCHITECTURE-AND-FEASIBILITY.md`

## Objective for this batch
Execute the next queued task for current phase by assigning Spike #1 implementation work across all team roles with concrete deliverables and handoff dependencies.

## Assignment board

### PM (session: `dreamatlas-pm`)
**Deliverables**
1. Freeze Spike #1 acceptance checklist in `docs/02-poc/03-SPIKE-1-ACCEPTANCE.md`.
2. Publish review cadence and checkpoint times in `docs/02-poc/04-SPIKE-1-CADENCE.md`.

**Dependency out**
- Needed by QA for final verification gate.

---

### Product (session: `dreamatlas-product`)
**Deliverables**
1. Create representative sample set spec: `docs/02-poc/data/FRAGMENT-SAMPLE-SPEC.md`.
2. Define “meaningful map” evaluation heuristics: `docs/02-poc/05-MEANINGFUL-MAP-HEURISTICS.md`.

**Dependency out**
- Needed by Dev/QA for implementation and validation inputs.

---

### Design (session: `dreamatlas-design`)
**Deliverables**
1. Node/region visual vocabulary: `docs/02-poc/06-VISUAL-VOCABULARY.md`.
2. Pan/zoom/select/info-panel interaction states: `docs/02-poc/07-INTERACTION-SPEC.md`.

**Dependency out**
- Needed by Dev for interaction/UI behavior implementation.

---

### Tech Lead (session: `dreamatlas-techlead`)
**Deliverables**
1. Option A blueprint + module boundaries: `docs/02-poc/08-TECH-BLUEPRINT.md`.
2. Performance budgets and instrumentation plan: `docs/02-poc/09-PERFORMANCE-BUDGETS.md`.

**Dependency out**
- Needed by Dev for implementation architecture and perf guardrails.

---

### Dev (session: `dreamatlas-dev`)
**Deliverables**
1. Skeleton app and generation pipeline checklist: `docs/02-poc/10-IMPLEMENTATION-CHECKLIST.md`.
2. Deterministic seed + save/load implementation notes: `docs/02-poc/11-DATA-AND-PERSISTENCE-NOTES.md`.

**Dependency out**
- Needed by QA for test execution and defect triage.

---

### QA (session: `dreamatlas-qa`)
**Deliverables**
1. Spike test matrix and edge-case checklist: `docs/02-poc/12-QA-TEST-MATRIX.md`.
2. Defect logging template for spike runs: `docs/02-poc/13-DEFECT-LOG-TEMPLATE.md`.

**Dependency out**
- Needed by PM/Tech Lead for exit sign-off.

## Sequencing (lightweight)
1. PM + Tech Lead + Product publish constraints/spec inputs first.
2. Design publishes interaction contract.
3. Dev executes against blueprint/spec.
4. QA validates and reports.
5. PM consolidates evidence against spike exit criteria.

## Done signal for this batch
- All six role deliverable docs created and linked.
- `PROJECT-STATE.yaml` advances to next executable step: implementation kickoff + QA loop.
