# QA Test Matrix (Spike #1)

Owner: QA  
Status: Ready for execution

Legend: `TODO | PASS | FAIL | BLOCKED`

| ID | Area | Scenario | Expected | Severity if fail | Status | Notes |
|---|---|---|---|---|---|---|
| QA-01 | Generation | Generate atlas from 50 fragments | Completes within baseline budget, no crash | High | TODO | |
| QA-02 | Determinism | Re-run same input + same seed | Cluster structure and relative placement stay stable | High | TODO | |
| QA-03 | Clustering | Toggle theme/intensity modes | Regrouping changes are explainable and consistent | Med | TODO | |
| QA-04 | Interaction | Pan/zoom for 60s stress | Smooth interaction, no lockups | High | TODO | |
| QA-05 | Selection | Select/deselect multiple nodes | Correct panel state transitions | Med | TODO | |
| QA-06 | Persistence | Save then load atlas | Restores nodes, clusters, and camera context | High | TODO | |
| QA-07 | Validation | Empty input payload | Clear validation error, no crash | Med | TODO | |
| QA-08 | Validation | Invalid field types | Validation errors are specific/actionable | Med | TODO | |
| QA-09 | Edge data | Noisy/ambiguous fragments | Graceful grouping, no critical failure | Med | TODO | |
| QA-10 | Regression | Repeat after mode switch + save/load | No state corruption after full loop | High | TODO | |

## Smoke sequence (first pass)

1. QA-01 -> QA-04 -> QA-06
2. If all PASS, continue QA-02 and QA-10
3. Run QA-07 and QA-08 as negative-path checks

## Exit criteria for QA sign-off (spike)

- No unresolved **High** severity defects in core path
- Determinism scenario (QA-02) is PASS
- Save/load scenario (QA-06) is PASS
- At least 8/10 scenarios executed with results recorded
