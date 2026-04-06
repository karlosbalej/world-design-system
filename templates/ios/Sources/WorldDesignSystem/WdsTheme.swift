import Foundation

/// Semantic color set for the World Design System.
/// All values are hex strings (e.g. "FFFFFF") – the consuming app bridges to its own color type.
public struct WdsSemanticColors: Sendable {
    // Surface
    public let surfacePrimary: String
    public let surfaceSecondary: String
    public let surfaceTertiary: String
    public let surfaceOverlay: String
    public let surfaceElevated: String
    // Text
    public let textPrimary: String
    public let textSecondary: String
    public let textTertiary: String
    public let textDisabled: String
    public let textInverse: String
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
    public let borderDivider: String
    public let borderTranslucent: String
    // Action
    public let actionPrimary: String
    public let actionPrimaryContent: String
    public let actionSecondary: String
    public let actionSecondaryContent: String
    public let actionTertiary: String
    public let actionTertiaryContent: String
    public let actionDestructive: String
    public let actionDestructiveContent: String
    public let actionDisabled: String
    public let actionDisabledContent: String
    public let actionGhost: String
    public let actionGhostContent: String
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
    // Accent
    public let accentPrimary: String
    public let accentContent: String
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
        textDisabled: WdsLightColorTokens.textDisabled,
        textInverse: WdsLightColorTokens.textInverse,
        iconPrimary: WdsLightColorTokens.iconPrimary,
        iconSecondary: WdsLightColorTokens.iconSecondary,
        iconTertiary: WdsLightColorTokens.iconTertiary,
        iconDisabled: WdsLightColorTokens.iconDisabled,
        iconInverse: WdsLightColorTokens.iconInverse,
        borderSubtle: WdsLightColorTokens.borderSubtle,
        borderDefault: WdsLightColorTokens.borderDefault,
        borderStrong: WdsLightColorTokens.borderStrong,
        borderFocus: WdsLightColorTokens.borderFocus,
        borderDivider: WdsLightColorTokens.borderDivider,
        borderTranslucent: WdsLightColorTokens.borderTranslucent,
        actionPrimary: WdsLightColorTokens.actionPrimary,
        actionPrimaryContent: WdsLightColorTokens.actionPrimaryContent,
        actionSecondary: WdsLightColorTokens.actionSecondary,
        actionSecondaryContent: WdsLightColorTokens.actionSecondaryContent,
        actionTertiary: WdsLightColorTokens.actionTertiary,
        actionTertiaryContent: WdsLightColorTokens.actionTertiaryContent,
        actionDestructive: WdsLightColorTokens.actionDestructive,
        actionDestructiveContent: WdsLightColorTokens.actionDestructiveContent,
        actionDisabled: WdsLightColorTokens.actionDisabled,
        actionDisabledContent: WdsLightColorTokens.actionDisabledContent,
        actionGhost: WdsLightColorTokens.actionGhost,
        actionGhostContent: WdsLightColorTokens.actionGhostContent,
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
        accentPrimary: WdsLightColorTokens.accentPrimary,
        accentContent: WdsLightColorTokens.accentContent
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
        textDisabled: WdsDarkColorTokens.textDisabled,
        textInverse: WdsDarkColorTokens.textInverse,
        iconPrimary: WdsDarkColorTokens.iconPrimary,
        iconSecondary: WdsDarkColorTokens.iconSecondary,
        iconTertiary: WdsDarkColorTokens.iconTertiary,
        iconDisabled: WdsDarkColorTokens.iconDisabled,
        iconInverse: WdsDarkColorTokens.iconInverse,
        borderSubtle: WdsDarkColorTokens.borderSubtle,
        borderDefault: WdsDarkColorTokens.borderDefault,
        borderStrong: WdsDarkColorTokens.borderStrong,
        borderFocus: WdsDarkColorTokens.borderFocus,
        borderDivider: WdsDarkColorTokens.borderDivider,
        borderTranslucent: WdsDarkColorTokens.borderTranslucent,
        actionPrimary: WdsDarkColorTokens.actionPrimary,
        actionPrimaryContent: WdsDarkColorTokens.actionPrimaryContent,
        actionSecondary: WdsDarkColorTokens.actionSecondary,
        actionSecondaryContent: WdsDarkColorTokens.actionSecondaryContent,
        actionTertiary: WdsDarkColorTokens.actionTertiary,
        actionTertiaryContent: WdsDarkColorTokens.actionTertiaryContent,
        actionDestructive: WdsDarkColorTokens.actionDestructive,
        actionDestructiveContent: WdsDarkColorTokens.actionDestructiveContent,
        actionDisabled: WdsDarkColorTokens.actionDisabled,
        actionDisabledContent: WdsDarkColorTokens.actionDisabledContent,
        actionGhost: WdsDarkColorTokens.actionGhost,
        actionGhostContent: WdsDarkColorTokens.actionGhostContent,
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
        accentPrimary: WdsDarkColorTokens.accentPrimary,
        accentContent: WdsDarkColorTokens.accentContent
    )
}
