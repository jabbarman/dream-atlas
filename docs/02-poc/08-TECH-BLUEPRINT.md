# Tech Blueprint (Option A)

Owner: Tech Lead

## Module boundaries
- `ingest`: normalize fragments + validate schema
- `cluster`: deterministic clustering logic (theme/intensity/time)
- `layout`: 2D placement and collision/light-overlap handling
- `render`: PixiJS scene orchestration
- `state`: selection/filter/camera/store
- `persistence`: save/load atlas snapshots

## API shape (POC)
- `POST /atlas/generate`
- `GET /atlas/:id`
- `POST /atlas/:id/save`
- `POST /atlas/:id/load`

## Technical principles
- Determinism first (seeded generation)
- Explainability over model complexity
- Feature-flag optional embedding enrichment
