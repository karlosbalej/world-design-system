# Color System — Codified Frameworks

## Governing Principle: Color Is Contextual

From Albers' *Interaction of Color*: No color exists in isolation. Every color's perceived value changes based on what surrounds it. This means:
- Never evaluate a brand color in a vacuum — always test in context
- Palette harmony is about relationships, not individual swatches
- Dark mode isn't "invert the colors" — it's a complete recontextualization

---

## Color Space: OKLCH

All brand colors should be defined in OKLCH (Lightness, Chroma, Hue) as the source of truth. OKLCH is perceptually uniform — adjusting one axis has minimal impact on the others.

### OKLCH Axes

```
L (Lightness):  0 (black) → 1 (white)     — Perceptual brightness
C (Chroma):     0 (grey) → 0.4+ (vivid)   — Color intensity/saturation
H (Hue):        0–360 degrees              — Color identity (red=25, orange=70, yellow=100, green=145, cyan=195, blue=265, purple=300, pink=350)
```

### Why OKLCH Over HSL/RGB

| Property | HSL Problem | OKLCH Solution |
|----------|-------------|----------------|
| Lightness | HSL "50%" yellow is much lighter than "50%" blue | OKLCH L=0.7 looks equally bright across all hues |
| Saturation | HSL 100% saturation varies wildly by hue | OKLCH chroma is perceptually consistent |
| Harmony | Complementary hues in HSL look mismatched in brightness | OKLCH complementary hues at same L feel balanced |
| Shade scales | HSL scales have perceptual jumps and dead zones | OKLCH scales are smooth and even |

### CSS Syntax
```css
color: oklch(0.7 0.15 250);       /* L C H */
color: oklch(0.7 0.15 250 / 0.5); /* with alpha */
```

---

## Palette Architecture

### Step 1: Define Brand Hues

From brand strategy, identify 1–3 primary hues and 1–3 secondary hues.

Map personality traits to hue families (adapted from Eiseman):

| Trait | Hue Range (OKLCH H) | Examples |
|-------|---------------------|----------|
| Energetic, passionate | 0–30 (Red) | Coca-Cola, YouTube, Netflix |
| Warm, friendly, creative | 30–70 (Orange) | Hermès, Mastercard |
| Optimistic, accessible | 70–110 (Yellow) | IKEA, McDonald's, Snap |
| Natural, growth, health | 110–160 (Green) | Spotify, Whole Foods |
| Calm, trustworthy, tech | 200–270 (Blue) | Meta, IBM, Samsung |
| Luxurious, creative, wise | 270–320 (Purple) | Cadbury, Twitch, FedEx |
| Feminine, playful, bold | 320–360 (Pink/Magenta) | T-Mobile, Lyft |

### Step 2: Generate Shade Scales (Refactoring UI Method)

For each brand hue, generate 9–11 shades by varying Lightness and Chroma:

```
Scale structure (11 steps):
  50:  L=0.97  C=0.01  — Near-white tint (backgrounds)
  100: L=0.93  C=0.03  — Very light tint
  200: L=0.87  C=0.06  — Light tint (hover states)
  300: L=0.78  C=0.10  — Soft (borders, dividers)
  400: L=0.68  C=0.14  — Medium-light (secondary text)
  500: L=0.58  C=0.18  — Base / mid-tone (icons, labels)
  600: L=0.50  C=0.19  — Medium-dark (primary actions)
  700: L=0.42  C=0.17  — Dark (text on light bg)
  800: L=0.33  C=0.14  — Very dark (headings)
  900: L=0.25  C=0.10  — Near-black (highest contrast)
  950: L=0.18  C=0.06  — Deepest (dark mode surfaces)
```

#### Scale Generation Rules
1. Fix hue (H) across the entire scale — hue is the brand constant
2. Lightness (L) decreases linearly from 0.97 to 0.18
3. Chroma (C) peaks at mid-range (500–600) and tapers at extremes
4. Test APCA contrast between every combination for accessibility

### Step 3: Build Neutral Scale

Neutrals are *not* pure grey. Inject the brand's primary hue at very low chroma:

```
Neutral scale (brand-tinted):
  H = primary brand hue (fixed)
  C = 0.005–0.015 (barely perceptible)
  L = same 11-step lightness scale as above
```

This creates warmth/coolness coherence — neutrals subtly echo the brand palette.

### Step 4: Define Semantic Colors

Map palette shades to functional roles:

```json
{
  "color": {
    "surface": {
      "primary":   { "$value": "{color.neutral.50}" },
      "secondary": { "$value": "{color.neutral.100}" },
      "tertiary":  { "$value": "{color.neutral.200}" },
      "inverse":   { "$value": "{color.neutral.900}" }
    },
    "text": {
      "primary":   { "$value": "{color.neutral.900}" },
      "secondary": { "$value": "{color.neutral.600}" },
      "tertiary":  { "$value": "{color.neutral.400}" },
      "inverse":   { "$value": "{color.neutral.50}" },
      "brand":     { "$value": "{color.brand.600}" }
    },
    "border": {
      "default":   { "$value": "{color.neutral.200}" },
      "strong":    { "$value": "{color.neutral.400}" },
      "brand":     { "$value": "{color.brand.300}" }
    },
    "action": {
      "primary":    { "$value": "{color.brand.600}" },
      "hover":      { "$value": "{color.brand.700}" },
      "active":     { "$value": "{color.brand.800}" },
      "disabled":   { "$value": "{color.neutral.300}" }
    },
    "feedback": {
      "success":   { "$value": "{color.green.600}" },
      "warning":   { "$value": "{color.amber.500}" },
      "error":     { "$value": "{color.red.600}" },
      "info":      { "$value": "{color.blue.600}" }
    }
  }
}
```

### Step 5: Proportion Rule (60:30:10)

From Itten's contrast of extension:

```
60% — Dominant color (neutrals/surfaces)
30% — Secondary color (brand primary, containers)
10% — Accent color (CTAs, highlights, emphasis)
```

---

## Itten's Seven Color Contrasts

Use as validation rules when evaluating palette combinations:

| Contrast Type | Rule | Brand Application |
|---------------|------|-------------------|
| **Hue** | Juxtaposition of different hues | Primary vs. secondary brand colors |
| **Light–Dark** | Value difference between colors | Text/background readability |
| **Cold–Warm** | Temperature difference | Emotional tone of compositions |
| **Complementary** | Opposite hues (180° on wheel) | Accent selection, CTA pop |
| **Simultaneous** | Eye generates complementary afterimage | Avoid fatigue in dominant color areas |
| **Saturation** | Vivid vs. muted | Hierarchy — saturated = important |
| **Extension** | Proportion of colors needed for balance | The 60:30:10 rule |

---

## Eiseman's Color Moods (Selected)

Map brand personality to color mood families for palette generation:

| Mood | Description | Hue Families | L Range | C Range |
|------|-------------|-------------|---------|---------|
| **Powerful** | Authority, confidence, sophistication | Deep blues, blacks, burgundy | 0.15–0.35 | 0.05–0.15 |
| **Nurturing** | Warmth, comfort, trust | Warm neutrals, rose, soft gold | 0.65–0.85 | 0.03–0.10 |
| **Energetic** | Vitality, excitement, movement | Bright reds, oranges, yellows | 0.55–0.75 | 0.18–0.30 |
| **Transcendent** | Innovation, premium, mystery | Deep purples, silvers, midnight | 0.20–0.45 | 0.08–0.18 |
| **Serene** | Calm, clarity, wellness | Sky blues, soft greens, lavender | 0.70–0.90 | 0.04–0.12 |
| **Fresh** | Youth, nature, optimism | Bright greens, teals, lime | 0.60–0.80 | 0.12–0.22 |
| **Provocative** | Disruption, boldness, edge | Hot pinks, electric blue, acid | 0.50–0.70 | 0.20–0.35 |
| **Trustworthy** | Reliability, stability, intelligence | Mid blues, slate, steel | 0.40–0.60 | 0.06–0.14 |
| **Luxurious** | Exclusivity, quality, heritage | Golds, deep burgundy, navy | 0.25–0.50 | 0.08–0.16 |
| **Playful** | Fun, approachable, informal | Bright multi-color, pastels | 0.65–0.85 | 0.10–0.25 |

---

## Dark Mode Translation

Dark mode is NOT inverting lightness. Rules:

1. **Surfaces** — Swap direction: light surfaces become dark, but NOT pure black. Use L=0.15–0.25 with brand-tinted neutrals.
2. **Text** — Swap direction: dark text becomes light, but reduce to L=0.90 (not pure white) to avoid glare.
3. **Brand colors** — Adjust L and C for dark contexts. Colors that work on white often need higher L and lower C on dark surfaces.
4. **Elevation** — In dark mode, elevation = lighter surfaces (not shadows). Higher = brighter.
5. **Semantic colors** — Feedback colors (success, error) need recalibration for dark backgrounds.

### DTCG Token Strategy for Theming

Use the same semantic token names with mode-switched values:

```json
{
  "color": {
    "surface": {
      "primary": {
        "$value": "{color.neutral.50}",
        "$extensions": {
          "mode": {
            "dark": "{color.neutral.950}"
          }
        }
      }
    }
  }
}
```

---

## Accessibility: APCA Contrast

Use APCA (Advanced Perceptual Contrast Algorithm) over WCAG 2.x ratios for more accurate readability assessment.

| Use Case | Minimum APCA Lc |
|----------|-----------------|
| Body text (16px+) | Lc 60 |
| Large text (24px+) | Lc 45 |
| Non-text UI (icons, borders) | Lc 30 |
| Placeholder text | Lc 40 |
| Disabled elements | Lc 25 (intentionally low) |

### Testing Rule
Every text color + background color combination in the semantic system must meet the appropriate APCA threshold. This is a hard constraint, not a guideline.
