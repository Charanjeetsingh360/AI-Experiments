---
description: "Use when creating a new Angular component from scratch, generating component files, or scaffolding shared UI elements for CareGiver 360. Covers component structure, file layout, selector naming, and export conventions."
applyTo: "src/app/shared/components/**/*.ts"
---

# Angular Component Generation Rules

Apply these rules whenever generating or scaffolding a new Angular component.

---

## File Structure

Every shared component lives in its own folder:

```
src/app/shared/components/
└── cs-<name>/
    ├── cs-<name>.component.ts
    ├── cs-<name>.component.html
    └── cs-<name>.component.scss
```

Export it from the barrel:
```typescript
// src/app/shared/components/index.ts
export { Cs<Name>Component } from './cs-<name>/cs-<name>.component';
```

---

## Required Decorator Configuration

```typescript
@Component({
  selector: 'cs-<name>',         // Always cs- prefix
  standalone: true,              // Never NgModule-based
  imports: [...],                // Import only what the template uses
  templateUrl: './cs-<name>.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  // Always OnPush
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-theme]': 'theme()',
    '[attr.data-density]': 'density()',
  },
})
```

---

## Signal-First State

- Use `input<T>()` for all component inputs (not `@Input()`)
- Use `output<T>()` for all outputs (not `@Output()` / `EventEmitter`)
- Use `signal<T>()` for internal state
- Use `computed()` for derived values
- Use `toSignal()` for Observable-to-signal bridges

```typescript
// Inputs
name = input.required<string>();
size = input<'sm' | 'md' | 'lg'>('md');

// Outputs
selected = output<string>();

// Internal state
isOpen = signal(false);

// Derived
displayName = computed(() => this.name().trim());
```

---

## Theme and Density

Every component must accept and propagate theme/density:

```typescript
theme = input<'light' | 'dark' | 'high-contrast'>('light');
density = input<'small' | 'medium' | 'large'>('medium');
```

These are bound to `data-theme` and `data-density` host attributes automatically via the standard decorator configuration above.

---

## Template Rules

- No inline styles (`style="..."`) — use Tailwind utilities and CSS custom properties only
- No hardcoded colors, hex values, or raw px for spacing
- Use `text-[length:var(--density-text-body)]` syntax for font-size custom properties
- Use `p-[var(--density-space-N)]` for density-aware spacing on interactive elements
- Use `@if`, `@for`, `@switch` (Angular 17+ control flow) — not `*ngIf`, `*ngFor`

---

## SCSS File

Prefer an empty (or near-empty) SCSS file:

```scss
// Override only what Tailwind cannot express.
:host {
  display: contents; // or block / flex — match the component's outer layout role
}
```

Never add component-level `font-family`, raw colors, or spacing values to SCSS.

---

## Accessibility Checklist

Every component must:
- [ ] Expose semantic HTML (native `<button>`, `<input>`, `<nav>`, not just `<div>`)
- [ ] Bind `aria-label`, `aria-disabled`, `aria-busy` where applicable
- [ ] Be keyboard-navigable (tab order, enter/space for interactive elements)
- [ ] Have visible focus ring in all themes (provided by global tokens)
- [ ] Use `aria-live="polite"` region for any dynamic status updates
