# APCA Contrast Guide

## What is APCA?

APCA (Accessible Perceptual Contrast Algorithm) is the next-generation contrast metric developed by Andrew Somers (Myndex) for WCAG 3. It replaces the WCAG 2 contrast ratio with a perceptually accurate lightness-contrast value called **Lc**.

Key differences from WCAG 2:
- **Polarity-aware**: dark text on light bg has different Lc than light text on dark bg (human vision is asymmetric)
- **Font-size sensitive**: larger text needs less contrast
- **Perceptually linear**: Lc maps to perceived readability

## Lc (Lightness Contrast)

- Range: roughly -108 to +106
- **Positive Lc**: dark text on light background
- **Negative Lc**: light text on dark background
- We use **absolute |Lc|** for threshold checks — the sign indicates polarity, not quality

## Thresholds used in this system

| Use case | Min |Lc| | Font size context |
|----------|---------|-------------------|
| Body text | 75 | 16px+ regular weight |
| Secondary text | 60 | 14px+ |
| Tertiary / caption | 45 | 12px+ |
| Disabled / decorative | 30 | Non-interactive elements |
| Borders / dividers | 15 | Non-text visual elements |

These thresholds are conservative. APCA's reference table allows lower values for very large or bold text, but design systems should default to the more stringent values.

## Validated pairings

The contrast checker (`scripts/check-contrast.ts`) validates these pairings in both light and dark themes:

### Text pairings
- `text.primary` on `background.primary/secondary/tertiary` → |Lc| ≥ 75
- `text.secondary` on `background.primary/secondary` → |Lc| ≥ 60
- `text.tertiary` on `background.primary` → |Lc| ≥ 45
- `text.link` on `background.primary` → |Lc| ≥ 60
- `text.placeholder` on `background.primary` → |Lc| ≥ 45

### Action pairings
- `action.primaryContent` on `action.primary` → |Lc| ≥ 75
- `action.disabledContent` on `action.disabled` → |Lc| ≥ 30

### Status pairings
- `status.error` on `background.primary` → |Lc| ≥ 60
- `status.error` on `status.errorBackground` → |Lc| ≥ 60
- `status.warning` on `background.primary` → |Lc| ≥ 45 (relaxed — yellow is hard)
- `status.success/info` on `background.primary` → |Lc| ≥ 60

### Navigation pairings
- `tabBar.selected` on `tabBar.background` → |Lc| ≥ 75
- `tabBar.unselected` on `tabBar.background` → |Lc| ≥ 45

### Border visibility
- `border.default` on `background.primary` → |Lc| ≥ 15
- `border.strong` on `background.primary` → |Lc| ≥ 25
- `border.focus` on `background.primary` → |Lc| ≥ 60

## Running the checker

```bash
# Build first (checker reads from build/web/)
npm run build

# Run contrast check
npm run check:contrast
```

Exit code 0 = all pass, 1 = failures found. Output shows each failing pairing with actual Lc vs required minimum.

## APCA vs WCAG 2 contrast ratio

| WCAG 2 ratio | Approximate APCA |Lc| | Notes |
|-------------|-------------------|-------|
| 3:1 | ~45 | Large text minimum |
| 4.5:1 | ~60 | Normal text AA |
| 7:1 | ~75 | Normal text AAA |

These are rough equivalents — the relationship is non-linear and depends on the specific colors involved.

## Implementation

This repo uses the `apca-w3` npm package (the W3C reference implementation):

```typescript
import { APCAcontrast, sRGBtoY } from 'apca-w3';

const fgY = sRGBtoY([r, g, b]);  // 0-255 per channel
const bgY = sRGBtoY([r, g, b]);
const Lc = APCAcontrast(fgY, bgY);
```
