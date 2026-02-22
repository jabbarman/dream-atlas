import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_SCHEMA_VERSION = 1;

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value;
}

export class SQLiteAtlasStore {
  constructor({ dbPath }) {
    const resolvedPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

    this.db = new DatabaseSync(resolvedPath);
    this.closed = false;
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS atlas_snapshots (
        id TEXT PRIMARY KEY,
        schema_version INTEGER NOT NULL,
        snapshot_json TEXT NOT NULL,
        seed TEXT,
        cluster_mode TEXT,
        node_count INTEGER,
        cluster_count INTEGER,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        saved_at TEXT,
        is_saved INTEGER NOT NULL DEFAULT 0
      );
    `);
    this.db.exec(
      "CREATE INDEX IF NOT EXISTS idx_atlas_snapshots_updated_at ON atlas_snapshots(updated_at DESC);",
    );

    this.getStmt = this.db.prepare(`
      SELECT
        id,
        schema_version,
        snapshot_json,
        created_at,
        updated_at,
        saved_at,
        is_saved
      FROM atlas_snapshots
      WHERE id = ?
    `);

    this.upsertStmt = this.db.prepare(`
      INSERT INTO atlas_snapshots (
        id,
        schema_version,
        snapshot_json,
        seed,
        cluster_mode,
        node_count,
        cluster_count,
        created_at,
        updated_at,
        saved_at,
        is_saved
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        schema_version = excluded.schema_version,
        snapshot_json = excluded.snapshot_json,
        seed = excluded.seed,
        cluster_mode = excluded.cluster_mode,
        node_count = excluded.node_count,
        cluster_count = excluded.cluster_count,
        updated_at = excluded.updated_at,
        saved_at = excluded.saved_at,
        is_saved = excluded.is_saved
    `);

    this.listStmt = this.db.prepare(`
      SELECT
        id,
        schema_version AS schemaVersion,
        seed,
        cluster_mode AS clusterMode,
        node_count AS nodeCount,
        cluster_count AS clusterCount,
        created_at AS createdAt,
        updated_at AS updatedAt,
        saved_at AS savedAt,
        is_saved AS isSaved
      FROM atlas_snapshots
      ORDER BY updated_at DESC
      LIMIT ? OFFSET ?
    `);

    this.countStmt = this.db.prepare("SELECT COUNT(*) AS total FROM atlas_snapshots");
  }

  upsert(snapshot, { markSaved = false } = {}) {
    const now = new Date().toISOString();
    const source = safeObject(snapshot);
    const existing = this.getStmt.get(source.id);
    const createdAt = existing?.created_at ?? now;
    const schemaVersion = toInt(source.schemaVersion, DEFAULT_SCHEMA_VERSION);
    const storedSnapshot = {
      ...source,
      schemaVersion,
      id: source.id,
    };

    const savedAt = markSaved ? source.savedAt ?? now : source.savedAt ?? existing?.saved_at ?? null;
    const isSaved = markSaved || Boolean(savedAt) ? 1 : 0;
    const nodeCount = toInt(source.nodeCount, Array.isArray(source.nodes) ? source.nodes.length : 0);
    const clusterCount = toInt(
      source.clusters?.length,
      Array.isArray(source.clusters) ? source.clusters.length : 0,
    );

    this.upsertStmt.run(
      source.id,
      schemaVersion,
      JSON.stringify(storedSnapshot),
      typeof source.seed === "string" ? source.seed : null,
      typeof source.clusterMode === "string" ? source.clusterMode : null,
      nodeCount,
      clusterCount,
      createdAt,
      now,
      savedAt,
      isSaved,
    );

    return {
      ...storedSnapshot,
      savedAt: savedAt ?? storedSnapshot.savedAt,
    };
  }

  get(id) {
    const row = this.getStmt.get(id);
    if (!row) return null;

    let snapshot;
    try {
      snapshot = JSON.parse(row.snapshot_json);
    } catch {
      return null;
    }
    return {
      ...snapshot,
      schemaVersion: toInt(snapshot.schemaVersion, row.schema_version),
      savedAt: snapshot.savedAt ?? row.saved_at ?? null,
    };
  }

  list({ limit = 50, offset = 0 } = {}) {
    const safeLimit = Math.min(Math.max(toInt(limit, 50), 1), 200);
    const safeOffset = Math.max(toInt(offset, 0), 0);
    const rows = this.listStmt.all(safeLimit, safeOffset);
    const total = this.countStmt.get()?.total ?? 0;

    return {
      total,
      limit: safeLimit,
      offset: safeOffset,
      items: rows.map((row) => ({
        id: row.id,
        schemaVersion: row.schemaVersion,
        seed: row.seed,
        clusterMode: row.clusterMode,
        nodeCount: row.nodeCount,
        clusterCount: row.clusterCount,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        savedAt: row.savedAt,
        isSaved: Boolean(row.isSaved),
      })),
    };
  }

  close() {
    if (this.closed) return;
    this.closed = true;
    this.db.close();
  }
}
