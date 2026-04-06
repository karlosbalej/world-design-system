/**
 * Color Analysis Script for World Design System
 *
 * The canonical primitive palette lives in Figma (source of truth).
 * This script reverse-maps the Figma hex values to OKLCH coordinates for
 * documentation, generates base.json from those coordinates, and runs
 * accessibility analysis against semantic pairings.
 *
 * Usage:
 *   npx tsx scripts/generate-colors.ts              # print tables + write base.json
 *   npx tsx scripts/generate-colors.ts --dry-run     # print tables only
 *   npx tsx scripts/generate-colors.ts --analyze     # specialty analysis + contrast report
 */

import { oklch, formatHex, wcagContrast, parse, clampChroma } from 'culori';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScaleStep {
  step: number;
  L: number;
  C: number;
  H: number;
}

interface ScaleConfig {
  name: string;
  hue: number;
  steps: ScaleStep[];
}

interface GeneratedColor {
  step: number;
  oklchL: number;
  oklchC: number;
  oklchH: number;
  hex: string;
}

// ---------------------------------------------------------------------------
// Gamut-safe OKLCH → hex conversion
// Reduces chroma minimally to fit sRGB while preserving L and H.
// ---------------------------------------------------------------------------

function oklchToHex(L: number, C: number, H: number): string {
  const color = { mode: 'oklch' as const, l: L, c: C, h: H };
  const clamped = clampChroma(color, 'oklch');
  return formatHex(clamped)!;
}

// ---------------------------------------------------------------------------
// Scale Definitions
// ---------------------------------------------------------------------------

/**
 * Reverse-maps a hex value to OKLCH coordinates so we can document
 * the perceptual properties of Figma-sourced colors.
 */
function hexToOklchStep(step: number, hex: string, hue: number): ScaleStep {
  const parsed = parse(hex);
  const o = parsed ? oklch(parsed) : null;
  return {
    step,
    L: o?.l ?? 0,
    C: o?.c ?? 0,
    H: o?.h ?? hue,
  };
}

function makeStepsFromHex(hue: number, hexMap: Record<number, string>): ScaleStep[] {
  return Object.entries(hexMap).map(([step, hex]) =>
    hexToOklchStep(Number(step), hex, hue)
  );
}

const GREY_SCALE: ScaleConfig = {
  name: 'grey',
  hue: 265,
  steps: makeStepsFromHex(265, {
    100: '#F2F3F5', 200: '#EAEBED', 300: '#D7D9DC', 400: '#B5B7BA',
    500: '#9FA2A5', 600: '#8A8C8F', 700: '#747679', 800: '#595B5E',
    900: '#3F4144', 950: '#17181A',
  }),
};

const ERROR_SCALE: ScaleConfig = {
  name: 'error',
  hue: 25,
  steps: makeStepsFromHex(25, {
    100: '#FFF8F7', 200: '#FFD7D1', 300: '#FFB4A8', 400: '#FF8D7E',
    500: '#FC6150', 600: '#F2261D', 700: '#B8110C', 800: '#7F0001',
    900: '#490000', 950: '#2D0000',
  }),
};

const WARNING_SCALE: ScaleConfig = {
  name: 'warning',
  hue: 75,
  steps: makeStepsFromHex(75, {
    100: '#FFF9F1', 200: '#FFEBD0', 300: '#FFDDAD', 400: '#FFCE87',
    500: '#FFBF5A', 600: '#FEAF00', 700: '#B47A00', 800: '#6F4A00',
    900: '#311F00', 950: '#1A0F00',
  }),
};

const SUCCESS_SCALE: ScaleConfig = {
  name: 'success',
  hue: 145,
  steps: makeStepsFromHex(145, {
    100: '#F1FEF1', 200: '#CEF4CE', 300: '#AAE8AB', 400: '#84DC88',
    500: '#58CF62', 600: '#00C235', 700: '#008C24', 800: '#005A14',
    900: '#002C06', 950: '#001803',
  }),
};

const INFO_SCALE: ScaleConfig = {
  name: 'info',
  hue: 260,
  steps: makeStepsFromHex(260, {
    100: '#F7FAFF', 200: '#CADEFF', 300: '#9CC2FF', 400: '#6DA4FF',
    500: '#3A84FF', 600: '#0064EE', 700: '#004BB7', 800: '#003484',
    900: '#001E53', 950: '#001030',
  }),
};

const ALL_SCALES: ScaleConfig[] = [GREY_SCALE, ERROR_SCALE, WARNING_SCALE, SUCCESS_SCALE, INFO_SCALE];

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

function generateScale(config: ScaleConfig): GeneratedColor[] {
  return config.steps.map(({ step, L, C, H }) => {
    const hex = oklchToHex(L, C, H);
    return { step, oklchL: L, oklchC: C, oklchH: H, hex };
  });
}

// ---------------------------------------------------------------------------
// Table Printing
// ---------------------------------------------------------------------------

function printScaleTable(name: string, colors: GeneratedColor[]): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${name.toUpperCase()} SCALE (H=${colors[0]?.oklchH})`);
  console.log(`${'='.repeat(60)}`);
  console.log(`  ${'Step'.padEnd(6)} | ${'OKLCH'.padEnd(26)} | Hex`);
  console.log(`  ${'─'.repeat(6)} | ${'─'.repeat(26)} | ${'─'.repeat(9)}`);
  for (const c of colors) {
    const oklchStr = `oklch(${c.oklchL.toFixed(2)} ${c.oklchC.toFixed(3)} ${c.oklchH})`;
    console.log(`  ${String(c.step).padEnd(6)} | ${oklchStr.padEnd(26)} | ${c.hex.toUpperCase()}`);
  }
}

// ---------------------------------------------------------------------------
// Cross-Scale Uniformity Check
// ---------------------------------------------------------------------------

function printUniformityCheck(allGenerated: Map<string, GeneratedColor[]>): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('  CROSS-SCALE UNIFORMITY CHECK (Step 600, primary action step)');
  console.log(`${'='.repeat(60)}`);
  for (const [name, colors] of allGenerated) {
    const step600 = colors.find(c => c.step === 600);
    if (step600) {
      console.log(`  ${name.padEnd(10)} | L=${step600.oklchL.toFixed(2)} | ${step600.hex.toUpperCase()}`);
    }
  }
}

// ---------------------------------------------------------------------------
// base.json Writer
// ---------------------------------------------------------------------------

function writeBaseJson(allGenerated: Map<string, GeneratedColor[]>): void {
  const base: Record<string, unknown> = { color: {} as Record<string, unknown> };
  const colorObj = base.color as Record<string, unknown>;

  colorObj['white'] = { $value: '#FFFFFF', $type: 'color' };
  colorObj['black'] = { $value: '#000000', $type: 'color' };

  for (const [name, colors] of allGenerated) {
    const scale: Record<string, { $value: string; $type: string }> = {};
    for (const c of colors) {
      scale[String(c.step)] = { $value: c.hex.toUpperCase(), $type: 'color' };
    }
    colorObj[name] = scale;
  }

  const outPath = resolve(ROOT, 'tokens/color/primitive/base.json');
  writeFileSync(outPath, JSON.stringify(base, null, 2) + '\n', 'utf-8');
  console.log(`\n✓ Written ${outPath}`);
}

// ---------------------------------------------------------------------------
// Specialty Color Analysis
// ---------------------------------------------------------------------------

interface SpecialtyAnalysis {
  path: string;
  hex: string;
  oklchL: number;
  oklchC: number;
  oklchH: number;
  contrastOnWhite: number;
  contrastOnDark: number;
  issues: string[];
}

function analyzeSpecialty(): SpecialtyAnalysis[] {
  const specPath = resolve(ROOT, 'tokens/color/primitive/specialty.json');
  const spec = JSON.parse(readFileSync(specPath, 'utf-8'));
  const results: SpecialtyAnalysis[] = [];

  const white = parse('#FFFFFF')!;
  const dark = parse('#17181A')!;

  function walk(obj: Record<string, unknown>, prefix: string): void {
    for (const [key, val] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (val && typeof val === 'object' && '$value' in (val as Record<string, unknown>)) {
        const raw = (val as Record<string, unknown>).$value as string;
        if (raw.startsWith('{')) return; // skip references
        const parsed = parse(raw);
        if (!parsed) return;
        const o = oklch(parsed);
        if (!o) return;
        const crWhite = wcagContrast(parsed, white);
        const crDark = wcagContrast(parsed, dark);
        const issues: string[] = [];
        if (crWhite < 3) issues.push(`Fails WCAG AA large text on white (${crWhite.toFixed(2)}:1)`);
        else if (crWhite < 4.5) issues.push(`Fails WCAG AA body text on white (${crWhite.toFixed(2)}:1)`);
        if (crDark < 3) issues.push(`Fails WCAG AA large text on dark bg (${crDark.toFixed(2)}:1)`);
        else if (crDark < 4.5) issues.push(`Fails WCAG AA body text on dark bg (${crDark.toFixed(2)}:1)`);
        results.push({
          path,
          hex: raw,
          oklchL: o.l ?? 0,
          oklchC: o.c ?? 0,
          oklchH: o.h ?? 0,
          contrastOnWhite: crWhite,
          contrastOnDark: crDark,
          issues,
        });
      } else if (val && typeof val === 'object') {
        walk(val as Record<string, unknown>, path);
      }
    }
  }

  walk(spec.color ?? spec, '');
  return results;
}

function printSpecialtyAnalysis(results: SpecialtyAnalysis[]): void {
  console.log(`\n${'='.repeat(80)}`);
  console.log('  SPECIALTY COLOR ANALYSIS');
  console.log(`${'='.repeat(80)}`);

  for (const r of results) {
    const oklchStr = `oklch(${r.oklchL.toFixed(2)} ${r.oklchC.toFixed(3)} ${r.oklchH.toFixed(0)})`;
    console.log(`\n  ${r.path}`);
    console.log(`    Hex:  ${r.hex}`);
    console.log(`    OKLCH: ${oklchStr}`);
    console.log(`    Contrast on white: ${r.contrastOnWhite.toFixed(2)}:1`);
    console.log(`    Contrast on dark:  ${r.contrastOnDark.toFixed(2)}:1`);
    if (r.issues.length > 0) {
      for (const issue of r.issues) {
        console.log(`    ⚠  ${issue}`);
      }
    } else {
      console.log(`    ✓  Passes WCAG AA for both contexts`);
    }
  }

  // Loud/silent pair recommendations for standalone colors
  console.log(`\n${'─'.repeat(80)}`);
  console.log('  LOUD/SILENT PAIR RECOMMENDATIONS');
  console.log(`${'─'.repeat(80)}`);

  const standalones = [
    'invites.primary', 'credentialCardText',
    'deepSkyBlue', 'skyBlueLight', 'darkModerateBlue', 'darkBlue',
  ];

  for (const name of standalones) {
    const r = results.find(x => x.path === name);
    if (!r) continue;

    let recommendation: string;
    if (r.oklchL > 0.85) {
      recommendation = 'Already very light — could serve as a "silent" value. Consider adding a "loud" counterpart with L≈0.55-0.65.';
    } else if (r.oklchL < 0.30) {
      recommendation = 'Very dark — specialized use only. A loud/silent pair is likely unnecessary unless used as a brand accent.';
    } else if (r.oklchL >= 0.30 && r.oklchL <= 0.70) {
      recommendation = 'Mid-range lightness — good candidate for a "loud" value. Consider adding a "silent" tint at L≈0.95 for background use.';
    } else {
      recommendation = 'Could benefit from a loud/silent pair depending on usage frequency.';
    }

    console.log(`\n  ${name} (L=${r.oklchL.toFixed(2)})`);
    console.log(`    → ${recommendation}`);
  }
}

// ---------------------------------------------------------------------------
// Contrast Ratio Verification for Semantic Pairings
// ---------------------------------------------------------------------------

interface ContrastCheck {
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  target: number;
  pass: boolean;
}

function resolveReference(ref: string, primitives: Record<string, unknown>): string | null {
  if (!ref.startsWith('{') || !ref.endsWith('}')) return ref;
  const path = ref.slice(1, -1).split('.');
  let current: unknown = primitives;
  for (const segment of path) {
    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[segment];
    } else {
      return null;
    }
  }
  if (current && typeof current === 'object' && '$value' in (current as Record<string, unknown>)) {
    const val = (current as Record<string, unknown>).$value as string;
    if (val.startsWith('{')) return resolveReference(val, primitives);
    return val;
  }
  return null;
}

function runContrastChecks(): ContrastCheck[] {
  const basePath = resolve(ROOT, 'tokens/color/primitive/base.json');
  const specPath = resolve(ROOT, 'tokens/color/primitive/specialty.json');
  const lightPath = resolve(ROOT, 'tokens/color/semantic/light.json');
  const darkPath = resolve(ROOT, 'tokens/color/semantic/dark.json');

  const base = JSON.parse(readFileSync(basePath, 'utf-8'));
  const spec = JSON.parse(readFileSync(specPath, 'utf-8'));
  const light = JSON.parse(readFileSync(lightPath, 'utf-8'));
  const dark = JSON.parse(readFileSync(darkPath, 'utf-8'));

  const primitives = {
    color: { ...(base.color ?? {}), ...(spec.color ?? {}) },
  };

  function getHex(theme: Record<string, unknown>, ...path: string[]): string | null {
    let current: unknown = theme;
    for (const segment of path) {
      if (current && typeof current === 'object') {
        current = (current as Record<string, unknown>)[segment];
      } else return null;
    }
    if (current && typeof current === 'object' && '$value' in (current as Record<string, unknown>)) {
      return resolveReference((current as Record<string, unknown>).$value as string, primitives);
    }
    return null;
  }

  function contrast(hex1: string, hex2: string): number {
    const c1 = parse(hex1);
    const c2 = parse(hex2);
    if (!c1 || !c2) return 0;
    return wcagContrast(c1, c2);
  }

  const checks: ContrastCheck[] = [];

  for (const [themeName, theme] of [['light', light], ['dark', dark]] as const) {
    const sem = (theme as Record<string, unknown>).semantic as Record<string, unknown>;
    const bgPrimary = getHex(sem, 'surface', 'primary')!;
    const bgSecondary = getHex(sem, 'surface', 'secondary')!;
    const textPrimary = getHex(sem, 'text', 'primary')!;
    const textSecondary = getHex(sem, 'text', 'secondary')!;
    const textTertiary = getHex(sem, 'text', 'tertiary')!;
    const actionPrimary = getHex(sem, 'action', 'primary')!;
    const actionPrimaryContent = getHex(sem, 'action', 'primaryContent')!;

    const addCheck = (label: string, fg: string, bg: string, target: number) => {
      if (!fg || !bg) return;
      const ratio = contrast(fg, bg);
      checks.push({ label: `[${themeName}] ${label}`, fg, bg, ratio, target, pass: ratio >= target });
    };

    addCheck('text.primary on surface.primary', textPrimary, bgPrimary, 4.5);
    addCheck('text.secondary on surface.primary', textSecondary, bgPrimary, 4.5);
    addCheck('text.tertiary on surface.primary', textTertiary, bgPrimary, 3.0);
    addCheck('text.primary on surface.secondary', textPrimary, bgSecondary, 4.5);
    addCheck('action.primaryContent on action.primary', actionPrimaryContent, actionPrimary, 4.5);

    for (const status of ['error', 'warning', 'success', 'info']) {
      const hex = getHex(sem, 'status', status);
      if (hex) addCheck(`status.${status} on surface.primary`, hex, bgPrimary, 3.0);
    }

    // Dark mode distinguishability check
    if (themeName === 'dark' && textSecondary && textTertiary) {
      const secOklch = oklch(parse(textSecondary)!);
      const terOklch = oklch(parse(textTertiary)!);
      if (secOklch && terOklch) {
        const deltaL = Math.abs((secOklch.l ?? 0) - (terOklch.l ?? 0));
        console.log(`\n  [dark] text.secondary vs text.tertiary delta-L: ${deltaL.toFixed(3)} (target: >= 0.08)`);
        if (deltaL < 0.08) {
          console.log('    ⚠  These may not be distinguishable — consider increasing gap');
        } else {
          console.log('    ✓  Sufficient lightness difference');
        }
      }
    }

    // New semantic token checks
    const destructive = getHex(sem, 'action', 'destructive');
    const destructiveContent = getHex(sem, 'action', 'destructiveContent');
    if (destructive && destructiveContent) {
      addCheck('action.destructiveContent on action.destructive', destructiveContent, destructive, 4.5);
    }

    const borderFocus = getHex(sem, 'border', 'focus');
    if (borderFocus) addCheck('border.focus on surface.primary', borderFocus, bgPrimary, 3.0);

    for (const sb of ['errorBackground', 'warningBackground', 'successBackground', 'infoBackground']) {
      const sbHex = getHex(sem, 'status', sb);
      if (sbHex) addCheck(`text.primary on status.${sb}`, textPrimary, sbHex, 4.5);
    }

    const accentPrimary = getHex(sem, 'accent', 'primary');
    const accentContent = getHex(sem, 'accent', 'content');
    if (accentPrimary && accentContent) {
      addCheck('accent.content on accent.primary', accentContent, accentPrimary, 4.5);
    }
    if (accentPrimary) addCheck('accent.primary on surface.primary', accentPrimary, bgPrimary, 3.0);

    const bgElevated = getHex(sem, 'surface', 'elevated');
    if (bgElevated) addCheck('text.primary on surface.elevated', textPrimary, bgElevated, 4.5);

    const bgTertiary = getHex(sem, 'surface', 'tertiary');
    if (bgTertiary) addCheck('text.primary on surface.tertiary', textPrimary, bgTertiary, 4.5);

    const inputPlaceholder = getHex(sem, 'input', 'placeholder');
    const inputBg = getHex(sem, 'input', 'background');
    if (inputPlaceholder && inputBg) addCheck('input.placeholder on input.background', inputPlaceholder, inputBg, 3.0);
  }

  return checks;
}

function printContrastReport(checks: ContrastCheck[]): void {
  console.log(`\n${'='.repeat(80)}`);
  console.log('  WCAG CONTRAST RATIO VERIFICATION');
  console.log(`${'='.repeat(80)}`);
  console.log(`  ${'Pairing'.padEnd(52)} | ${'Ratio'.padEnd(8)} | ${'Target'.padEnd(8)} | Result`);
  console.log(`  ${'─'.repeat(52)} | ${'─'.repeat(8)} | ${'─'.repeat(8)} | ${'─'.repeat(6)}`);
  for (const c of checks) {
    const status = c.pass ? '✓ PASS' : '✗ FAIL';
    console.log(`  ${c.label.padEnd(52)} | ${c.ratio.toFixed(2).padStart(5)}:1 | ${c.target.toFixed(1).padStart(5)}:1 | ${status}`);
  }

  const failures = checks.filter(c => !c.pass);
  if (failures.length > 0) {
    console.log(`\n  ⚠  ${failures.length} check(s) failed — review mappings above.`);
  } else {
    console.log(`\n  ✓  All ${checks.length} checks passed.`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const analyzeOnly = args.includes('--analyze');

  if (analyzeOnly) {
    const specResults = analyzeSpecialty();
    printSpecialtyAnalysis(specResults);
    const contrastChecks = runContrastChecks();
    printContrastReport(contrastChecks);
    return;
  }

  // Generate all scales
  const allGenerated = new Map<string, GeneratedColor[]>();
  for (const scale of ALL_SCALES) {
    const colors = generateScale(scale);
    allGenerated.set(scale.name, colors);
    printScaleTable(scale.name, colors);
  }

  printUniformityCheck(allGenerated);

  if (!dryRun) {
    writeBaseJson(allGenerated);
  } else {
    console.log('\n(dry run — base.json not written)');
  }
}

main();
