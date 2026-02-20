# Interaction Spec (Pan/Zoom/Select/Info Panel)

Owner: Design

## Core interactions
- Pan: click-drag / touch-drag
- Zoom: mouse wheel / pinch
- Select node: click/tap on node
- Deselect: click empty space / ESC

## Behavior rules
- Selection persists through pan/zoom.
- Selected node keeps screen-space affordance (ring/marker).
- Info panel opens on select, updates on selection change, closes on deselect.
- Hover is non-destructive and does not change selection.

## Accessibility baseline
- Keyboard support for node focus traversal (next/prev)
- Visible focus state distinct from hover/selection
