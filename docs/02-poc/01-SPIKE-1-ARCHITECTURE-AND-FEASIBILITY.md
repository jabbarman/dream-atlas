# POC Spike #1 — Architecture Options + Feasibility Criteria

## Goal
Prove the critical path: **text fragments → meaningful 2D atlas generation → fluid exploration UX** with explainable clustering and private-by-default storage.

## Decision Drivers
- Fastest route to a credible POC demo
- Explainability of map placement/grouping
- Low operational complexity
- Easy evolution toward MVP
- Privacy-sensitive defaults

## Architecture options (shortlist)

### Option A (recommended): React + PixiJS (2D WebGL) + Node API + SQLite/Postgres-ready schema
**Shape**
- Frontend: React shell + PixiJS rendering layer for map interactions
- Backend: Node/TypeScript API (atlas generation + persistence)
- Data: SQLite for POC, schema compatible with Postgres migration
- Clustering: deterministic rules first (tag/theme/time/intensity), optional embedding-assisted enrichment behind feature flag

**Pros**
- Strong 2D performance with manageable complexity
- Good developer velocity; straightforward debugging
- Migration path to richer rendering and larger datasets

**Cons**
- Slightly more setup than pure Canvas
- Needs careful scene/state boundary design in React

---

### Option B: React + native Canvas2D + Node API + SQLite
**Shape**
- React + Canvas2D for rendering
- Node API + SQLite persistence
- Rule-based clustering only for POC

**Pros**
- Smallest implementation footprint
- Very easy to reason about and iterate

**Cons**
- Performance/feature ceiling arrives sooner
- More manual work for effects/interaction polish

---

### Option C: Phaser scene app + thin API + SQLite
**Shape**
- Phaser-driven scene and camera/navigation
- Thin Node API for save/load + generation orchestration

**Pros**
- Excellent interaction primitives and camera model
- Rapid prototyping feel for exploratory UX

**Cons**
- Product-app patterns can feel less natural than game-scene patterns
- Risk of over-investing in visual behavior over product workflows

## Weighted feasibility criteria
Scale: 1 (poor) to 5 (excellent). Weights sum to 100.

| Criterion | Weight | A | B | C |
|---|---:|---:|---:|---:|
| Critical-path delivery speed | 25 | 4 | 5 | 3 |
| Interaction smoothness at 500+ nodes | 20 | 4 | 3 | 5 |
| Explainability of map logic | 15 | 4 | 5 | 3 |
| Maintainability toward MVP | 20 | 5 | 3 | 3 |
| Privacy/data simplicity | 10 | 4 | 4 | 4 |
| Team implementation confidence | 10 | 4 | 4 | 3 |
| **Weighted total (/500)** | **100** | **425** | **405** | **355** |

## Selected approach
**Select Option A** for Spike #1.

Why:
1. Best balance of speed + durability for MVP progression
2. Handles map interaction demands without committing to game-engine patterns
3. Keeps clustering logic explainable while preserving an AI-enrichment path later

## Spike #1 scope (what we must prove)
1. Input 20–100 sample fragments and generate stable spatial layout
2. Render map with pan/zoom + node selection at interactive framerate
3. Show at least 2 meaningful clustering modes (e.g., theme + intensity)
4. Save/load atlas state and metadata locally
5. Produce short feasibility report with limits, bottlenecks, and go/no-go recommendation

## Evidence required for POC gate contribution
- Demo capture (video/gif) of critical flow
- Latency snapshot (generation and interaction)
- Crash/bug log for core flows
- Known limitations + mitigation options

## Role-based implementation tasks

### PM
- Lock Spike #1 acceptance criteria and timeline window
- Define review checkpoint cadence (daily async + end-of-spike review)

### Product
- Provide representative sample fragment set (at least 50 entries)
- Define “meaningful map” heuristics for evaluation

### Design
- Define node/region visual vocabulary (states, selection, emphasis)
- Deliver interaction spec for pan/zoom/select and info panel behavior

### Tech Lead
- Finalize Option A technical blueprint and module boundaries
- Set coding standards + performance budget targets for spike

### Dev
- Implement data model + generation pipeline + render integration
- Add save/load and deterministic seed behavior

### QA
- Build spike test checklist (core flow + edge cases)
- Validate stability and capture defects with reproduction notes

## Exit criteria (Spike #1 done)
- All 5 spike scope proofs completed
- Weighted feasibility re-score confirms Option A remains acceptable (>=400/500)
- No unresolved critical defects in core flow
- Feasibility report signed off by PM + Tech Lead + QA
