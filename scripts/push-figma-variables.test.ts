import { describe, it, expect } from 'vitest';
import {
  walkTokenTree,
  toKebab,
  toCamel,
  computeCodeSyntax,
  deriveScopes,
  parseTokenReference,
  hexToFigmaColor,
  resolveValue,
} from './figma-push-utils.js';

// ---------------------------------------------------------------------------
// walkTokenTree
// ---------------------------------------------------------------------------

describe('walkTokenTree', () => {
  it('extracts leaf tokens with correct paths', () => {
    const json = {
      color: {
        white: { $value: '#FFFFFF', $type: 'color' },
        grey: {
          100: { $value: '#F2F3F5', $type: 'color' },
          200: { $value: '#EAEBED', $type: 'color' },
        },
      },
    };
    const entries = walkTokenTree(json);
    expect(entries).toEqual([
      { path: ['color', 'white'], rawValue: '#FFFFFF' },
      { path: ['color', 'grey', '100'], rawValue: '#F2F3F5' },
      { path: ['color', 'grey', '200'], rawValue: '#EAEBED' },
    ]);
  });

  it('preserves token references as raw strings', () => {
    const json = {
      semantic: {
        surface: {
          primary: { $value: '{color.white}', $type: 'color' },
          overlay: { $value: '#000000CC', $type: 'color' },
        },
      },
    };
    const entries = walkTokenTree(json);
    expect(entries).toEqual([
      { path: ['semantic', 'surface', 'primary'], rawValue: '{color.white}' },
      { path: ['semantic', 'surface', 'overlay'], rawValue: '#000000CC' },
    ]);
  });

  it('skips $-prefixed keys at branch level', () => {
    const json = {
      $description: 'should be ignored',
      color: {
        white: { $value: '#FFFFFF', $type: 'color' },
      },
    };
    const entries = walkTokenTree(json);
    expect(entries).toHaveLength(1);
    expect(entries[0].path).toEqual(['color', 'white']);
  });

  it('returns empty array for empty object', () => {
    expect(walkTokenTree({})).toEqual([]);
  });

  it('handles basePath parameter', () => {
    const json = {
      white: { $value: '#FFFFFF', $type: 'color' },
    };
    const entries = walkTokenTree(json, ['color']);
    expect(entries[0].path).toEqual(['color', 'white']);
  });
});

// ---------------------------------------------------------------------------
// toKebab / toCamel
// ---------------------------------------------------------------------------

describe('toKebab', () => {
  it('joins simple segments', () => {
    expect(toKebab(['surface', 'primary'])).toBe('surface-primary');
  });

  it('splits camelCase within segments', () => {
    expect(toKebab(['action', 'primaryContent'])).toBe('action-primary-content');
  });

  it('handles single segment', () => {
    expect(toKebab(['surface'])).toBe('surface');
  });

  it('handles multi-word camelCase', () => {
    expect(toKebab(['status', 'errorBackground'])).toBe('status-error-background');
  });
});

describe('toCamel', () => {
  it('joins simple segments', () => {
    expect(toCamel(['surface', 'primary'])).toBe('surfacePrimary');
  });

  it('preserves internal camelCase', () => {
    expect(toCamel(['action', 'primaryContent'])).toBe('actionPrimaryContent');
  });

  it('handles single segment', () => {
    expect(toCamel(['surface'])).toBe('surface');
  });

  it('capitalizes second+ segments', () => {
    expect(toCamel(['status', 'errorBackground'])).toBe('statusErrorBackground');
  });
});

// ---------------------------------------------------------------------------
// computeCodeSyntax
// ---------------------------------------------------------------------------

describe('computeCodeSyntax', () => {
  it('generates all three platform syntaxes', () => {
    const result = computeCodeSyntax(['surface', 'primary']);
    expect(result).toEqual({
      WEB: 'var(--wds-surface-primary)',
      ANDROID: 'Wds.colors.surfacePrimary',
      iOS: 'WdsTheme.light.surfacePrimary',
    });
  });

  it('handles compound camelCase names', () => {
    const result = computeCodeSyntax(['action', 'primaryContent']);
    expect(result).toEqual({
      WEB: 'var(--wds-action-primary-content)',
      ANDROID: 'Wds.colors.actionPrimaryContent',
      iOS: 'WdsTheme.light.actionPrimaryContent',
    });
  });

  it('handles status background tokens', () => {
    const result = computeCodeSyntax(['status', 'errorBackground']);
    expect(result).toEqual({
      WEB: 'var(--wds-status-error-background)',
      ANDROID: 'Wds.colors.statusErrorBackground',
      iOS: 'WdsTheme.light.statusErrorBackground',
    });
  });
});

// ---------------------------------------------------------------------------
// deriveScopes
// ---------------------------------------------------------------------------

describe('deriveScopes', () => {
  it('returns FRAME_FILL + SHAPE_FILL for surface tokens', () => {
    expect(deriveScopes('surface/primary')).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
  });

  it('returns TEXT_FILL for text tokens', () => {
    expect(deriveScopes('text/primary')).toEqual(['TEXT_FILL']);
  });

  it('returns STROKE_COLOR for border tokens', () => {
    expect(deriveScopes('border/default')).toEqual(['STROKE_COLOR']);
  });

  it('returns STROKE_COLOR + SHAPE_FILL for border/translucent', () => {
    expect(deriveScopes('border/translucent')).toEqual(['STROKE_COLOR', 'SHAPE_FILL']);
  });

  it('returns TEXT_FILL for action/*Content tokens', () => {
    expect(deriveScopes('action/primaryContent')).toEqual(['TEXT_FILL']);
    expect(deriveScopes('action/destructiveContent')).toEqual(['TEXT_FILL']);
    expect(deriveScopes('action/ghostContent')).toEqual(['TEXT_FILL']);
  });

  it('returns FRAME_FILL + SHAPE_FILL for action background tokens', () => {
    expect(deriveScopes('action/primary')).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
    expect(deriveScopes('action/destructive')).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
  });

  it('returns TEXT_FILL for input text/placeholder', () => {
    expect(deriveScopes('input/text')).toEqual(['TEXT_FILL']);
    expect(deriveScopes('input/placeholder')).toEqual(['TEXT_FILL']);
  });

  it('returns STROKE_COLOR for input/error and input/divider', () => {
    expect(deriveScopes('input/error')).toEqual(['STROKE_COLOR']);
    expect(deriveScopes('input/divider')).toEqual(['STROKE_COLOR']);
  });

  it('returns FRAME_FILL + SHAPE_FILL for status/*Background', () => {
    expect(deriveScopes('status/errorBackground')).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
    expect(deriveScopes('status/infoBackground')).toEqual(['FRAME_FILL', 'SHAPE_FILL']);
  });

  it('returns ALL_FILLS + STROKE_COLOR for status indicator tokens', () => {
    expect(deriveScopes('status/error')).toEqual(['ALL_FILLS', 'STROKE_COLOR']);
  });

  it('returns TEXT_FILL for accent/content', () => {
    expect(deriveScopes('accent/content')).toEqual(['TEXT_FILL']);
  });

  it('returns ALL_FILLS + STROKE_COLOR for accent/primary', () => {
    expect(deriveScopes('accent/primary')).toEqual(['ALL_FILLS', 'STROKE_COLOR']);
  });

  it('returns ALL_FILLS for unknown groups', () => {
    expect(deriveScopes('unknown/token')).toEqual(['ALL_FILLS']);
  });
});

// ---------------------------------------------------------------------------
// parseTokenReference
// ---------------------------------------------------------------------------

describe('parseTokenReference', () => {
  it('parses a valid reference', () => {
    expect(parseTokenReference('{color.white}')).toEqual(['color', 'white']);
  });

  it('parses nested references', () => {
    expect(parseTokenReference('{color.grey.950}')).toEqual(['color', 'grey', '950']);
  });

  it('returns null for hex values', () => {
    expect(parseTokenReference('#FFFFFF')).toBeNull();
  });

  it('returns null for hex with alpha', () => {
    expect(parseTokenReference('#000000CC')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// hexToFigmaColor
// ---------------------------------------------------------------------------

describe('hexToFigmaColor', () => {
  it('converts 6-digit hex', () => {
    const c = hexToFigmaColor('#FFFFFF');
    expect(c).toEqual({ r: 1, g: 1, b: 1, a: 1 });
  });

  it('converts black', () => {
    const c = hexToFigmaColor('#000000');
    expect(c).toEqual({ r: 0, g: 0, b: 0, a: 1 });
  });

  it('converts 8-digit hex with alpha', () => {
    const c = hexToFigmaColor('#000000CC');
    expect(c.r).toBe(0);
    expect(c.g).toBe(0);
    expect(c.b).toBe(0);
    expect(c.a).toBeCloseTo(0.8, 1);
  });

  it('handles low alpha', () => {
    const c = hexToFigmaColor('#0000000A');
    expect(c.a).toBeCloseTo(10 / 255, 3);
  });

  it('works without # prefix', () => {
    const c = hexToFigmaColor('FF0000');
    expect(c).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });
});

// ---------------------------------------------------------------------------
// resolveValue
// ---------------------------------------------------------------------------

describe('resolveValue', () => {
  const primitiveIdMap = new Map([
    ['color/white', 'var-id-white'],
    ['color/grey/950', 'var-id-grey-950'],
  ]);
  const primitiveHexMap = new Map([
    ['color/white', '#FFFFFF'],
    ['color/grey/950', '#17181A'],
    ['color/grey/100', '#F2F3F5'],
  ]);

  it('resolves a reference to VariableAlias', () => {
    const result = resolveValue('{color.white}', primitiveIdMap, primitiveHexMap);
    expect(result).toEqual({ type: 'VARIABLE_ALIAS', id: 'var-id-white' });
  });

  it('resolves nested reference to VariableAlias', () => {
    const result = resolveValue('{color.grey.950}', primitiveIdMap, primitiveHexMap);
    expect(result).toEqual({ type: 'VARIABLE_ALIAS', id: 'var-id-grey-950' });
  });

  it('falls back to hex when reference is not in idMap but is in hexMap', () => {
    const result = resolveValue('{color.grey.100}', primitiveIdMap, primitiveHexMap);
    expect(result).toEqual(hexToFigmaColor('#F2F3F5'));
  });

  it('returns null when reference is not found anywhere', () => {
    const result = resolveValue('{color.nonexistent}', primitiveIdMap, primitiveHexMap);
    expect(result).toBeNull();
  });

  it('converts hex string directly to FigmaColor', () => {
    const result = resolveValue('#FF0000', primitiveIdMap, primitiveHexMap);
    expect(result).toEqual({ r: 1, g: 0, b: 0, a: 1 });
  });

  it('converts hex-8 string with alpha to FigmaColor', () => {
    const result = resolveValue('#000000CC', primitiveIdMap, primitiveHexMap);
    expect(result).not.toBeNull();
    expect((result as { a: number }).a).toBeCloseTo(0.8, 1);
  });
});

// ---------------------------------------------------------------------------
// Payload snapshot: small fixture → expected API structure
// ---------------------------------------------------------------------------

describe('payload snapshot', () => {
  it('produces correct variable + mode value structure from fixture data', () => {
    const primitiveJson = {
      color: {
        white: { $value: '#FFFFFF', $type: 'color' },
        grey: {
          950: { $value: '#17181A', $type: 'color' },
        },
      },
    };

    const lightJson = {
      semantic: {
        surface: {
          primary: { $value: '{color.white}', $type: 'color' },
          overlay: { $value: '#000000CC', $type: 'color' },
        },
      },
    };

    const darkJson = {
      semantic: {
        surface: {
          primary: { $value: '{color.grey.950}', $type: 'color' },
          overlay: { $value: '#000000CC', $type: 'color' },
        },
      },
    };

    const descs: Record<string, string> = {
      'surface/primary': 'Main background',
      'surface/overlay': 'Scrim behind modals',
    };

    // Walk tokens
    const primEntries = walkTokenTree(primitiveJson);
    const lightEntries = walkTokenTree(lightJson);
    const darkEntries = walkTokenTree(darkJson);

    // Build primitive maps
    const primIdMap = new Map<string, string>();
    const primHexMap = new Map<string, string>();
    let nextId = 0;
    for (const e of primEntries) {
      const name = e.path.join('/');
      const id = `temp_${nextId++}`;
      primIdMap.set(name, id);
      if (e.rawValue.startsWith('#')) primHexMap.set(name, e.rawValue);
    }

    // Build semantic variables
    const variables: Record<string, unknown>[] = [];
    const modeValues: Record<string, unknown>[] = [];

    const lightByName = new Map(
      lightEntries.map((e) => [e.path.slice(1).join('/'), e]),
    );
    const darkByName = new Map(
      darkEntries.map((e) => [e.path.slice(1).join('/'), e]),
    );

    const semNames = [...new Set([...lightByName.keys(), ...darkByName.keys()])];

    for (const name of semNames) {
      const segments = name.split('/');
      const id = `temp_${nextId++}`;

      variables.push({
        action: 'CREATE',
        id,
        name,
        resolvedType: 'COLOR',
        codeSyntax: computeCodeSyntax(segments),
        scopes: deriveScopes(name),
        description: descs[name] ?? '',
      });

      const le = lightByName.get(name);
      if (le) {
        const v = resolveValue(le.rawValue, primIdMap, primHexMap);
        if (v) modeValues.push({ variableId: id, modeId: 'light-mode', value: v });
      }

      const de = darkByName.get(name);
      if (de) {
        const v = resolveValue(de.rawValue, primIdMap, primHexMap);
        if (v) modeValues.push({ variableId: id, modeId: 'dark-mode', value: v });
      }
    }

    expect(variables).toMatchSnapshot();
    expect(modeValues).toMatchSnapshot();
  });
});
