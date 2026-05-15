# CareGiver 360 - Angular Web Portal

A 4-layer, token-driven design system built with Angular 19, Tailwind CSS, and Figma MCP integration.

## Architecture Overview

```
src/
├── app/
│   ├── core/                    # Core module (singleton services)
│   │   ├── guards/              # Route guards
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── layouts/             # Layout components
│   │   ├── models/              # Core interfaces
│   │   └── services/            # Core services (ThemeService, etc.)
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── auth/                # Authentication feature
│   │   ├── dashboard/           # Dashboard feature
│   │   └── ...                  # Other features
│   ├── shared/                  # Shared module
│   │   ├── components/          # Reusable UI components
│   │   ├── directives/          # Custom directives
│   │   ├── pipes/               # Custom pipes
│   │   ├── models/              # Shared interfaces
│   │   └── utils/               # Utility functions
│   └── app.routes.ts            # Application routes
├── styles/
│   ├── tokens/                  # 4-Layer Token System
│   │   ├── 01-primitives.scss   # Layer 1: Raw design values
│   │   ├── 02-semantic.scss     # Layer 2: Theme mappings
│   │   ├── 02-density.scss      # Layer 2b: Density modes
│   │   └── 03-styles.scss       # Layer 3: Typography/shadows
│   ├── components/              # Layer 4: Component styles
│   │   ├── _buttons.scss
│   │   ├── _cards.scss
│   │   ├── _forms.scss
│   │   ├── _tables.scss
│   │   ├── _sidebar.scss
│   │   └── _topbar.scss
│   └── base.scss                # App shell + resets
└── styles.scss                  # Main entry point
```

## 4-Layer Token Architecture

### Layer 1: Primitives (`tokens/01-primitives.scss`)
Raw, un-themed design values with no semantic meaning.
- Colors: Neutral, Blue, Red, Green, Amber, Info scales
- Typography: Font sizes, families, weights
- Spacing: 4px grid system (0-96)
- Radii, Shadows, Transitions

### Layer 2: Semantic (`tokens/02-semantic.scss`)
Role-based color mappings, switchable per theme.
- **Themes**: `light` | `dark` | `high-contrast`
- Action, Status, Surface, Text, Border tokens

### Layer 2b: Density (`tokens/02-density.scss`)
Spacing density presets.
- **Modes**: `compact` | `default` | `comfortable`

### Layer 3: Styles (`tokens/03-styles.scss`)
Typography helpers, elevation presets, utilities.

### Layer 4: Components (`styles/components/`)
SCSS component partials consuming CSS custom properties.

## Key Features

### Theme Switching
```typescript
import { ThemeService } from './core/services/theme.service';

// In any component
constructor(private themeService: ThemeService) {}

// Switch theme
this.themeService.setTheme('dark');
this.themeService.setTheme('high-contrast');

// Toggle theme
this.themeService.toggleTheme();
```

### Density Modes
```typescript
// Switch density
this.themeService.setDensity('compact');
this.themeService.setDensity('comfortable');

// Cycle density
this.themeService.cycleDensity();
```

### Reactive State (Angular Signals)
```typescript
// In template
@if (themeService.isDarkMode()) {
  <span>Dark Mode Active</span>
}

// Current values
themeService.theme()    // 'light' | 'dark' | 'high-contrast'
themeService.density()  // 'compact' | 'default' | 'comfortable'
```

## Figma MCP Integration

### Sync Tokens from Figma
```bash
npm run figma:sync
```

### Generate Token Outputs
```bash
npm run tokens:generate
```

### Validate Tokens
```bash
npm run tokens:validate
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod
```

## Token Naming Convention

```
--cs360-{category}-{role}-{variant}

Examples:
--cs360-action-primary-default
--cs360-text-secondary
--cs360-bg-surface-hover
```

## Backup

The original HTML-only version is preserved in:
```
/Users/charanjeetsingh/Work Drive/PROJECTS/AI-Experiments/_backup-html-only/
```

---

**Stack**: Angular 19 | Tailwind CSS | SCSS | Figma MCP  
**Version**: 1.0.0
