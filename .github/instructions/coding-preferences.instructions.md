---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.scss"
description: "CareGiver 360 portal coding preferences and non-negotiable design rules. Includes no raw hex colors, no raw SVG icons, and no inline styles for Angular components, templates, and styles."
---

# CareGiver 360 — Coding Preferences & Design Rules

These rules are **non-negotiable**. Never make guesses — always follow the structure already defined.

---

## Global UI Redlines ⛔

- **No raw hex/colors:** never add `#hex`, `rgb()`, `hsl()`, named colors, or Tailwind color classes directly in Angular templates/components/styles; use semantic CSS tokens such as `var(--cs360-text-primary)`.
- **No raw SVG icons:** never paste inline `<svg>`, copied Figma SVG paths, or downloaded icon assets; use `<cs-icon>` with Google Material Symbols Rounded names.
- **No inline styles:** never use `style=""`, `[style.*]`, `ngStyle`, or component-generated raw style strings for UI styling; use Tailwind utilities and CSS custom properties from the token layers.
- If a Figma value has no token yet, add it to the correct token layer first instead of bypassing the design system.

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

## 2. Icons ⛔ REDLINE

- **NEVER** download, export, copy SVG paths from Figma, or guess icon shapes.
- **NEVER** write raw `<svg>` with paths for icons.
- **ALWAYS** use `<cs-icon>` with a Google Material Symbols Rounded name.
- Match icon name from Figma layer name (e.g. layer `"chevron_forward"` → `name="chevron_forward"`).
- Reference: https://fonts.google.com/icons?icon.style=Rounded
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

## 4. Typography / Font ⛔ REDLINE

- **NEVER** set `font-family` inline or in component styles — it is inherited globally.
- **NEVER** use any font other than **Inter**.
- Font family is already declared globally via `--cs360-font-sans: 'Inter'` in `01-primitives.scss`.
- All components inherit Inter automatically — do NOT override it.
- The only typography properties to set explicitly per element are: `font-size` (density token), `font-weight`, `line-height`, and `color` (semantic token).

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

- **Always use Tailwind CSS utility classes** as the base structure for all form field types — never write custom form CSS from scratch.
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

---

## 10. Figma → Angular Layout Mapping (CRITICAL — Lessons Learned)

**Never assume layout — always fetch the Figma node and read exact properties.**

### Figma Sizing Modes → CSS

| Figma Sizing | CSS Translation |
|---|---|
| **HUG** (hug contents) | No `min-h`, no `h-*`, no fixed size — let content size it |
| **FILL** (fill container) | `flex-1 min-w-0` (or `w-full` on block elements) |
| **FIXED** | Explicit `w-[Npx] h-[Npx]` |

**HUG = no constraints. Never add `min-h-[Npx]` to a HUG container.**

### Figma Alignment → CSS

| Figma `primaryAxisAlignItems` | Flex Direction | CSS |
|---|---|---|
| `MIN` (= START) | ROW | `items-start` |
| `CENTER` | ROW | `items-center` |
| `MAX` (= END) | ROW | `items-end` |
| `SPACE_BETWEEN` | ROW | `justify-between` |

**Read the Figma `counterAxisAlignItems` too — it controls cross-axis alignment.**

### Figma Auto Layout → CSS

```
HORIZONTAL frame → flex-row (default)
VERTICAL frame   → flex-col
gap: Npx         → gap-[Npx] or gap-N (Tailwind)
padding T/R/B/L  → pt-[T] pr-[R] pb-[B] pl-[L] (or shorthand p-[N] if all equal)
```

### cs-avatar Size Map (ALWAYS CHECK before using named size)

| size prop | resolvedSize |
|---|---|
| `xs` | 24px |
| `sm` | 32px |
| `md` | 40px ← Figma standard avatar |
| `lg` | 48px |
| `xl` | 56px |

### Figma Color Tokens → Our Primitives (Tailwind Slate scale)

Our neutral scale now matches Tailwind Slate exactly:
- `#0f172a` = slate-900 = `--cs360-neutral-900` = `--cs360-text-primary`
- `#e2e8f0` = slate-200 = `--cs360-neutral-200` = `--cs360-border-subtle`
- `#94a3b8` = slate-400 = `--cs360-neutral-300` = `--cs360-text-tertiary`

When a Figma node uses a color: look it up in Tailwind Slate, find its position, map to our primitive.

### Implementation Checklist (use before writing any component)

Before coding, fetch the Figma node and extract:
- [ ] `layoutMode`: HORIZONTAL or VERTICAL?
- [ ] `primaryAxisSizingMode`: HUG / FILL / FIXED?
- [ ] `counterAxisSizingMode`: HUG / FILL / FIXED?
- [ ] `primaryAxisAlignItems`: MIN / CENTER / MAX / SPACE_BETWEEN?
- [ ] `counterAxisAlignItems`: MIN / CENTER / MAX?
- [ ] `paddingTop/Right/Bottom/Left`: exact px values
- [ ] `itemSpacing` (gap): exact px value
- [ ] Each child's `layoutSizingHorizontal` and `layoutSizingVertical`: HUG / FILL / FIXED?
- [ ] Text nodes: `fontSize`, `fontWeight`, `lineHeightPx`, resolved fill color
- [ ] Then map to tokens. Never set a size or color from memory.
