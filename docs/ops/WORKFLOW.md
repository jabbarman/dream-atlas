# Delivery Workflow: Discovery → POC → MVP

## Phase 1: Discovery
### Objectives
- Validate problem and target users
- Define outcomes, constraints, and initial scope

### Required outputs
- Concept brief
- Problem statement
- User segments / JTBD
- Success metrics (north star + guardrails)
- Prioritized opportunity backlog
- Initial risk register

### Gate criteria
- Clear user and pain validated
- Measurable outcomes agreed
- Scope boundaries defined

## Phase 2: POC
### Objectives
- Prove technical feasibility on the critical path
- Reduce highest-risk unknowns

### Required outputs
- Architecture options + selected approach
- Spike results and evidence
- Prototype covering critical path
- Feasibility report with known limits

### Gate criteria
- Critical technical risks reduced
- Feasibility accepted by PM + Tech + QA
- MVP estimate confidence acceptable

## Pause/Resume Guardrail (cross-phase)
- Pause is state-driven (`execution_state: paused-token-guard`) and must capture a task-agnostic `resume_context` in `docs/status/PROJECT-STATE.yaml`.
- Resume is state-driven (not task-name driven): when guard thresholds recover, controller flips state back to active and dispatches `resume_context.dispatch_message`.
- The resumed work item should be derived from current project state/docs (`next_action`), so this works for any phase/task.

## Phase 3: MVP
### Objectives
- Build smallest valuable release
- Validate real usage with quality and observability

### Required outputs
- Locked MVP scope
- Implementation plan + sprint backlog
- Functional increment(s)
- QA test report + release checklist
- Launch and post-launch measurement plan

### Gate criteria
- Acceptance criteria met
- No critical defects open
- Metrics/telemetry in place
