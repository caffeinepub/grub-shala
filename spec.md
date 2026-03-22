# Grub Shala

## Current State
CartSidebar has customer name, mobile, tax toggle, and place order fields. No outlet selection exists.

## Requested Changes (Diff)

### Add
- Outlet dropdown in the CartSidebar (order page), above or within the Customer Details section
- Default list of GrabShala outlets (e.g. Main Branch, Branch 2, Branch 3)
- Outlet is required before placing an order

### Modify
- CartSidebar: add outlet state, render Select dropdown, validate on place order

### Remove
- Nothing removed

## Implementation Plan
1. Add `selectedOutlet` state to CartSidebar
2. Render a Select dropdown with default outlet options in Customer Details section
3. Validate outlet is selected before allowing place order
4. Show outlet on the print receipt
