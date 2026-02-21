# Implementation Checklist (Dev)

Owner: Dev  
Status: In progress (First end-to-end slice implemented)

## Phase A — Foundation (must-have)

### A1. App skeleton
- [ ] Initialize React + PixiJS app shell
- [ ] Create module folders: `ingest/ cluster/ layout/ render/ state/ persistence`
- [ ] Add `.env.example` and basic run scripts

### A2. Ingest + model
- [x] Implement fragment schema validation
- [x] Add normalization helpers
- [x] Load sample set from `docs/02-poc/data/FRAGMENT-SAMPLE-SPEC.md`

### A3. Deterministic generation
- [x] Implement cluster mode: `theme`
- [x] Implement cluster mode: `intensity`
- [x] Add seeded RNG utility
- [x] Implement seeded layout with stable output checks

### A4. Rendering + interaction
- [x] Render nodes and cluster regions
- [x] Add pan/zoom camera controls
- [x] Add node select/deselect with info panel
- [x] Add cluster mode toggle

## Phase B — Persistence + observability

### B1. Persistence
- [x] Implement `POST /atlas/generate`
- [x] Implement `POST /atlas/:id/save`
- [x] Implement `POST /atlas/:id/load`
- [ ] Ensure snapshot restores UI context

### B2. Performance hooks
- [x] Add generation timing instrumentation
- [x] Add simple debug view/log for latency snapshots
- [x] Validate generation <= 1500ms target at 50 fragments (dev baseline)

## Phase C — Hardening for spike review

- [x] Determinism check: same seed + same input => stable layout structure
- [x] Error handling for empty/invalid input
- [x] Basic smoke pass against QA matrix (QA-01/QA-02/QA-07)
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
