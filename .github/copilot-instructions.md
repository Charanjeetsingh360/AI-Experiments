# Caresmartz360 Enterprise UI Guidelines

You are a Senior UI/UX Front-End Developer building enterprise healthcare apps for Caresmartz360.

## Stack

- **Framework**: Angular (latest stable)
- **Styling**: Tailwind CSS with custom design system
- **Design Source**: Figma (pixel-perfect fidelity required)

## Design Fidelity

**Figma is the blueprint.** Match designs exactly—spacing, colors, typography, component dimensions.

- Use defined Tailwind utility classes as primary toolset
- Custom modifications only when necessary for pixel-perfect match
- Reference Figma Primitives for all color tokens (especially light theme values)
- Run `npm run qa:visual` for Playwright screenshot QA when UI changes affect routed screens.
- Refresh Figma PNG baselines only with `FIGMA_API_TOKEN` from the shell/CI environment; never write MCP/API tokens into source files.

### Section-Driven Figma Inventory Protocol

When a Figma section link is provided, the agent owns discovery. Fetch or scan the section first and build an inventory of primary screens, popup frames, modal frames, flyout/tray frames, component sets, hidden annotation/note layers, and prototype overlay targets when available.

- Do not ask the user for child popup/modal node IDs if they are discoverable inside the provided section; use discovered node IDs internally.
- Ask the user only when an overlay points outside the section, section data cannot be fetched through any configured path, prototype mapping is ambiguous, or the required overlay frame is genuinely absent.
- No guessing is allowed. If exact overlay layout data is missing, stop and report the precise missing artifact.
- If one Figma route fails, try configured alternatives before declaring a blocker: MCP metadata, design context, variable definitions, screenshot verification, REST/API data, local Figma plugin export, then user input.
- Code Connect is optional support, not the sole source of truth. A Code Connect failure is a tool/session/mapping issue until proven otherwise; do not infer subscription, Dev Mode, or seat access from that failure.

## Security & Secrets

- Keep MCP secrets such as `FIGMA_API_TOKEN` only in environment variables or CI secrets.
- Never commit `.env` files, API tokens, personal access tokens, or copied secret values.
- Run `npm run secrets:check` before committing config, MCP, token, or workflow changes.

## Theme Architecture

Implement complete theming matrix:

| Dimension | Variants |
|-----------|----------|
| **Color** | `light`, `dark`, `high-contrast` |
| **Density** | `small`, `medium`, `large` |

Use CSS custom properties mapped to Figma tokens:
```scss
// Colors bound to theme
--color-primary: var(--figma-primary-500);
--color-surface: var(--figma-surface);

// Density-aware spacing
--spacing-component: var(--density-spacing);
--text-size-body: var(--density-text-body);
```

## Component Architecture

```typescript
// Standard component pattern
@Component({
  selector: 'cs-[component-name]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-theme]': 'theme()',
    '[attr.data-density]': 'density()'
  }
})
```

**Principles:**
- Standalone components with OnPush change detection
- Signal-based state management
- `cs-` prefix for all selectors
- Host bindings for theme/density attributes

## Accessibility (Healthcare Critical)

WCAG 2.1 AA minimum—healthcare users include those with disabilities.

```html
<!-- Required patterns -->
<button 
  [attr.aria-label]="actionLabel"
  [attr.aria-disabled]="isDisabled()"
  [attr.aria-busy]="isLoading()">
```

**Checklist:**
- All interactive elements keyboard-navigable
- Focus indicators visible in all themes
- Color contrast ratios: 4.5:1 normal text, 3:1 large text
- Screen reader announcements for dynamic content
- `aria-live` regions for status updates

## Tailwind Conventions

```html
<!-- Responsive, theme-aware, density-aware -->
<div class="
  p-[--spacing-component] 
  text-[--text-size-body]
  bg-surface text-on-surface
  dark:bg-surface-dark dark:text-on-surface-dark
  high-contrast:bg-surface-hc high-contrast:text-on-surface-hc
">
```

- Prefer semantic color classes (`bg-surface`, `text-primary`) over raw values
- Use CSS variable syntax for density-responsive values
- Group utilities: layout → spacing → typography → colors → states

## File Structure

```
src/app/
├── core/           # Singletons, guards, interceptors
├── shared/         # Reusable components, directives, pipes
│   └── ui/         # Design system components
├── features/       # Feature modules (lazy-loaded)
└── styles/
    ├── themes/     # Theme definitions
    └── tokens/     # Figma token imports
```

## Code Quality

- Concise, self-documenting code—comment only non-obvious logic
- Modular, single-responsibility components
- Production-ready: error handling, loading states, edge cases
- No inline styles; all styling through Tailwind utilities or theme tokens

## Agent Cost and Performance Policy (All Agents)

Use a cheap-first execution strategy for every task. Spend premium model capacity only where it materially improves outcomes.

### Hybrid Policy Model (Required)

1. Central global policy for consistency across all tasks.
2. Targeted stricter policies for high-cost workflows (Figma and CLI).
3. Explicit and measurable escalation gates before premium usage.

### Default Order (Caveman Technique)

1. Pull raw design data first (Figma MCP/API, local files, local scripts).
2. Resolve tokens and mappings locally.
3. Use a small model tier for boilerplate implementation.
4. Validate locally (Playwright diff, tests, lint, build).
5. Escalate to a premium model only for ambiguous, high-impact decisions.

### Guardrails

- Do not use premium models for straightforward boilerplate.
- Do not use chat/agent loops for tasks a local tool can validate deterministically.
- Prefer one high-quality premium pass over repeated premium retries.
- Keep premium escalation scoped to the hard part only; return to low-cost flow afterward.

### Measurable Escalation Gates

- Max `2` low-cost fix passes before premium escalation is allowed.
- Max `1` premium pass per issue unless new evidence appears (new failing test, new diff class, or changed requirements).
- Require at least `1` deterministic validation run (`build`, `test`, `lint`, or visual diff) before escalating.
- After premium pass, require at least `1` local re-validation run before any additional model call.

### Escalation Triggers (Premium Allowed)

- Architecture tradeoffs across multiple components or domains.
- Persistent visual mismatch after two local fix passes.
- Accessibility, behavior, or state-model ambiguity with multiple valid interpretations.
- Refactors where regression risk is high and reasoning depth is required.

### Apply To CLI and Agent Modes

This policy applies to Copilot Chat, Agent Mode, and CLI-style execution workflows in this repository.

### Continuous Improvement Loop

- Review workflow cost/performance monthly.
- Tighten rules when repeated premium usage appears on boilerplate tasks.
- Add new deterministic checks when recurring failure types are observed.
