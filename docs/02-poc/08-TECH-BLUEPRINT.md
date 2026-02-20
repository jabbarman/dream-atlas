# Tech Blueprint (Option A)

Owner: Tech Lead  
Status: Kickoff-ready (POC Spike #1)

## 1) System shape

- **Frontend**: React + PixiJS
- **Backend**: Node/TypeScript API
- **Persistence**: SQLite (POC), schema-compatible with Postgres
- **Core path**: `fragments -> cluster -> layout -> render -> explore -> save/load`

## 2) Module boundaries

### `ingest`
- Parse fragment payloads
- Validate required fields: `id`, `text`, `createdAt` (optional), `tags[]` (optional), `intensity` (optional)
- Normalize into `Fragment` domain model

### `cluster`
- Deterministic grouping modes:
  1. `theme` (tag+keyword heuristics)
  2. `intensity` (bucket by emotional intensity)
  3. `time` (optional fallback mode)
- Output: cluster assignments + explainability annotations

### `layout`
- Seeded 2D layout
- Cluster-aware placement (cluster center + local jitter)
- Collision/light-overlap mitigation
- Stable position output for same seed + input set

### `render`
- PixiJS scene lifecycle
- Node + region rendering
- Selection/highlight states
- Camera controls (pan/zoom)

### `state`
- UI state: selected node, cluster mode, filters, camera transform
- Deterministic re-hydration from saved atlas state

### `persistence`
- Save/load atlas snapshot (data + layout + UI context)
- Atlas metadata (seed, createdAt, generation timings)

## 3) Data contracts (POC)

### Fragment
```ts
interface Fragment {
  id: string;
  text: string;
  tags?: string[];
  createdAt?: string; // ISO
  intensity?: number; // 1-5
}
```

### AtlasNode
```ts
interface AtlasNode {
  id: string;
  fragmentId: string;
  x: number;
  y: number;
  clusterId: string;
}
```

### AtlasSnapshot
```ts
interface AtlasSnapshot {
  id: string;
  seed: string;
  clusterMode: "theme" | "intensity" | "time";
  nodes: AtlasNode[];
  clusters: { id: string; label: string; reason: string }[];
  uiState: { selectedNodeId?: string; zoom: number; panX: number; panY: number };
  perf: { generationMs: number };
}
```

## 4) API shape (POC)

- `POST /atlas/generate`
  - Input: `{ fragments: Fragment[], seed?: string, clusterMode?: string }`
  - Output: `AtlasSnapshot`
- `GET /atlas/:id`
  - Output: `AtlasSnapshot`
- `POST /atlas/:id/save`
  - Input: `AtlasSnapshot`
  - Output: `{ ok: true }`
- `POST /atlas/:id/load`
  - Output: `AtlasSnapshot`

## 5) Performance budgets (initial)

- Generate from 50 fragments: **<= 1500ms** target
- Render + interaction at 50-100 nodes: no visible lockups; smooth pan/zoom
- Save/load operation: **<= 500ms** target on local dev

## 6) Instrumentation

- Add timers for:
  - ingest
  - cluster
  - layout
  - render init
  - total generation
- Persist last 20 generation metrics in local debug panel/log

## 7) Technical principles

1. Determinism first (seeded generation)
2. Explainability > opaque magic
3. Private-by-default storage
4. Thin backend contract; avoid premature complexity
5. Optional embedding enrichment behind feature flag only

## 8) Risks and mitigations

- **Risk**: map looks random, not meaningful  
  **Mitigation**: expose cluster reason labels + deterministic mode toggles
- **Risk**: UI jank with >100 nodes  
  **Mitigation**: pooled sprites + throttle expensive redraws
- **Risk**: schema churn  
  **Mitigation**: version snapshots with `schemaVersion`

## 9) Exit conditions for blueprint acceptance

- Data contracts agreed by Dev + QA
- API shape agreed by Product + Tech Lead
- Perf budgets accepted as POC baseline
- No unresolved blocker on module ownership
