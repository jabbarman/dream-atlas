# Fragment Sample Spec (Spike #1)

Owner: Product  
Purpose: Provide representative text fragments for clustering/map validation.

## Dataset size
- Minimum: 50 fragments
- Preferred: 80–120 fragments

## Required attributes per fragment
- `id` (stable unique id)
- `text` (1–3 sentences)
- `theme_tags` (1–3 tags)
- `intensity` (1–5)
- `timestamp_bucket` (e.g., dawn/day/night or date bucket)
- `source_type` (journal, note, voice-transcribed, etc.)

## Distribution constraints
- At least 6 distinct themes
- Intensity spread across 1–5
- Include 10–15 ambiguous fragments (cross-theme overlap)
- Include 5 noisy/low-signal fragments for robustness checks
