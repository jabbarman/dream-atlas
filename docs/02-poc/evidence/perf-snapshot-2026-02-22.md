# Performance Snapshot — 2026-02-22

Environment:
- Local dev machine
- API: `services/api/src/server.js`
- Dataset: sample fragments (50) and derived 100-fragment variant
- Runs: 20 iterations per scenario

## Results

| Scenario | avg (ms) | p95 (ms) | min (ms) | max (ms) | Output summary |
|---|---:|---:|---:|---:|---|
| Generate 50 / theme | 10.25 | 14.74 | 3.21 | 82.04 | 50 nodes, 8 clusters |
| Generate 50 / intensity | 3.09 | 4.51 | 1.73 | 5.53 | 50 nodes, 3 clusters |
| Generate 100 / theme | 3.23 | 3.74 | 2.24 | 4.41 | 100 nodes, 8 clusters |
| Save snapshot (50) | 3.04 | 4.22 | 1.69 | 9.07 | context persisted |
| Load snapshot (50) | 2.54 | 4.46 | 1.23 | 7.17 | context restored |

## Budget check

- Generation budget (`<= 2.0s target`, `<= 3.0s max`): PASS
- Save/load budget (`<= 500ms target`, `<= 1000ms max`): PASS

## Caveats

- One `max` outlier in 50/theme indicates startup/jitter effects; p95 remains low.
- API payload field `perf.generationMs` currently uses low-resolution timing and should be upgraded before MVP.
