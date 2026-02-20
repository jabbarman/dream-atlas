# Data + Persistence Notes (Dev)

## Deterministic seed behavior
- Seed supplied at generation request and persisted with atlas metadata.
- Same `(dataset, settings, seed)` must reproduce equivalent layout and cluster ids.

## Suggested entities
- `fragments(id, text, theme_tags, intensity, timestamp_bucket, source_type)`
- `atlases(id, seed, clustering_mode, created_at, metadata_json)`
- `atlas_nodes(atlas_id, fragment_id, x, y, cluster_id, score_json)`

## Save/load scope
- Save: camera state, selected filters, selected node, atlas generation params
- Load: restore atlas node layout + interaction state
