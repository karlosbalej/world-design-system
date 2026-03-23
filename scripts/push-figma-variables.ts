/**
 * Push design tokens to Figma as Variables via the REST API.
 *
 * Creates/updates two variable collections:
 *   1. "Primitives" (1 mode: Default)  — raw color values
 *   2. "Semantic"   (2 modes: Light, Dark) — semantic tokens aliasing primitives
 *
 * Requires environment variables:
 *   FIGMA_ACCESS_TOKEN — Personal access token with file_variables:write scope
 *   FIGMA_FILE_KEY    — File key from Figma URL
 *
 * Usage: npx tsx scripts/push-figma-variables.ts
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const FIGMA_API = 'https://api.figma.com';
const TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!TOKEN || !FILE_KEY) {
  console.error('Missing env vars: FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY are required.');
  console.error('See references/figma-variables-guide.md for setup instructions.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Load built tokens
// ---------------------------------------------------------------------------

function loadJson<T = Record<string, unknown>>(path: string): T {
  return JSON.parse(readFileSync(resolve(root, path), 'utf-8'));
}

const primitiveTokens = loadJson<Record<string, string>>('build/web/tokens.json');
const lightTokens = loadJson<Record<string, string>>('build/web/light-theme.json');
const darkTokens = loadJson<Record<string, string>>('build/web/dark-theme.json');

// ---------------------------------------------------------------------------
// Hex parsing
// ---------------------------------------------------------------------------

interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

function hexToFigmaColor(hex: string): FigmaColor {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, a };
}

// ---------------------------------------------------------------------------
// Token key → Figma variable name
// ---------------------------------------------------------------------------

/**
 * Convert camelCase key to Figma slash-separated path.
 * "colorGrey400" → "color/grey/400"
 * "semanticBackgroundPrimary" → "background/primary"
 */
function primitiveKeyToName(key: string): string {
  // Remove "color" prefix
  if (!key.startsWith('color')) return key;
  const rest = key.slice(5); // remove "color"

  // Split on case boundaries and digits
  const parts: string[] = [];
  let current = '';

  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (i > 0 && /[A-Z]/.test(ch) && /[a-z]/.test(rest[i - 1])) {
      parts.push(current);
      current = ch;
    } else if (i > 0 && /\d/.test(ch) && !/\d/.test(rest[i - 1])) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  return 'color/' + parts.map((p) => p.toLowerCase()).join('/');
}

function semanticKeyToName(key: string): string {
  // Remove "semantic" prefix
  if (!key.startsWith('semantic')) return key;
  const rest = key.slice(8); // remove "semantic"

  const parts: string[] = [];
  let current = '';

  for (let i = 0; i < rest.length; i++) {
    const ch = rest[i];
    if (i > 0 && /[A-Z]/.test(ch) && /[a-z]/.test(rest[i - 1])) {
      parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);

  return parts.map((p) => p.toLowerCase()).join('/');
}

// ---------------------------------------------------------------------------
// Figma API helpers
// ---------------------------------------------------------------------------

async function figmaGet<T>(path: string): Promise<T> {
  const res = await fetch(`${FIGMA_API}${path}`, {
    headers: { 'X-Figma-Token': TOKEN! },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma GET ${path}: ${res.status} ${body}`);
  }
  return res.json() as Promise<T>;
}

async function figmaPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${FIGMA_API}${path}`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': TOKEN!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma POST ${path}: ${res.status} ${text}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FigmaVariable {
  id: string;
  name: string;
  variableCollectionId: string;
}

interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
}

interface FigmaLocalVariablesResponse {
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

interface VariableCreate {
  action: 'CREATE';
  id: string;
  name: string;
  variableCollectionId: string;
  resolvedType: 'COLOR';
}

interface VariableUpdate {
  action: 'UPDATE';
  id: string;
  name: string;
  variableCollectionId: string;
}

interface VariableModeValue {
  variableId: string;
  modeId: string;
  value: FigmaColor;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Fetching existing Figma variables...');
  const existing = await figmaGet<FigmaLocalVariablesResponse>(
    `/v1/files/${FILE_KEY}/variables/local`,
  );

  const collections = existing.meta.variableCollections;
  const variables = existing.meta.variables;

  // Find or prepare to create collections
  let primitivesCollection = Object.values(collections).find((c) => c.name === 'Primitives');
  let semanticCollection = Object.values(collections).find((c) => c.name === 'Semantic');

  // Build variable name → id lookup
  const existingVarsByName = new Map<string, FigmaVariable>();
  for (const v of Object.values(variables)) {
    existingVarsByName.set(v.name, v);
  }

  // Prepare batch request
  const variableCreates: VariableCreate[] = [];
  const variableUpdates: VariableUpdate[] = [];
  const variableModeValues: VariableModeValue[] = [];
  const collectionCreates: { action: string; id: string; name: string; initialModeId?: string }[] = [];
  const modeCreates: { action: string; id: string; name: string; variableCollectionId: string }[] = [];
  const modeUpdates: { action: string; id: string; name: string; variableCollectionId: string }[] = [];

  let tempIdCounter = 0;
  function tempId(): string {
    return `temp_${tempIdCounter++}`;
  }

  // --- Primitives collection ---
  let primCollId: string;
  let primModeId: string;

  if (primitivesCollection) {
    primCollId = primitivesCollection.id;
    primModeId = primitivesCollection.modes[0].modeId;
  } else {
    primCollId = tempId();
    primModeId = tempId();
    collectionCreates.push({
      action: 'CREATE',
      id: primCollId,
      name: 'Primitives',
      initialModeId: primModeId,
    });
    modeUpdates.push({
      action: 'UPDATE',
      id: primModeId,
      name: 'Default',
      variableCollectionId: primCollId,
    });
  }

  // --- Semantic collection ---
  let semCollId: string;
  let lightModeId: string;
  let darkModeId: string;

  if (semanticCollection) {
    semCollId = semanticCollection.id;
    const lightMode = semanticCollection.modes.find((m) => m.name === 'Light');
    const darkMode = semanticCollection.modes.find((m) => m.name === 'Dark');
    lightModeId = lightMode?.modeId || semanticCollection.modes[0]?.modeId || tempId();
    darkModeId = darkMode?.modeId || tempId();

    if (!lightMode && semanticCollection.modes[0]) {
      modeUpdates.push({
        action: 'UPDATE',
        id: lightModeId,
        name: 'Light',
        variableCollectionId: semCollId,
      });
    }
    if (!darkMode) {
      darkModeId = tempId();
      modeCreates.push({
        action: 'CREATE',
        id: darkModeId,
        name: 'Dark',
        variableCollectionId: semCollId,
      });
    }
  } else {
    semCollId = tempId();
    lightModeId = tempId();
    darkModeId = tempId();
    collectionCreates.push({
      action: 'CREATE',
      id: semCollId,
      name: 'Semantic',
      initialModeId: lightModeId,
    });
    modeUpdates.push({
      action: 'UPDATE',
      id: lightModeId,
      name: 'Light',
      variableCollectionId: semCollId,
    });
    modeCreates.push({
      action: 'CREATE',
      id: darkModeId,
      name: 'Dark',
      variableCollectionId: semCollId,
    });
  }

  // --- Create/update primitive variables ---
  let createdCount = 0;
  let updatedCount = 0;

  for (const [key, hex] of Object.entries(primitiveTokens)) {
    const name = primitiveKeyToName(key);
    const color = hexToFigmaColor(hex);
    const existing = existingVarsByName.get(name);

    let varId: string;
    if (existing && existing.variableCollectionId === primCollId) {
      varId = existing.id;
      updatedCount++;
    } else {
      varId = tempId();
      variableCreates.push({
        action: 'CREATE',
        id: varId,
        name,
        variableCollectionId: primCollId,
        resolvedType: 'COLOR',
      });
      createdCount++;
    }

    variableModeValues.push({
      variableId: varId,
      modeId: primModeId,
      value: color,
    });
  }

  // --- Create/update semantic variables ---
  const allSemanticKeys = new Set([...Object.keys(lightTokens), ...Object.keys(darkTokens)]);

  for (const key of allSemanticKeys) {
    const name = semanticKeyToName(key);
    const lightHex = lightTokens[key];
    const darkHex = darkTokens[key];
    const existing = existingVarsByName.get(name);

    let varId: string;
    if (existing && existing.variableCollectionId === semCollId) {
      varId = existing.id;
      updatedCount++;
    } else {
      varId = tempId();
      variableCreates.push({
        action: 'CREATE',
        id: varId,
        name,
        variableCollectionId: semCollId,
        resolvedType: 'COLOR',
      });
      createdCount++;
    }

    if (lightHex) {
      variableModeValues.push({
        variableId: varId,
        modeId: lightModeId,
        value: hexToFigmaColor(lightHex),
      });
    }
    if (darkHex) {
      variableModeValues.push({
        variableId: varId,
        modeId: darkModeId,
        value: hexToFigmaColor(darkHex),
      });
    }
  }

  // --- Send batch request ---
  const payload: Record<string, unknown[]> = {};
  if (collectionCreates.length) payload.variableCollections = collectionCreates;
  if (modeCreates.length || modeUpdates.length) payload.variableModes = [...modeCreates, ...modeUpdates];
  if (variableCreates.length) payload.variables = variableCreates;
  if (variableModeValues.length) payload.variableModeValues = variableModeValues;

  console.log(`\nPushing to Figma file ${FILE_KEY}...`);
  console.log(`  Collections: ${collectionCreates.length} to create`);
  console.log(`  Variables: ${createdCount} to create, ${updatedCount} to update`);
  console.log(`  Mode values: ${variableModeValues.length} to set`);

  await figmaPost(`/v1/files/${FILE_KEY}/variables`, payload);

  console.log('\nDone! Variables pushed successfully.');
  console.log('Open your Figma file and check Local Variables to verify.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
