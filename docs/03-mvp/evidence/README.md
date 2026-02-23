# MVP Evidence Artifacts

- `mvp-slice2-ingestion-ui.png`: Slice 2 UI walkthrough state showing manual/custom ingestion controls and custom generation flow.
- `mvp-slice3-discovery-ui.png`: Slice 3 UI state showing discovery controls (search, intensity/time filters, clear filters) and discovery summary counts.
- `mvp-slice4-export-controls-ui.png`: Slice 4 UI state showing `Import Atlas JSON` and `Export Atlas JSON` controls.
- `mvp-slice4-export-import-roundtrip.json`: Slice 4 API roundtrip integrity report (generate -> export payload -> import -> load -> signature compare).
- `mvp-slice4-import-validation.json`: Slice 4 malformed import validation result (`POST /atlas/import` returns 400 + details).
