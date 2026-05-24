# CS360 Token Scaffold

This folder contains the starter token package for CS360 design-to-code experiments.

## Files

- `primitives.json`: Raw source values such as colors, spacing, radius, typography, elevation, and focus-ring values.
- `semantic.json`: Contextual product tokens that alias primitives.
- `config/style-dictionary.config.js`: Starter Style Dictionary config for building CSS custom properties.

## Token architecture

CS360 follows a 4-layer design-system model:

| Layer | Purpose | Example |
|---|---|---|
| Primitive | Raw values | `color.blue.600` |
| Semantic | Contextual meaning | `color.action.primary` |
| Style | Composite reusable styling | `focus.ring.default` |
| Component | Component-specific decisions | `button.background.primary.default` |

## Naming convention

Use this mapping across tools:

| Figma path | JSON path | CSS variable |
|---|---|---|
| `color/background/surface/default` | `color.background.surface.default` | `--color-background-surface-default` |
| `color/text/primary` | `color.text.primary` | `--color-text-primary` |
| `spacing/md` | `spacing.md` | `--spacing-md` |

## Rules

- Primitive tokens may contain raw values.
- Semantic tokens should reference primitives using Style Dictionary alias syntax, such as `{color.gray.900}`.
- Component tokens should reference semantic tokens.
- Tailwind values should reference generated CSS custom properties with `var(--token-name)`.
- Missing values should be added as tokens, not hardcoded in Angular templates or component styles.

## Step 3 handoff

The next step is to confirm the project build stack and wire these token files into a CSS-variable output. Start from `PENDING_FOR_STEP3.md` in the project root.
