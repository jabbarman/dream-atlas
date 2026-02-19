# WhatsApp Reporting Protocol

## Purpose
Send concise WhatsApp updates when major milestones are reached or major blockers are resolved.

## Trigger events
1. Major milestone completed (Discovery gate, POC gate, MVP-ready, launch-ready)
2. Major problem resolved (high-impact blocker overcome)

## Message format
"Dream Atlas update: <event>. Current phase: <phase>. Next: <next step>."

## Source of truth
- `docs/status/PROJECT-STATE.yaml` for current phase/status and event state
- `docs/status/REPORTING-STATE.yaml` for deduplication (`sent_events`)
- `docs/status/REPORT-LOG.md` for audit trail

## Anti-spam rule
Do not send duplicate reports for the same event ID.
