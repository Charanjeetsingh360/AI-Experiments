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
