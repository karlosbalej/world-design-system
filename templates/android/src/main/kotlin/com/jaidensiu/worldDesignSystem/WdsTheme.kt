package com.jaidensiu.worldDesignSystem

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * Semantic color interface for the World Design System.
 * All fields map to semantic token names.
 */
data class WdsColors(
    // Background
    val surfacePrimary: Color,
    val surfaceSecondary: Color,
    val surfaceTertiary: Color,
    val surfaceOverlay: Color,
    val surfaceElevated: Color,
    // Text
    val textPrimary: Color,
    val textSecondary: Color,
    val textTertiary: Color,
    val textInverse: Color,
    val textLink: Color,
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
    // Action
    val actionPrimary: Color,
    val actionPrimaryContent: Color,
    val actionSecondary: Color,
    val actionSecondaryBorder: Color,
    val actionSecondaryContent: Color,
    val actionTertiary: Color,
    val actionTertiaryContent: Color,
    val actionDisabled: Color,
    val actionDisabledContent: Color,
    // Control
    val controlOn: Color,
    val controlOff: Color,
    val controlThumb: Color,
    val controlOnContent: Color,
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
    // Badge
    val badgeBackground: Color,
    val badgeText: Color,
    val badgeBorder: Color,
    // Tab Bar
    val tabBarSelected: Color,
    val tabBarUnselected: Color,
    val tabBarBackground: Color,
    val tabBarBorder: Color,
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
    textInverse = WdsLightColorTokens.textInverse,
    textLink = WdsLightColorTokens.textLink,
    iconPrimary = WdsLightColorTokens.iconPrimary,
    iconSecondary = WdsLightColorTokens.iconSecondary,
    iconTertiary = WdsLightColorTokens.iconTertiary,
    iconDisabled = WdsLightColorTokens.iconDisabled,
    iconInverse = WdsLightColorTokens.iconInverse,
    borderSubtle = WdsLightColorTokens.borderSubtle,
    borderDefault = WdsLightColorTokens.borderDefault,
    borderStrong = WdsLightColorTokens.borderStrong,
    borderFocus = WdsLightColorTokens.borderFocus,
    actionPrimary = WdsLightColorTokens.actionPrimary,
    actionPrimaryContent = WdsLightColorTokens.actionPrimaryContent,
    actionSecondary = WdsLightColorTokens.actionSecondary,
    actionSecondaryBorder = WdsLightColorTokens.actionSecondaryBorder,
    actionSecondaryContent = WdsLightColorTokens.actionSecondaryContent,
    actionTertiary = WdsLightColorTokens.actionTertiary,
    actionTertiaryContent = WdsLightColorTokens.actionTertiaryContent,
    actionDisabled = WdsLightColorTokens.actionDisabled,
    actionDisabledContent = WdsLightColorTokens.actionDisabledContent,
    controlOn = WdsLightColorTokens.controlOn,
    controlOff = WdsLightColorTokens.controlOff,
    controlThumb = WdsLightColorTokens.controlThumb,
    controlOnContent = WdsLightColorTokens.controlOnContent,
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
    badgeBackground = WdsLightColorTokens.badgeBackground,
    badgeText = WdsLightColorTokens.badgeText,
    badgeBorder = WdsLightColorTokens.badgeBorder,
    tabBarSelected = WdsLightColorTokens.tabBarSelected,
    tabBarUnselected = WdsLightColorTokens.tabBarUnselected,
    tabBarBackground = WdsLightColorTokens.tabBarBackground,
    tabBarBorder = WdsLightColorTokens.tabBarBorder,
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
    textInverse = WdsDarkColorTokens.textInverse,
    textLink = WdsDarkColorTokens.textLink,
    iconPrimary = WdsDarkColorTokens.iconPrimary,
    iconSecondary = WdsDarkColorTokens.iconSecondary,
    iconTertiary = WdsDarkColorTokens.iconTertiary,
    iconDisabled = WdsDarkColorTokens.iconDisabled,
    iconInverse = WdsDarkColorTokens.iconInverse,
    borderSubtle = WdsDarkColorTokens.borderSubtle,
    borderDefault = WdsDarkColorTokens.borderDefault,
    borderStrong = WdsDarkColorTokens.borderStrong,
    borderFocus = WdsDarkColorTokens.borderFocus,
    actionPrimary = WdsDarkColorTokens.actionPrimary,
    actionPrimaryContent = WdsDarkColorTokens.actionPrimaryContent,
    actionSecondary = WdsDarkColorTokens.actionSecondary,
    actionSecondaryBorder = WdsDarkColorTokens.actionSecondaryBorder,
    actionSecondaryContent = WdsDarkColorTokens.actionSecondaryContent,
    actionTertiary = WdsDarkColorTokens.actionTertiary,
    actionTertiaryContent = WdsDarkColorTokens.actionTertiaryContent,
    actionDisabled = WdsDarkColorTokens.actionDisabled,
    actionDisabledContent = WdsDarkColorTokens.actionDisabledContent,
    controlOn = WdsDarkColorTokens.controlOn,
    controlOff = WdsDarkColorTokens.controlOff,
    controlThumb = WdsDarkColorTokens.controlThumb,
    controlOnContent = WdsDarkColorTokens.controlOnContent,
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
    badgeBackground = WdsDarkColorTokens.badgeBackground,
    badgeText = WdsDarkColorTokens.badgeText,
    badgeBorder = WdsDarkColorTokens.badgeBorder,
    tabBarSelected = WdsDarkColorTokens.tabBarSelected,
    tabBarUnselected = WdsDarkColorTokens.tabBarUnselected,
    tabBarBackground = WdsDarkColorTokens.tabBarBackground,
    tabBarBorder = WdsDarkColorTokens.tabBarBorder,
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
