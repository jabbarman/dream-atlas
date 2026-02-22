import express from "express";
import cors from "cors";
import { performance } from "node:perf_hooks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateAtlasSnapshot, validateGenerateRequest } from "./atlas/generateAtlas.js";
import { SQLiteAtlasStore } from "./persistence/sqliteAtlasStore.js";

const app = express();
const port = process.env.PORT || 8787;
const defaultDbPath = path.resolve(fileURLToPath(new URL("../data/atlas.sqlite", import.meta.url)));
const atlasStore = new SQLiteAtlasStore({
  dbPath: process.env.ATLAS_DB_PATH || defaultDbPath,
});

function toMs(value) {
  return Number(value.toFixed(3));
}

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "dream-atlas-api" });
});

app.get("/atlas", (req, res) => {
  const limit = Number.parseInt(req.query.limit ?? "50", 10);
  const offset = Number.parseInt(req.query.offset ?? "0", 10);
  res.json(atlasStore.list({ limit, offset }));
});

app.post("/atlas/generate", (req, res) => {
  const requestStart = performance.now();
  const validation = validateGenerateRequest(req.body);
  if (!validation.ok) {
    res.status(400).json({
      error: "Validation failed",
      details: validation.errors,
    });
    return;
  }

  const snapshot = generateAtlasSnapshot(validation.value);
  const persisted = atlasStore.upsert(snapshot, { markSaved: false });
  snapshot.perf = {
    ...persisted.perf,
    requestMs: toMs(performance.now() - requestStart),
  };
  snapshot.schemaVersion = persisted.schemaVersion;
  snapshot.savedAt = persisted.savedAt;
  res.json(snapshot);
});

app.get("/atlas/:id", (req, res) => {
  const snapshot = atlasStore.get(req.params.id);
  if (!snapshot) {
    res.status(404).json({ error: "Atlas not found" });
    return;
  }
  res.json(snapshot);
});

app.post("/atlas/:id/save", (req, res) => {
  const saveStart = performance.now();
  const atlasId = req.params.id;
  const snapshot = req.body ?? {};

  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    res.status(400).json({ error: "Snapshot body must be an object" });
    return;
  }

  const persisted = atlasStore.upsert(
    {
      ...snapshot,
      id: atlasId,
      schemaVersion: Number.parseInt(snapshot.schemaVersion ?? "1", 10) || 1,
      savedAt: new Date().toISOString(),
    },
    { markSaved: true },
  );
  res.json({
    ok: true,
    id: atlasId,
    schemaVersion: persisted.schemaVersion,
    perf: { saveMs: toMs(performance.now() - saveStart) },
  });
});

app.post("/atlas/:id/load", (req, res) => {
  const loadStart = performance.now();
  const snapshot = atlasStore.get(req.params.id);
  if (!snapshot) {
    res.status(404).json({ error: "Atlas not found" });
    return;
  }
  res.json({
    ...snapshot,
    perf: {
      ...snapshot.perf,
      loadMs: toMs(performance.now() - loadStart),
    },
  });
});

app.listen(port, () => {
  console.log(`Dream Atlas API listening on :${port}`);
});

function closeStore() {
  atlasStore.close();
}

let isShuttingDown = false;

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  closeStore();
  process.exit(0);
}

process.on("exit", closeStore);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
