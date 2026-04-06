# Design Tokens — W3C DTCG Format

## What Are Design Tokens?

Design tokens are the machine-readable encoding of brand decisions. Every visual, motion, and spatial choice in a brand system should be expressible as a token. The W3C Design Tokens Community Group specification (stable v1, October 2025) defines the canonical JSON format.

**File extension:** `.tokens.json`
**MIME type:** `application/design-tokens+json`

---

## Token Anatomy

```json
{
  "token-name": {
    "$value": "the actual value",
    "$type": "color | dimension | duration | cubicBezier | ...",
    "$description": "When and why to use this token"
  }
}
```

### Supported Types

| Type | Value Format | Example |
|------|-------------|---------|
| `color` | CSS color string | `"oklch(0.7 0.15 250)"` |
| `dimension` | Number + unit | `"16px"`, `"1rem"` |
| `fontFamily` | String or array | `"Inter"`, `["Inter", "sans-serif"]` |
| `fontWeight` | Number or keyword | `700`, `"bold"` |
| `duration` | Time value | `"200ms"` |
| `cubicBezier` | Array of 4 numbers | `[0.4, 0, 0.2, 1]` |
| `number` | Unitless number | `1.5` |
| `strokeStyle` | String or object | `"solid"`, `{"dashArray": ["2px", "4px"]}` |
| `border` | Object | `{"color": "...", "width": "...", "style": "..."}` |
| `transition` | Object | `{"duration": "...", "timingFunction": "...", "delay": "..."}` |
| `shadow` | Object or array | `{"offsetX": "...", "offsetY": "...", "blur": "...", "spread": "...", "color": "..."}` |
| `gradient` | Array of stops | `[{"color": "...", "position": 0}, ...]` |
| `typography` | Composite object | `{"fontFamily": "...", "fontSize": "...", "fontWeight": "...", "lineHeight": "...", "letterSpacing": "..."}` |

---

## Token Hierarchy: Three Levels

### Level 1: Primitive Tokens (Raw Values)

The raw palette. Never referenced directly in components.

```json
{
  "color": {
    "blue": {
      "50":  { "$value": "oklch(0.97 0.01 250)", "$type": "color" },
      "100": { "$value": "oklch(0.93 0.03 250)", "$type": "color" },
      "200": { "$value": "oklch(0.87 0.06 250)", "$type": "color" },
      "300": { "$value": "oklch(0.78 0.10 250)", "$type": "color" },
      "400": { "$value": "oklch(0.68 0.14 250)", "$type": "color" },
      "500": { "$value": "oklch(0.58 0.18 250)", "$type": "color" },
      "600": { "$value": "oklch(0.50 0.19 250)", "$type": "color" },
      "700": { "$value": "oklch(0.42 0.17 250)", "$type": "color" },
      "800": { "$value": "oklch(0.33 0.14 250)", "$type": "color" },
      "900": { "$value": "oklch(0.25 0.10 250)", "$type": "color" },
      "950": { "$value": "oklch(0.18 0.06 250)", "$type": "color" }
    },
    "neutral": {
      "50":  { "$value": "oklch(0.97 0.005 250)", "$type": "color" },
      "100": { "$value": "oklch(0.93 0.005 250)", "$type": "color" },
      "200": { "$value": "oklch(0.87 0.008 250)", "$type": "color" },
      "300": { "$value": "oklch(0.78 0.008 250)", "$type": "color" },
      "400": { "$value": "oklch(0.68 0.010 250)", "$type": "color" },
      "500": { "$value": "oklch(0.58 0.010 250)", "$type": "color" },
      "600": { "$value": "oklch(0.50 0.012 250)", "$type": "color" },
      "700": { "$value": "oklch(0.42 0.012 250)", "$type": "color" },
      "800": { "$value": "oklch(0.33 0.010 250)", "$type": "color" },
      "900": { "$value": "oklch(0.25 0.008 250)", "$type": "color" },
      "950": { "$value": "oklch(0.18 0.005 250)", "$type": "color" }
    }
  },
  "space": {
    "0":   { "$value": "0px",   "$type": "dimension" },
    "0.5": { "$value": "2px",   "$type": "dimension" },
    "1":   { "$value": "4px",   "$type": "dimension" },
    "1.5": { "$value": "6px",   "$type": "dimension" },
    "2":   { "$value": "8px",   "$type": "dimension" },
    "3":   { "$value": "12px",  "$type": "dimension" },
    "4":   { "$value": "16px",  "$type": "dimension" },
    "5":   { "$value": "20px",  "$type": "dimension" },
    "6":   { "$value": "24px",  "$type": "dimension" },
    "8":   { "$value": "32px",  "$type": "dimension" },
    "10":  { "$value": "40px",  "$type": "dimension" },
    "12":  { "$value": "48px",  "$type": "dimension" },
    "16":  { "$value": "64px",  "$type": "dimension" },
    "20":  { "$value": "80px",  "$type": "dimension" },
    "24":  { "$value": "96px",  "$type": "dimension" }
  }
}
```

### Level 2: Semantic Tokens (Intent-Based)

Reference primitives by alias. These are what components consume.

```json
{
  "color": {
    "surface": {
      "primary":   { "$value": "{color.neutral.50}", "$type": "color", "$description": "Default page background" },
      "secondary": { "$value": "{color.neutral.100}", "$type": "color", "$description": "Card, container backgrounds" },
      "tertiary":  { "$value": "{color.neutral.200}", "$type": "color", "$description": "Subtle section backgrounds" },
      "inverse":   { "$value": "{color.neutral.900}", "$type": "color", "$description": "Dark surface for contrast areas" },
      "brand":     { "$value": "{color.blue.50}", "$type": "color", "$description": "Lightly tinted brand surface" }
    },
    "text": {
      "primary":   { "$value": "{color.neutral.900}", "$type": "color", "$description": "Headings and body text" },
      "secondary": { "$value": "{color.neutral.600}", "$type": "color", "$description": "Supporting text, labels" },
      "tertiary":  { "$value": "{color.neutral.400}", "$type": "color", "$description": "Placeholder, disabled text" },
      "inverse":   { "$value": "{color.neutral.50}", "$type": "color", "$description": "Text on dark backgrounds" },
      "brand":     { "$value": "{color.blue.600}", "$type": "color", "$description": "Brand-colored text, links" }
    },
    "border": {
      "default":   { "$value": "{color.neutral.200}", "$type": "color" },
      "strong":    { "$value": "{color.neutral.400}", "$type": "color" },
      "brand":     { "$value": "{color.blue.300}", "$type": "color" },
      "focus":     { "$value": "{color.blue.500}", "$type": "color" }
    },
    "action": {
      "primary":   { "$value": "{color.blue.600}", "$type": "color" },
      "hover":     { "$value": "{color.blue.700}", "$type": "color" },
      "active":    { "$value": "{color.blue.800}", "$type": "color" },
      "disabled":  { "$value": "{color.neutral.300}", "$type": "color" }
    },
    "feedback": {
      "success":    { "$value": "oklch(0.55 0.17 145)", "$type": "color" },
      "success-bg": { "$value": "oklch(0.95 0.03 145)", "$type": "color" },
      "warning":    { "$value": "oklch(0.65 0.18 85)", "$type": "color" },
      "warning-bg": { "$value": "oklch(0.95 0.04 85)", "$type": "color" },
      "error":      { "$value": "oklch(0.55 0.20 25)", "$type": "color" },
      "error-bg":   { "$value": "oklch(0.95 0.03 25)", "$type": "color" },
      "info":       { "$value": "oklch(0.55 0.15 250)", "$type": "color" },
      "info-bg":    { "$value": "oklch(0.95 0.02 250)", "$type": "color" }
    }
  },
  "space": {
    "inline": {
      "xs": { "$value": "{space.1}", "$type": "dimension", "$description": "Icon-to-text gap" },
      "sm": { "$value": "{space.2}", "$type": "dimension", "$description": "Between related elements" },
      "md": { "$value": "{space.3}", "$type": "dimension", "$description": "Between grouped elements" },
      "lg": { "$value": "{space.4}", "$type": "dimension", "$description": "Between sections inline" }
    },
    "stack": {
      "xs": { "$value": "{space.1}", "$type": "dimension", "$description": "Tight vertical gap" },
      "sm": { "$value": "{space.2}", "$type": "dimension", "$description": "Between form fields" },
      "md": { "$value": "{space.4}", "$type": "dimension", "$description": "Between content blocks" },
      "lg": { "$value": "{space.8}", "$type": "dimension", "$description": "Between sections" },
      "xl": { "$value": "{space.16}", "$type": "dimension", "$description": "Between major page sections" }
    },
    "inset": {
      "xs": { "$value": "{space.2}", "$type": "dimension", "$description": "Compact container padding" },
      "sm": { "$value": "{space.3}", "$type": "dimension", "$description": "Card padding (compact)" },
      "md": { "$value": "{space.4}", "$type": "dimension", "$description": "Card padding (standard)" },
      "lg": { "$value": "{space.6}", "$type": "dimension", "$description": "Section padding" },
      "xl": { "$value": "{space.8}", "$type": "dimension", "$description": "Page-level padding" }
    }
  },
  "typography": {
    "display": {
      "$value": {
        "fontFamily": "{font.family.heading}",
        "fontSize": "3.5rem",
        "fontWeight": 700,
        "lineHeight": 1.1,
        "letterSpacing": "-0.02em"
      },
      "$type": "typography"
    },
    "heading-1": {
      "$value": {
        "fontFamily": "{font.family.heading}",
        "fontSize": "2.25rem",
        "fontWeight": 700,
        "lineHeight": 1.2,
        "letterSpacing": "-0.015em"
      },
      "$type": "typography"
    },
    "body": {
      "$value": {
        "fontFamily": "{font.family.body}",
        "fontSize": "1rem",
        "fontWeight": 400,
        "lineHeight": 1.5,
        "letterSpacing": "0"
      },
      "$type": "typography"
    }
  },
  "motion": {
    "duration": {
      "instant": { "$value": "0ms", "$type": "duration" },
      "micro":   { "$value": "75ms", "$type": "duration" },
      "fast":    { "$value": "150ms", "$type": "duration" },
      "normal":  { "$value": "250ms", "$type": "duration" },
      "slow":    { "$value": "400ms", "$type": "duration" },
      "deliberate": { "$value": "600ms", "$type": "duration" }
    },
    "easing": {
      "enter":   { "$value": [0, 0, 0.2, 1], "$type": "cubicBezier" },
      "exit":    { "$value": [0.4, 0, 1, 1], "$type": "cubicBezier" },
      "move":    { "$value": [0.4, 0, 0.2, 1], "$type": "cubicBezier" },
      "bounce":  { "$value": [0.34, 1.56, 0.64, 1], "$type": "cubicBezier" }
    }
  },
  "elevation": {
    "0": { "$value": "none", "$type": "shadow" },
    "1": {
      "$value": { "offsetX": "0px", "offsetY": "1px", "blur": "2px", "spread": "0px", "color": "oklch(0 0 0 / 0.05)" },
      "$type": "shadow"
    },
    "2": {
      "$value": { "offsetX": "0px", "offsetY": "4px", "blur": "8px", "spread": "-2px", "color": "oklch(0 0 0 / 0.08)" },
      "$type": "shadow"
    },
    "3": {
      "$value": { "offsetX": "0px", "offsetY": "8px", "blur": "16px", "spread": "-4px", "color": "oklch(0 0 0 / 0.1)" },
      "$type": "shadow"
    },
    "4": {
      "$value": { "offsetX": "0px", "offsetY": "16px", "blur": "32px", "spread": "-8px", "color": "oklch(0 0 0 / 0.12)" },
      "$type": "shadow"
    }
  },
  "radius": {
    "none":  { "$value": "0px", "$type": "dimension" },
    "sm":    { "$value": "4px", "$type": "dimension" },
    "md":    { "$value": "8px", "$type": "dimension" },
    "lg":    { "$value": "12px", "$type": "dimension" },
    "xl":    { "$value": "16px", "$type": "dimension" },
    "2xl":   { "$value": "24px", "$type": "dimension" },
    "full":  { "$value": "9999px", "$type": "dimension" }
  }
}
```

### Level 3: Component Tokens (Scoped)

For specific component overrides. Optional — most components should reference semantic tokens directly.

```json
{
  "button": {
    "primary": {
      "background":    { "$value": "{color.action.primary}" },
      "text":          { "$value": "{color.text.inverse}" },
      "border-radius": { "$value": "{radius.md}" },
      "padding-x":     { "$value": "{space.inset.md}" },
      "padding-y":     { "$value": "{space.inset.xs}" }
    }
  }
}
```

---

## Theming with Modes

The same semantic tokens, different values per mode:

```json
{
  "color": {
    "surface": {
      "primary": {
        "$value": "{color.neutral.50}",
        "$type": "color",
        "$extensions": {
          "com.tokens.studio.modes": {
            "light": "{color.neutral.50}",
            "dark": "{color.neutral.950}"
          }
        }
      }
    }
  }
}
```

---

## Toolchain

| Tool | Role |
|------|------|
| **Tokens Studio** (Figma plugin) | Author and manage tokens in Figma |
| **Style Dictionary v4** (Amazon) | Transform DTCG tokens → platform code (CSS, iOS, Android) |
| **Specify** | Token distribution API |
| **Figma Variables** | Native Figma token support with mode switching |

### Style Dictionary Transform Pipeline

```
brand.tokens.json
  → Style Dictionary
    → CSS custom properties    (web)
    → Swift constants          (iOS)
    → Kotlin constants         (Android)
    → Tailwind config          (utility CSS)
    → Figma variables          (design tool)
```

---

## Complete Brand Token File Structure

```
tokens/
├── primitives/
│   ├── color.tokens.json      (raw palette)
│   ├── space.tokens.json      (spacing scale)
│   ├── radius.tokens.json     (border radius scale)
│   └── font.tokens.json       (font families, weights)
├── semantic/
│   ├── color.tokens.json      (surface, text, border, action, feedback)
│   ├── space.tokens.json      (inline, stack, inset, layout)
│   ├── typography.tokens.json (display, heading, body, caption)
│   ├── motion.tokens.json     (duration, easing, transitions)
│   ├── elevation.tokens.json  (shadow scale)
│   └── radius.tokens.json     (component radius mapping)
├── component/
│   ├── button.tokens.json
│   ├── input.tokens.json
│   └── card.tokens.json
└── brand.tokens.json          (master file importing all above)
```
