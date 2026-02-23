# MVP-12 Copy and Privacy Pass

Date (UTC): 2026-02-23T23:10:23Z  
Owner: Product + PM

## Objective

Close MVP-12 by aligning product-facing copy and repository-facing copy with explicit privacy and non-clinical boundaries.

## Changes applied

1. UI boundary copy added at the top of the app:
   - Creative exploration framing only (no therapy/diagnosis/medical advice).
   - Privacy note clarifying data is stored in configured backend and should run in controlled environments.
2. README updated with:
   - dedicated privacy/non-clinical boundaries section,
   - latest MVP capabilities (Slice 3 + Slice 4),
   - import endpoint documentation (`POST /atlas/import`),
   - updated MVP QA/release doc links.
3. Discovery risk register updated:
   - R-04 (clinical misperception) moved to mitigated.
   - R-06 (privacy expectations) moved to mitigated.

## Validation

1. `npm run build:web` passes after UI copy additions.
2. Manual copy review confirms no clinical/therapeutic claims in product-facing summary text.
3. MVP release checklist updated to remove MVP-12 open blocker.

## Decision

**MVP-12 PASS** — privacy/non-clinical copy alignment is complete; final release sign-off can proceed.
