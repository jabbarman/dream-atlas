# Dream Atlas

Team-operated product delivery workspace for taking the concept from **Discovery → POC → MVP** with clear governance, role ownership, and quality gates.

## Operating model

- Specialized role leads (PM, Product, Design, Tech, Dev, QA)
- Shared artifact-first workflow (docs are the source of truth)
- Stage gates at the end of each phase

Start here:

1. `docs/ops/TEAM-CHARTER.md`
2. `docs/ops/AGENT-TOPOLOGY.md`
3. `docs/ops/WORKFLOW.md`
4. `docs/ops/CODEX-CLI-WORKFLOW.md`
5. `docs/status/PROJECT-STATE.yaml`

## Product scaffold (POC codebase)

A runnable scaffold is now in place:
- `apps/web` → React + PixiJS frontend
- `services/api` → Node/Express API

Quick start:

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:8787/health
