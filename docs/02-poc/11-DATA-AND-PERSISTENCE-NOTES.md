# Data + Persistence Notes (Dev)

## Deterministic seed behavior
- Seed supplied at generation request and persisted with atlas metadata.
- Same `(dataset, settings, seed)` must reproduce equivalent layout and cluster ids.

## Suggested entities
- `fragments(id, text, theme_tags, intensity, timestamp_bucket, source_type)`
- `atlases(id, seed, clustering_mode, created_at, metadata_json)`
- `atlas_nodes(atlas_id, fragment_id, x, y, cluster_id, score_json)`

## Current implementation snapshot (2026-02-22)
- Storage backend: SQLite (`services/api/data/atlas.sqlite`)
- Table: `atlas_snapshots`
- API supports:
  - `GET /atlas` for paginated snapshot listing
  - `POST /atlas/generate` and `POST /atlas/:id/save` persistence to SQLite
  - `GET /atlas/:id` and `POST /atlas/:id/load` retrieval from SQLite
- Frontend now consumes `GET /atlas` via saved-atlas picker to streamline load flows.
- Snapshot contract now includes `schemaVersion` for migration-safe evolution.

## Save/load scope
- Save: camera state, selected filters, selected node, atlas generation params
- Load: restore atlas node layout + interaction state
