# QA Test Matrix (Spike #1)

Owner: QA  
Status: Executed (10/10 scenarios recorded)

Legend: `TODO | PASS | FAIL | BLOCKED`

| ID | Area | Scenario | Expected | Severity if fail | Status | Notes |
|---|---|---|---|---|---|---|
| QA-01 | Generation | Generate atlas from 50 fragments | Completes within baseline budget, no crash | High | PASS | 2026-02-21: `POST /atlas/generate` with 50 sample fragments returned `200`, `nodeCount=50`, `clusterCount=8`, and web render completed. |
| QA-02 | Determinism | Re-run same input + same seed | Cluster structure and relative placement stay stable | High | PASS | 2026-02-21: repeated `/atlas/generate` call with same payload produced identical node signature. |
| QA-03 | Clustering | Toggle theme/intensity modes | Regrouping changes are explainable and consistent | Med | PASS | 2026-02-22: theme mode returned 8 clusters; intensity mode returned 3 buckets with explicit reason labels (1-2, 3, 4-5). |
| QA-04 | Interaction | Pan/zoom for 60s stress | Smooth interaction, no lockups | High | PASS | 2026-02-22: in-browser synthetic pan/zoom stress ran for 60s total (2 x 30s) with no runtime errors. |
| QA-05 | Selection | Select/deselect multiple nodes | Correct panel state transitions | Med | PASS | 2026-02-22: automated selection transitions verified (`null -> nodeA -> nodeB -> null`) via debug hook; UI state and status transitions updated correctly. |
| QA-06 | Persistence | Save then load atlas | Restores nodes, clusters, and camera context | High | PASS | 2026-02-22: save/load round trip restored snapshot id, selected node, zoom, panX, and panY in API+UI flow. |
| QA-07 | Validation | Empty input payload | Clear validation error, no crash | Med | PASS | 2026-02-21: empty fragments payload returned `400` with field-level validation error. |
| QA-08 | Validation | Invalid field types | Validation errors are specific/actionable | Med | PASS | 2026-02-22: invalid payload types returned `400` with six field-specific validation errors (`id`, `text`, `theme_tags`, `intensity`, `timestamp_bucket`, `source_type`). |
| QA-09 | Edge data | Noisy/ambiguous fragments | Graceful grouping, no critical failure | Med | PASS | 2026-02-22: sample includes 15 noisy/ambiguous fragments; generation completed (`200`, `nodeCount=50`) without crash. |
| QA-10 | Regression | Repeat after mode switch + save/load | No state corruption after full loop | High | PASS | 2026-02-22: theme->save->intensity->load(theme) restored stable node signature and saved UI context values. |

## Smoke sequence (first pass)

1. QA-01 -> QA-04 -> QA-06
2. If all PASS, continue QA-02 and QA-10
3. Run QA-07 and QA-08 as negative-path checks

## Exit criteria for QA sign-off (spike)

- No unresolved **High** severity defects in core path
- Determinism scenario (QA-02) is PASS
- Save/load scenario (QA-06) is PASS
- At least 8/10 scenarios executed with results recorded

Current run summary:
- Executed: 10/10 scenarios
- Result: 10 PASS, 0 FAIL, 0 BLOCKED
