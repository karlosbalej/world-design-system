# World Design System — Next Generation Plan

Comparison of UI Kit 4.0 (current) vs Token-Sync explorations (new), with a roadmap to make the system better, easier to use, and scalable.

---

## Executive Summary

UI Kit 4.0 has a mature component library (19 component pages, 40+ component sets, 600+ variants) with documentation pages, but **0% variable bindings** across every single component. All fills are hardcoded hex values. The Token-Sync exploration has 33 real product screens and a properly structured variable system (52 primitives + 49 semantics with Light/Dark modes), but no reusable component library yet.

The path forward: bridge both worlds. Keep the component quality of 4.0, rebuild on the variable foundation of 5.0, and fill the gaps that neither file addresses.

---

## 1. What's Working (Keep These)

### From UI Kit 4.0
- **Component documentation structure** — The page hierarchy (`Styles & Tokens → Components → Miniapps`) is clean and navigable
- **Tokens documentation page** — The table format (Token / Description / Light mode / Dark mode) is a great onboarding tool for designers
- **Component page pattern** — One page per component (Button, Input, Controls) with variant grids
- **Spacing scale** — 37-step `scale/0..60` variable collection covers the full range
- **Component property design** — Well-structured boolean toggles (Show icon, Show message), instance swap slots, and variant dimensions

### From Token-Sync / UI Kit 5.0
- **Variable-first architecture** — 52 primitives + 49 semantics with proper Light/Dark modes
- **Slash-separated naming** — `surface/primary`, `text/secondary`, `action/ghost` reads better in Figma's variable panel than the old `color-bg-background`
- **Alias chain** — Semantics alias to primitives, so a palette change propagates everywhere
- **Real screens as test cases** — 33 product screens (Home, Apps, Settings, Invest, etc.) prove the tokens against actual UI patterns

---

## 2. Complete Component Audit — UI Kit 4.0

Full inventory of every component in the file. Variable binding rate: **0%** across all components (2 bindings out of ~2,000+ nodes with solid fills).

### 2.1 Core Interaction Components

#### Button
- **Component set:** 36 variants
- **Properties:** Type (Primary, Secondary, Tertiary) × Size (Large, Small, XSmall) × State (Default, Pressed, Disabled, Pending, Success, Failed) + Show left/right icon (boolean) + Icon instance swap slots
- **5.0 sizing note:** All buttons standardized to 48px (Large). Small (32px) for compact contexts. Medium dropped.
- **Hardcoded colors:**
  - Primary fill: `#181818`, label: `#FFFFFF`
  - Secondary fill: `#F3F4F5`, label: `#181818`
  - Tertiary fill: transparent, border: `#EBECEF`, label: `#181818`
  - Disabled fill: `#F3F4F5`, label: `#D6D9DD`
  - Success icon: `#00C230`, Failed icon: `#F2280D`
  - Pending spinner: `#181818` (on secondary)
- **Variable binding:** 0 / 36 variants bound
- **Issues:** No destructive variant. No ghost variant. Pressed state has no visible feedback. Success/Failed states use status icons but no semantic background color.
- **Token mapping for rebuild:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#181818` fill | `action/primary` | Primary button background |
| `#FFFFFF` text | `action/primaryContent` | Primary button label |
| `#F3F4F5` fill | `action/secondary` | Secondary button background |
| `#181818` text | `action/secondaryContent` | Secondary button label |
| transparent + `#EBECEF` stroke | `action/tertiary` + `border/default` | Tertiary button |
| `#181818` text | `action/tertiaryContent` | Tertiary button label |
| `#F3F4F5` fill (disabled) | `action/disabled` | Disabled background |
| `#D6D9DD` text (disabled) | `action/disabledContent` | Disabled label |
| `#00C230` | `status/success` | Success state icon |
| `#F2280D` | `status/error` | Failed state icon |

#### Icon Button
- **Component set:** 3 variants
- **Properties:** Type (Primary, Secondary, Tertiary)
- **Hardcoded colors:** Same as Button (Primary `#181818`, Secondary `#F3F4F5`, Tertiary transparent + border)
- **Variable binding:** 0 / 3 bound
- **Recommendation:** Merge into Button component as a `Content` variant (Icon only / Label only / Icon + Label) instead of a separate component. Reduces maintenance.

#### Controls (Toggle, Checkbox, Radio)
- **Toggle:** 2 variants (On/Off). On: `#181818` track + `#FFFFFF` thumb. Off: `#D6D9DD` track + `#FFFFFF` thumb
- **Checkbox:** 2 variants (On/Off). On: `#181818` fill + `#FFFFFF` check. Off: empty + `#D6D9DD` border
- **Radio button:** 2 variants (On/Off). On: `#181818` fill + `#FFFFFF` dot. Off: empty + `#D6D9DD` border
- **Variable binding:** 0 / 6 bound
- **Issues:** No disabled state on any control. No error state. No intermediate/indeterminate state for checkbox.
- **Token mapping:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#181818` (on state) | `action/primary` | Active track/fill |
| `#FFFFFF` (thumb/check) | `action/primaryContent` | Indicator on active |
| `#D6D9DD` (off state) | `border/strong` | Inactive border/track |

### 2.2 Input Components

#### Text Field (+ variants)
- **9 component sets:** Text Field (8 variants), Select (2), Text Field with Suffix (4), Password (4), Phone Number (4), Text Area (8), Code (4), Search Field (3), Wallet Address (4)
- **Properties per set:** State (Default, Focused, Filled, Error) × Label inside (Off/On) + Show message (boolean) + Show icon (boolean)
- **Hardcoded colors:**
  - Default background: `#F3F4F5`, border: none
  - Focused background: `#FFFFFF`, border: `#191C20`
  - Error border: `#F2280D`, error message text: `#F2280D`
  - Placeholder text: `#717680`
  - Filled text: `#191C20`
  - Label text: `#717680` (default), `#191C20` (focused/filled)
  - Helper/message text: `#717680`
- **Variable binding:** 0 / 41 fill nodes across Text Field alone
- **Token mapping:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#F3F4F5` | `input/background` | Default field fill |
| `#FFFFFF` | `input/backgroundFocus` | Focused field fill |
| `#191C20` border | `border/focus` | Focused field border |
| `#F2280D` | `input/error` or `status/error` | Error border + message |
| `#717680` | `input/placeholder` | Placeholder + helper text |
| `#191C20` text | `input/text` | Filled value |

### 2.3 Navigation Components

#### Top Bar
- **3 component sets:** Topbar iOS (6 variants), Topbar Android (6), Top Bar MiniApps (3)
- **Properties:** Type (Off/Controls/Profile picture/Blank/Marble/Title) × Stepper (Off/On) × Subtitle (Off/On) + Show label/left button/right button (booleans) + Icon instance swaps + Text label
- **Hardcoded colors:** Background transparent/white, title `#191C20`, icons `#191C20`, stepper `#DADADA`
- **Variable binding:** 2 / 1,075 nodes (0.2%)
- **Issues:** iOS and Android are separate component sets with identical properties. Should be a single set with a Device variant (or platform-agnostic if the visual difference is only status bar).
- **Recommendation:** Merge iOS + Android into one component. Add device differentiation at the status bar level only, not the whole bar.

#### Tab Bar
- **3 component sets:** `_TabBar` item (2 variants), Tab-Bar_iOS (4 variants), Tab-Bar_Android (4 variants)
- **Properties:** Tab (Home, Wallet, Chat, World ID) + Show notifications (boolean) + State (On/Off on individual item)
- **Hardcoded colors:** Selected icon/text: `#191C20`, unselected icon/text: `#838D9B`, background: `#FFFFFF`, border-top: `#838D9B` stroke
- **Variable binding:** 0 / 194 nodes
- **Token mapping:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#191C20` (selected) | `icon/primary` + `text/primary` | Active tab |
| `#838D9B` (unselected) | `icon/secondary` + `text/secondary` | Inactive tab |
| `#FFFFFF` background | `surface/primary` | Tab bar background |
| `#838D9B` stroke-top | `border/subtle` | Top divider line |

#### Bottom Bar
- **2 component sets:** Bottom Bar_iOS (2 variants), Bottom Bar_Android (2 variants)
- **Properties:** Direction (Horizontal, Vertical) + Show T&C/buttons/Primary/Secondary (booleans)
- **Hardcoded colors:** `#181818` primary button, `#F3F4F5` secondary button, `#FFFFFF` tertiary button + `#EBECEF` borders
- **Same issue as Top Bar:** iOS/Android split unnecessarily. Merge into one component.

### 2.4 Feedback Components

#### Drawer / Bottom Sheet
- **3 component sets:** Drawer Generic iOS (8 variants), Drawer Generic Android (8), Verify with World ID (4)
- **Properties:** State (Default, Pending, Success, Error) × Illustration (On/Off) + Show buttons (boolean)
- **Hardcoded colors:** Sheet background `#FFFFFF`, title `#191C20`, body text `#717680`, close icon `#9BA3AE`, overlay `#000000` at varying opacity
- **Variable binding:** 0 / 214 nodes
- **Token mapping:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#FFFFFF` sheet | `surface/elevated` | Sheet surface |
| `#191C20` title | `text/primary` | Heading |
| `#717680` body | `text/secondary` | Description text |
| `#9BA3AE` close | `icon/tertiary` | Close button |
| `#000000` overlay | `surface/overlay` | Scrim behind sheet |
| `#00C230` | `status/success` | Success state |
| `#F2280D` | `status/error` | Error state |

#### Toast Message
- **Component set:** 2 variants (Error, Success)
- **Hardcoded colors:** Success icon `#00C230`, Error icon `#F2280D`, text `#191C20`, background `#FFFFFF` with shadow
- **Variable binding:** 0 / 10 nodes
- **Issues:** No warning or info variant. No dismissal interaction. Missing icon instance swap.
- **Recommendation:** Expand to 4 states: Success, Error, Warning, Info. Add dismissible (boolean). Add icon swap slot.

#### Spinner
- **Component set:** 4 variants (states showing progress animation)
- **Hardcoded colors:** `#181818` on white
- **Variable binding:** 0 / 4 nodes

### 2.5 Content Components

#### List Card
- **Component set:** 18 variants
- **Properties:** Type (Token, Network, Generic) × Active (True/False) × Show badge (True/False) × Show icon × Right icon + Show desc/suffix/divider (booleans) + Additional desc (boolean)
- **Hardcoded colors:** Background `#FFFFFF`/`#F9FAFB`, text `#191C20` (primary), `#717680` (description), badge text `#B1B8C2`, divider `#F3F4F5`, icon backgrounds use brand colors
- **Variable binding:** 0 / 360 nodes
- **Token mapping:**

| Hardcoded | Semantic token | Context |
|-----------|---------------|---------|
| `#FFFFFF`/`#F9FAFB` | `surface/primary`/`surface/secondary` | Card background |
| `#191C20` | `text/primary` | Title |
| `#717680` | `text/secondary` | Description |
| `#B1B8C2` | `text/tertiary` | Badge/meta text |
| `#F3F4F5` divider | `border/subtle` | Row divider |

#### Bullet List
- **Single component + bullet sub-component**
- **Simple.** Just needs `text/primary` and `icon/secondary`.

#### Progress Bar
- **Single component** (not a component set)
- **Hardcoded colors:** Track `#F3F4F5`, fill `#181818`
- **Token mapping:** Track → `surface/secondary`, fill → `action/primary`

#### Segmented Controls
- **Component set:** 4 variants (Selected 1st, 2nd, 3rd, 4th)
- **Hardcoded colors:** Selected pill: `#F3F4F5` (light circle), unselected: transparent, text: `#191C20`
- **Variable binding:** 0 / 36 nodes
- **Token mapping:** Selected pill → `surface/secondary`, text → `text/primary`

#### Sticky Button Bar
- **Single component** (wrapper for bottom-docked button area)
- **Basically a Bottom Bar variant.** Consider merging.

### 2.6 Data Display Components (Tokens, Methods & States page)

This is the richest page. 9 component sets, 500+ variants for crypto-specific UI.

#### Tokens (crypto asset icons)
- **Component set:** 180 variants
- **Properties:** Token (10 cryptos) × Size (88/64/48/44/24px) × Disabled (On/Off) × Monotone (On/Off) + Show network (boolean)
- **Variable binding:** 0
- **Brand-specific.** These don't use semantic tokens directly since they contain brand-specific asset imagery. The Disabled and Monotone variants should use `icon/disabled` for the overlay.

#### Generic Icon
- **Component set:** 10 variants. Size (88/64/48/44/24px) × Monochrome (True/False) + icon swap
- **Token mapping:** Non-monochrome background colors are brand-specific. Monochrome should use `surface/secondary` background + `icon/primary`.

#### States (status indicators)
- **Component set:** 20 variants. State (Error, Success, Warning, Critical error, Pending) × Size (88/64/44/24px)
- **Token mapping:** Direct match to `status/error`, `status/success`, `status/warning` + respective `*Background` tokens. Critical error uses same as error.

#### Payment Methods, Networks, Crypto Apps, Providers
- **Combined 297 variants** across 4 component sets
- **Brand-specific logos and imagery.** No semantic token coverage needed except for disabled states and container backgrounds.
- **Disabled variants** should use `icon/disabled` overlay.

#### Token Symbol
- **Component set:** 11 variants. Text-only ticker symbols.
- **Token mapping:** `text/primary` for the symbol text.

### 2.7 Chat Components (largest component page)

22 component sets, ~200+ variants. This is a mini design system within the design system.

#### Message Bubbles
- **Sender Bubble:** 9 variants. Bubbles count (1, 2, 3, Removed) × Swipe options × Device
  - Fill: `#005CFF` (blue), text: `#FFFFFF`
- **Recipient Bubble:** 14 variants. Same dimensions + Is group chat + Typing state
  - Fill: `#F3F4F5` (light grey), text: `#191C20`
- **Token gap identified:** No dedicated `chat/sender` or `chat/recipient` tokens. Options:
  - **A)** Use `accent/primary` + `accent/content` for sender, `surface/secondary` + `text/primary` for recipient
  - **B)** Add `chat/senderBubble` and `chat/recipientBubble` semantic tokens
  - **Recommendation: A** is cleaner. The chat bubble color IS the accent color. `accent/primary` defaults to `info.600` which maps close to `#005CFF`. Recipient uses existing surface tokens.

#### Chat List & Contacts
- **Chats list item:** 4 variants (Default, Left swipe, Right swipe, Unread). Swipe actions use `#005CFF` (blue/unread) and `#F2280D` (red/delete).
- **List contact:** 3 variants (Verified, Not verified, Loading)
- **Profile Picture:** 96 variants (10 colors × ~8 sizes + various states). Color-specific backgrounds (Blue, Gray, Green, Yellow, Red, Orange, Light Blue, Violet, Not verified, Avatar).
- **Token mapping for swipe actions:** Unread/Pin → `accent/primary`, Delete → `action/destructive`, Mute → `surface/tertiary`

#### Chat-Specific Sub-Components
- **Messages' preview:** 13 variants (Default, Vocal, Photo, Video, Document, Contact, Location, Poll, View once, Delete)
- **Messages' statuses:** 6 variants (Error, Seen, Sent, Sending, Removed, Forwarded)
- **Reaction:** 2 variants (single, multiple)
- **Verification badge:** 4 variants
- **Thread Input Bar:** 4 variants (show send button × device)
- **Link:** 7 variants (Horizontal/Vertical Link, Loading, Miniapp, Share profile)
- **Replies:** 6 variants (various reply contexts)
- **Photos:** 10 variants (single/multi, horizontal/vertical, video, fail state)
- **Payments:** Sender Payment (7), Recipient Payment (2), Recipient group chat (3)
- **Banners:** 3 variants (Encrypt, Disappearing on/off)
- **Dividers:** 2 variants (Date, Status)

#### Chat Token Needs
The chat system introduces colors not covered by our 49 semantic tokens:

| Color usage | Current coverage | Gap? |
|-------------|-----------------|------|
| Sender bubble blue `#005CFF` | `accent/primary` (info.600) | Close enough. info.600 is `#2563EB` in code. Consider aligning. |
| Recipient bubble grey `#F3F4F5` | `surface/secondary` | Covered |
| Unread badge blue `#005CFF` | `accent/primary` | Covered |
| Delete red `#F2280D` | `action/destructive` | Covered |
| Verified badge blue | `accent/primary` | Covered |
| Typing indicator dots | `text/tertiary` | Covered |
| Time/meta text | `text/tertiary` | Covered |

### 2.8 App Icons
- **Component set:** 120 variants. App (10 apps) × Size (64/60/52/24)
- **Brand-specific imagery.** No semantic token needs. Container shapes should use `surface/secondary` when monotone.

### 2.9 Marble (Avatar backgrounds)
- **Component set:** 8 variants (7 gradient combos + "No user")
- **Decorative/brand-specific.** Gradient fills won't use semantic tokens. "No user" fallback should use `surface/tertiary`.

---

## 3. What's Broken (Fix These)

### P0 — Must fix before any team uses this

| # | Problem | Impact | Fix |
|---|---------|--------|-----|
| 1 | **Components not bound to variables** — 0% binding rate across all 40+ component sets. Every fill is hardcoded hex. | Every component is a manual repaint when the palette changes. Dark mode requires building every component twice. | Rebuild each component with variable bindings. This is the single biggest win. |
| 2 | **Old naming still in use** — 4.0 uses `color-bg-background`, `color-text-default`. New system uses `surface/primary`, `text/primary` | Designers will reference wrong names, devs will use wrong tokens | One system, one naming convention. The new `group/role` pattern wins. Document a migration table. |
| 3 | **No code syntax on variables** — None of the 49 semantic variables in UI Kit 5.0 have `codeSyntax` set | Dev Mode shows variable names but not the actual CSS/Kotlin/Swift token name. Devs copy the wrong thing. | Set `codeSyntax` for WEB (`var(--wds-surface-primary)`), ANDROID (`Wds.colors.surfacePrimary`), iOS (`WdsTheme.light.surfacePrimary`) on every variable. |
| 4 | **Scopes too broad** — Most variables use `ALL_FILLS` or `ALL_SCOPES`, polluting the property picker | Designers see every token in every picker. A border color appears in text fill suggestions. | Set precise scopes per the scope table below. |
| 5 | **iOS/Android component duplication** — Top Bar, Bottom Bar, Tab Bar, Drawer, Thread Input Bar all have separate iOS/Android component sets with near-identical properties | Double the maintenance. Variants drift apart. Designers grab the wrong platform version. | Merge into single component sets. Add `Device` variant (iOS/Android) that only changes the status bar chrome, not the component itself. |

### P1 — Fix before wider rollout

| # | Problem | Impact | Fix |
|---|---------|--------|-----|
| 6 | **No component library in new file** — Token-Sync has screens but no reusable components | Designers will detach or copy-paste instead of using instances | Build component library on the new variable foundation. |
| 7 | **Missing component states** — Controls lack disabled states. Toast lacks warning/info. Button lacks destructive/ghost. | Devs build custom states that don't match design intent | Add missing states to each component. See per-component specs above. |
| 8 | **Specialty colors not semantic** — World Blue (`#3FDBED`), Carrot Orange (`#FF5A00`) exist as primitives only | Devs hardcode hex values. No dark mode fallback. | Use `accent/primary` for the main brand accent. Other specialty colors stay as primitives since they're used for specific brand assets (token icons, app icons). |
| 9 | **Spacing variables use `ALL_SCOPES`** — The 37 spacing variables don't restrict where they appear | A spacing value shows up in corner radius pickers | Set scopes: padding/gap → `GAP`, sizing → `WIDTH_HEIGHT`, radius → `CORNER_RADIUS`. |
| 10 | **No descriptions on variables** — Variables lack the helpful descriptions that 4.0's documentation page had | New designers can't tell when to use `text/secondary` vs `text/tertiary` | Add `description` to each semantic variable. |
| 11 | **Chat components are overcomplicated** — 22 component sets for one feature area, many with redundant nesting | Hard to find the right component. Lots of private sub-components exposed. | Consolidate. Keep 8-10 key public components, mark the rest as private (`_` prefix). |

---

## 4. Hardcoded Color → Semantic Token Migration Map

The top 20 most-used hardcoded colors across all components and their target semantic tokens.

| Rank | Hardcoded color | Uses | Maps to | Semantic token |
|------|----------------|------|---------|---------------|
| 1 | `#181818` | 7,219 | Dark fills, primary buttons, selected controls, text | `action/primary`, `text/primary` |
| 2 | `#FFFFFF` | 1,549 | White backgrounds, button labels, surfaces | `surface/primary`, `action/primaryContent`, `surface/elevated` |
| 3 | `#000000` | 1,412 | Black (icons, some fills) | `text/primary` (most cases) |
| 4 | `#F3F4F5` | 273 | Secondary button, input default bg, recipient bubble | `action/secondary`, `input/background`, `surface/secondary` |
| 5 | `#B1B8C2` | 259 | Disabled/muted elements, badge text | `text/tertiary`, `icon/disabled` |
| 6 | `#717680` | 216 | Secondary text, placeholders, helper text | `text/secondary`, `input/placeholder` |
| 7 | `#F2280D` | 184 | Error/destructive red | `status/error`, `action/destructive` |
| 8 | `#9BA3AE` | 181 | Tertiary icons, close buttons | `icon/tertiary` |
| 9 | `#EBECEF` | 92 | Borders, dividers | `border/default` |
| 10 | `#D6D9DD` | 60 | Control off-state, disabled borders | `border/strong`, `action/disabled` |
| 11 | `#F9FAFB` | 71 | Subtle backgrounds, card hover | `surface/secondary` |
| 12 | `#005CFF` | 70 | Accent blue (verified badge, sender bubble) | `accent/primary` |
| 13 | `#838D9B` | 51 | Tab bar unselected, muted icons | `icon/secondary` |
| 14 | `#00C230` | 40 | Success green | `status/success` |
| 15 | `#FF5A00` | 102 | Brand orange (token/network icons) | Primitive only (specialty) |
| 16 | `#8600FF` | 76 | Brand purple (profile pictures, icons) | Primitive only (specialty) |
| 17 | `#D80027` | 52 | Country flags, payment error | `status/error` or flag-specific |
| 18 | `#EA4076` | 60 | App icon pink | Primitive only (specialty) |
| 19 | `#191C20` | 160 | Near-black (alternative primary text) | `text/primary` |
| 20 | `#DADADA` | 51 | Stepper track, disabled elements | `border/default` |

**Pattern:** 8 of the top 10 colors map cleanly to our semantic tokens. The remaining 2 (`#000000`, `#B1B8C2`) need context-aware mapping since they're used in both text and icon contexts.

---

## 5. Scope Table: Correct Variable Scopes

Every variable should have scopes set explicitly. `ALL_SCOPES` / `ALL_FILLS` is never correct for a production system.

| Variable group | Scopes | Rationale |
|---------------|--------|-----------|
| `surface/*` | `FRAME_FILL, SHAPE_FILL` | Background fills only, not text or strokes |
| `text/*` | `TEXT_FILL` | Only appears in text color picker |
| `icon/*` | `ALL_FILLS, STROKE_COLOR` | Icons use both fills and strokes |
| `border/*` | `STROKE_COLOR` | Border = stroke, not fill |
| `border/translucent` | `STROKE_COLOR, SHAPE_FILL` | Sometimes used as a subtle card fill too |
| `action/*` | `FRAME_FILL, SHAPE_FILL` | Button backgrounds |
| `action/*Content` | `TEXT_FILL` | Text on buttons |
| `input/*` | `FRAME_FILL, SHAPE_FILL` | Input field backgrounds |
| `input/text`, `input/placeholder` | `TEXT_FILL` | Input text colors |
| `status/*` | `ALL_FILLS, STROKE_COLOR` | Status colors used in many contexts |
| `status/*Background` | `FRAME_FILL, SHAPE_FILL` | Banner/badge backgrounds |
| `accent/*` | `ALL_FILLS, STROKE_COLOR` | Accent used broadly |
| `accent/content` | `TEXT_FILL` | Text on accent surfaces |
| Primitives | `[]` (empty) | Hidden from all pickers. Designers use semantics, not primitives. |

---

## 5.5 Typography Scale

**Font:** World Pro MVP (variable font)
**Styles:** 12 (down from 21 in 4.0)

Weight system — 3 tiers:
- **SemiBold (600)** = page anchors (display, headings)
- **Medium (500)** = UI emphasis (subtitles/labels)
- **Light (300)** = reading (body, caption)

Each size appears once per weight role. No overlapping sizes across categories.

| Style | Weight | CSS | Size | Letter Spacing | Line Height | Role |
|-------|--------|-----|------|---------------|-------------|------|
| Display/D1 | SemiBold | 600 | 56 | -2% | 120% | Hero headlines, marketing |
| Headline/H1 | SemiBold | 600 | 34 | -1.5% | 120% | Page titles |
| Headline/H2 | SemiBold | 600 | 26 | -1% | 120% | Section headers |
| Headline/H3 | SemiBold | 600 | 22 | -0.5% | 120% | Subsections |
| Headline/H4 | SemiBold | 600 | 19 | -0.5% | 120% | Card titles, list group headers |
| Subtitles/S1 | Medium | 500 | 17 | 0% | 120% | Button text (large/medium), nav items |
| Subtitles/S2 | Medium | 500 | 15 | 0% | 120% | Button text (small), tabs |
| Subtitles/S3 | Medium | 500 | 13 | 0.3% | 120% | Tags, badges, metadata |
| Body/B1 | Light | 300 | 17 | 0% | 150% | Primary reading text |
| Body/B2 | Light | 300 | 15 | 0% | 150% | Default reading text |
| Body/B3 | Light | 300 | 13 | 0% | 140% | Secondary descriptions |
| Caption/C1 | Light | 300 | 11 | 0.3% | 140% | Timestamps, footnotes, help text |

**Line height system (3 values):**
- **120%** — Single-line text: Display, Headline, Subtitles
- **140%** — Small text: Body/B3, Caption/C1
- **150%** — Paragraphs: Body/B1, Body/B2

**What changes from 4.0:**
- Number killed (5 styles removed). Use `font-variant-numeric: tabular-nums` as a modifier on any heading/subtitle style. Zero duplication.
- Subtitle trimmed from 4 → 3 (S4 at 13px merged with S3). Absorbs Label role from 4.0.
- 21 → 12 styles. Every size appears once per weight role.
- Progressive letter spacing: -2% at 56px → -1.5% at 34 → -1% at 26 → -0.5% at 19-22 → 0% at 13-17 → +0.3% at 11.
- Body line heights bumped to 150% for paragraph readability.
- Caption/C1 added at 11px (fills gap for utility text below 13px).
- For numeric display: apply tabular-nums + tighter letter spacing (-1%) as a component-level modifier on any heading/subtitle style.

---

## 6. Component Migration Plan — Detailed Specs

Rebuild 4.0 components on the 5.0 variable foundation. Each spec defines the target component structure, variants, properties, and exact variable bindings.

### Phase 1 — Core (week 1)

#### 6.1 Button

**Structure:** Single component set (merge Button + Icon Button into one).
Each variant uses a two-frame structure: transparent outer Component (fixed size) wrapping an inner Container (visual button). This enables Smart Animate on Pressed state without layout jump.

| Property | Type | Values |
|----------|------|--------|
| Variant | Variant | Primary, Secondary, Tertiary, Ghost |
| Size | Variant | Large (48px), Small (32px) |
| State | Variant | Default, Pressed, Disabled |
| Content | Variant | Label, Icon + Label, Icon only |
| Left icon | Instance swap | — |

**Current:** 72 variants (4 types × 2 sizes × 3 states × 3 content). Destructive and Loading deferred.

**Sizing update (from Apps 5.0 Handoff):** All primary action buttons are 48px. The handoff file used 56px, but going forward the standard is 48px for all full-width CTAs. Small (32px) exists for inline/compact contexts only. Medium (40px) dropped — not used in any handoff screen.

**Shape:** Full pill (`border-radius: 100px` / `rounded-full`). Confirmed across all button instances in the handoff. No square or slightly-rounded variants.

**Variable bindings per variant:**

| Variant | Background | Text/Icon | Border | Pressed effect |
|---------|-----------|-----------|--------|----------------|
| Primary | `action/primary` | `action/primaryContent` | none | 0.95 scale (Container HUG) |
| Secondary | `action/secondary` | `action/secondaryContent` | none | 0.95 scale (Container HUG) |
| Tertiary | `action/tertiary` | `action/tertiaryContent` | `border/default` | 0.95 scale + `surface/secondary` bg |
| Ghost | `action/ghost` | `action/ghostContent` | none | 0.95 scale (Container HUG) |
| Disabled (all) | `action/disabled` | `action/disabledContent` | none | — |

**Deferred variants (add later):**
- Destructive (type) — `action/destructive` + `action/destructiveContent`
- Loading (state) — spinner replaces label, inherits content color
- Right icon (instance swap slot)

**What changes from 4.0:**
- Icon Button merges in as `Content = Icon only`
- Sizing simplified to 2 tiers: Large (48px) for all primary CTAs, Small (32px) for inline/compact
- Secondary and Tertiary swapped: Secondary is now the grey filled button (more prominent), Tertiary is the outlined/transparent button (least prominent)
- Pressed state uses 0.95 scale (inner Container shrinks within fixed-size outer frame) for smooth Smart Animate transitions
- Success/Failed states removed from Button (handled by Toast or inline status)

---

#### 6.2 Input

**Structure:** Consolidate 9 component sets into 2: `Text Field` and `Select`.

**Text Field** (covers: text field, password, phone number, wallet address, search, text area, code input)

| Property | Type | Values |
|----------|------|--------|
| Variant | Variant | Default, Focused, Filled, Error, Disabled |
| Type | Variant | Text, Password, Phone, Search, TextArea, Code, WalletAddress |
| Label position | Variant | Outside, Inside, None |
| Show helper text | Boolean | — |
| Show left icon | Boolean | — |
| Show right icon | Boolean | — |
| Left icon | Instance swap | — |
| Right icon | Instance swap | — |
| Helper text | Text | — |
| Label text | Text | — |

**Variable bindings:**

| State | Background | Border | Label | Value text | Placeholder | Helper |
|-------|-----------|--------|-------|-----------|-------------|--------|
| Default | `input/background` | none | `text/secondary` | — | `input/placeholder` | `text/tertiary` |
| Focused | `input/backgroundFocus` | `border/focus` | `text/secondary` | `input/text` | `input/placeholder` | `text/tertiary` |
| Filled | `input/backgroundFocus` | `border/default` | `text/secondary` | `input/text` | — | `text/tertiary` |
| Error | `input/backgroundFocus` | `input/error` | `status/error` | `input/text` | — | `status/error` |
| Disabled | `action/disabled` | none | `text/disabled` | `text/disabled` | — | `text/disabled` |

**Select** (dropdown)

| Property | Type | Values |
|----------|------|--------|
| State | Variant | Default, Filled, Open, Disabled |
| Show flag | Boolean | — |
| Show helper text | Boolean | — |

Same color binding pattern as Text Field, plus chevron icon → `icon/secondary`.

**What changes from 4.0:**
- 9 component sets → 2. The `Type` variant handles specialization.
- Added Disabled state (missing in 4.0)
- Search Field gets its own `Type` variant instead of being a separate component
- Suffix input variant becomes a slot (right icon/text swap) rather than a separate component

---

#### 6.3 List Item (new component)

Most repeated pattern across Token-Sync screens. Not a 4.0 component, needs creation from scratch.

| Property | Type | Values |
|----------|------|--------|
| Left content | Variant | Icon, Avatar, Token, None |
| Right content | Variant | Text, Icon, Toggle, Badge, None |
| Show description | Boolean | — |
| Show divider | Boolean | — |
| Active | Variant | Default, Active, Disabled |
| Left icon | Instance swap | — |
| Right icon | Instance swap | — |

**Variable bindings:**

| Element | Token |
|---------|-------|
| Background (default) | `surface/primary` |
| Background (active) | `surface/secondary` |
| Title | `text/primary` |
| Description | `text/secondary` |
| Right text (meta) | `text/tertiary` |
| Left icon | `icon/secondary` |
| Right icon/chevron | `icon/tertiary` |
| Divider | `border/divider` |
| Badge background | `accent/primary` |
| Badge text | `accent/content` |

---

### Phase 2 — Navigation & Feedback (week 2)

#### 6.4 Top Bar

**Structure:** Single component set (merge iOS + Android + MiniApps).

| Property | Type | Values |
|----------|------|--------|
| Type | Variant | Default, Profile, Controls, Stepper |
| Show title | Boolean | — |
| Show subtitle | Boolean | — |
| Show left action | Boolean | — |
| Show right action | Boolean | — |
| Left action | Instance swap | — |
| Right action | Instance swap | — |
| Title | Text | — |
| Subtitle | Text | — |

**Variable bindings:** Background `surface/primary`, title `text/primary`, subtitle `text/secondary`, icons `icon/primary`, stepper track `border/default`, stepper fill `action/primary`.

**What changes from 4.0:**
- 3 component sets → 1 (no more iOS/Android/MiniApp split)
- Platform chrome handled by a separate Status Bar component that wraps the Top Bar

---

#### 6.5 Tab Bar

**Structure:** Single component set.

| Property | Type | Values |
|----------|------|--------|
| Active tab | Variant | 1, 2, 3, 4 |
| Show notification | Boolean (per tab) | — |
| Tab 1-4 icon | Instance swap | — |
| Tab 1-4 label | Text | — |

**Variable bindings:** Background `surface/primary`, active icon/text `icon/primary` + `text/primary`, inactive icon/text `icon/secondary` + `text/secondary`, notification dot `status/error`, top border `border/subtle`.

**What changes from 4.0:**
- 3 component sets → 1
- Tab labels become text properties (editable) instead of hardcoded "Home", "Wallet", "Chat", "World ID"
- Notification dot added as a boolean per tab

---

#### 6.6 Bottom Bar (Sticky Action Bar)

**Structure:** Single component set (merge Bottom Bar iOS/Android + Sticky Button Bar).

| Property | Type | Values |
|----------|------|--------|
| Layout | Variant | Single button, Dual button, Vertical |
| Show terms | Boolean | — |
| Primary button | Boolean | — |
| Secondary button | Boolean | — |

**Variable bindings:** Background `surface/primary`, border-top `border/subtle`, buttons inherit from Button component (nested instance).

---

#### 6.7 Toast / Snackbar

**Structure:** Single component set.

| Property | Type | Values |
|----------|------|--------|
| Status | Variant | Success, Error, Warning, Info |
| Show action | Boolean | — |
| Icon | Instance swap | — |
| Message | Text | — |
| Action label | Text | — |

**Variable bindings:**

| Status | Background | Icon | Text |
|--------|-----------|------|------|
| Success | `status/successBackground` | `status/success` | `text/primary` |
| Error | `status/errorBackground` | `status/error` | `text/primary` |
| Warning | `status/warningBackground` | `status/warning` | `text/primary` |
| Info | `status/infoBackground` | `status/info` | `text/primary` |

**What changes from 4.0:** 2 states → 4. Added action button. Added icon swap slot.

---

#### 6.8 Drawer / Bottom Sheet

**Structure:** Single component set.

| Property | Type | Values |
|----------|------|--------|
| State | Variant | Default, Loading, Success, Error |
| Show illustration | Boolean | — |
| Show buttons | Boolean | — |
| Show close | Boolean | — |
| Illustration | Instance swap | — |
| Title | Text | — |
| Description | Text | — |

**Variable bindings:** Sheet `surface/elevated`, scrim `surface/overlay`, title `text/primary`, description `text/secondary`, close icon `icon/tertiary`. Buttons are nested Button instances.

**What changes from 4.0:** 3 component sets → 1 (no iOS/Android split). Verify with World ID becomes a pattern/usage example, not a separate component.

---

### Phase 3 — Content & Feature (week 3)

#### 6.9 Controls (Toggle, Checkbox, Radio)

Keep as 3 separate component sets (they're fundamentally different interactions) but add missing states.

**Toggle:**

| Property | Type | Values |
|----------|------|--------|
| State | Variant | Off, On, Disabled Off, Disabled On |

**Bindings:** On track `action/primary`, on thumb `action/primaryContent`, off track `border/strong`, off thumb `surface/primary`, disabled track `action/disabled`, disabled thumb `action/disabledContent`.

**Checkbox and Radio:** Same state pattern. Add `Indeterminate` for Checkbox.

---

#### 6.10 Segmented Control

| Property | Type | Values |
|----------|------|--------|
| Count | Variant | 2, 3, 4 |
| Selected | Variant | 1, 2, 3, 4 |
| Segment labels | Text × 4 | — |

**Bindings:** Selected pill `surface/primary` (with shadow), unselected `transparent`, track `surface/secondary`, text `text/primary`.

---

#### 6.11 Card

New component (extracted from Token-Sync screen patterns).

| Property | Type | Values |
|----------|------|--------|
| Variant | Variant | Elevated, Outlined, Flat |
| Show header | Boolean | — |
| Show footer | Boolean | — |
| Show image | Boolean | — |

**Bindings:** Elevated background `surface/elevated`, outlined background `surface/primary` + border `border/default`, flat background `surface/secondary`.

---

#### 6.12 Badge / Chip

| Property | Type | Values |
|----------|------|--------|
| Variant | Variant | Filled, Outlined, Dot |
| Status | Variant | Default, Success, Error, Warning, Info |
| Size | Variant | Small, Medium |
| Label | Text | — |

**Bindings:** Default filled `accent/primary` + `accent/content`. Status variants use respective `status/*` + `status/*Background` tokens.

---

### Phase 3.5 — Patterns from Apps 5.0 Handoff (Prism)

Discovered from auditing the [Apps 5.0 Handoff (Prism)](https://www.figma.com/design/Gj7UNmXWBsjjyCoiASr0wd) file, node `107:5369` (NFC ID flows). These patterns repeat across 10+ screens and should be standardized as components or templates.

#### 6.13 Status Screen (template component)

The most repeated layout in the handoff. Used for every error, confirmation, and blocker state: "Country not supported", "No photo loaded", "ID already added", "ID expired", "ID expiring soon", "This device is not compatible", "You must be 18+", "Possible scan issues".

| Property | Type | Values |
|----------|------|--------|
| Icon | Instance swap | — |
| Icon variant | Variant | Neutral, Info, Error, Success, Warning |
| Position | Variant | Centered, Top-aligned |
| Title | Text | — |
| Description | Text | — |
| Show secondary text | Boolean | — |
| Button layout | Variant | Single, Dual, None |
| Primary button | Instance (Button) | — |
| Secondary button | Instance (Button) | — |

**Layout spec:**
- Full screen with `Position` variant: Centered (icon at vertical center) or Top-aligned (icon in upper third, more room for descriptions)
- Top Bar at top (Close × or Back ←)
- Icon Circle: 88px, centered
- Title: H2 (30px SemiBold), centered, 16px below icon
- Description: B2 (17px Light), `text/secondary`, centered, 12px below title
- Bottom Bar with button(s) at bottom

**Variable bindings:**

| Element | Token |
|---------|-------|
| Background | `surface/primary` |
| Icon circle (neutral) | `surface/secondary` + `icon/primary` |
| Icon circle (info) | `accent/primary` + white icon |
| Icon circle (error) | `status/errorBackground` + `status/error` |
| Icon circle (success) | `status/successBackground` + `status/success` |
| Title | `text/primary` |
| Description | `text/secondary` |

**Interaction states:**

| Context | Loading | Empty | Error | Success | Partial |
|---------|---------|-------|-------|---------|---------|
| Status Screen | Spinner replaces icon, title shows "Processing..." | N/A (always has content) | Icon=Error style, description explains what went wrong, CTA = retry/go back | Icon=Success style, description confirms action, CTA = continue/done | Icon=Warning style, description explains limitation |

**Why this matters:** Without this template, every screen that needs an error/result state gets hand-built from scratch. The handoff shows 10+ instances in just the NFC flow. Across the full app, this is probably 50+ screens.

---

#### 6.14 Icon Circle

Reusable icon-in-circle used on Status Screens, Drawers, and Intro Screens.

| Property | Type | Values |
|----------|------|--------|
| Size | Variant | Large (88px), Medium (64px), Small (44px) |
| Style | Variant | Neutral, Accent, Error, Success, Warning, Custom |
| Icon | Instance swap | — |

**Variable bindings:**

| Style | Background | Icon color |
|-------|-----------|------------|
| Neutral | `surface/secondary` | `icon/primary` |
| Accent | `accent/primary` | `action/primaryContent` (white) |
| Error | `status/errorBackground` | `status/error` |
| Success | `status/successBackground` | `status/success` |
| Warning | `status/warningBackground` | `status/warning` |
| Custom | — (brand-specific fill) | — |

This is extracted from the existing "Generic Icon" component in 4.0, but renamed and repositioned as a core building block. The handoff proves it's not just for crypto tokens — it's the universal status indicator across all flows.

---

#### 6.15 Alert Dialog

System-style dialog seen in camera permission flow and error states. Distinct from Drawer (which slides from bottom with scrim).

| Property | Type | Values |
|----------|------|--------|
| Title | Text | — |
| Description | Text | — |
| Button layout | Variant | Side-by-side, Stacked |
| Primary button label | Text | — |
| Secondary button label | Text | — |

**Layout spec:**
- Centered on screen, max width ~270px
- Rounded corners (14px, matching iOS system)
- Background: `surface/elevated`
- Title: H4 (19px SemiBold), left-aligned
- Description: B3 (13px Light), `text/secondary`
- Buttons: compact size (Small 32px), side by side

**Variable bindings:** Background `surface/elevated`, title `text/primary`, description `text/secondary`, scrim `surface/overlay`.

**Interaction states:** Alert Dialog is stateless by design. It appears, the user taps a button, it dismisses. No loading, error, or partial states. If a loading state is needed, use the Drawer/Bottom Sheet instead.

**Decision deferred:** Whether this is a custom component or native OS dialog will be decided during implementation. Custom gives cross-platform consistency, native gives platform feel. For now, include in the component spec but mark as optional build.

---

#### Patterns (not components, but standardized layouts)

**Intro Screen / Onboarding Step** — "Bring your ID", "Remove any phone case":
- Illustration area (top ~55%, `surface/secondary` background)
- Title + description below
- Progress tracker in Top Bar
- Single primary CTA in Bottom Bar
- Standardize as a Figma template page, not a component. The illustration area varies too much.

**Scan Overlay / Camera Viewfinder** — ID scan, passport scan (front, back, inner):
- Camera feed as background
- Viewfinder frame (rounded rectangle overlay, `border/focus` stroke)
- Scanner line animation indicator
- Instructions text above viewfinder
- "Enter manually" tertiary button at bottom
- Feature-specific. Define layout rules but not a generic component.

---

### Phase 4 — Chat (week 4, optional)

Chat components are complex enough to be their own project. Recommended approach:

**Keep as public components (8):**
1. Chat List Item (from Chats)
2. Sender Bubble
3. Recipient Bubble
4. Chat Input Bar (from Thread Input Bar)
5. Profile Picture
6. Message Status
7. Chat Banner
8. Chat Divider

**Mark as private (prefix with `_`) (14):**
- `_Messages' preview`, `_Messages' statuses`, `_Reaction`, `_Verification badge`, `_Link`, `_Replies`, `_Photos`, `_Sender Payment`, `_Recipient Payment`, `_Recipient group chat`, `_External list avatar`, `_Internal Chat avatar`, `_Group pictures`, `_Contact info`

These become internal building blocks, not directly usable in the asset panel.

---

## 7. Recommended Figma Component Structure

### 7.1 Component Naming Convention

Use Figma's `/` syntax for component organization. Each component lives under a clear category.

```
Core / Button
Core / Icon Button          → DEPRECATED, merged into Core / Button (Content = Icon only)
Core / Controls / Toggle
Core / Controls / Checkbox
Core / Controls / Radio
Core / Input / Text Field
Core / Input / Select
Core / List Item
Core / Card
Core / Badge
Core / Icon Circle

Navigation / Top Bar
Navigation / Tab Bar
Navigation / Bottom Bar

Feedback / Toast
Feedback / Drawer
Feedback / Alert Dialog
Feedback / Spinner
Feedback / Progress Bar

Templates / Status Screen

Content / Segmented Control
Content / Bullet List

Data / Token Icon
Data / Network Icon
Data / App Icon
Data / State Icon
Data / Payment Method
Data / Provider
Data / Crypto App

Chat / Sender Bubble
Chat / Recipient Bubble
Chat / Chat List Item
Chat / Chat Input
Chat / Profile Picture
Chat / Message Status
Chat / Banner
Chat / Divider
```

### 7.2 Figma File Page Structure

```
📄 Cover
📄 Getting Started
   (How to use the library, how to enable variables, where to find tokens)
──── SEPARATOR ────
📄 Foundations / Color Primitives
   (Visual swatches with hex values, matching 4.0's documentation style)
📄 Foundations / Semantic Tokens
   (Token table: Name | Description | Light | Dark)
📄 Foundations / Typography
   (Text styles with usage guidelines)
📄 Foundations / Spacing & Layout
   (Scale visual + usage examples)
📄 Foundations / Iconography
   (Icon grid, sizes, usage rules)
──── SEPARATOR ────
📄 Components / Core
   (Button, Input, List Item, Card, Badge, Controls, Icon Circle)
📄 Components / Navigation
   (Top Bar, Tab Bar, Bottom Bar)
📄 Components / Feedback
   (Toast, Drawer, Alert Dialog, Spinner, Progress Bar)
📄 Components / Content
   (Segmented Control, Bullet List)
📄 Components / Data Display
   (Token icons, Networks, States, Payment methods, etc.)
──── SEPARATOR ────
📄 Components / Chat
   (All chat-specific components on a single page)
──── SEPARATOR ────
📄 Templates / Status Screen
   (Error, success, blocker, confirmation — the most used layout in the app)
📄 Patterns / Intro Screen / Onboarding Step
📄 Patterns / Settings List
📄 Patterns / App Grid
📄 Patterns / Transaction Flow
📄 Patterns / Scan Overlay
──── SEPARATOR ────
📄 Reference / Color Migration (4.0 → 5.0)
📄 Reference / Component Changes (4.0 → 5.0)
```

### 7.3 Component Property Best Practices

Rules for all components in the new system:

1. **Variant dimensions max 3.** If a component needs more, use boolean/instance swap properties instead. 4.0 already does this well (e.g., `Show icon` boolean instead of Icon variant).

2. **Naming convention for properties:**
   - Variants: PascalCase (`Size`, `State`, `Type`)
   - Booleans: "Show [element]" (`Show icon`, `Show divider`)
   - Instance swaps: Use the icon's purpose (`Left icon`, `Right icon`)
   - Text props: Use the content description (`Label`, `Title`, `Description`)

3. **No platform variants in most components.** Only components that truly differ between iOS and Android get a `Device` variant (Tab Bar, if the indicator style differs). Everything else should be platform-agnostic.

4. **Private sub-components use `_` prefix.** `_bullet`, `_TabBar` (already done in 4.0), but extend to all internal pieces. This keeps the asset panel clean.

5. **Every visible fill and stroke must be bound to a variable.** Zero hardcoded colors in any published component. If a color is brand-specific (token logo), it gets a specific primitive variable binding, not a hex value.

---

## 8. Naming Migration Table

For teams transitioning from 4.0 to 5.0.

| UI Kit 4.0 token | UI Kit 5.0 token | Notes |
|-------------------|------------------|-------|
| `color-bg-background` | `surface/primary` | |
| `color-bg-subtle` | `surface/secondary` | |
| `color-bg-muted` | `surface/tertiary` | |
| `color-bg-item` | `surface/tertiary` | Context-specific in 4.0, generalized in 5.0 |
| `color-bg-inverse` | `surface/primary` (dark mode) | Handled by theme modes now |
| `color-border-default` | `border/default` | |
| `color-text-default` | `text/primary` | |
| `color-text-description` | `text/secondary` | |
| `color-text-small-titles` | `text/tertiary` | |
| `color-bg-danger-default` | `status/errorBackground` | |
| `color-text-danger-default` | `status/error` | |
| `color-text-danger-inverse` | `text/inverse` | Handled by theme modes now |
| `color-bg-warning-default` | `status/warningBackground` | |
| `color-text-warning-default` | `status/warning` | |

### Component Name Changes

| UI Kit 4.0 | UI Kit 5.0 | Why |
|-----------|-----------|-----|
| Button + Icon Button | Core / Button | Merged. Icon-only is a `Content` variant. |
| Topbar (iOS) + Topbar (Android) + Top Bar MiniApps | Navigation / Top Bar | Merged. No platform split. |
| Tab-Bar_iOS + Tab-Bar_Android | Navigation / Tab Bar | Merged. |
| Bottom Bar_iOS + Bottom Bar_Android + Sticky Button Bar | Navigation / Bottom Bar | Merged. |
| Drawer Generic (iOS) + Drawer Generic (Android) | Feedback / Drawer | Merged. |
| Text Field + Text Field with Suffix + Password + Phone Number + Wallet Address + Text Area + Code + Search Field | Core / Input / Text Field | Consolidated. `Type` variant handles specialization. |
| Toggle + Checkbox + Radio | Core / Controls / Toggle, etc. | Kept separate but moved under Controls group. |
| List card | Core / List Item | Renamed for generality. |
| Toast Message | Feedback / Toast | Added Warning + Info variants. |

---

## 9. Figma File Strategy

### Option A: Single file (recommended for < 10 designers)
Merge everything into UI Kit 5.0. One file = one source of truth. Simpler publishing, simpler versioning.

### Option B: Split library (recommended for 10+ designers)
- **Foundations file** — Variables, text styles, effect styles. Published as a Figma library.
- **Components file** — Consumes the Foundations library. Components built with variable bindings.
- **Screens file** — Uses component instances. Never hardcodes values.

For the current team size, **Option A is the move**. Split later when the team grows.

---

## 10. Code Syntax Setup

Every semantic variable needs code syntax so Dev Mode shows the right token name per platform.

| Variable | WEB | ANDROID | iOS |
|----------|-----|---------|-----|
| `surface/primary` | `var(--wds-surface-primary)` | `Wds.colors.surfacePrimary` | `WdsTheme.light.surfacePrimary` |
| `text/primary` | `var(--wds-text-primary)` | `Wds.colors.textPrimary` | `WdsTheme.light.textPrimary` |
| `action/ghost` | `var(--wds-action-ghost)` | `Wds.colors.actionGhost` | `WdsTheme.light.actionGhost` |
| ... | (same pattern for all 49) | | |

The pattern is mechanical: `group/role` → `--wds-{group}-{role}` (CSS), `{group}{Role}` (camelCase for Kotlin/Swift).

---

## 11. Quality Checklist Before Launch

- [ ] All 49 semantic variables have `codeSyntax` set for WEB, ANDROID, iOS
- [ ] All semantic variables have scopes set per the scope table (no `ALL_SCOPES`)
- [ ] All semantic variables have descriptions
- [ ] All primitives have scopes set to `[]` (hidden from pickers)
- [ ] Button component rebuilt with variable bindings (5 variants × 3 sizes × 4 states)
- [ ] Input component consolidated and rebuilt (2 component sets from 9)
- [ ] List Item component created with variable bindings
- [ ] Top Bar merged and rebuilt (1 set from 3)
- [ ] Tab Bar merged and rebuilt (1 set from 3)
- [ ] Bottom Bar merged and rebuilt (1 set from 3)
- [ ] Toast expanded to 4 states and rebuilt
- [ ] Drawer merged and rebuilt (1 set from 3)
- [ ] Controls have disabled states added
- [ ] Status Screen template created with 5 icon variants
- [ ] Icon Circle component created (3 sizes × 6 styles)
- [ ] Alert Dialog component created
- [ ] All private sub-components prefixed with `_`
- [ ] Token documentation page created (matching 4.0 format)
- [ ] Migration guide published for designers
- [ ] `npm run build` passes with 0 contrast failures
- [ ] Preview HTML updated to show all 49 tokens with live theme toggle

---

## 12. What's NOT in Scope

| Decision | Rationale |
|----------|-----------|
| Typography variables in Figma | Text styles are more appropriate than variables for type. Figma's text variable support is limited. |
| Spacing aliases in semantic layer | Direct spacing scale works fine. No need for `spacing/button-padding` aliases yet. |
| Dark mode for specialty colors | Specialty colors (World Blue, Carrot Orange, Purple) are brand-locked. They don't change per theme. |
| Motion/animation tokens | Figma doesn't support motion variables. Define in code only. |
| Multi-brand theming | Single brand (World). If white-labeling is needed later, add a Brand mode to the Semantic collection. |
| Full Chat component rebuild | Chat is complex enough for its own project. Include in Phase 4 only if bandwidth allows. |
| Alert Dialog: custom vs native | Deferred to implementation phase. Custom gives cross-platform consistency. Native gives platform-native feel. |
| Scan Overlay as Figma component | Deferred. Camera viewfinder varies too much per document type. Define layout rules in documentation instead. |

---

## 13. Effort Estimate

| Phase | Scope | Effort |
|-------|-------|--------|
| **P0 fixes** | Code syntax, scopes, descriptions on all 49 variables | ~2 hours |
| **Phase 1: Core** | Button (merge + rebuild), Input (consolidate 9→2), List Item (new) | ~5 hours |
| **Phase 2: Nav + Feedback** | Top Bar, Tab Bar, Bottom Bar, Toast, Drawer (merge + rebuild) | ~4 hours |
| **Phase 3: Content** | Controls (add states), Segmented, Card (new), Badge (new) | ~3 hours |
| **Phase 3.5: Handoff patterns** | Status Screen (template), Icon Circle, Alert Dialog | ~2 hours |
| **Phase 4: Chat** | 8 public + 14 private component refactor | ~5 hours |
| **Documentation** | Token docs, migration guide, getting started, reference pages | ~3 hours |
| **QA + polish** | Contrast audit, preview update, variable coverage check | ~1 hour |
| **Total** | | **~25 hours** |

With AI assistance (Figma MCP + code generation), the component phases compress significantly. Realistic timeline: **2-3 weeks** of focused work, prioritizing P0 + Phase 1 + Phase 2 in the first week.

### Priority order if time is limited

1. **P0 fixes** (2h) — biggest bang for buck, no new components needed
2. **Phase 1: Button** (2h) — most-used component, proves the pattern
3. **Phase 1: Input** (2h) — second most-used, consolidation saves future pain
4. **Phase 2: Top Bar + Tab Bar + Bottom Bar** (2h) — navigation frame, every screen uses these
5. **Phase 1: List Item** (1h) — the missing workhorse pattern
6. **Phase 3.5: Status Screen** (1h) — the single most repeated layout in handoff (10+ screens in NFC alone)
7. Everything else follows naturally

---

## 14. Component Count Summary

| Category | 4.0 components | 5.0 target | Reduction |
|----------|---------------|-----------|-----------|
| Core interaction | 3 (Button, Icon Button, Controls×3) → 5 sets | 5 (Button, Toggle, Checkbox, Radio, Progress) | Icon Button merged |
| Input | 9 component sets | 2 (Text Field, Select) | 78% fewer sets |
| Navigation | 8 sets (3 Top Bar + 3 Tab Bar + 2 Bottom Bar) | 3 (Top Bar, Tab Bar, Bottom Bar) | 63% fewer sets |
| Feedback | 4 sets (3 Drawer + 1 Toast) | 4 (Drawer, Toast, Spinner, Alert Dialog) | Drawer merged, Alert new |
| Content | 3 (List Card, Segmented, Bullet List) | 5 (List Item, Segmented, Card, Badge, Bullet List) | 2 new, 0 removed |
| Patterns/Templates | 0 | 2 (Status Screen, Icon Circle) | New from handoff audit |
| Data display | 9 sets | 9 sets (unchanged) | Brand-specific, keep as-is |
| Chat | 22 sets | 8 public + 14 private | Same count, better organization |
| App icons + Marble | 2 | 2 | No change |
| **Total** | **~60 component sets** | **~55 component sets** | **8% fewer sets, but +3 new building blocks from handoff audit** |

The real win isn't fewer components. It's fewer component sets doing the same job (9 input types → 2, 8 navigation bars → 3), plus 100% variable binding coverage. The new additions (Status Screen, Icon Circle, Alert Dialog) aren't overhead — they're patterns already used on 10+ screens that were previously hand-built each time.

---

*Generated from deep audit of [UI Kit 4.0](https://www.figma.com/design/rQyitWCsRVKHsR26qsZHdX) (40+ component sets, 600+ variants) and [Token-Sync explorations](https://www.figma.com/design/XTLslMtyGZqSYafCujW0X3) on 2026-04-02. Updated 2026-04-03 with full component inventory and Figma structure recommendations. Updated 2026-04-06 with component patterns from [Apps 5.0 Handoff (Prism)](https://www.figma.com/design/Gj7UNmXWBsjjyCoiASr0wd) NFC ID flow audit — added Status Screen, Icon Circle, Alert Dialog, and button sizing standardization (48px).*

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | CLEAN | 5 proposals, 0 accepted, 0 deferred. Mode: SELECTIVE_EXPANSION, 2 critical gaps (accepted) |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAN | 5 issues, 5 accepted. Scope expanded to all 3 P0 metadata items (codeSyntax + scopes + descriptions). Refactored push script to read source JSONs (fixes 11-variable naming bug), push VariableAlias chains, compute codeSyntax for WEB/ANDROID/iOS. Added vitest + 45 unit tests. |
| Design Review | `/plan-design-review` | UI/UX gaps | 2 | CLEAN | Run 2: Figma handoff audit (Apps 5.0 Prism NFC). Added 3 components (Status Screen, Icon Circle, Alert Dialog), button sizing 48px, 7 review passes. Score: 8/10 → 9/10. 1 deferred (Alert Dialog custom vs native). |

- **UNRESOLVED:** 1 deferred decision (Alert Dialog: custom vs native OS)
- **VERDICT:** CEO + DESIGN + ENG CLEARED. Ready to ship.
