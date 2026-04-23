/**
 * Custom Style Dictionary formats for Kotlin / Jetpack Compose output.
 */

import type { Format, FormatFnArguments } from 'style-dictionary/types';
import type { TypographyTokenValue, FontWeightKey } from './types.js';

const PACKAGE = 'com.jaidensiu.worldDesignSystem';

function hexToArgb(hex: string): string {
  const h = hex.replace('#', '').toUpperCase();
  if (h.length === 8) {
    // Hex-8: #RRGGBBAA → Compose needs 0xAARRGGBB
    const rgb = h.slice(0, 6);
    const alpha = h.slice(6, 8);
    return `0x${alpha}${rgb}`;
  }
  return `0xFF${h}`;
}

function camelCase(path: string[]): string {
  return path
    .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join('');
}

function fontWeightToCompose(weight: number): string {
  const map: Record<FontWeightKey, string> = {
    325: 'FontWeight.Light',
    400: 'FontWeight.Normal',
    500: 'FontWeight.Medium',
    600: 'FontWeight.SemiBold',
    700: 'FontWeight.Bold',
  };
  return map[weight as FontWeightKey] || `FontWeight(${weight})`;
}

/**
 * compose/colorObject – Generates a Kotlin object with Color(...) constants.
 * Used for primitive palette colors and specialty colors.
 */
export const composeColorObject: Format = {
  name: 'compose/colorObject',
  format: ({ dictionary, options }: FormatFnArguments) => {
    const objectName = (options.objectName as string) || 'WdsColorPalette';
    const tokens = dictionary.allTokens.filter((t) => t.$type === 'color');

    const lines = tokens.map((token) => {
      const name = camelCase(token.path);
      const hex = (token.$value || token.value) as string;
      return `    val ${name} = Color(${hexToArgb(hex)})`;
    });

    return [
      `package ${PACKAGE}`,
      '',
      'import androidx.compose.ui.graphics.Color',
      '',
      `object ${objectName} {`,
      ...lines,
      '}',
      '',
    ].join('\n');
  },
};

/**
 * compose/themeColors – Generates a Kotlin object for theme colors
 * (light or dark). Includes both the semantic tier (surface/text/icon/border/
 * status/accent) and the component tier (action/input/badge/card/tabBar).
 * References resolved hex values directly.
 */
export const composeThemeColors: Format = {
  name: 'compose/themeColors',
  format: ({ dictionary, options }: FormatFnArguments) => {
    const objectName = (options.objectName as string) || 'LightColorTokens';
    const tokens = dictionary.allTokens.filter(
      (t) =>
        t.$type === 'color' &&
        (t.path[0] === 'semantic' || t.path[0] === 'component'),
    );

    const lines = tokens.map((token) => {
      // Drop the tier prefix ("semantic" or "component") so both tiers share
      // the same Kotlin names they used before the migration (e.g.
      // `actionPrimary`, `surfacePrimary`).
      const name = camelCase(token.path.slice(1));
      const hex = (token.$value || token.value) as string;
      return `    val ${name} = Color(${hexToArgb(hex)})`;
    });

    return [
      `package ${PACKAGE}`,
      '',
      'import androidx.compose.ui.graphics.Color',
      '',
      `object ${objectName} {`,
      ...lines,
      '}',
      '',
    ].join('\n');
  },
};

/**
 * compose/typography – Generates a Kotlin object with TextStyle constants.
 */
export const composeTypography: Format = {
  name: 'compose/typography',
  format: ({ dictionary }: FormatFnArguments) => {
    const tokens = dictionary.allTokens.filter(
      (t) => t.$type === 'typography',
    );

    const lines = tokens.flatMap((token) => {
      const name = token.path[token.path.length - 1];
      const v = (token.$value || token.value) as TypographyTokenValue;
      const fontSize = v.fontSize;
      const lineHeight = (v.fontSize * v.lineHeightMultiplier).toFixed(1);
      const letterSpacing =
        v.letterSpacing !== 0
          ? `\n        letterSpacing = (${v.letterSpacing}).em,`
          : '';
      return [
        `    val ${name} = TextStyle(`,
        '        fontFamily = WorldProFontFamily,',
        `        fontWeight = ${fontWeightToCompose(v.fontWeight)},`,
        `        fontSize = ${fontSize}.sp,`,
        `        lineHeight = ${lineHeight}.sp,${letterSpacing}`,
        '    )',
        '',
      ];
    });

    return [
      `package ${PACKAGE}`,
      '',
      'import androidx.compose.ui.text.TextStyle',
      'import androidx.compose.ui.text.font.FontFamily',
      'import androidx.compose.ui.text.font.FontWeight',
      'import androidx.compose.ui.unit.em',
      'import androidx.compose.ui.unit.sp',
      '',
      '// Font family must be provided by the consuming app',
      'val WorldProFontFamily = FontFamily.Default',
      '',
      'object WdsTypography {',
      ...lines,
      '}',
      '',
    ].join('\n');
  },
};

/**
 * compose/spacing – Generates a Kotlin object with Dp constants.
 */
export const composeSpacing: Format = {
  name: 'compose/spacing',
  format: ({ dictionary }: FormatFnArguments) => {
    const tokens = dictionary.allTokens.filter(
      (t) => t.$type === 'dimension' && t.path[0] === 'spacing',
    );

    const lines = tokens.map((token) => {
      const name = token.path[token.path.length - 1];
      const v = (token.$value ?? token.value) as number;
      return `    val ${name} = ${v}.dp`;
    });

    return [
      `package ${PACKAGE}`,
      '',
      'import androidx.compose.ui.unit.dp',
      'import androidx.compose.ui.unit.Dp',
      '',
      'object WdsSpacing {',
      ...lines,
      '}',
      '',
    ].join('\n');
  },
};
