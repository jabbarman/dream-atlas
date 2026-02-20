# Implementation Checklist (Dev)

Owner: Dev  
Status: In progress (Kickoff batch)

## Phase A — Foundation (must-have)

### A1. App skeleton
- [ ] Initialize React + PixiJS app shell
- [ ] Create module folders: `ingest/ cluster/ layout/ render/ state/ persistence`
- [ ] Add `.env.example` and basic run scripts

### A2. Ingest + model
- [ ] Implement fragment schema validation
- [ ] Add normalization helpers
- [ ] Load sample set from `docs/02-poc/data/FRAGMENT-SAMPLE-SPEC.md`

### A3. Deterministic generation
- [ ] Implement cluster mode: `theme`
- [ ] Implement cluster mode: `intensity`
- [ ] Add seeded RNG utility
- [ ] Implement seeded layout with stable output checks

### A4. Rendering + interaction
- [ ] Render nodes and cluster regions
- [ ] Add pan/zoom camera controls
- [ ] Add node select/deselect with info panel
- [ ] Add cluster mode toggle

## Phase B — Persistence + observability

### B1. Persistence
- [ ] Implement `POST /atlas/generate`
- [ ] Implement `POST /atlas/:id/save`
- [ ] Implement `POST /atlas/:id/load`
- [ ] Ensure snapshot restores UI context

### B2. Performance hooks
- [ ] Add generation timing instrumentation
- [ ] Add simple debug view/log for latency snapshots
- [ ] Validate generation <= 1500ms target at 50 fragments (dev baseline)

## Phase C — Hardening for spike review

- [ ] Determinism check: same seed + same input => stable layout structure
- [ ] Error handling for empty/invalid input
- [ ] Basic smoke pass against QA matrix
- [ ] Capture demo artifact (gif/video)

## Immediate execution order (next 60 min)

1. A1 + A2 scaffolding
2. A3 seeded generation skeleton
3. A4 pan/zoom + selection wiring
4. Record blockers in `docs/status/PROJECT-STATE.yaml` if any

## Definition of Done (Spike #1 dev slice)

- Two clustering modes work end-to-end
- Pan/zoom/select is functional
- Save/load round trip works on at least one sample atlas
- No critical crash in core flow
