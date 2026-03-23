# OKLCH Scale Generation Guide

## Why OKLCH?

OKLCH (Oklab Lightness-Chroma-Hue) is a perceptually uniform color space — equal numeric changes produce equal perceived differences. Unlike HSL, where L=50 looks wildly different for blue vs yellow, OKLCH's lightness channel faithfully represents perceived brightness.

This makes it ideal for design system palettes: steps feel evenly spaced, and you can predict contrast relationships from lightness values alone.

## Color model

| Channel | Range | Meaning |
|---------|-------|---------|
| **L** (Lightness) | 0–1 | 0 = black, 1 = white. Perceptually linear. |
| **C** (Chroma) | 0–~0.4 | Colorfulness. 0 = neutral grey. Higher = more vivid. |
| **H** (Hue) | 0–360 | Hue angle. 0/360 = red, 90 = yellow, 180 = green, 270 = blue. |

## Scale types in this repo

### Neutral scale (grey)

- **Fixed hue** (255) with minimal chroma (0.005) — barely-there coolness, reads as neutral.
- Chroma is constant in the mid-range and tapers at extremes (near-white and near-black have less perceptible hue).
- Lightness uses **non-linear control points** — more resolution at the light end (backgrounds, borders) and coarser at the dark end.

### Feedback scales (error, warning, success, info)

- **Fixed hue** per scale, high chroma peaking at the hero step (600).
- Chroma follows a bell curve: 10% of max at step 100 (light tint), 100% at step 600, 50% at step 900 (dark shade).
- Lightness is **anchored at the hero step** — where maximum chroma occurs for that hue in sRGB. Steps above and below are evenly distributed.

## Lightness control points

Used for the grey scale and as defaults:

| Step | L | Role |
|------|---|------|
| 0 | 1.000 | White |
| 50 | 0.985 | Off-white background |
| 100 | 0.965 | Subtle background |
| 200 | 0.940 | Light border |
| 300 | 0.885 | Border |
| 400 | 0.780 | Mid-light |
| 500 | 0.710 | Mid |
| 600 | 0.640 | Mid-dark |
| 700 | 0.565 | Dark |
| 800 | 0.470 | Darker |
| 900 | 0.375 | Near-black |
| 950 | 0.210 | Very dark |

## Parameters per scale

| Scale | Hue | Chroma | Hero step | Hero L | Notes |
|-------|-----|--------|-----------|--------|-------|
| grey | 255 | 0.005 | — | — | Barely-there cool, uses standard control points |
| error | 29 | 0.235 | 600 | 0.617 | Red |
| warning | 76 | 0.170 | 600 | 0.809 | Amber/yellow (high L for max chroma) |
| success | 145 | 0.225 | 600 | 0.707 | Green |
| info | 260 | 0.252 | 600 | 0.545 | Blue (low L for max chroma) |

## Using the generator

```bash
# Grey scale
npx tsx scripts/generate-palette.ts \
  --name grey --hue 255 --chroma 0.005 \
  --steps 0,50,100,200,300,400,500,600,700,800,900,950

# Feedback scale (with hero anchoring)
npx tsx scripts/generate-palette.ts \
  --name error --hue 29 --chroma 0.235 \
  --steps 100,200,300,400,500,600,700,800,900 \
  --hero-step 600 --hero-lightness 0.617
```

JSON output goes to stdout, human-readable table to stderr. Redirect stdout to capture:

```bash
npx tsx scripts/generate-palette.ts ... > /tmp/palette.json 2>/dev/null
```

## Chroma behavior

### Neutral mode (no `--hero-step`)

Chroma is constant at the base value, with tapering:
- L > 0.9: reduces by up to 85% as L approaches 1.0
- L < 0.25: reduces by up to 70% as L approaches 0

### Feedback mode (`--hero-step` provided)

Chroma scales linearly from floors to full at the hero:
- **Light side** (step 100 → hero): floor at 10%, linear ramp to 100%
- **Dark side** (hero → step 900): floor at 50%, linear ramp to 100%

Dark steps retain more chroma because dark saturated colors are visually appealing and stay within sRGB gamut.

## sRGB gamut clamping

The generator uses `culori.clampChroma()` to ensure all output colors fit within sRGB. If an OKLCH color falls outside the displayable range, chroma is reduced while preserving lightness and hue.
