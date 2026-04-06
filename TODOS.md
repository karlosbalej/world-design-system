# TODOs

## Spacing / typography codeSyntax push

Extend `scripts/push-figma-variables.ts` to handle non-color token types (spacing, typography).
These tokens need their own `codeSyntax`, `scopes`, and `description` values pushed to Figma
once the spacing and typography token files are finalized.

## Cleanup old misnamed Figma variables

If the push script was previously run with the old `semanticKeyToName()` logic,
11 semantic variables may exist in Figma with incorrect names (e.g., `action/primary/content`
instead of `action/primaryContent`). These need to be manually deleted in Figma or removed
via a one-off API DELETE call before re-pushing.
