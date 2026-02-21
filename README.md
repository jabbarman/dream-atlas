# Dream Atlas

Dream Atlas is a procedural memory map: it turns short text fragments (dreams, memories, ideas, journal notes) into a navigable 2D atlas so patterns and relationships are easier to explore than in linear notes.

## What the application is

- Input: personal text fragments with tags, intensity, and time bucket metadata.
- Generation: deterministic clustering + seeded spatial layout.
- Output: an interactive atlas of nodes and regions you can pan, zoom, and inspect.
- Goal: help users discover connections and emotional geography in reflective or creative material.

This project is a creative and exploratory tool. It is not a clinical or diagnostic product.

## Current POC capabilities

- Generate an atlas from a 50-fragment representative sample set.
- Deterministic output for same seed + same input.
- Cluster modes: `theme` and `intensity`.
- PixiJS map rendering with pan/zoom/select interaction.
- API endpoints for generate, save, and load snapshots.

## Architecture (current)

- `apps/web` - React + Vite + PixiJS frontend
- `services/api` - Node + Express API
- `docs` - Discovery, POC specs, QA artifacts, and project status

Core flow:
`fragments -> cluster -> seeded layout -> render -> explore -> save/load`

## Quick start

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787/health

## API (POC)

- `POST /atlas/generate` - generate deterministic snapshot from fragment payload
- `GET /atlas/:id` - retrieve generated snapshot from in-memory store
- `POST /atlas/:id/save` - save snapshot
- `POST /atlas/:id/load` - load snapshot

## Product and delivery docs

For implementation status and project governance:

1. `docs/status/PROJECT-STATE.yaml`
2. `docs/status/LIVE-STATUS.md`
3. `docs/02-poc/10-IMPLEMENTATION-CHECKLIST.md`
4. `docs/02-poc/12-QA-TEST-MATRIX.md`
5. `docs/ops/CODEX-CLI-WORKFLOW.md`
