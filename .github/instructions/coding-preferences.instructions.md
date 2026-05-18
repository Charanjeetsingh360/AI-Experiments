---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.scss"
description: "CareGiver 360 portal coding preferences and non-negotiable design rules. Always apply these when writing or editing Angular components, templates, or styles."
---

# CareGiver 360 — Coding Preferences & Design Rules

These rules are **non-negotiable**. Never make guesses — always follow the structure already defined.

---

## 1. Button Design

- **Always use Tailwind CSS utility classes** as the base pattern for buttons — never write custom button CSS from scratch.
- Primary color, hover, active, and focus states must come from the **semantic color token layer** (`02-semantic.scss`), e.g. `var(--cs360-action-primary)`.
- Padding, font size, border-radius, and height must come from the **density mode layer** (`02-density.scss`), e.g. `var(--density-space-2)`, `var(--density-text-body)`.
- Example pattern for a primary button:
  ```html
  <button class="inline-flex items-center gap-2 rounded-lg font-medium transition-colors
                 bg-[var(--cs360-action-primary)] text-white
                 hover:bg-[var(--cs360-action-primary-hover)]
                 px-[var(--density-space-4)] py-[var(--density-space-2)]
                 text-[length:var(--density-text-body)]">
    Label
  </button>
  ```

---

## 2. Icons

- **Always use Google Material Symbols Rounded** — never custom SVGs.
- Reference: https://fonts.google.com/icons?icon.style=Rounded
- Developer docs: https://developers.google.com/fonts/docs/material_symbols
- GitHub: https://github.com/google/material-design-icons
- Always use the `<cs-icon>` component (`src/app/shared/components/cs-icon/cs-icon.component.ts`).
- Icon names are snake_case (e.g. `arrow_forward`, `calendar_month`).
- Use `[filled]="true"` for filled variant, `false` (default) for outlined.

---

## 3. Colors

- **Never guess or hardcode colors** (no `#hex`, `rgb()`, named colors like `blue`, `red`).
- All colors must come from the **semantic token layer** (`02-semantic.scss`) via CSS custom properties.
- Semantic tokens resolve automatically per theme (light / dark / high-contrast).
- Key tokens: `--cs360-action-primary`, `--cs360-bg-surface`, `--cs360-text-primary`, `--cs360-text-secondary`, `--cs360-feedback-error`, `--cs360-feedback-success`, etc.

---

## 4. Typography / Font

- Font family: **Inter** — defined as `--cs360-font-sans` in `01-primitives.scss`.
- Never set `font-family` manually. Use `--cs360-font-sans` or let Tailwind `font-sans` apply it.
- Font size and line-height must always use **density tokens**: `--density-text-body`, `--density-text-sm`, etc. from `02-density.scss`.
- Text style classes: use `.cs360-text-body`, `.cs360-text-heading`, etc. from `03-styles.scss`.

---

## 5. Spacing & Density

- Padding, margin, gap, width, height for UI elements must use density tokens: `--density-space-1` through `--density-space-8`.
- This ensures all 3 density modes (compact / default / comfortable) work correctly.
- Do **not** use Tailwind spacing utilities like `p-4`, `gap-3` directly on interactive elements — use `p-[var(--density-space-4)]` instead.

---

## 6. 4-Layer Token Architecture (Never Bypass)

```
Layer 1 — 01-primitives.scss   Raw values (colors, sizes, font scale)
Layer 2 — 02-semantic.scss     Theme aliases per data-theme (light/dark/high-contrast)
Layer 2b— 02-density.scss      Density aliases per data-density (compact/default/comfortable)
Layer 3 — 03-styles.scss       Text style utility classes
Layer 4 — styles/components/   Component-level SCSS partials
```

- Always resolve through the chain. Never skip layers.
- Never add raw values to Layer 2 or below — they belong in Layer 1.

---

## 7. Component Reusability

- All shared UI elements (buttons, cards, icons, tabs, flyouts, etc.) must be **standalone Angular components** in `src/app/shared/components/`.
- Export every shared component from `src/app/shared/components/index.ts`.
- The `<app-sidebar>` component is used inside `MainLayoutComponent` and is automatically available on all pages — never duplicate it.

---

## 8. Navigation / Routing

- Nav labels, icons and routes follow the Figma component: **Caregiver Web Portal node 183-126608**.
- Current nav items (in order): Home, Shift Calendar, My Clients, Messages, Availability, Documents, Caregiver Forms, Trainings, Learn2Care (external), LMS (external).
- External links use `href` + `target="_blank" rel="noopener noreferrer"`.

---

## 9. Form Fields (Inputs, Selects, Textareas, Datepickers)

- **Always use Tailwind CSS utility classes as the base structure** for all form field types — never write custom form CSS from scratch.
- Tailwind handles: `block`, `w-full`, `rounded-md`, `border`, `shadow-sm`, `placeholder-`, `focus:ring-`, `focus:outline-none`, `disabled:opacity-50`, etc.
- **Colors must come from semantic tokens** (not Tailwind color classes like `border-gray-300`):
  - Border: `border-[var(--cs360-border-subtle)]`
  - Background: `bg-[var(--cs360-bg-surface)]`
  - Text: `text-[var(--cs360-text-primary)]`
  - Placeholder: `placeholder-[var(--cs360-text-disabled)]`
  - Focus ring: `focus:ring-[var(--cs360-action-primary)]` `focus:border-[var(--cs360-action-primary)]`
- **Padding and font-size must come from density tokens**:
  - Use `px-[var(--density-space-3)] py-[var(--density-space-2)]` (not `px-3 py-2`)
  - Use `text-[length:var(--density-text-body)]`
- Label pattern:
  ```html
  <label class="block text-sm font-medium text-[var(--cs360-text-primary)] mb-[var(--density-space-1)]">
    Field Name <span class="text-[var(--cs360-feedback-error)]">*</span>
  </label>
  ```
- Input pattern:
  ```html
  <input type="text"
    class="block w-full rounded-md border border-[var(--cs360-border-subtle)]
           bg-[var(--cs360-bg-surface)] text-[var(--cs360-text-primary)]
           placeholder-[var(--cs360-text-disabled)] shadow-sm
           px-[var(--density-space-3)] py-[var(--density-space-2)]
           text-[length:var(--density-text-body)]
           focus:outline-none focus:ring-2 focus:ring-[var(--cs360-action-primary)]
           focus:border-[var(--cs360-action-primary)]
           disabled:opacity-50 disabled:cursor-not-allowed" />
  ```
- Textarea: same as input, add `resize-none` and explicit `rows`.
- Select: same as input, browser default arrow is fine.
- Date inputs: same as input.
- File upload areas: use dashed border `border-2 border-dashed border-[var(--cs360-border-subtle)]` with centered icon + text.


---

## 1. Button Design

- **Always use Tailwind CSS utility classes** as the base pattern for buttons — never write custom button CSS from scratch.
- Primary color, hover, active, and focus states must come from the **semantic color token layer** (`02-semantic.scss`), e.g. `var(--cs360-action-primary)`.
- Padding, font size, border-radius, and height must come from the **density mode layer** (`02-density.scss`), e.g. `var(--density-space-2)`, `var(--density-text-body)`.
- Example pattern for a primary button:
  ```html
  <button class="inline-flex items-center gap-2 rounded-lg font-medium transition-colors
                 bg-[var(--cs360-action-primary)] text-white
                 hover:bg-[var(--cs360-action-primary-hover)]
                 px-[var(--density-space-4)] py-[var(--density-space-2)]
                 text-[length:var(--density-text-body)]">
    Label
  </button>
  ```

---

## 2. Icons

- **Always use Google Material Symbols Rounded** — never custom SVGs.
- Reference: https://fonts.google.com/icons?icon.style=Rounded
- Developer docs: https://developers.google.com/fonts/docs/material_symbols
- GitHub: https://github.com/google/material-design-icons
- Always use the `<cs-icon>` component (`src/app/shared/components/cs-icon/cs-icon.component.ts`).
- Icon names are snake_case (e.g. `arrow_forward`, `calendar_month`).
- Use `[filled]="true"` for filled variant, `false` (default) for outlined.

---

## 3. Colors

- **Never guess or hardcode colors** (no `#hex`, `rgb()`, named colors like `blue`, `red`).
- All colors must come from the **semantic token layer** (`02-semantic.scss`) via CSS custom properties.
- Semantic tokens resolve automatically per theme (light / dark / high-contrast).
- Key tokens: `--cs360-action-primary`, `--cs360-bg-surface`, `--cs360-text-primary`, `--cs360-text-secondary`, `--cs360-feedback-error`, `--cs360-feedback-success`, etc.

---

## 4. Typography / Font

- Font family: **Inter** — defined as `--cs360-font-sans` in `01-primitives.scss`.
- Never set `font-family` manually. Use `--cs360-font-sans` or let Tailwind `font-sans` apply it.
- Font size and line-height must always use **density tokens**: `--density-text-body`, `--density-text-sm`, etc. from `02-density.scss`.
- Text style classes: use `.cs360-text-body`, `.cs360-text-heading`, etc. from `03-styles.scss`.

---

## 5. Spacing & Density

- Padding, margin, gap, width, height for UI elements must use density tokens: `--density-space-1` through `--density-space-8`.
- This ensures all 3 density modes (compact / default / comfortable) work correctly.
- Do **not** use Tailwind spacing utilities like `p-4`, `gap-3` directly on interactive elements — use `p-[var(--density-space-4)]` instead.

---

## 6. 4-Layer Token Architecture (Never Bypass)

```
Layer 1 — 01-primitives.scss   Raw values (colors, sizes, font scale)
Layer 2 — 02-semantic.scss     Theme aliases per data-theme (light/dark/high-contrast)
Layer 2b— 02-density.scss      Density aliases per data-density (compact/default/comfortable)
Layer 3 — 03-styles.scss       Text style utility classes
Layer 4 — styles/components/   Component-level SCSS partials
```

- Always resolve through the chain. Never skip layers.
- Never add raw values to Layer 2 or below — they belong in Layer 1.

---

## 7. Component Reusability

- All shared UI elements (buttons, cards, icons, tabs, flyouts, etc.) must be **standalone Angular components** in `src/app/shared/components/`.
- Export every shared component from `src/app/shared/components/index.ts`.
- The `<app-sidebar>` component is used inside `MainLayoutComponent` and is automatically available on all pages — never duplicate it.

---

## 8. Navigation / Routing

- Nav labels, icons and routes follow the Figma component: **Caregiver Web Portal node 183-126608**.
- Current nav items (in order): Home, Shift Calendar, My Clients, Messages, Availability, Documents, Caregiver Forms, Trainings, Learn2Care (external), LMS (external).
- External links use `href` + `target="_blank" rel="noopener noreferrer"`.
