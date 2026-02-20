import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 8787;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "dream-atlas-api" });
});

app.post("/atlas/generate", (req, res) => {
  const { fragments = [], seed = "default", clusterMode = "theme" } = req.body ?? {};

  res.json({
    id: "atlas-dev-1",
    seed,
    clusterMode,
    nodeCount: fragments.length,
    message: "POC stub response",
  });
});

app.listen(port, () => {
  console.log(`Dream Atlas API listening on :${port}`);
});
