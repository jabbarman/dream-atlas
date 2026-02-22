# MVP Scope Definition (Draft v1)

Date (UTC): 2026-02-22  
Phase: MVP-prep (parallel draft while POC gate approval is pending)  
Owner: PM + Tech Lead

## MVP objective

Ship the smallest valuable Dream Atlas release that supports real user input, repeat exploration, and persistent atlas lifecycle with quality and observability guardrails.

## Target users for MVP

1. Primary: creatives with existing notes/fragments.
2. Secondary: reflective users with recurring journaling/dream entries.

## In scope for MVP

1. User fragment ingestion from UI (manual entry + JSON paste/import).
2. Persistent atlas storage (non-volatile) with create/list/load/save flows.
3. Deterministic generation modes: `theme` and `intensity`.
4. Core exploration UX: pan/zoom/select/cluster reasoning panel.
5. Discovery utility: text/tag search and basic filters (theme/intensity/time bucket).
6. Export capability: atlas JSON export and telemetry export.
7. Baseline release quality: regression checks, defect triage, and release checklist.
8. Observability baseline: API perf payload + in-app render telemetry available for QA.

## Out of scope for MVP

1. 3D map layers/biomes.
2. Real-time multi-user collaboration.
3. Heavy AI interpretation/clinical inference.
4. Native mobile app packaging.
5. Social feeds or public profiles.

## MVP acceptance criteria

1. User can complete `input -> generate -> explore -> save -> load -> export` with own data.
2. No open critical defects in core flows.
3. Generation and save/load remain within current POC budget thresholds.
4. QA report and release checklist are complete and reviewed.
5. Privacy/non-clinical positioning remains explicit in product copy.

## Gate dependency

This scope is execution-ready but should be treated as pre-approved draft until POC gate sign-off is formally recorded in `docs/02-poc/15-SPIKE-1-SIGNOFF-RECORD.md`.
