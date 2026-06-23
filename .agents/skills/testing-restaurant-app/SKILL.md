---
name: testing-restaurant-app
description: End-to-end testing procedures for the L'Elegance premium restaurant website. Use when verifying booking flow, menu filtering, scanner, or theme toggle functionality.
---

# Testing the L'Elegance Restaurant App

## Overview

This is a React SPA deployed at https://build-sfoqmkeu.devinapps.com with no backend — all data persists in localStorage.

## Prerequisites

- No credentials needed (public frontend)
- No backend or API to configure
- Data is stored in localStorage under key `luxury_restaurant_bookings`
- Clear localStorage before testing for a clean state

## Key Test Flows

### 1. Booking E2E Flow (Critical Path)

This is the primary flow that exercises the most code:

1. Navigate to `/booking`
2. Select a date → time slots appear (each shows "X left" availability)
3. Select a time slot → click "Next"
4. Enter guests count and special requests → click "Next"
5. Enter name, email, phone → click "Confirm Reservation"
6. **Assert**: Success modal with QR code SVG, reference ID, booking details
7. Close modal → navigate to `/reservations`
8. **Assert**: Booking card visible with correct details and green "confirmed" badge
9. Expand card → verify reference ID, email, phone, special requests match
10. Copy booking ID from localStorage: `JSON.parse(localStorage.getItem('luxury_restaurant_bookings'))[0].id`
11. Navigate to `/scanner`
12. Paste ID in manual entry → click "Verify"
13. **Assert**: Green "Booking Verified!" modal (first scan)
14. Close and verify same ID again
15. **Assert**: Yellow "Already Verified" modal (repeat scan — proves `markScanned()` works)
16. Try invalid ID (e.g., "fake-id-12345")
17. **Assert**: Red "Not Found" error modal
18. Navigate to `/reservations` → expand card → click "Cancel"
19. **Assert**: Confirmation dialog appears
20. Confirm cancellation
21. **Assert**: Status badge changes from green "confirmed" to red "cancelled"

**Key adversarial assertion**: The scanner MUST distinguish first scan (green) from repeat scan (yellow). If both show green, `markScanned()` is broken.

### 2. Menu Filtering

1. Navigate to `/menu` — all 16 dishes visible
2. Click a category filter (e.g., "Desserts") → only items of that category shown
3. Click "All" → all 16 dishes restored
4. Type in search bar (e.g., "wagyu") → only matching dish visible
5. Type non-existent term → "No dishes found" empty state

### 3. Theme Toggle

1. Click sun/moon icon in navbar
2. **Known issue**: As of initial implementation, the toggle changes the icon but does NOT visually change page backgrounds. Pages hard-code `bg-charcoal` instead of using Tailwind `dark:` variants. Check if this has been fixed.

## Testing Tips

- **Booking IDs**: Use browser console to extract from localStorage rather than trying to copy from the UI
- **Availability**: Each time slot has a max of 10 tables. After 10 bookings for the same date+time, the slot should show as full
- **Scanner page**: The camera feed requires HTTPS or localhost. For testing, always use the manual entry field
- **Animations**: Pages use Framer Motion — wait briefly after navigation for animations to complete before asserting
- **Routes**: Home `/`, Menu `/menu`, Booking `/booking`, Reservations `/reservations`, Scanner `/scanner`, Gallery `/gallery`, About `/about`

## Devin Secrets Needed

None — this is a fully public frontend with no authentication.
