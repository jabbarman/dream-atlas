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
