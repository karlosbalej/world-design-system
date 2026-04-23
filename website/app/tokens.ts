import primitiveTokens from "@jaidensiu/world-design-system/tokens.json";
import lightThemeTokens from "@jaidensiu/world-design-system/light-theme.json";
import darkThemeTokens from "@jaidensiu/world-design-system/dark-theme.json";
import typographyTokens_ from "@jaidensiu/world-design-system/typography.json";
import spacingTokens_ from "@jaidensiu/world-design-system/spacing.json";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ColorGroup {
  name: string;
  colors: { name: string; value: string }[];
}

export interface TypographyToken {
  name: string;
  category: string;
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeightMultiplier: number;
}

export interface SpacingToken {
  name: string;
  value: number;
}

export interface SemanticToken {
  name: string;
  group: string;
  light: string;
  dark: string;
  lightRef: string;
  darkRef: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Group flat "colorFoo123" keys into { groupName: [{ shade, hex }] } */
function groupPrimitiveColors(
  tokens: Record<string, string>,
  prefix: string,
): { group: string; shade: string; hex: string }[] {
  return Object.entries(tokens)
    .filter(([k]) => k.startsWith(prefix))
    .map(([k, v]) => {
      const rest = k.slice(prefix.length);
      // Find where the shade/variant starts (first digit or uppercase after group name)
      const match = rest.match(/^([A-Z][a-z]*)(.*)$/);
      if (match) {
        return { group: match[1], shade: match[2] || match[1], hex: v };
      }
      return { group: rest, shade: rest, hex: v };
    });
}

// ---------------------------------------------------------------------------
// Primitive colors — parsed from tokens.json
// ---------------------------------------------------------------------------

const primitiveGroupOrder = [
  "Grey",
  "Black",
  "Error",
  "Warning",
  "Success",
  "Info",
];

const specialtyGroupOrder = [
  "WorldBlue",
  "CarrotOrange",
  "Purple",
  "Green",
  "Blue",
];

const specialtyDisplayNames: Record<string, string> = {
  WorldBlue: "World Blue",
  CarrotOrange: "Carrot Orange",
  Purple: "Purple",
  Green: "Green",
  Blue: "Blue",
};

function buildPrimitiveColors(): ColorGroup[] {
  const groups: ColorGroup[] = [];

  for (const groupName of primitiveGroupOrder) {
    const prefix = `color${groupName}`;
    const colors: { name: string; value: string }[] = [];

    for (const [key, value] of Object.entries(primitiveTokens)) {
      if (groupName === "Black") {
        if (key === "colorBlack") {
          colors.push({ name: "black", value });
        }
      } else if (key.startsWith(prefix)) {
        const shade = key.slice(prefix.length);
        colors.push({ name: shade, value });
      }
    }

    if (colors.length > 0) {
      groups.push({ name: groupName, colors });
    }
  }

  return groups;
}

function buildSpecialtyColors(): ColorGroup[] {
  const groups: ColorGroup[] = [];

  for (const groupName of specialtyGroupOrder) {
    const prefix = `color${groupName}`;
    const colors: { name: string; value: string }[] = [];

    for (const [key, value] of Object.entries(primitiveTokens)) {
      if (key.startsWith(prefix)) {
        const variant = key.slice(prefix.length).toLowerCase();
        colors.push({ name: variant, value });
      }
    }

    if (colors.length > 0) {
      groups.push({
        name: specialtyDisplayNames[groupName] || groupName,
        colors,
      });
    }
  }

  // Remaining specialty colors not in the above groups
  const handledPrefixes = [
    ...primitiveGroupOrder.map((g) => `color${g}`),
    ...specialtyGroupOrder.map((g) => `color${g}`),
    "colorBlack",
  ];

  const otherColors: { name: string; value: string }[] = [];
  for (const [key, value] of Object.entries(primitiveTokens)) {
    if (!key.startsWith("color")) continue;
    const matchesHandled = handledPrefixes.some((p) => key.startsWith(p));
    if (!matchesHandled) {
      // Convert camelCase key to readable name: "colorDeepSkyBlue" -> "deepSkyBlue"
      const name = key.slice("color".length);
      const readableName = name.charAt(0).toLowerCase() + name.slice(1);
      otherColors.push({ name: readableName, value });
    }
  }

  if (otherColors.length > 0) {
    groups.push({ name: "Other", colors: otherColors });
  }

  return groups;
}

export const primitiveColors: ColorGroup[] = buildPrimitiveColors();
export const specialtyColors: ColorGroup[] = buildSpecialtyColors();

// ---------------------------------------------------------------------------
// Semantic tokens — parsed from light-theme.json + dark-theme.json
// ---------------------------------------------------------------------------

/** Build a reverse map from hex -> primitive token name (e.g. "#181818" -> "grey.900") */
function buildHexToPrimitiveName(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, value] of Object.entries(primitiveTokens)) {
    if (!key.startsWith("color")) continue;
    const rest = key.slice("color".length);
    // Split camelCase into group + shade: "Grey900" -> "grey.900", "Error600" -> "error.600"
    const match = rest.match(/^([A-Z][a-zA-Z]*?)(\d+)$/);
    if (match) {
      const group = match[1].charAt(0).toLowerCase() + match[1].slice(1);
      map[value.toUpperCase()] = `${group}.${match[2]}`;
    } else if (rest === "Black") {
      map[value.toUpperCase()] = "black";
    } else {
      // Specialty colors: "WorldBlueLoud" -> "worldBlue.loud"
      const variantMatch = rest.match(/^([A-Z][a-zA-Z]*?)(Loud|Silent|Primary)$/);
      if (variantMatch) {
        const group = variantMatch[1].charAt(0).toLowerCase() + variantMatch[1].slice(1);
        const variant = variantMatch[2].charAt(0).toLowerCase() + variantMatch[2].slice(1);
        map[value.toUpperCase()] = `${group}.${variant}`;
      } else {
        const name = rest.charAt(0).toLowerCase() + rest.slice(1);
        map[value.toUpperCase()] = name;
      }
    }
  }
  return map;
}

const hexToPrimitive = buildHexToPrimitiveName();

function buildSemanticTokens(): SemanticToken[] {
  const tokens: SemanticToken[] = [];

  // Tokens are emitted with either a `semantic` or `component` root prefix
  // depending on which JSON tier they live in. The website surfaces them under
  // the same display groups regardless of tier, so we match both prefixes.
  const groupPatterns = [
    { prefix: "semanticBackground", group: "Background", label: "background" },
    { prefix: "semanticText",       group: "Text",       label: "text" },
    { prefix: "semanticBorder",     group: "Border",     label: "border" },
    { prefix: "semanticStatus",     group: "Status",     label: "status" },
    { prefix: "componentAction",    group: "Action",     label: "action" },
    { prefix: "componentInput",     group: "Input",      label: "input" },
    { prefix: "componentTabBar",    group: "Tab Bar",    label: "tabBar" },
    { prefix: "componentBadge",     group: "Badge",      label: "badge" },
    { prefix: "componentCard",      group: "Card",       label: "card" },
  ];

  for (const [key, lightValue] of Object.entries(lightThemeTokens)) {
    const darkValue =
      (darkThemeTokens as Record<string, string>)[key] || lightValue;

    for (const { prefix, group, label } of groupPatterns) {
      if (key.startsWith(prefix)) {
        const rest = key.slice(prefix.length);
        const propName = rest.charAt(0).toLowerCase() + rest.slice(1);
        tokens.push({
          name: `${label}.${propName}`,
          group,
          light: lightValue,
          dark: darkValue,
          lightRef: hexToPrimitive[lightValue.toUpperCase()] || "",
          darkRef: hexToPrimitive[darkValue.toUpperCase()] || "",
        });
        break;
      }
    }
  }

  return tokens;
}

export const semanticTokens: SemanticToken[] = buildSemanticTokens();

// ---------------------------------------------------------------------------
// Typography — parsed from typography.json
// ---------------------------------------------------------------------------

const categoryMap: Record<string, string> = {
  D: "Display",
  N: "Narrative",
  H: "Headline",
  S: "Subtitle",
  L: "Label",
  B: "Body",
};

function buildTypographyTokens(): TypographyToken[] {
  return Object.entries(typographyTokens_).map(([key, value]) => {
    const name = key.replace("typography", "").toLowerCase();
    const categoryLetter = name.charAt(0).toUpperCase();
    const category = categoryMap[categoryLetter] || "Other";
    const v = value as {
      fontSize: number;
      fontWeight: number;
      letterSpacing: number;
      lineHeightMultiplier: number;
    };
    return {
      name,
      category,
      fontSize: v.fontSize,
      fontWeight: v.fontWeight,
      letterSpacing: v.letterSpacing,
      lineHeightMultiplier: v.lineHeightMultiplier,
    };
  });
}

export const typographyTokens: TypographyToken[] = buildTypographyTokens();

// ---------------------------------------------------------------------------
// Spacing — parsed from spacing.json
// ---------------------------------------------------------------------------

function buildSpacingTokens(): SpacingToken[] {
  return Object.entries(spacingTokens_).map(([key, value]) => ({
    name: key.replace("spacing", "").replace(/^(.)/, (c) => c.toLowerCase()),
    value: value as number,
  }));
}

export const spacingTokens: SpacingToken[] = buildSpacingTokens();

// ---------------------------------------------------------------------------
// Misc exports
// ---------------------------------------------------------------------------

export const fontWeightLabels: Record<number, string> = {
  325: "Light",
  400: "Normal",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
};
