/**
 * OKLCH Palette Generator
 *
 * Generates perceptually uniform color scales in DTCG JSON format.
 * Uses OKLCH color space for even lightness distribution and
 * chroma tapering at extremes to stay within sRGB gamut.
 *
 * Usage:
 *   npx tsx scripts/generate-palette.ts --name grey --hue 257 --chroma 0.018 --steps 0,50,100,200,300,400,500,600,700,800,900,950
 *   npx tsx scripts/generate-palette.ts --name error --hue 29 --chroma 0.235 --steps 100,200,300,400,500,600,700,800,900 --hero-step 600
 */

import { oklch, formatHex, clampChroma } from 'culori';

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

interface PaletteConfig {
  name: string;
  hue: number;
  chroma: number;
  steps: number[];
  heroStep: number | null; // If set, chroma peaks here and tapers toward extremes
  heroLightness: number | null; // Override lightness at the hero step
}

function parseArgs(): PaletteConfig {
  const args = process.argv.slice(2);
  const map = new Map<string, string>();

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    if (!value) {
      console.error(`Missing value for --${key}`);
      process.exit(1);
    }
    map.set(key, value);
  }

  const name = map.get('name');
  const hue = map.get('hue');
  const chroma = map.get('chroma');
  const steps = map.get('steps');
  const heroStep = map.get('hero-step');
  const heroLightness = map.get('hero-lightness');

  if (!name || !hue || !chroma || !steps) {
    console.error(
      'Usage: npx tsx scripts/generate-palette.ts --name <name> --hue <0-360> --chroma <0-0.4> --steps <csv> [--hero-step <step>] [--hero-lightness <0-1>]',
    );
    process.exit(1);
  }

  return {
    name,
    hue: parseFloat(hue),
    chroma: parseFloat(chroma),
    steps: steps.split(',').map((s) => parseInt(s.trim(), 10)),
    heroStep: heroStep ? parseInt(heroStep, 10) : null,
    heroLightness: heroLightness ? parseFloat(heroLightness) : null,
  };
}

// ---------------------------------------------------------------------------
// OKLCH scale generation
// ---------------------------------------------------------------------------

/**
 * Predefined lightness control points for design-system scales.
 * UI design needs more resolution at the light end (backgrounds, borders)
 * and coarser steps at the dark end.
 */
const LIGHTNESS_CONTROL_POINTS: Record<number, number> = {
  0: 1.000,    // white
  50: 0.985,   // off-white background
  100: 0.965,  // subtle background
  200: 0.940,  // light border
  300: 0.885,  // border
  400: 0.780,  // mid-light
  500: 0.710,  // mid
  600: 0.640,  // mid-dark
  700: 0.565,  // dark
  800: 0.470,  // darker
  900: 0.375,  // near-black
  950: 0.210,  // very dark
};

/**
 * Interpolate between control points.
 */
function interpolateControlPoints(
  step: number,
  points: Record<number, number>,
): number {
  if (step in points) return points[step];

  const controlSteps = Object.keys(points)
    .map(Number)
    .sort((a, b) => a - b);

  let lower = controlSteps[0];
  let upper = controlSteps[controlSteps.length - 1];

  for (const cs of controlSteps) {
    if (cs <= step) lower = cs;
    if (cs >= step) {
      upper = cs;
      break;
    }
  }

  if (lower === upper) return points[lower];

  const t = (step - lower) / (upper - lower);
  return points[lower] + t * (points[upper] - points[lower]);
}

/**
 * Map a step number to an OKLCH lightness value.
 *
 * For neutral scales (no hero): uses the predefined control points directly.
 *
 * For feedback scales (with hero): anchors the hero step at the given lightness,
 * then distributes steps above the hero toward white (L=0.985) and steps below
 * toward dark (L=0.255), using even spacing within each half.
 */
function stepToLightness(
  step: number,
  heroStep: number | null,
  heroLightness: number | null,
  steps: number[],
): number {
  // Neutral mode: use standard control points
  if (heroStep === null || heroLightness === null) {
    return interpolateControlPoints(step, LIGHTNESS_CONTROL_POINTS);
  }

  // Feedback mode: anchor hero, distribute evenly in each half
  if (step === heroStep) return heroLightness;

  const minStep = Math.min(...steps);
  const maxStep = Math.max(...steps);

  if (step < heroStep) {
    // Light side: heroLightness → 0.985 (near-white)
    const lightL = 0.985;
    const t = (heroStep - step) / (heroStep - minStep);
    return heroLightness + t * (lightL - heroLightness);
  } else {
    // Dark side: heroLightness → 0.255 (very dark)
    const darkL = 0.255;
    const t = (step - heroStep) / (maxStep - heroStep);
    return heroLightness + t * (darkL - heroLightness);
  }
}

/**
 * Chroma for neutral scales (grey): constant with tapering at lightness extremes.
 */
function neutralChroma(baseChroma: number, L: number): number {
  if (L > 0.9) {
    const t = (L - 0.9) / 0.1;
    return baseChroma * (1 - t * 0.85);
  }
  if (L < 0.25) {
    const t = (0.25 - L) / 0.2;
    return baseChroma * (1 - t * 0.7);
  }
  return baseChroma;
}

/**
 * Chroma for feedback scales (error, warning, success, info):
 * peaks at the hero step and tapers toward both light and dark extremes.
 *
 * Light side retains 10% chroma at the extreme (subtle tinted backgrounds).
 * Dark side retains 50% chroma at the extreme (dark colors stay visibly colored).
 * Linear interpolation between floor and hero gives natural results.
 */
function feedbackChroma(
  baseChroma: number,
  step: number,
  heroStep: number,
  steps: number[],
): number {
  if (step === heroStep) return baseChroma;

  const minStep = Math.min(...steps);
  const maxStep = Math.max(...steps);

  let fraction: number;
  if (step < heroStep) {
    // Light side: floor at 10%, linear ramp to 100% at hero
    const range = heroStep - minStep;
    const dist = heroStep - step;
    const rawFraction = 1 - dist / range;
    fraction = 0.10 + 0.90 * rawFraction;
  } else {
    // Dark side: floor at 50%, linear ramp to 100% at hero
    const range = maxStep - heroStep;
    const dist = step - heroStep;
    const rawFraction = 1 - dist / range;
    fraction = 0.50 + 0.50 * rawFraction;
  }

  return baseChroma * fraction;
}

/**
 * Generate a single OKLCH color, clamp to sRGB gamut, return hex.
 */
function generateHex(L: number, C: number, H: number): string {
  const color = oklch({ mode: 'oklch', l: L, c: C, h: H });
  const clamped = clampChroma(color, 'oklch');
  const hex = formatHex(clamped);
  return hex.toUpperCase();
}

// ---------------------------------------------------------------------------
// DTCG JSON output
// ---------------------------------------------------------------------------

interface DtcgToken {
  $value: string;
  $type: 'color';
}

function generatePalette(config: PaletteConfig): Record<string, DtcgToken> {
  const tokens: Record<string, DtcgToken> = {};

  for (const step of config.steps) {
    const L = stepToLightness(step, config.heroStep, config.heroLightness, config.steps);

    let C: number;
    if (config.heroStep !== null) {
      C = feedbackChroma(config.chroma, step, config.heroStep, config.steps);
    } else {
      C = neutralChroma(config.chroma, L);
    }

    const hex = generateHex(L, C, config.hue);

    tokens[String(step)] = {
      $value: hex,
      $type: 'color',
    };
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const config = parseArgs();
const tokens = generatePalette(config);

const output = {
  color: {
    [config.name]: tokens,
  },
};

console.log(JSON.stringify(output, null, 2));

// Print a human-readable table to stderr
console.error('\n--- Generated palette ---');
console.error(`Scale: ${config.name} (hue: ${config.hue}, chroma: ${config.chroma}${config.heroStep ? `, hero: ${config.heroStep}` : ''}${config.heroLightness ? `, heroL: ${config.heroLightness}` : ''})`);
console.error('');
for (const step of config.steps) {
  const L = stepToLightness(step, config.heroStep, config.heroLightness, config.steps);
  let C: number;
  if (config.heroStep !== null) {
    C = feedbackChroma(config.chroma, step, config.heroStep, config.steps);
  } else {
    C = neutralChroma(config.chroma, L);
  }
  const hex = tokens[String(step)].$value;
  console.error(
    `  ${String(step).padStart(4)} │ L: ${L.toFixed(3)} C: ${C.toFixed(4)} │ ${hex}`,
  );
}
