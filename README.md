# World Design System

Cross-platform design tokens that define the foundational UI layer and visual identity of the World ecosystem.

## Architecture

**Two-layer token system:**

1. **Primitive tokens** – Raw palette values (grey, error, warning, success, info, specialty). Theme-agnostic.
2. **Semantic tokens** – Role-based references (`background.primary`, `text.primary`, `action.primary`). Resolve differently per light/dark theme.

**Platform outputs are standalone** – no dependency on app-specific types. Android gets Compose `Color` objects; iOS gets raw hex `String` constants and a `WdsFontSpec` struct; Web gets CSS custom properties and JSON files. The consuming app bridges these to its own types (e.g. `WLDColor`, `WLDFont`).

## Quick Start

```bash
npm install
npm run build
```

Generated files appear in `build/`:

| Platform | Path | Contents |
|----------|------|----------|
| Android  | `build/android/` | Kotlin objects with Compose `Color` values, `build.gradle.kts` for Maven publishing |
| iOS      | `build/ios/` | Standalone Swift enums/structs with hex string constants, `Package.swift` for SPM |
| Web      | `build/web/` | CSS custom properties, JSON token files, `package.json` for npm publishing |

## Token Files

| File | Description |
|------|-------------|
| `tokens/color/primitive/base.json` | Grey, error, warning, success, info palettes |
| `tokens/color/primitive/specialty.json` | Brand colors (worldBlue, carrotOrange, purple, etc.) |
| `tokens/color/semantic/light.json` | Semantic-to-primitive mappings for light theme |
| `tokens/color/semantic/dark.json` | Semantic-to-primitive mappings for dark theme |
| `tokens/typography/scale.json` | Full type scale (d1, n1-5, h1-4, s1-4, l1-3, b1-4) |
| `tokens/spacing/spacing.json` | Spacing scale (xxs through xxl) |

## Generated Output

### Android (Kotlin/Compose)

- `WdsColorPalette` – Primitive colors as `Color` objects
- `WdsLightColorTokens` / `WdsDarkColorTokens` – Semantic theme colors
- `WdsTypography` – Type scale as `TextStyle` values
- `WdsSpacing` – Spacing scale as `Dp` values
- `WdsTheme` – Composable theme provider with `Wds.colors` accessor

### iOS (Swift)

- `WdsColorPalette` – Primitive colors as hex `String` constants
- `WdsLightColorTokens` / `WdsDarkColorTokens` – Semantic theme colors as hex strings
- `WdsTypography` – Type scale as `WdsFontSpec` values
- `WdsSpacing` – Spacing scale as `CGFloat` values
- `WdsTheme` – Light/dark `WdsSemanticColors` bundles

### Web (CSS / JSON)

- `wds-color-palette.css` – Primitive colors as CSS custom properties (`--wds-color-*`)
- `wds-light-theme.css` / `wds-dark-theme.css` – Semantic theme colors as CSS custom properties (`--wds-*`)
- `wds-typography.css` – Typography as CSS custom properties (`--wds-typography-*`)
- `wds-spacing.css` – Spacing as CSS custom properties (`--wds-spacing-*`)
- `tokens.json` / `light-theme.json` / `dark-theme.json` / `typography.json` / `spacing.json` – JSON token files for programmatic use

## CI/CD

The GitHub Actions workflow (`.github/workflows/publish.yml`) supports two trigger modes:

- **Merged PR with a release label** (`major`, `minor`, `patch`) – auto-bumps version, creates a tag, builds, and publishes
- **Manual dispatch** – choose the bump type from the Actions UI

### Pipeline Steps

1. **release** – Determines version bump, creates and pushes a `v*` tag
2. **build** – Runs `npm run build`, uploads `android-tokens`, `ios-tokens`, and `web-tokens` artifacts
3. **publish-maven** – Publishes Android library to GitHub Packages
4. **publish-spm** – Commits generated iOS files to the `generated/ios` branch, tags as `v*-ios`
5. **publish-npm** – Publishes Web package to GitHub Packages npm registry

## Consuming the Tokens

### Android

Add the GitHub Packages Maven repository to `settings.gradle`:

```groovy
maven {
    url = uri("https://maven.pkg.github.com/jaidensiu/world-design-system")
    credentials {
        username = System.getenv("GITHUB_USER")
        password = System.getenv("GITHUB_TOKEN")
    }
}
```

Then add the dependency:

```groovy
implementation "com.jaidensiu:world-design-system:<version>"
```

Wrap your composable tree in `WdsTheme { ... }` and access tokens via `Wds.colors`, `WdsTypography`, `WdsSpacing`, etc.

### iOS

Add the SPM dependency in your `Package.swift`:

```swift
.package(url: "https://github.com/jaidensiu/world-design-system.git", branch: "generated/ios")
```

Or pin to a specific release tag (e.g. `v0.1.0-ios`).

Then add `WorldDesignSystem` as a dependency on your target:

```swift
.target(
    name: "YourTarget",
    dependencies: [
        .product(name: "WorldDesignSystem", package: "world-design-system"),
    ]
)
```

Bridge the standalone tokens to your app types:

```swift
import WorldDesignSystem

// Colors – WdsColorPalette contains hex strings
let color = WLDColor(WdsColorPalette.colorGrey900)

// Typography – WdsTypography contains WdsFontSpec values
let spec = WdsTypography.h1
let font = WLDFont(size: spec.size, weight: Weight(integerLiteral: Int(spec.weight)), ...)

// Semantic themes
let lightBg = WdsTheme.light.backgroundPrimary  // hex String
```

### Web

Add a `.npmrc` to your project:

```
@jaidensiu:registry=https://npm.pkg.github.com
```

Then install the package:

```bash
npm install @jaidensiu/world-design-system
```

**CSS custom properties** – import the stylesheets you need:

```css
@import "@jaidensiu/world-design-system/wds-color-palette.css";
@import "@jaidensiu/world-design-system/wds-light-theme.css";
@import "@jaidensiu/world-design-system/wds-dark-theme.css";
@import "@jaidensiu/world-design-system/wds-typography.css";
@import "@jaidensiu/world-design-system/wds-spacing.css";
```

Then use the variables:

```css
.card {
  background: var(--wds-background-primary);
  color: var(--wds-text-primary);
  padding: var(--wds-spacing-md);
  border: 1px solid var(--wds-border-default);
}
```

**JSON tokens** – import directly for JS/TS usage:

```ts
import tokens from "@jaidensiu/world-design-system/tokens.json";
import lightTheme from "@jaidensiu/world-design-system/light-theme.json";
import darkTheme from "@jaidensiu/world-design-system/dark-theme.json";
import typography from "@jaidensiu/world-design-system/typography.json";
import spacing from "@jaidensiu/world-design-system/spacing.json";
```

## Color Architecture

**Figma is the source of truth** for primitive color values. The palette uses a clean 100–950 step scale:

| Scale | Steps | Description |
|-------|-------|-------------|
| `grey` | 100–950 (10 steps) | Cool neutral greys |
| `error` | 100–950 (10 steps) | Red status scale |
| `warning` | 100–950 (10 steps) | Amber status scale |
| `success` | 100–950 (10 steps) | Green status scale |
| `info` | 100–950 (10 steps) | Blue status scale |
| `white` / `black` | — | Standalone constants |

Semantic tokens (49 across 8 groups) map roles to primitives, resolving differently per theme. See `tokens/color/semantic/light.json` and `dark.json`.

The `scripts/generate-colors.ts` script reverse-maps Figma hex values to OKLCH coordinates for documentation and runs WCAG contrast analysis against semantic pairings.

## Adding / Modifying Tokens

1. Edit the relevant JSON file in `tokens/`
2. Run `npm run build` to verify output
3. Open a PR with a release label (`patch`, `minor`, or `major`)
4. On merge, CI auto-tags and publishes to all three platforms
