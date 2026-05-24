# Figma to Angular Prompt Template

Use this prompt when converting a CS360 Figma screen, component, or flow into Angular + Tailwind implementation guidance.

## Prompt

You are converting a Caresmartz360 Figma design into Angular and Tailwind-ready implementation guidance.

### Context

- Product area: `[Caregiver Web / Caregiver Mobile / Agency Portal / Design System Core]`
- Screen or component name: `[Name]`
- Figma source: `[Paste frame/component link or description]`
- Target platform: `[Web / Mobile Web / Hybrid]`
- Density mode: `[Default / Compact / Both]`
- Theme mode: `[Light / Dark / Both]`

### Required output

Produce the implementation handoff using this structure:

## Problem

Describe what the UI needs to support and what design-system gap, workflow issue, or implementation concern exists.

## Why

Explain why the decision matters for CS360 usability, consistency, accessibility, scalability, and future theming or density support.

## Recommendation

Provide the recommended Angular + Tailwind implementation approach:

- Component structure
- Inputs and outputs
- States and variants
- Token usage
- Responsive behavior
- Accessibility behavior
- Edge cases

## Implementation note

Include developer-ready details:

- Suggested Angular component names
- Tailwind classes mapped to token-backed theme values
- ARIA attributes
- Keyboard behavior
- Empty, loading, error, disabled, hover, focus, active, and selected states
- Any TODOs for missing tokens or unclear design decisions

## Token mapping table

| Figma value or variable | Recommended token | CSS variable | Tailwind usage | Notes |
|---|---|---|---|---|
| `[value]` | `[token.path]` | `--token-name` | `theme-key` | `[notes]` |

## Accessibility checklist

- Text contrast is at least 4.5:1.
- UI boundaries and controls are at least 3:1.
- Focus state is visible and tokenized.
- Keyboard order follows the visual/task flow.
- Inputs have labels, helper text, and error messaging.
- Touch targets are at least 44px where practical.
- Motion respects reduced-motion preferences.

## Constraints

- Do not hardcode colors, spacing, radius, elevation, or typography where tokens should exist.
- Use semantic tokens over primitive tokens in product UI.
- Flag missing tokens instead of inventing one-off values silently.
- Keep recommendations practical for Angular and Tailwind implementation.
