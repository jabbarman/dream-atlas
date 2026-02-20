# Meaningful Map Heuristics

Owner: Product

## Heuristic set
1. **Semantic neighborhood**: fragments with shared themes tend to be co-located.
2. **Intensity layering**: high-intensity fragments are visually distinguishable without obscuring grouping.
3. **Continuity under pan/zoom**: users can maintain orientation and recover context quickly.
4. **Cluster legibility**: users can name/describe major regions with low ambiguity.
5. **Deterministic trust**: same input + seed reproduces equivalent structure.

## Acceptance thresholds (POC)
- >=80% of sample set appears in a cluster judged “plausible” by Product+QA review.
- Users can identify top 3 regions with <=1 mismatch in blind walkthrough.
- Re-run drift (same seed) should produce no major region relocation.
