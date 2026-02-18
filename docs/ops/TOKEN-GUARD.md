# Token Budget Guard (gpt-5.3-codex)

## Goal
Avoid running out of model budget/context mid-stream by pausing at safe checkpoints and notifying via WhatsApp.

## Check cadence
Run `session_status`:
- Before starting a major ticket
- At each milestone checkpoint
- Immediately after completing a ticket

## Thresholds
### Warning state
- Day budget left < 30% **or** time left < 2h
- Context usage > 75%

Action: tighten scope for current iteration and prepare pause candidate.

### Pause state
- Day budget left < 20% **or** time left < 1h
- Context usage > 85%

Action: **do not start new work**. Complete only safe-stop tasks:
1. Update `docs/status/PROJECT-STATE.yaml`
2. Write explicit resume instructions
3. Send WhatsApp alert
4. Wait for user instruction

## WhatsApp alert format
"Dream Atlas paused at safe checkpoint. Reason: <threshold hit>. Last completed: <item>. Next resume step: <step>."

## Safe-stop definition
A safe-stop is a state where:
- No partial schema migrations are pending
- No half-written cross-file refactor without notes
- A human can resume from repository docs without hidden context
