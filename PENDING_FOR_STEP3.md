# Pending for Step 3

This file captures the next work needed after the Step 1 and Step 2 scaffold is installed.

## Step 3 objective

Connect the token scaffold to the Angular and Tailwind implementation path so CS360 design decisions can move from Figma variables into code-friendly token outputs.

## Recommended next tasks

- **Confirm build tooling**: Check whether the project already uses Angular, Tailwind, Style Dictionary, or another token build tool.
- **Install or align Style Dictionary**: Add the package only if the repo does not already have a token pipeline.
- **Generate CSS variables**: Convert `tokens/primitives.json` and `tokens/semantic.json` into CSS custom properties.
- **Wire Tailwind theme extensions**: Use the values from `tailwind.config.snippet.js` or merge them into the project Tailwind configuration.
- **Add mode strategy**: Decide where light/dark theme and default/compact density selectors will live.
- **Create validation script**: Add a lightweight check that flags hardcoded hex, px, and radius values in semantic or component-level token files.
- **Document Figma export process**: Define how Figma variables should be exported, transformed, reviewed, and committed.

## Decisions needed

| Decision | Recommended default | Notes |
|---|---|---|
| Token source of truth | Figma variables exported into `tokens/` | Keeps design and code aligned. |
| Build output | CSS custom properties | Works well with Angular and Tailwind. |
| Theme switching | CSS class or data attribute on app root | Avoids Tailwind rebuilds for mode changes. |
| Density switching | `data-density="default"` and `data-density="compact"` | Supports scalable component sizing. |
| Token review cadence | Before design-system release or sprint handoff | Prevents hardcoded drift. |

## Suggested Step 3 prompt

Continue CS360 Step 3 by inspecting the AI-Experiments project structure, identifying the existing Angular/Tailwind/token setup, and recommending the smallest safe implementation path to generate CSS variables from `tokens/primitives.json` and `tokens/semantic.json`.
