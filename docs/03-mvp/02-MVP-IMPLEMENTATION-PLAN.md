# MVP Implementation Plan (Draft v1)

Date (UTC): 2026-02-22  
Phase: MVP-prep  
Owner: Tech Lead

## Current execution update (2026-02-22)

- Slice 1 API foundation implemented in commit `2f1eb57`:
  - durable SQLite snapshot store
  - `/atlas` listing endpoint with pagination (`limit`, `offset`)
  - snapshot `schemaVersion` field on generate/save/load paths
- Slice 1 frontend integration implemented in commit `af8e986`:
  - saved-atlas picker backed by `/atlas` listing
  - refresh control for latest persisted snapshots
- Slice 1 QA evidence pass completed:
  - report: `docs/03-mvp/05-SLICE-1-QA-REPORT.md`
  - evidence: API smoke JSON + picker-load screenshot
- Next focus:
  - start Slice 2 user-data ingestion

## Execution slices

### Slice 1 — Persistence hardening

Goal: replace transient in-memory persistence with durable store and atlas listing.

Deliverables:
1. Durable persistence adapter (SQLite-first).
2. API endpoints for atlas index/list metadata.
3. Migration-safe snapshot schema versioning notes.

Exit checks:
1. Save/load works across API restarts.
2. Atlas list returns expected metadata.

### Slice 2 — User data ingestion

Goal: allow real user fragment input beyond static sample data.

Deliverables:
1. UI input path for manual fragments and JSON paste/import.
2. Server-side validation aligned with existing fragment contract.
3. Clear user-facing errors for malformed payloads.

Exit checks:
1. User can generate from pasted/imported data without code changes.
2. Validation errors are actionable and field-specific.

### Slice 3 — Discovery utility

Goal: improve practical exploration quality for real datasets.

Deliverables:
1. Search by text/tag.
2. Filters by intensity and time bucket.
3. Highlight related nodes from selected context.

Exit checks:
1. Search/filter updates are responsive and reversible.
2. Selected context remains stable under filter changes.

### Slice 4 — Export and release readiness

Goal: package MVP release candidate with QA and observability evidence.

Deliverables:
1. Atlas JSON export path (portable snapshot).
2. QA report for MVP matrix + regression pass.
3. Release checklist and rollback notes.

Exit checks:
1. Export/import roundtrip preserves atlas integrity.
2. Release packet is complete with pass/fail status and known issues.

## Sequencing and dependencies

1. Slice 1 before Slice 2 (durable save/load baseline first).
2. Slice 2 before Slice 3 (real data input needed for discovery validation).
3. Slice 4 begins after Slice 1-3 feature freeze.

## Risk controls during execution

1. Timebox non-core UX polish until acceptance criteria are met.
2. Keep clustering model deterministic; defer experimental model changes.
3. Track every new endpoint/UI flow in QA matrix as it lands.
