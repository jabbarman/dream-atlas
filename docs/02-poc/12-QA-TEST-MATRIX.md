# QA Test Matrix (Spike #1)

| Area | Scenario | Expected | Status |
|---|---|---|---|
| Generation | Generate atlas from 50 fragments | Completes within budget, no crash | TODO |
| Determinism | Re-run with same seed | Stable cluster/placement structure | TODO |
| Clustering | Switch between 2 modes | Meaningful regrouping with explainable logic | TODO |
| Interaction | Pan/zoom stress | Smooth, no lockups, preserves orientation | TODO |
| Selection | Select/deselect nodes | Correct panel behavior + state transitions | TODO |
| Persistence | Save then load atlas | Restores atlas + interaction context | TODO |
| Edge | Noisy/ambiguous fragments | No critical failures, graceful grouping | TODO |
| Edge | Empty/invalid input handling | Clear validation errors, no crash | TODO |
