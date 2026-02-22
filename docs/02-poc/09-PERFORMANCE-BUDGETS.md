# Performance Budgets + Instrumentation Plan

Owner: Tech Lead

## POC budgets
- Initial generation (<=100 fragments): target <= 2.0s, max 3.0s
- Pan/zoom interaction: target >= 50 FPS, floor 40 FPS
- Node selection to panel update: target <= 120ms, max 200ms
- Save/load roundtrip (local): target <= 500ms, max 1000ms

## Instrumentation
- Capture generation start/end timestamps
- Frame-time sampling during pan/zoom bursts
- Selection latency markers
- Save/load timing markers

## Reporting
- Record snapshots per test run in evidence notes
- Flag any >20% budget miss as perf risk

## Latest snapshot (2026-02-22)

Source: `docs/02-poc/evidence/perf-snapshot-2026-02-22.md`

| Metric | Budget target | Latest result | Status |
|---|---|---|---|
| Generate (50 fragments, theme) | <= 2.0s target, <= 3.0s max | avg 10.25ms, p95 14.74ms | PASS |
| Generate (50 fragments, intensity) | <= 2.0s target, <= 3.0s max | avg 3.09ms, p95 4.51ms | PASS |
| Generate (100 fragments, theme) | <= 2.0s target, <= 3.0s max | avg 3.23ms, p95 3.74ms | PASS |
| Save roundtrip (local) | <= 500ms target, <= 1000ms max | avg 3.04ms, p95 4.22ms | PASS |
| Load roundtrip (local) | <= 500ms target, <= 1000ms max | avg 2.54ms, p95 4.46ms | PASS |

Notes:
- Interaction stress (pan/zoom) executed for 60s total in browser with no runtime errors (QA-04 PASS).
- API perf payload now uses high-resolution timing (`performance.now`) with phase metrics (`normalizeMs`, `clusterMs`, `layoutMs`) and request/save/load timings (`requestMs`, `saveMs`, `loadMs`) from commit `9c9a704`.
- Frontend run summary now includes live render telemetry (`current/avg FPS`, `p95 frame ms`) for in-session observability (commit `51764e7`).
- Frontend now supports one-click telemetry export (`Export Telemetry`) to JSON for evidence persistence during sign-off walkthroughs (commit `a7d861e`).
