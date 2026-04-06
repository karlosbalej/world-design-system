/**
 * Pure utility functions for the Figma variable push script.
 * Separated for testability — no side effects, no I/O.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TokenEntry {
  path: string[];
  rawValue: string;
}

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface CodeSyntax {
  WEB: string;
  ANDROID: string;
  iOS: string;
}

// ---------------------------------------------------------------------------
// Token tree walker
// ---------------------------------------------------------------------------

/**
 * Recursively walk a DTCG-format JSON object, collecting leaf tokens.
 * A leaf is any object with a `$value` property.
 */
export function walkTokenTree(
  obj: Record<string, unknown>,
  basePath: string[] = [],
): TokenEntry[] {
  const entries: TokenEntry[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;

    const currentPath = [...basePath, key];

    if (typeof value === 'object' && value !== null) {
      const record = value as Record<string, unknown>;

      if ('$value' in record && typeof record.$value === 'string') {
        entries.push({ path: currentPath, rawValue: record.$value });
      } else {
        entries.push(...walkTokenTree(record, currentPath));
      }
    }
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Naming helpers
// ---------------------------------------------------------------------------

/**
 * Join path segments as kebab-case, splitting camelCase within segments.
 * ["action", "primaryContent"] → "action-primary-content"
 */
export function toKebab(segments: string[]): string {
  return segments
    .join('-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Join path segments as camelCase.
 * ["action", "primaryContent"] → "actionPrimaryContent"
 */
export function toCamel(segments: string[]): string {
  return segments
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join('');
}

// ---------------------------------------------------------------------------
// Code syntax
// ---------------------------------------------------------------------------

/**
 * Compute platform-specific code syntax for a semantic token.
 * @param pathSegments - path after stripping "semantic", e.g. ["surface", "primary"]
 */
export function computeCodeSyntax(pathSegments: string[]): CodeSyntax {
  const kebab = toKebab(pathSegments);
  const camel = toCamel(pathSegments);
  return {
    WEB: `var(--wds-${kebab})`,
    ANDROID: `Wds.colors.${camel}`,
    iOS: `WdsTheme.light.${camel}`,
  };
}

// ---------------------------------------------------------------------------
// Scope derivation
// ---------------------------------------------------------------------------

const SCOPE_MAP: Record<string, string[]> = {
  surface: ['FRAME_FILL', 'SHAPE_FILL'],
  text: ['TEXT_FILL'],
  icon: ['ALL_FILLS', 'STROKE_COLOR'],
  border: ['STROKE_COLOR'],
  action: ['FRAME_FILL', 'SHAPE_FILL'],
  input: ['FRAME_FILL', 'SHAPE_FILL'],
  status: ['ALL_FILLS', 'STROKE_COLOR'],
  accent: ['ALL_FILLS', 'STROKE_COLOR'],
};

const SCOPE_OVERRIDES: Record<string, string[]> = {
  'border/translucent': ['STROKE_COLOR', 'SHAPE_FILL'],
  'action/primaryContent': ['TEXT_FILL'],
  'action/secondaryContent': ['TEXT_FILL'],
  'action/tertiaryContent': ['TEXT_FILL'],
  'action/destructiveContent': ['TEXT_FILL'],
  'action/disabledContent': ['TEXT_FILL'],
  'action/ghostContent': ['TEXT_FILL'],
  'input/text': ['TEXT_FILL'],
  'input/placeholder': ['TEXT_FILL'],
  'input/error': ['STROKE_COLOR'],
  'input/divider': ['STROKE_COLOR'],
  'status/errorBackground': ['FRAME_FILL', 'SHAPE_FILL'],
  'status/warningBackground': ['FRAME_FILL', 'SHAPE_FILL'],
  'status/successBackground': ['FRAME_FILL', 'SHAPE_FILL'],
  'status/infoBackground': ['FRAME_FILL', 'SHAPE_FILL'],
  'accent/content': ['TEXT_FILL'],
};

/**
 * Derive Figma VariableScope array from the semantic variable's Figma name.
 * Uses specific overrides first, then falls back to group-level defaults.
 */
export function deriveScopes(figmaName: string): string[] {
  if (figmaName in SCOPE_OVERRIDES) return SCOPE_OVERRIDES[figmaName];
  const group = figmaName.split('/')[0];
  if (group in SCOPE_MAP) return SCOPE_MAP[group];
  console.warn(`Unknown scope group: "${group}" — defaulting to ALL_FILLS`);
  return ['ALL_FILLS'];
}

// ---------------------------------------------------------------------------
// Reference parsing
// ---------------------------------------------------------------------------

/**
 * Parse a DTCG $value string. Returns either a reference path or null.
 * "{color.white}" → ["color", "white"]
 * "#000000CC"     → null
 */
export function parseTokenReference(value: string): string[] | null {
  const match = value.match(/^\{(.+)\}$/);
  if (match) return match[1].split('.');
  return null;
}

// ---------------------------------------------------------------------------
// Hex → Figma color
// ---------------------------------------------------------------------------

export function hexToFigmaColor(hex: string): FigmaColor {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

// ---------------------------------------------------------------------------
// Value resolution (reference → alias, hex → color)
// ---------------------------------------------------------------------------

export type ModeValue = FigmaColor | { type: 'VARIABLE_ALIAS'; id: string };

/**
 * Resolve a raw DTCG $value into a Figma mode value.
 * - Token references become VariableAlias if the target exists in primitiveIdMap.
 * - Falls back to resolved hex via primitiveHexMap.
 * - Hex strings are converted to FigmaColor directly.
 * Returns null if the reference cannot be resolved at all.
 */
export function resolveValue(
  rawValue: string,
  primitiveIdMap: Map<string, string>,
  primitiveHexMap: Map<string, string>,
): ModeValue | null {
  const ref = parseTokenReference(rawValue);
  if (ref) {
    const refName = ref.join('/');
    const refId = primitiveIdMap.get(refName);
    if (refId) return { type: 'VARIABLE_ALIAS', id: refId };

    const hex = primitiveHexMap.get(refName);
    if (hex) return hexToFigmaColor(hex);

    return null;
  }

  return hexToFigmaColor(rawValue);
}
