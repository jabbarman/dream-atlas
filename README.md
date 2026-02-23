# Dream Atlas

Dream Atlas is a procedural memory map: it turns short text fragments (dreams, memories, ideas, journal notes) into a navigable 2D atlas so patterns and relationships are easier to explore than in linear notes.

## What the application is

- Input: personal text fragments with tags, intensity, and time bucket metadata.
- Generation: deterministic clustering + seeded spatial layout.
- Output: an interactive atlas of nodes and regions you can pan, zoom, and inspect.
- Goal: help users discover connections and emotional geography in reflective or creative material.

This project is a creative and exploratory tool. It is not a clinical or diagnostic product.

## Privacy and non-clinical boundaries

- Dream Atlas is for reflective/creative exploration, not treatment, diagnosis, or crisis support.
- Fragment and atlas data are stored in the backend configured for your runtime environment.
- For local development, data remains on your machine unless you deploy the API elsewhere.
- Use environments you control and avoid uploading highly sensitive personal information.

## Current POC capabilities

- Generate an atlas from a 50-fragment representative sample set.
- Deterministic output for same seed + same input.
- Cluster modes: `theme` and `intensity`.
- PixiJS map rendering with pan/zoom/select interaction.
- API + UI snapshot persistence flow with saved-atlas picker, generate/save/load, and telemetry export.
- MVP Slice 2 ingestion flow: manual fragment entry and JSON paste/import for custom generation.
- MVP Slice 3 discovery flow: text/tag search, intensity/time filters, and related-node highlighting.
- MVP Slice 4 portability flow: atlas JSON export/import roundtrip.

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

- `GET /atlas` - list stored atlas snapshots (supports `limit` and `offset`)
- `POST /atlas/generate` - generate deterministic snapshot from fragment payload
- `GET /atlas/:id` - retrieve a stored snapshot by id
- `POST /atlas/:id/save` - save snapshot
- `POST /atlas/:id/load` - load snapshot
- `POST /atlas/import` - import atlas JSON snapshot payload

## Product and delivery docs

For implementation status and project governance:

1. `docs/status/PROJECT-STATE.yaml`
2. `docs/status/LIVE-STATUS.md`
3. `docs/02-poc/10-IMPLEMENTATION-CHECKLIST.md`
4. `docs/02-poc/12-QA-TEST-MATRIX.md`
5. `docs/02-poc/15-SPIKE-1-SIGNOFF-RECORD.md`
6. `docs/03-mvp/01-MVP-SCOPE.md`
7. `docs/03-mvp/02-MVP-IMPLEMENTATION-PLAN.md`
8. `docs/03-mvp/05-SLICE-1-QA-REPORT.md`
9. `docs/03-mvp/06-SLICE-2-QA-REPORT.md`
10. `docs/03-mvp/07-SLICE-3-QA-REPORT.md`
11. `docs/03-mvp/08-MVP-REGRESSION-MATRIX.md`
12. `docs/03-mvp/09-SLICE-4-QA-REPORT.md`
13. `docs/03-mvp/10-MVP-RELEASE-CHECKLIST.md`
