# Snapshot Schema Versioning Notes

Date (UTC): 2026-02-22  
Owner: Tech Lead

## Current version

- `schemaVersion: 1`
- Applied to generated and saved atlas snapshots by API.
- Stored with each snapshot in SQLite (`schema_version`) and in snapshot JSON payload.

## Storage model

- Table: `atlas_snapshots`
- Key fields:
  - `id` (PK)
  - `schema_version`
  - `snapshot_json`
  - metadata: `seed`, `cluster_mode`, `node_count`, `cluster_count`, `created_at`, `updated_at`, `saved_at`

## Backward compatibility policy

1. API `load` and `get` responses always include `schemaVersion`.
2. If a legacy snapshot omits `schemaVersion`, API defaults it to `1` on read/write.
3. Non-breaking additions are preferred within a schema version.

## Migration strategy for version bumps

1. Bump `schemaVersion` only for breaking snapshot-contract changes.
2. Add an explicit migration function per version step (`v1 -> v2`, etc.) in persistence layer.
3. Migrate on read first; optionally re-persist migrated snapshots on save.
4. Keep migration logs in release notes for QA traceability.

## Validation expectations

1. Generation path returns `schemaVersion`.
2. Save path preserves/increments version as defined by migration logic.
3. Load path returns valid snapshot for old and current versions.
