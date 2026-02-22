# MVP Backlog (Draft v1)

Date (UTC): 2026-02-22  
Phase: MVP-prep  
Source: Discovery opportunities + completed POC evidence

| ID | Item | Priority | Owner | Depends on | Done when |
|---|---|---|---|---|---|
| MVP-01 | Durable snapshot store (SQLite) | P0 | Dev | None | Save/load survives API restart |
| MVP-02 | Atlas listing API + UI picker | P0 | Dev | MVP-01 | User can browse and load prior atlases |
| MVP-03 | Snapshot schema version field | P0 | Tech Lead | MVP-01 | Version is stored and validated on load |
| MVP-04 | Manual fragment entry form | P0 | Frontend | None | User can add/edit fragments in UI |
| MVP-05 | JSON paste/import flow | P1 | Frontend + API | MVP-04 | User imports fragment set with validation feedback |
| MVP-06 | Search by text/tag | P1 | Frontend | MVP-04 | Results narrow visibly and are clearable |
| MVP-07 | Filters (intensity/time bucket) | P1 | Frontend | MVP-04 | Filtered atlas remains interactive and stable |
| MVP-08 | Related-node highlighting | P1 | Frontend | MVP-06 | Selected context highlights related nodes |
| MVP-09 | Atlas JSON export | P1 | Dev | MVP-01 | Exported snapshot re-imports without data loss |
| MVP-10 | MVP QA matrix + regression suite | P0 | QA | MVP-01..MVP-09 | All P0 scenarios executed with recorded outcomes |
| MVP-11 | Release checklist + rollback notes | P0 | PM + Tech Lead | MVP-10 | Release packet ready for go/no-go meeting |
| MVP-12 | Privacy/non-clinical copy pass | P1 | Product | None | App copy and README/docs align with boundaries |

## Initial execution order

1. MVP-01, MVP-02, MVP-03
2. MVP-04, MVP-05
3. MVP-06, MVP-07, MVP-08
4. MVP-09, MVP-10, MVP-11, MVP-12
