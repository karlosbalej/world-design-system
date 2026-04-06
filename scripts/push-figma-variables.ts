/**
 * Push design tokens to Figma as Variables via the REST API.
 *
 * Creates/updates two variable collections:
 *   1. "Primitives" (1 mode: Default)  — raw color values, hidden from pickers
 *   2. "Semantic"   (2 modes: Light, Dark) — tokens with codeSyntax, scopes, descriptions
 *
 * Reads source DTCG token JSONs directly (not built/flattened output) to preserve
 * the exact hierarchy and enable proper VariableAlias chains.
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
import {
  walkTokenTree,
  computeCodeSyntax,
  deriveScopes,
  parseTokenReference,
  hexToFigmaColor,
  resolveValue,
  type FigmaColor,
  type ModeValue,
  type TokenEntry,
} from './figma-push-utils.js';

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
// Load source token files
// ---------------------------------------------------------------------------

function loadJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(root, path), 'utf-8'));
}

const baseTokens = loadJson<Record<string, unknown>>('tokens/color/primitive/base.json');
const specialtyTokens = loadJson<Record<string, unknown>>('tokens/color/primitive/specialty.json');
const lightTokens = loadJson<Record<string, unknown>>('tokens/color/semantic/light.json');
const darkTokens = loadJson<Record<string, unknown>>('tokens/color/semantic/dark.json');
const descriptions = loadJson<Record<string, string>>('tokens/color/semantic/descriptions.json');

// ---------------------------------------------------------------------------
// Extract token entries via tree walker
// ---------------------------------------------------------------------------

const primitiveEntries = [
  ...walkTokenTree(baseTokens),
  ...walkTokenTree(specialtyTokens),
];

const lightEntries = walkTokenTree(lightTokens);
const darkEntries = walkTokenTree(darkTokens);

function semanticFigmaName(entry: TokenEntry): string {
  return entry.path.slice(1).join('/');
}

const lightByName = new Map<string, TokenEntry>();
for (const e of lightEntries) lightByName.set(semanticFigmaName(e), e);

const darkByName = new Map<string, TokenEntry>();
for (const e of darkEntries) darkByName.set(semanticFigmaName(e), e);

const allSemanticNames = [...new Set([...lightByName.keys(), ...darkByName.keys()])];

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
  codeSyntax?: { WEB: string; ANDROID: string; iOS: string };
  scopes?: string[];
  description?: string;
}

interface VariableUpdate {
  action: 'UPDATE';
  id: string;
  name?: string;
  codeSyntax?: { WEB: string; ANDROID: string; iOS: string };
  scopes?: string[];
  description?: string;
}

interface VariableModeValue {
  variableId: string;
  modeId: string;
  value: ModeValue;
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

  const primitivesCollection = Object.values(collections).find((c) => c.name === 'Primitives');
  const semanticCollection = Object.values(collections).find((c) => c.name === 'Semantic');

  const existingVarsByName = new Map<string, FigmaVariable>();
  for (const v of Object.values(variables)) {
    existingVarsByName.set(`${v.variableCollectionId}::${v.name}`, v);
  }

  const variableChanges: (VariableCreate | VariableUpdate)[] = [];
  const variableModeValues: VariableModeValue[] = [];
  const collectionCreates: { action: string; id: string; name: string; initialModeId?: string }[] = [];
  const modeCreates: { action: string; id: string; name: string; variableCollectionId: string }[] = [];
  const modeUpdates: { action: string; id: string; name: string; variableCollectionId: string }[] = [];

  let tempIdCounter = 0;
  function tempId(): string {
    return `temp_${tempIdCounter++}`;
  }

  // ----- Primitives collection -----
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

  // ----- Semantic collection -----
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

  // ----- Primitive variables -----
  const primitiveIdMap = new Map<string, string>();
  const primitiveHexMap = new Map<string, string>();
  let createdCount = 0;
  let updatedCount = 0;

  for (const entry of primitiveEntries) {
    const name = entry.path.join('/');

    // Build hex resolution map
    if (entry.rawValue.startsWith('#')) {
      primitiveHexMap.set(name, entry.rawValue);
    } else {
      const ref = parseTokenReference(entry.rawValue);
      if (ref) {
        const refHex = primitiveHexMap.get(ref.join('/'));
        if (refHex) primitiveHexMap.set(name, refHex);
      }
    }

    const existingVar = existingVarsByName.get(`${primCollId}::${name}`);
    let varId: string;

    if (existingVar) {
      varId = existingVar.id;
      variableChanges.push({
        action: 'UPDATE',
        id: varId,
        scopes: [],
      });
      updatedCount++;
    } else {
      varId = tempId();
      variableChanges.push({
        action: 'CREATE',
        id: varId,
        name,
        variableCollectionId: primCollId,
        resolvedType: 'COLOR',
        scopes: [],
      });
      createdCount++;
    }

    primitiveIdMap.set(name, varId);

    // Resolve value: alias to another primitive or raw hex
    const resolved = resolveValue(entry.rawValue, primitiveIdMap, primitiveHexMap);
    if (resolved) {
      variableModeValues.push({ variableId: varId, modeId: primModeId, value: resolved });
    } else {
      console.warn(`Could not resolve value for primitive ${name}: ${entry.rawValue}`);
    }
  }

  // ----- Semantic variables -----
  for (const name of allSemanticNames) {
    const segments = name.split('/');
    const codeSyntax = computeCodeSyntax(segments);
    const scopes = deriveScopes(name);
    const description = descriptions[name] ?? '';

    const existingVar = existingVarsByName.get(`${semCollId}::${name}`);
    let varId: string;

    if (existingVar) {
      varId = existingVar.id;
      variableChanges.push({
        action: 'UPDATE',
        id: varId,
        codeSyntax,
        scopes,
        description,
      });
      updatedCount++;
    } else {
      varId = tempId();
      variableChanges.push({
        action: 'CREATE',
        id: varId,
        name,
        variableCollectionId: semCollId,
        resolvedType: 'COLOR',
        codeSyntax,
        scopes,
        description,
      });
      createdCount++;
    }

    // Light mode
    const lightEntry = lightByName.get(name);
    if (lightEntry) {
      const resolved = resolveValue(lightEntry.rawValue, primitiveIdMap, primitiveHexMap);
      if (resolved) {
        variableModeValues.push({ variableId: varId, modeId: lightModeId, value: resolved });
      } else {
        console.warn(`Could not resolve light value for ${name}: ${lightEntry.rawValue}`);
      }
    }

    // Dark mode
    const darkEntry = darkByName.get(name);
    if (darkEntry) {
      const resolved = resolveValue(darkEntry.rawValue, primitiveIdMap, primitiveHexMap);
      if (resolved) {
        variableModeValues.push({ variableId: varId, modeId: darkModeId, value: resolved });
      } else {
        console.warn(`Could not resolve dark value for ${name}: ${darkEntry.rawValue}`);
      }
    }
  }

  // ----- Send batch request -----
  const payload: Record<string, unknown[]> = {};
  if (collectionCreates.length) payload.variableCollections = collectionCreates;
  if (modeCreates.length || modeUpdates.length) payload.variableModes = [...modeUpdates, ...modeCreates];
  if (variableChanges.length) payload.variables = variableChanges;
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
