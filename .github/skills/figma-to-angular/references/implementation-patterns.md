# Angular Component Implementation Patterns

Templates and patterns for generating CareGiver 360 Angular components from Figma designs.

---

## Standard Component Skeleton

### TypeScript (`cs-<name>.component.ts`)

```typescript
import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cs-<name>',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cs-<name>.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.data-theme]': 'theme()',
    '[attr.data-density]': 'density()',
  },
})
export class Cs<Name>Component {
  // Inputs
  theme = input<'light' | 'dark' | 'high-contrast'>('light');
  density = input<'small' | 'medium' | 'large'>('medium');

  // Computed host classes
  hostClasses = computed(() => [
    'cs-<name>',
    `cs-<name>--${this.density()}`,
  ].join(' '));
}
```

### SCSS (`cs-<name>.component.scss`)

```scss
// Only override what Tailwind cannot express.
// Prefer empty file — all styling via Tailwind utilities + theme tokens.
:host {
  display: contents; // or block / flex depending on component
}
```

---

## Common Component Patterns

### Overlay & Popover Implementation Pattern

Overlays, popovers, dropdowns, modals, flyouts, and contextual trays must be
implemented from discovered overlay frames, not guessed.

**Execution model:**
1. Primary pass: implement base screens and wire trigger methods only.
2. Overlay pass: implement each discovered overlay frame using its extracted
   node ID, dimensions, auto-layout, padding, typography, colors, and
   interaction metadata.
3. Use existing workspace components where applicable, such as `cs-flyout`,
   `cs-icon`, `cs-card`, and shared form/button components.
4. If exact overlay metadata is unavailable, stop with a precise missing-data
   message instead of inventing Tailwind layout.

**Primary pass trigger example:**

```html
<button
  type="button"
  class="inline-flex items-center gap-[var(--density-space-2)]"
  [attr.aria-expanded]="isAvailableAppsOpen()"
  (click)="openAvailableAppsPopover()"
>
  <cs-icon name="apps" [size]="20" />
  Available Apps
</button>
```

**Overlay pass wrapper example:**

```html
<cs-flyout
  [isOpen]="isAvailableAppsOpen()"
  (isOpenChange)="isAvailableAppsOpen.set($event)"
  position="center"
  width="532px"
  height="auto"
  ariaLabel="Available Apps"
>
  <div flyout-header>
    <!-- Header content comes from the discovered overlay frame. -->
  </div>

  <div flyout-body>
    <!-- Body content comes from the discovered overlay frame. -->
  </div>
</cs-flyout>
```

> Width/height values in examples are placeholders. In production work, read
> them from the discovered overlay node's bounds and map internal spacing,
> color, typography, and radius through CS360 tokens before implementation.

### Card Component

```html
<!-- Figma: VERTICAL frame, padding 16px, gap 12px, white bg, shadow -->
<div class="
  flex flex-col
  gap-[var(--density-space-3)]
  p-[var(--density-space-4)]
  bg-[var(--cs360-bg-surface)]
  rounded-lg shadow
  border border-[var(--cs360-border-subtle)]
">
  <ng-content />
</div>
```

### Header Row (title + action)

```html
<!-- Figma: HORIZONTAL frame, SPACE_BETWEEN, items-center, padding 16px -->
<div class="flex flex-row items-center justify-between p-[var(--density-space-4)]">
  <h2 class="
    text-[length:var(--density-text-lg)]
    font-semibold
    leading-[28px]
    text-[var(--cs360-text-primary)]
  ">{{ title() }}</h2>

  <button class="
    inline-flex items-center gap-[var(--density-space-2)]
    px-[var(--density-space-4)] py-[var(--density-space-2)]
    rounded-lg font-medium
    bg-[var(--cs360-action-primary)] text-white
    hover:bg-[var(--cs360-action-primary-hover)]
    transition-colors
  "
    [attr.aria-label]="actionLabel()">
    <cs-icon name="add" [size]="16" />
    {{ actionLabel() }}
  </button>
</div>
```

### List Item (avatar + text + meta)

```html
<!-- Figma: HORIZONTAL, items-center, gap 12px, padding 16px -->
<div class="
  flex flex-row items-center
  gap-[var(--density-space-3)]
  px-[var(--density-space-4)] py-[var(--density-space-3)]
  border-b border-[var(--cs360-border-subtle)]
  last:border-b-0
">
  <cs-avatar [src]="avatarUrl()" [name]="name()" size="md" />

  <div class="flex flex-col flex-1 min-w-0 gap-[var(--density-space-1)]">
    <span class="
      text-[length:var(--density-text-body)]
      font-medium
      leading-[20px]
      text-[var(--cs360-text-primary)]
      truncate
    ">{{ name() }}</span>

    <span class="
      text-[length:var(--density-text-sm)]
      font-normal
      leading-[16px]
      text-[var(--cs360-text-secondary)]
      truncate
    ">{{ subtitle() }}</span>
  </div>

  <span class="
    text-[length:var(--density-text-sm)]
    font-normal
    text-[var(--cs360-text-tertiary)]
    shrink-0
  ">{{ meta() }}</span>
</div>
```

### Form Field

```html
<div class="flex flex-col gap-[var(--density-space-1)]">
  <label class="
    text-[length:var(--density-text-sm)]
    font-medium
    text-[var(--cs360-text-primary)]
  "
    [attr.for]="fieldId()">
    {{ label() }}
    @if (required()) {
      <span class="text-[var(--cs360-feedback-error)] ml-0.5" aria-hidden="true">*</span>
    }
  </label>

  <input
    [id]="fieldId()"
    [type]="type()"
    [placeholder]="placeholder()"
    [disabled]="disabled()"
    class="
      block w-full rounded-md
      border border-[var(--cs360-border-subtle)]
      bg-[var(--cs360-bg-surface)]
      text-[var(--cs360-text-primary)]
      placeholder:text-[var(--cs360-text-disabled)]
      px-[var(--density-space-3)] py-[var(--density-space-2)]
      text-[length:var(--density-text-body)]
      shadow-sm
      focus:outline-none focus:ring-2
      focus:ring-[var(--cs360-action-primary)]
      focus:border-[var(--cs360-action-primary)]
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    [attr.aria-required]="required()"
    [attr.aria-invalid]="hasError()"
    [attr.aria-describedby]="hasError() ? errorId() : null"
  />

  @if (hasError()) {
    <span
      [id]="errorId()"
      class="text-[length:var(--density-text-sm)] text-[var(--cs360-feedback-error)]"
      role="alert"
    >{{ errorMessage() }}</span>
  }
</div>
```

### Badge / Pill

```html
<!-- Figma: HORIZONTAL, HUG, rounded-full, colored bg -->
<span class="
  inline-flex items-center
  px-[var(--density-space-2)] py-0.5
  rounded-full
  text-[length:var(--density-text-xs)]
  font-medium
  bg-[var(--cs360-action-primary-subtle)]
  text-[var(--cs360-action-primary)]
">{{ label() }}</span>
```

### Empty State

```html
<div class="
  flex flex-col items-center justify-center
  gap-[var(--density-space-3)]
  py-[var(--density-space-12)]
  text-center
">
  <cs-icon name="inbox" [size]="48" class="text-[var(--cs360-text-tertiary)]" />
  <p class="
    text-[length:var(--density-text-body)]
    font-medium
    text-[var(--cs360-text-secondary)]
  ">{{ message() }}</p>
</div>
```

### Loading Skeleton

```html
<div
  class="animate-pulse flex flex-col gap-[var(--density-space-3)]"
  aria-busy="true"
  aria-label="Loading..."
>
  <div class="h-4 bg-[var(--cs360-bg-alt)] rounded w-3/4"></div>
  <div class="h-4 bg-[var(--cs360-bg-alt)] rounded w-1/2"></div>
</div>
```

---

## Accessibility Patterns

### Interactive Element Template

```html
<button
  [type]="buttonType()"
  [attr.aria-label]="ariaLabel()"
  [attr.aria-disabled]="disabled()"
  [attr.aria-busy]="loading()"
  [attr.aria-pressed]="pressed()"
  [disabled]="disabled()"
  (click)="handleClick()"
  (keydown.enter)="handleClick()"
  (keydown.space)="handleClick()"
>
  @if (loading()) {
    <cs-icon name="progress_activity" [size]="16" class="animate-spin" aria-hidden="true" />
  }
  <ng-content />
</button>
```

### Live Region for Dynamic Updates

```html
<div
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
>{{ statusMessage() }}</div>
```

---

## Export Pattern (`index.ts`)

```typescript
// src/app/shared/components/index.ts
export { Cs<Name>Component } from './cs-<name>/cs-<name>.component';
```

---

## Signal-Based Component with Data Loading

```typescript
import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cs-<name>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cs<Name>Component implements OnInit {
  private readonly service = inject(<Name>Service);

  readonly isLoading = signal(false);
  readonly hasError = signal(false);
  readonly data = toSignal(this.service.getData$(), { initialValue: [] });

  ngOnInit(): void {
    this.isLoading.set(true);
    // service handles loading state
  }
}
```

---

## Theming Cheat Sheet

```html
<!-- Theme-aware background -->
<div class="bg-[var(--cs360-bg-surface)]">

<!-- Theme-aware text -->
<p class="text-[var(--cs360-text-primary)]">

<!-- Theme-aware border -->
<div class="border border-[var(--cs360-border-subtle)]">

<!-- Density-aware padding -->
<div class="p-[var(--density-space-4)]">

<!-- Density-aware text size -->
<span class="text-[length:var(--density-text-body)]">
```

> Use `text-[length:var(...)]` syntax (not `text-[var(...)]`) to correctly map font-size CSS custom properties in Tailwind.
