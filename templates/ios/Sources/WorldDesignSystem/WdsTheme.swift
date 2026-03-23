import Foundation

/// Semantic color set for the World Design System.
/// All values are hex strings (e.g. "FFFFFF") – the consuming app bridges to its own color type.
public struct WdsSemanticColors: Sendable {
    // Background
    public let surfacePrimary: String
    public let surfaceSecondary: String
    public let surfaceTertiary: String
    public let surfaceOverlay: String
    public let surfaceElevated: String
    // Text
    public let textPrimary: String
    public let textSecondary: String
    public let textTertiary: String
    public let textInverse: String
    public let textLink: String
    // Icon
    public let iconPrimary: String
    public let iconSecondary: String
    public let iconTertiary: String
    public let iconDisabled: String
    public let iconInverse: String
    // Border
    public let borderSubtle: String
    public let borderDefault: String
    public let borderStrong: String
    public let borderFocus: String
    // Action
    public let actionPrimary: String
    public let actionPrimaryContent: String
    public let actionSecondary: String
    public let actionSecondaryBorder: String
    public let actionSecondaryContent: String
    public let actionTertiary: String
    public let actionTertiaryContent: String
    public let actionDisabled: String
    public let actionDisabledContent: String
    // Control
    public let controlOn: String
    public let controlOff: String
    public let controlThumb: String
    public let controlOnContent: String
    // Input
    public let inputBackground: String
    public let inputBackgroundFocus: String
    public let inputText: String
    public let inputPlaceholder: String
    public let inputDivider: String
    public let inputError: String
    // Status
    public let statusError: String
    public let statusWarning: String
    public let statusSuccess: String
    public let statusInfo: String
    public let statusErrorBackground: String
    public let statusWarningBackground: String
    public let statusSuccessBackground: String
    public let statusInfoBackground: String
    // Badge
    public let badgeBackground: String
    public let badgeText: String
    public let badgeBorder: String
    // Tab Bar
    public let tabBarSelected: String
    public let tabBarUnselected: String
    public let tabBarBackground: String
    public let tabBarBorder: String
}

public enum WdsTheme {
    public static let light = WdsSemanticColors(
        surfacePrimary: WdsLightColorTokens.surfacePrimary,
        surfaceSecondary: WdsLightColorTokens.surfaceSecondary,
        surfaceTertiary: WdsLightColorTokens.surfaceTertiary,
        surfaceOverlay: WdsLightColorTokens.surfaceOverlay,
        surfaceElevated: WdsLightColorTokens.surfaceElevated,
        textPrimary: WdsLightColorTokens.textPrimary,
        textSecondary: WdsLightColorTokens.textSecondary,
        textTertiary: WdsLightColorTokens.textTertiary,
        textInverse: WdsLightColorTokens.textInverse,
        textLink: WdsLightColorTokens.textLink,
        iconPrimary: WdsLightColorTokens.iconPrimary,
        iconSecondary: WdsLightColorTokens.iconSecondary,
        iconTertiary: WdsLightColorTokens.iconTertiary,
        iconDisabled: WdsLightColorTokens.iconDisabled,
        iconInverse: WdsLightColorTokens.iconInverse,
        borderSubtle: WdsLightColorTokens.borderSubtle,
        borderDefault: WdsLightColorTokens.borderDefault,
        borderStrong: WdsLightColorTokens.borderStrong,
        borderFocus: WdsLightColorTokens.borderFocus,
        actionPrimary: WdsLightColorTokens.actionPrimary,
        actionPrimaryContent: WdsLightColorTokens.actionPrimaryContent,
        actionSecondary: WdsLightColorTokens.actionSecondary,
        actionSecondaryBorder: WdsLightColorTokens.actionSecondaryBorder,
        actionSecondaryContent: WdsLightColorTokens.actionSecondaryContent,
        actionTertiary: WdsLightColorTokens.actionTertiary,
        actionTertiaryContent: WdsLightColorTokens.actionTertiaryContent,
        actionDisabled: WdsLightColorTokens.actionDisabled,
        actionDisabledContent: WdsLightColorTokens.actionDisabledContent,
        controlOn: WdsLightColorTokens.controlOn,
        controlOff: WdsLightColorTokens.controlOff,
        controlThumb: WdsLightColorTokens.controlThumb,
        controlOnContent: WdsLightColorTokens.controlOnContent,
        inputBackground: WdsLightColorTokens.inputBackground,
        inputBackgroundFocus: WdsLightColorTokens.inputBackgroundFocus,
        inputText: WdsLightColorTokens.inputText,
        inputPlaceholder: WdsLightColorTokens.inputPlaceholder,
        inputDivider: WdsLightColorTokens.inputDivider,
        inputError: WdsLightColorTokens.inputError,
        statusError: WdsLightColorTokens.statusError,
        statusWarning: WdsLightColorTokens.statusWarning,
        statusSuccess: WdsLightColorTokens.statusSuccess,
        statusInfo: WdsLightColorTokens.statusInfo,
        statusErrorBackground: WdsLightColorTokens.statusErrorBackground,
        statusWarningBackground: WdsLightColorTokens.statusWarningBackground,
        statusSuccessBackground: WdsLightColorTokens.statusSuccessBackground,
        statusInfoBackground: WdsLightColorTokens.statusInfoBackground,
        badgeBackground: WdsLightColorTokens.badgeBackground,
        badgeText: WdsLightColorTokens.badgeText,
        badgeBorder: WdsLightColorTokens.badgeBorder,
        tabBarSelected: WdsLightColorTokens.tabBarSelected,
        tabBarUnselected: WdsLightColorTokens.tabBarUnselected,
        tabBarBackground: WdsLightColorTokens.tabBarBackground,
        tabBarBorder: WdsLightColorTokens.tabBarBorder
    )

    public static let dark = WdsSemanticColors(
        surfacePrimary: WdsDarkColorTokens.surfacePrimary,
        surfaceSecondary: WdsDarkColorTokens.surfaceSecondary,
        surfaceTertiary: WdsDarkColorTokens.surfaceTertiary,
        surfaceOverlay: WdsDarkColorTokens.surfaceOverlay,
        surfaceElevated: WdsDarkColorTokens.surfaceElevated,
        textPrimary: WdsDarkColorTokens.textPrimary,
        textSecondary: WdsDarkColorTokens.textSecondary,
        textTertiary: WdsDarkColorTokens.textTertiary,
        textInverse: WdsDarkColorTokens.textInverse,
        textLink: WdsDarkColorTokens.textLink,
        iconPrimary: WdsDarkColorTokens.iconPrimary,
        iconSecondary: WdsDarkColorTokens.iconSecondary,
        iconTertiary: WdsDarkColorTokens.iconTertiary,
        iconDisabled: WdsDarkColorTokens.iconDisabled,
        iconInverse: WdsDarkColorTokens.iconInverse,
        borderSubtle: WdsDarkColorTokens.borderSubtle,
        borderDefault: WdsDarkColorTokens.borderDefault,
        borderStrong: WdsDarkColorTokens.borderStrong,
        borderFocus: WdsDarkColorTokens.borderFocus,
        actionPrimary: WdsDarkColorTokens.actionPrimary,
        actionPrimaryContent: WdsDarkColorTokens.actionPrimaryContent,
        actionSecondary: WdsDarkColorTokens.actionSecondary,
        actionSecondaryBorder: WdsDarkColorTokens.actionSecondaryBorder,
        actionSecondaryContent: WdsDarkColorTokens.actionSecondaryContent,
        actionTertiary: WdsDarkColorTokens.actionTertiary,
        actionTertiaryContent: WdsDarkColorTokens.actionTertiaryContent,
        actionDisabled: WdsDarkColorTokens.actionDisabled,
        actionDisabledContent: WdsDarkColorTokens.actionDisabledContent,
        controlOn: WdsDarkColorTokens.controlOn,
        controlOff: WdsDarkColorTokens.controlOff,
        controlThumb: WdsDarkColorTokens.controlThumb,
        controlOnContent: WdsDarkColorTokens.controlOnContent,
        inputBackground: WdsDarkColorTokens.inputBackground,
        inputBackgroundFocus: WdsDarkColorTokens.inputBackgroundFocus,
        inputText: WdsDarkColorTokens.inputText,
        inputPlaceholder: WdsDarkColorTokens.inputPlaceholder,
        inputDivider: WdsDarkColorTokens.inputDivider,
        inputError: WdsDarkColorTokens.inputError,
        statusError: WdsDarkColorTokens.statusError,
        statusWarning: WdsDarkColorTokens.statusWarning,
        statusSuccess: WdsDarkColorTokens.statusSuccess,
        statusInfo: WdsDarkColorTokens.statusInfo,
        statusErrorBackground: WdsDarkColorTokens.statusErrorBackground,
        statusWarningBackground: WdsDarkColorTokens.statusWarningBackground,
        statusSuccessBackground: WdsDarkColorTokens.statusSuccessBackground,
        statusInfoBackground: WdsDarkColorTokens.statusInfoBackground,
        badgeBackground: WdsDarkColorTokens.badgeBackground,
        badgeText: WdsDarkColorTokens.badgeText,
        badgeBorder: WdsDarkColorTokens.badgeBorder,
        tabBarSelected: WdsDarkColorTokens.tabBarSelected,
        tabBarUnselected: WdsDarkColorTokens.tabBarUnselected,
        tabBarBackground: WdsDarkColorTokens.tabBarBackground,
        tabBarBorder: WdsDarkColorTokens.tabBarBorder
    )
}
