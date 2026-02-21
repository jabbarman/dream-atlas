import express from "express";
import cors from "cors";
import { generateAtlasSnapshot, validateGenerateRequest } from "./atlas/generateAtlas.js";

const app = express();
const port = process.env.PORT || 8787;
const atlasStore = new Map();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "dream-atlas-api" });
});

app.post("/atlas/generate", (req, res) => {
  const validation = validateGenerateRequest(req.body);
  if (!validation.ok) {
    res.status(400).json({
      error: "Validation failed",
      details: validation.errors,
    });
    return;
  }

  const snapshot = generateAtlasSnapshot(validation.value);
  atlasStore.set(snapshot.id, snapshot);
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
  const atlasId = req.params.id;
  const snapshot = req.body ?? {};

  if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) {
    res.status(400).json({ error: "Snapshot body must be an object" });
    return;
  }

  atlasStore.set(atlasId, {
    ...snapshot,
    id: atlasId,
    savedAt: new Date().toISOString(),
  });
  res.json({ ok: true, id: atlasId });
});

app.post("/atlas/:id/load", (req, res) => {
  const snapshot = atlasStore.get(req.params.id);
  if (!snapshot) {
    res.status(404).json({ error: "Atlas not found" });
    return;
  }
  res.json(snapshot);
});

app.listen(port, () => {
  console.log(`Dream Atlas API listening on :${port}`);
});
