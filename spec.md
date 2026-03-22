# Grub Shala

## Current State
Full POS app with Motoko backend and React frontend. Backend has categories, menu items, and orders stored in non-stable `Map.empty()` variables -- these reset on every upgrade/restart, causing saves to appear successful but data to disappear immediately on re-render.

## Requested Changes (Diff)

### Add
- Stable storage for all backend state (categories, menuItems, orders, counters)

### Modify
- Backend: convert all mutable state to stable arrays; rebuild runtime maps from stable arrays on init
- Backend: add preupgrade/postupgrade hooks to serialize/deserialize maps to stable arrays

### Remove
- Nothing

## Implementation Plan
1. Rewrite main.mo to use stable arrays for categories, menuItems, orders, and counters
2. Load maps from stable arrays at init and save back on upgrade
3. No frontend changes needed
