package com.jaidensiu.worldDesignSystem

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

data class WdsColors(
    // Surface
    val surfacePrimary: Color,
    val surfaceSecondary: Color,
    val surfaceTertiary: Color,
    val surfaceOverlay: Color,
    val surfaceElevated: Color,
    // Text
    val textPrimary: Color,
    val textSecondary: Color,
    val textTertiary: Color,
    val textDisabled: Color,
    val textInverse: Color,
    // Icon
    val iconPrimary: Color,
    val iconSecondary: Color,
    val iconTertiary: Color,
    val iconDisabled: Color,
    val iconInverse: Color,
    // Border
    val borderSubtle: Color,
    val borderDefault: Color,
    val borderStrong: Color,
    val borderFocus: Color,
    val borderDivider: Color,
    val borderTranslucent: Color,
    // Action
    val actionPrimary: Color,
    val actionPrimaryContent: Color,
    val actionSecondary: Color,
    val actionSecondaryContent: Color,
    val actionTertiary: Color,
    val actionTertiaryContent: Color,
    val actionDestructive: Color,
    val actionDestructiveContent: Color,
    val actionDisabled: Color,
    val actionDisabledContent: Color,
    val actionGhost: Color,
    val actionGhostContent: Color,
    // Input
    val inputBackground: Color,
    val inputBackgroundFocus: Color,
    val inputText: Color,
    val inputPlaceholder: Color,
    val inputDivider: Color,
    val inputError: Color,
    // Status
    val statusError: Color,
    val statusWarning: Color,
    val statusSuccess: Color,
    val statusInfo: Color,
    val statusErrorBackground: Color,
    val statusWarningBackground: Color,
    val statusSuccessBackground: Color,
    val statusInfoBackground: Color,
    // Accent
    val accentPrimary: Color,
    val accentContent: Color,
)

fun lightColors() = WdsColors(
    surfacePrimary = WdsLightColorTokens.surfacePrimary,
    surfaceSecondary = WdsLightColorTokens.surfaceSecondary,
    surfaceTertiary = WdsLightColorTokens.surfaceTertiary,
    surfaceOverlay = WdsLightColorTokens.surfaceOverlay,
    surfaceElevated = WdsLightColorTokens.surfaceElevated,
    textPrimary = WdsLightColorTokens.textPrimary,
    textSecondary = WdsLightColorTokens.textSecondary,
    textTertiary = WdsLightColorTokens.textTertiary,
    textDisabled = WdsLightColorTokens.textDisabled,
    textInverse = WdsLightColorTokens.textInverse,
    iconPrimary = WdsLightColorTokens.iconPrimary,
    iconSecondary = WdsLightColorTokens.iconSecondary,
    iconTertiary = WdsLightColorTokens.iconTertiary,
    iconDisabled = WdsLightColorTokens.iconDisabled,
    iconInverse = WdsLightColorTokens.iconInverse,
    borderSubtle = WdsLightColorTokens.borderSubtle,
    borderDefault = WdsLightColorTokens.borderDefault,
    borderStrong = WdsLightColorTokens.borderStrong,
    borderFocus = WdsLightColorTokens.borderFocus,
    borderDivider = WdsLightColorTokens.borderDivider,
    borderTranslucent = WdsLightColorTokens.borderTranslucent,
    actionPrimary = WdsLightColorTokens.actionPrimary,
    actionPrimaryContent = WdsLightColorTokens.actionPrimaryContent,
    actionSecondary = WdsLightColorTokens.actionSecondary,
    actionSecondaryContent = WdsLightColorTokens.actionSecondaryContent,
    actionTertiary = WdsLightColorTokens.actionTertiary,
    actionTertiaryContent = WdsLightColorTokens.actionTertiaryContent,
    actionDestructive = WdsLightColorTokens.actionDestructive,
    actionDestructiveContent = WdsLightColorTokens.actionDestructiveContent,
    actionDisabled = WdsLightColorTokens.actionDisabled,
    actionDisabledContent = WdsLightColorTokens.actionDisabledContent,
    actionGhost = WdsLightColorTokens.actionGhost,
    actionGhostContent = WdsLightColorTokens.actionGhostContent,
    inputBackground = WdsLightColorTokens.inputBackground,
    inputBackgroundFocus = WdsLightColorTokens.inputBackgroundFocus,
    inputText = WdsLightColorTokens.inputText,
    inputPlaceholder = WdsLightColorTokens.inputPlaceholder,
    inputDivider = WdsLightColorTokens.inputDivider,
    inputError = WdsLightColorTokens.inputError,
    statusError = WdsLightColorTokens.statusError,
    statusWarning = WdsLightColorTokens.statusWarning,
    statusSuccess = WdsLightColorTokens.statusSuccess,
    statusInfo = WdsLightColorTokens.statusInfo,
    statusErrorBackground = WdsLightColorTokens.statusErrorBackground,
    statusWarningBackground = WdsLightColorTokens.statusWarningBackground,
    statusSuccessBackground = WdsLightColorTokens.statusSuccessBackground,
    statusInfoBackground = WdsLightColorTokens.statusInfoBackground,
    accentPrimary = WdsLightColorTokens.accentPrimary,
    accentContent = WdsLightColorTokens.accentContent,
)

fun darkColors() = WdsColors(
    surfacePrimary = WdsDarkColorTokens.surfacePrimary,
    surfaceSecondary = WdsDarkColorTokens.surfaceSecondary,
    surfaceTertiary = WdsDarkColorTokens.surfaceTertiary,
    surfaceOverlay = WdsDarkColorTokens.surfaceOverlay,
    surfaceElevated = WdsDarkColorTokens.surfaceElevated,
    textPrimary = WdsDarkColorTokens.textPrimary,
    textSecondary = WdsDarkColorTokens.textSecondary,
    textTertiary = WdsDarkColorTokens.textTertiary,
    textDisabled = WdsDarkColorTokens.textDisabled,
    textInverse = WdsDarkColorTokens.textInverse,
    iconPrimary = WdsDarkColorTokens.iconPrimary,
    iconSecondary = WdsDarkColorTokens.iconSecondary,
    iconTertiary = WdsDarkColorTokens.iconTertiary,
    iconDisabled = WdsDarkColorTokens.iconDisabled,
    iconInverse = WdsDarkColorTokens.iconInverse,
    borderSubtle = WdsDarkColorTokens.borderSubtle,
    borderDefault = WdsDarkColorTokens.borderDefault,
    borderStrong = WdsDarkColorTokens.borderStrong,
    borderFocus = WdsDarkColorTokens.borderFocus,
    borderDivider = WdsDarkColorTokens.borderDivider,
    borderTranslucent = WdsDarkColorTokens.borderTranslucent,
    actionPrimary = WdsDarkColorTokens.actionPrimary,
    actionPrimaryContent = WdsDarkColorTokens.actionPrimaryContent,
    actionSecondary = WdsDarkColorTokens.actionSecondary,
    actionSecondaryContent = WdsDarkColorTokens.actionSecondaryContent,
    actionTertiary = WdsDarkColorTokens.actionTertiary,
    actionTertiaryContent = WdsDarkColorTokens.actionTertiaryContent,
    actionDestructive = WdsDarkColorTokens.actionDestructive,
    actionDestructiveContent = WdsDarkColorTokens.actionDestructiveContent,
    actionDisabled = WdsDarkColorTokens.actionDisabled,
    actionDisabledContent = WdsDarkColorTokens.actionDisabledContent,
    actionGhost = WdsDarkColorTokens.actionGhost,
    actionGhostContent = WdsDarkColorTokens.actionGhostContent,
    inputBackground = WdsDarkColorTokens.inputBackground,
    inputBackgroundFocus = WdsDarkColorTokens.inputBackgroundFocus,
    inputText = WdsDarkColorTokens.inputText,
    inputPlaceholder = WdsDarkColorTokens.inputPlaceholder,
    inputDivider = WdsDarkColorTokens.inputDivider,
    inputError = WdsDarkColorTokens.inputError,
    statusError = WdsDarkColorTokens.statusError,
    statusWarning = WdsDarkColorTokens.statusWarning,
    statusSuccess = WdsDarkColorTokens.statusSuccess,
    statusInfo = WdsDarkColorTokens.statusInfo,
    statusErrorBackground = WdsDarkColorTokens.statusErrorBackground,
    statusWarningBackground = WdsDarkColorTokens.statusWarningBackground,
    statusSuccessBackground = WdsDarkColorTokens.statusSuccessBackground,
    statusInfoBackground = WdsDarkColorTokens.statusInfoBackground,
    accentPrimary = WdsDarkColorTokens.accentPrimary,
    accentContent = WdsDarkColorTokens.accentContent,
)

val LocalWdsColors = staticCompositionLocalOf { lightColors() }

@Composable
fun WdsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val colors = if (darkTheme) darkColors() else lightColors()
    CompositionLocalProvider(LocalWdsColors provides colors) {
        content()
    }
}

object Wds {
    val colors: WdsColors
        @Composable
        get() = LocalWdsColors.current
}
