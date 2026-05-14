# CareGiver360 - Design Token Scaffold

A 4-layer, token-driven design system scaffold for the CareGiver Web Portal.

This scaffold demonstrates the **Primitives -> Semantic -> Styles -> Components** architecture, with CSS custom property tokens that are Figma MCP-compatible.

---

## Architecture Overview

```
AI-Experiments/
├── tokens/                  # Layer 1 & 2: Token definitions
│   ├── 01-primitives.scss   # Layer 1: Raw design values
│   ├── 02-semantic.scss     # Layer 2: Theme mappings (light/dark/high-contrast)
│   ├── 02-density.scss      # Layer 2b: Density presets
│   └── 03-styles.scss       # Layer 3: Typography, shadows, utilities
├── styles/                  # Layer 4: Component styles
│   ├── components/          # Compiled SCSS partials
│   │   ├── _sidebar.scss
│   │   ├── _topbar.scss
│   │   ├── _cards.scss
│   │   ├── _tables.scss
│   │   ├── _buttons.scss
│   │   └── _forms.scss
│   └── base.scss            # App shell + imports
├── html-preview/            # Standalone HTML preview
│   └── index.html           # Theme/demo switcher built-in
├── tailwind.config.js       # Tailwind <-> Token bridge
└── README.md
```

---

## 4-Layer Design Structure

### Layer 1: Primitives (`tokens/01-primitives.scss`)
Raw, un-themed design values. No semantic meaning.
- **Colors**: Neutral, blue, red, green, yellow, purple, teal scales
- **Typography**: Font sizes xs through 6xl, font families
- **Spacing**: 0 through 96 (Tailwind-compatible scale)
- **Radii**: none, sm, md, lg, xl, full
- **Shadows**: sm, md, lg, xl, inset variants
- **Transitions**: none, fast, normal, slow, slower
- **Motion**: none, fast, normal, slow
- **Sizes**: Input sizes, icon sizes, avatar sizes, form width, sidebar width

### Layer 2: Semantic (`tokens/02-semantic.scss`)
Role-based color mappings. Swappable per theme.
- **Action colors**: primary, secondary, destructive, ghost
- **Status colors**: success, warning, error, info
- **Surface colors**: default, surface, muted, elevated, overlay, inverse
- **Text colors**: primary, secondary, muted, inverse, link
- **Border colors**: default, subtle, focus

**Supported themes:** `light` | `dark` | `high-contrast`

### Layer 2b: Density (`tokens/02-density.scss`)
Density preset tokens.
- **Presets**: `default` | `compact` | `comfortable`
- Applied via `data-density` attribute on root element

### Layer 3: Styles (`tokens/03-styles.scss`)
Typography helpers, elevation presets, border utilities, skeleton loaders.

### Layer 4: Components (`styles/components/`)
Compiled component SCSS that consumes CSS custom properties:
- **Sidebar**: Navigation, logo, menu items
- **Topbar**: Search, notifications, user avatar
- **Cards**: Stat cards, promotional banners, alerts
- **Tables**: Data tables with headers, rows, pagination
- **Buttons**: Primary, secondary, tertiary, destructive, sizes, icon variants
- **Forms**: Inputs, selects, textareas, checkboxes, radios, toggles, validation states

---

## Figma MCP Compatibility

This system is designed to be compatible with Figma's MCP (Multi-Component Prototype) workflow:

1. **CSS Custom Properties** as the single source of truth (not SCSS variables)
2. **No hard-coded hex values** in semantic layer - all reference primitives
3. **Style Dictionary-ready** structure for token migration pipeline
4. **Tailwind bridge** config maps tokens to utility classes

### Token Naming Convention
```
--cs360-{category}-{role}-{variant}
--cs360-action-primary-default
--cs360-bg-surface
--cs360-text-muted
```

---

## How to Use

### 1. Preview HTML Demo
Open `html-preview/index.html` in a browser to see:
- Live theme switcher (light/dark/high-contrast)
- Density switcher (default/compact/comfortable)
- Skeleton dashboard with sidebar, topbar, cards, buttons, forms, tables
- No real data - pure skeleton/placeholder content

### 2. Integrate into Angular + Tailwind + SCSS

**Step A: Copy token files**
```
AI-Experiments/tokens/  ->  src/styles/tokens/
AI-Experiments/styles/  ->  src/styles/
```

**Step B: Import in `styles.scss`**
```scss
@import 'tokens/01-primitives';
@import 'tokens/02-semantic';
@import 'tokens/02-density';
@import 'tokens/03-styles';
@import 'base';
```

**Step C: Configure Tailwind**
Use `tailwind.config.js` as-is - it extends Tailwind to reference CSS custom properties.

**Step D: Theme switching in Angular**
```ts
// In a service or component
setTheme(theme: string) {
  this.renderer.setAttribute(
    document.documentElement,
    'data-theme',
    theme
  );
}

setDensity(density: string) {
  this.renderer.setAttribute(
    document.documentElement,
    'data-density',
    density
  );
}
```

---

## Migration from CGPortal

### Current State (CGPortal)
- Mixed token sources (SCSS variables + inline styles)
- Hard-coded hex values in components
- No separation of concerns between layers

### Target State (This Scaffold)
- All design values flow from primitives layer
- Components reference only semantic CSS custom properties
- Zero hard-coded hex in component files

### Migration Steps
1. **Audit** existing CGPortal components for hard-coded colors/spacing
2. **Map** each hard-coded value to its nearest token equivalent
3. **Replace** hard-coded values with `var(--cs360-...)` references
4. **Remove** old SCSS variables in favor of CSS custom properties
5. **Validate** across all three themes (light, dark, high-contrast)

---

## Repo Structure Summary

| Folder/File | Purpose |
|---|---|
| `tokens/01-primitives.scss` | Raw design tokens (Layer 1) |
| `tokens/02-semantic.scss` | Theme color mappings (Layer 2) |
| `tokens/02-density.scss` | Spacing density presets (Layer 2b) |
| `tokens/03-styles.scss` | Typography, shadows, utilities (Layer 3) |
| `styles/components/` | SCSS component partials (Layer 4) |
| `styles/base.scss` | App shell, imports, resets |
| `tailwind.config.js` | Tailwind <-> CSS token bridge |
| `html-preview/index.html` | Standalone preview page |
| `README.md` | This file |

---

**Stack**: Angular | Tailwind CSS | SCSS
**Design**: CareGiver Web Portal (Figma)
**Version**: 1.0.0-scaffold
