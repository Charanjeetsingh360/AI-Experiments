# Figma → CareGiver 360 Token Mapping Reference

Complete mapping tables for converting Figma node properties to CareGiver 360 design tokens and Tailwind utilities.

---

## Sizing Modes → CSS

| Figma `*SizingMode` | CSS Translation | Notes |
|---|---|---|
| **HUG** | _(nothing)_ | No `min-h`, no `h-*`, no fixed size. Let content size it. |
| **FILL** | `flex-1 min-w-0` (inline) / `w-full` (block) | Child fills available space |
| **FIXED** | `w-[Npx] h-[Npx]` | Use exact px from `absoluteBoundingBox` |

> **HUG = zero constraints.** If Figma says HUG, do not add any size class.

---

## Layout Direction → CSS

| Figma `layoutMode` | CSS |
|---|---|
| `HORIZONTAL` | `flex flex-row` |
| `VERTICAL` | `flex flex-col` |
| `NONE` | _(no flex)_ |

---

## Alignment → CSS

### Primary Axis (main axis of flex direction)

| Figma `primaryAxisAlignItems` | Flex Direction | CSS |
|---|---|---|
| `MIN` (= START) | ROW | `justify-start` |
| `CENTER` | ROW | `justify-center` |
| `MAX` (= END) | ROW | `justify-end` |
| `SPACE_BETWEEN` | ROW | `justify-between` |
| `MIN` (= START) | COLUMN | `justify-start` |
| `CENTER` | COLUMN | `justify-center` |
| `MAX` (= END) | COLUMN | `justify-end` |

### Counter Axis (cross axis)

| Figma `counterAxisAlignItems` | Flex Direction | CSS |
|---|---|---|
| `MIN` (= START) | ROW | `items-start` |
| `CENTER` | ROW | `items-center` |
| `MAX` (= END) | ROW | `items-end` |
| `MIN` (= START) | COLUMN | `items-start` |
| `CENTER` | COLUMN | `items-center` |
| `MAX` (= END) | COLUMN | `items-end` |

> Do NOT use `items-center` unless Figma `counterAxisAlignItems` = `CENTER`. Read the value — never assume.

---

## Spacing → Density Tokens

| Figma px | Density Token | Tailwind Utility (static only) |
|---|---|---|
| 4px  | `--density-space-1` | `gap-1` / `p-1` |
| 8px  | `--density-space-2` | `gap-2` / `p-2` |
| 12px | `--density-space-3` | `gap-3` / `p-3` |
| 16px | `--density-space-4` | `gap-4` / `p-4` |
| 20px | `--density-space-5` | `gap-5` / `p-5` |
| 24px | `--density-space-6` | `gap-6` / `p-6` |
| 32px | `--density-space-8` | `gap-8` / `p-8` |
| 40px | `--density-space-10` | `gap-10` / `p-10` |
| 48px | `--density-space-12` | `gap-12` / `p-12` |

**For interactive/layout elements:** use `p-[var(--density-space-N)]`, `gap-[var(--density-space-N)]`  
**For fixed internal component spacing** (won't change with density): Tailwind shorthand `gap-2`, `p-3` is acceptable.

---

## Colors → Semantic Tokens (Neutral / Slate Scale)

| Figma Hex | Tailwind Slate | CS360 Primitive | Semantic Token |
|---|---|---|---|
| `#0f172a` | slate-900 | `--cs360-neutral-900` | `--cs360-text-primary` |
| `#1e293b` | slate-800 | `--cs360-neutral-800` | `--cs360-text-primary` (slightly lighter) |
| `#334155` | slate-700 | `--cs360-neutral-700` | `--cs360-text-secondary` |
| `#475569` | slate-600 | `--cs360-neutral-600` | `--cs360-text-secondary` |
| `#64748b` | slate-500 | `--cs360-neutral-500` | `--cs360-text-tertiary` |
| `#94a3b8` | slate-400 | `--cs360-neutral-400` | `--cs360-text-tertiary` |
| `#cbd5e1` | slate-300 | `--cs360-neutral-300` | `--cs360-border-default` |
| `#e2e8f0` | slate-200 | `--cs360-neutral-200` | `--cs360-border-subtle` |
| `#f1f5f9` | slate-100 | `--cs360-neutral-100` | `--cs360-bg-alt` |
| `#f8fafc` | slate-50  | `--cs360-neutral-50`  | `--cs360-bg-page` |
| `#ffffff` | white     | `--cs360-neutral-0`   | `--cs360-bg-surface` |
| `#0077ff` / `#2499ff` | blue-500 | `--cs360-blue-500` | `--cs360-action-primary` |
| `#0062d4` | blue-700 | `--cs360-blue-700` | `--cs360-action-primary-hover` |

**If a Figma color has no matching primitive:**
1. Add it to `src/styles/01-primitives.scss` first
2. Create a semantic alias in `02-semantic.scss`
3. Never hardcode hex in any component

---

## Typography → Tokens

| Figma `fontSize` | Density Token | Tailwind Fallback |
|---|---|---|
| 10px | `--density-text-xs` | `text-xs` |
| 12px | `--density-text-sm` | `text-sm` |
| 14px | `--density-text-body` | `text-sm` |
| 16px | `--density-text-md` | `text-base` |
| 18px | `--density-text-lg` | `text-lg` |
| 20px | `--density-text-xl` | `text-xl` |
| 24px | `--density-text-2xl` | `text-2xl` |

### Font Weight

| Figma `fontWeight` | Tailwind Class |
|---|---|
| 400 | `font-normal` |
| 500 | `font-medium` |
| 600 | `font-semibold` |
| 700 | `font-bold` |

### Line Height

Set directly from Figma `lineHeightPx`:
```html
class="leading-[20px]"  <!-- for lineHeightPx: 20 -->
```

---

## cs-avatar Size Map

Always check before using a named size:

| `size` prop | Resolved px | When to use |
|---|---|---|
| `xs` | 24px | Tight lists, inline |
| `sm` | 32px | Compact contexts |
| `md` | 40px | **Figma standard** — most uses |
| `lg` | 48px | Profile cards |
| `xl` | 56px | Full profile headers |

---

## cs-icon Rules

- Icon name comes from the **Figma layer name** (e.g. layer `"chevron_forward"` → `name="chevron_forward"`)
- Icon size comes from `absoluteBoundingBox.width` in Figma (do not guess)
- Icon color maps to the token table above
- Reference: https://fonts.google.com/icons?icon.style=Rounded

```html
<!-- Correct -->
<cs-icon name="arrow_forward" [size]="20" class="text-[var(--cs360-action-primary)]" />

<!-- Wrong -->
<svg>...(paths)...</svg>
<mat-icon>arrow_forward</mat-icon>
```

---

## Border Radius Tokens

| Figma `cornerRadius` | Tailwind | Token |
|---|---|---|
| 4px  | `rounded` | `--cs360-radius-sm` |
| 6px  | `rounded-md` | `--cs360-radius-md` |
| 8px  | `rounded-lg` | `--cs360-radius-lg` |
| 12px | `rounded-xl` | `--cs360-radius-xl` |
| 16px | `rounded-2xl` | `--cs360-radius-2xl` |
| 9999px | `rounded-full` | `--cs360-radius-full` |

---

## Shadow Tokens

| Figma Effect | Tailwind | Semantic Token |
|---|---|---|
| Subtle card shadow | `shadow-sm` | `--cs360-shadow-sm` |
| Standard card shadow | `shadow` | `--cs360-shadow-md` |
| Elevated (modal/dropdown) | `shadow-lg` | `--cs360-shadow-lg` |
| No shadow | _(omit class)_ | — |

---

## Status / Feedback Colors

| State | Semantic Token | Usage |
|---|---|---|
| Error | `--cs360-feedback-error` | Validation, required field asterisks |
| Success | `--cs360-feedback-success` | Confirmation states |
| Warning | `--cs360-feedback-warning` | Alert states |
| Info | `--cs360-feedback-info` | Informational badges |
| Disabled | `--cs360-text-disabled` | Disabled inputs/buttons |
