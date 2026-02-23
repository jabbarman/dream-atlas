# MVP Regression Matrix

Date (UTC): 2026-02-23T22:44:45Z  
Phase: MVP  
Owner: QA

## Regression scenarios

| ID | Scenario | Method | Result |
|---|---|---|---|
| MVP-R01 | Generate atlas (`theme`) with valid fragments | API smoke (`POST /atlas/generate`) | PASS |
| MVP-R02 | Generate atlas (`intensity`) with valid fragments | API smoke (`POST /atlas/generate`) | PASS |
| MVP-R03 | Manual fragment add/update and custom generation | Browser walkthrough (Slice 2 controls) | PASS |
| MVP-R04 | Save and load persisted snapshot | API/UI smoke (`/atlas/:id/save`, `/atlas/:id/load`) | PASS |
| MVP-R05 | Saved atlas listing/selection path | API/UI smoke (`GET /atlas`, picker) | PASS |
| MVP-R06 | Search/filter/related highlighting behavior | Browser walkthrough (Slice 3 discovery controls) | PASS |
| MVP-R07 | Telemetry export from UI | Browser walkthrough (`Export Telemetry`) | PASS |
| MVP-R08 | Atlas JSON export/import roundtrip integrity | API roundtrip script + evidence JSON | PASS |
| MVP-R09 | Atlas import validation on malformed payload | API negative test (`POST /atlas/import`) | PASS |

## Evidence pointers

1. `docs/03-mvp/evidence/mvp-slice4-export-import-roundtrip.json`
2. `docs/03-mvp/evidence/mvp-slice4-import-validation.json`
3. `docs/03-mvp/evidence/mvp-slice4-export-controls-ui.png`
4. `docs/03-mvp/05-SLICE-1-QA-REPORT.md`
5. `docs/03-mvp/06-SLICE-2-QA-REPORT.md`
6. `docs/03-mvp/07-SLICE-3-QA-REPORT.md`

## Decision

All listed MVP regression scenarios are **PASS** for current scope.
