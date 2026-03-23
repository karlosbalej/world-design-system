# Figma Variables Guide

## Overview

The World Design System pushes color tokens to Figma as **Variables** via the Figma REST API. This creates two variable collections that designers use to theme components.

## Collection structure

### Collection 1: Primitives

Single mode ("Default"). Contains all raw color values.

```
color/grey/0          → #FFFFFF
color/grey/50         → #F8FAFE
color/grey/100        → #F0F4F9
...
color/grey/950        → #14191F
color/black           → #000000
color/error/100       → #FFF8F7
...
color/error/900       → #490000
color/warning/...
color/success/...
color/info/...
color/worldBlue/loud  → #3FDBED
color/worldBlue/silent → #ECFBFD
...
```

### Collection 2: Semantic

Two modes: "Light" and "Dark". Tokens alias primitives.

```
background/primary     → Light: color/grey/0      | Dark: color/grey/950
background/secondary   → Light: color/grey/50     | Dark: color/grey/900
background/tertiary    → Light: color/grey/100    | Dark: color/grey/800
background/overlay     → Light: #00000080         | Dark: #000000B3
background/elevated    → Light: color/grey/0      | Dark: color/grey/900
background/sunken      → Light: color/grey/100    | Dark: color/grey/950
text/primary           → Light: color/grey/950    | Dark: color/grey/0
text/secondary         → Light: color/grey/700    | Dark: color/grey/400
text/tertiary          → Light: color/grey/600    | Dark: color/grey/600
text/inverse           → Light: color/grey/0      | Dark: color/grey/950
text/link              → Light: color/info/600    | Dark: color/info/400
text/placeholder       → Light: color/grey/700    | Dark: color/grey/600
border/default         → Light: color/grey/200    | Dark: color/grey/800
border/strong          → Light: color/grey/300    | Dark: color/grey/700
border/focus           → Light: color/grey/950    | Dark: color/grey/0
action/primary         → Light: color/grey/950    | Dark: color/grey/0
action/primaryContent  → Light: color/grey/0      | Dark: color/grey/950
...
```

## Naming conventions

- **Separator**: `/` (Figma's native group separator)
- **Case**: lowercase
- **No prefix**: collection name provides scope — don't add "wds-" inside Figma
- **Structure matches JSON**: `color/grey/400` maps to `tokens/color/primitive/base.json → color.grey.400`

## Push script

### Prerequisites

1. **Figma access token**: Generate at https://www.figma.com/developers/api#access-tokens
   - Needs `file_variables:read` and `file_variables:write` scopes
2. **File key**: The alphanumeric ID from your Figma file URL
   - `https://www.figma.com/design/{FILE_KEY}/...`

### Environment variables

```bash
export FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxx
export FIGMA_FILE_KEY=abcdef123456
```

### Running

```bash
# Build tokens first
npm run build

# Push to Figma
npm run push:figma
```

The script is **idempotent** — re-running updates existing variables and creates only missing ones. It will not duplicate variables.

### What happens

1. Reads built token JSON files (`build/web/tokens.json`, `build/web/light-theme.json`, `build/web/dark-theme.json`)
2. Fetches existing Figma variables in the file
3. Creates/updates the "Primitives" collection with a single "Default" mode
4. Creates/updates the "Semantic" collection with "Light" and "Dark" modes
5. For semantic tokens that reference primitives, creates variable aliases (not hardcoded hex values)
6. Reports created/updated/unchanged variable counts

## Verifying in Figma

After pushing:

1. Open the Figma file
2. Go to **Local variables** (right panel or Assets panel)
3. Verify two collections: "Primitives" and "Semantic"
4. Check that "Semantic" has two modes (Light, Dark)
5. Apply a semantic variable to a frame fill — switching modes should change the color

## Limitations

- The Figma Variables API requires a paid Figma plan (Professional or higher)
- Overlay tokens with alpha (#00000080) are stored as solid colors with opacity in Figma — the alpha value from hex-8 is converted to Figma's 0-1 opacity
- Maximum 5000 variables per file
