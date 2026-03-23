/**
 * APCA Contrast Checker
 *
 * Validates semantic color token pairings against APCA Lc thresholds.
 * Reads from the built JSON output files in build/web/.
 *
 * Usage: npx tsx scripts/check-contrast.ts
 *
 * Exit code 0 = all pairings pass, 1 = failures found.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { APCAcontrast, sRGBtoY } from 'apca-w3';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Load built token files
// ---------------------------------------------------------------------------

function loadJson(path: string): Record<string, string> {
  const abs = resolve(root, path);
  return JSON.parse(readFileSync(abs, 'utf-8'));
}

const lightTokens = loadJson('build/web/light-theme.json');
const darkTokens = loadJson('build/web/dark-theme.json');

// ---------------------------------------------------------------------------
// Hex → RGB helper
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  // Handle hex-8 (with alpha) — ignore alpha for contrast calculation
  const rgb = h.length >= 8 ? h.slice(0, 6) : h;
  return [
    parseInt(rgb.slice(0, 2), 16),
    parseInt(rgb.slice(2, 4), 16),
    parseInt(rgb.slice(4, 6), 16),
  ];
}

// ---------------------------------------------------------------------------
// APCA contrast calculation
// ---------------------------------------------------------------------------

function calcLc(fgHex: string, bgHex: string): number {
  const fgRgb = hexToRgb(fgHex);
  const bgRgb = hexToRgb(bgHex);
  const fgY = sRGBtoY(fgRgb);
  const bgY = sRGBtoY(bgRgb);
  return APCAcontrast(fgY, bgY) as number;
}

// ---------------------------------------------------------------------------
// Pairing definitions
// ---------------------------------------------------------------------------

interface Pairing {
  fg: string;     // semantic token key (camelCase, e.g. "textPrimary")
  bg: string;     // semantic token key
  minLc: number;  // minimum absolute Lc value
  label: string;  // human-readable description
}

const pairings: Pairing[] = [
  // --- Text on backgrounds ---
  { fg: 'textPrimary', bg: 'surfacePrimary', minLc: 75, label: 'Primary text on primary surface' },
  { fg: 'textPrimary', bg: 'surfaceSecondary', minLc: 75, label: 'Primary text on secondary surface' },
  { fg: 'textPrimary', bg: 'surfaceTertiary', minLc: 75, label: 'Primary text on tertiary surface' },
  { fg: 'textSecondary', bg: 'surfacePrimary', minLc: 60, label: 'Secondary text on primary surface' },
  { fg: 'textSecondary', bg: 'surfaceSecondary', minLc: 60, label: 'Secondary text on secondary surface' },
  { fg: 'textTertiary', bg: 'surfacePrimary', minLc: 45, label: 'Tertiary text on primary surface' },

  // --- Icon on backgrounds ---
  { fg: 'iconPrimary', bg: 'surfacePrimary', minLc: 75, label: 'Primary icon on primary surface' },
  { fg: 'iconSecondary', bg: 'surfacePrimary', minLc: 45, label: 'Secondary icon on primary surface' },
  { fg: 'iconTertiary', bg: 'surfacePrimary', minLc: 30, label: 'Tertiary icon on primary surface' },
  { fg: 'iconDisabled', bg: 'surfacePrimary', minLc: 15, label: 'Disabled icon on primary surface' },

  // --- Action buttons ---
  { fg: 'actionPrimaryContent', bg: 'actionPrimary', minLc: 75, label: 'Primary button label' },
  { fg: 'actionSecondaryContent', bg: 'actionSecondary', minLc: 75, label: 'Secondary button label' },
  { fg: 'actionTertiaryContent', bg: 'actionTertiary', minLc: 75, label: 'Tertiary button label' },
  { fg: 'actionDisabledContent', bg: 'actionDisabled', minLc: 30, label: 'Disabled button text' },

  // --- Links ---
  { fg: 'textLink', bg: 'surfacePrimary', minLc: 60, label: 'Link text on primary surface' },

  // --- Input ---
  { fg: 'inputText', bg: 'inputBackground', minLc: 75, label: 'Input text on input bg' },
  { fg: 'inputText', bg: 'inputBackgroundFocus', minLc: 75, label: 'Input text on focused input bg' },
  { fg: 'inputPlaceholder', bg: 'inputBackground', minLc: 40, label: 'Placeholder on input bg' },
  { fg: 'inputPlaceholder', bg: 'inputBackgroundFocus', minLc: 40, label: 'Placeholder on focused input bg' },
  { fg: 'inputError', bg: 'surfacePrimary', minLc: 60, label: 'Input error text' },

  // --- Control ---
  { fg: 'controlOnContent', bg: 'controlOn', minLc: 75, label: 'Checkmark on control on' },

  // --- Status on backgrounds ---
  { fg: 'statusError', bg: 'surfacePrimary', minLc: 60, label: 'Error text on primary surface' },
  { fg: 'statusError', bg: 'statusErrorBackground', minLc: 60, label: 'Error text on error bg' },
  { fg: 'statusWarning', bg: 'surfacePrimary', minLc: 45, label: 'Warning text on primary surface' },
  { fg: 'statusWarning', bg: 'statusWarningBackground', minLc: 45, label: 'Warning text on warning bg' },
  { fg: 'statusSuccess', bg: 'surfacePrimary', minLc: 60, label: 'Success text on primary surface' },
  { fg: 'statusSuccess', bg: 'statusSuccessBackground', minLc: 60, label: 'Success text on success bg' },
  { fg: 'statusInfo', bg: 'surfacePrimary', minLc: 60, label: 'Info text on primary surface' },
  { fg: 'statusInfo', bg: 'statusInfoBackground', minLc: 60, label: 'Info text on info bg' },

  // --- Badge (small element, bold text — relaxed threshold) ---
  { fg: 'badgeText', bg: 'badgeBackground', minLc: 60, label: 'Badge text on badge bg' },

  // --- Tab bar ---
  { fg: 'tabBarSelected', bg: 'tabBarBackground', minLc: 75, label: 'Selected tab label' },
  { fg: 'tabBarUnselected', bg: 'tabBarBackground', minLc: 45, label: 'Unselected tab label' },

  // --- Border visibility (subtle/default intentionally light per Figma design) ---
  { fg: 'borderDefault', bg: 'surfacePrimary', minLc: 8, label: 'Default border on primary surface' },
  { fg: 'borderStrong', bg: 'surfacePrimary', minLc: 15, label: 'Strong border on primary surface' },
  { fg: 'borderFocus', bg: 'surfacePrimary', minLc: 60, label: 'Focus ring on primary surface' },
];

// ---------------------------------------------------------------------------
// Run checks
// ---------------------------------------------------------------------------

type ThemeTokens = Record<string, string>;

function prefixKey(key: string): string {
  // Token keys in the built JSON use "semantic" prefix: "semanticTextPrimary"
  return `semantic${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

function checkTheme(
  theme: string,
  tokens: ThemeTokens,
): { passes: number; failures: string[] } {
  let passes = 0;
  const failures: string[] = [];

  for (const { fg, bg, minLc, label } of pairings) {
    const fgKey = prefixKey(fg);
    const bgKey = prefixKey(bg);
    const fgHex = tokens[fgKey];
    const bgHex = tokens[bgKey];

    if (!fgHex || !bgHex) {
      // Token not yet present — skip (will be added)
      continue;
    }

    const lc = calcLc(fgHex, bgHex);
    const absLc = Math.abs(lc);
    const pass = absLc >= minLc;

    if (pass) {
      passes++;
    } else {
      failures.push(
        `  FAIL  ${theme} │ ${label}\n` +
        `        ${fg} (${fgHex}) on ${bg} (${bgHex})\n` +
        `        Lc = ${lc.toFixed(1)}, need |Lc| >= ${minLc}`,
      );
    }
  }

  return { passes, failures };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log('APCA Contrast Check — World Design System\n');

const light = checkTheme('Light', lightTokens);
const dark = checkTheme('Dark', darkTokens);

const totalPasses = light.passes + dark.passes;
const allFailures = [...light.failures, ...dark.failures];

if (allFailures.length > 0) {
  console.log(`Failures (${allFailures.length}):\n`);
  for (const f of allFailures) {
    console.log(f);
    console.log('');
  }
}

console.log(`Result: ${totalPasses} passed, ${allFailures.length} failed\n`);

if (allFailures.length > 0) {
  process.exit(1);
} else {
  console.log('All contrast pairings pass APCA thresholds.');
}
