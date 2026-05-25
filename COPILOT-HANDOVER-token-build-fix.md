# 🔧 Token Build Fix — Copilot Runbook

> **Run this file's steps top-to-bottom in order. Do not skip steps.**
> Each step has a verification command. Only move to the next step when verification passes.

---

## Context

`npm start` fails at the `prestart` hook because `npm run tokens:generate` exits with:
```
❌ Build failed: Reference Errors — Some token references (146) could not be found.
```

Style Dictionary v5 (`scripts/build-tokens.mjs`) deep-merges these files and resolves `{aliases}`:
```
tokens/sd-input/primitives.json                         ← primitive values (source of truth)
tokens/sd-input/tokens/General/semantic-general.json
tokens/sd-input/tokens/Color Theme/semantic-color.json  ← FAILS HERE first
tokens/sd-input/tokens/Color Theme/Soothing Dark Mode.json
tokens/sd-input/tokens/Color Theme/High Contrast.json
tokens/sd-input/tokens/Color Theme/Stark Dark Mode - Testcase.json
tokens/sd-input/tokens/Density Modes/semantic-density.json
tokens/sd-input/tokens/Density Modes/Large.json
tokens/sd-input/tokens/Density Modes/Small.json
```

Output target: `tokens/output/css/tokens.css`

---

## Step 1 — Run the auto-fix script

A comprehensive fix script has already been written at `scripts/fix-token-refs.mjs`.
**Run it now:**

```bash
cd /Users/netsmartz/Documents/PROJECTS/AI-Experiments
node scripts/fix-token-refs.mjs
```

Expected output ends with:
```
✅ No unknown token references found. Safe to run: npm run tokens:generate
```

If you see `⚠️ N potentially unresolved refs remaining`, go to **Step 2**.

---

## Step 2 — Verify the token build

```bash
npm run tokens:generate
```

Expected passing output:
```
  Building color-light…
  Building color-soothing-dark…
  Building color-high-contrast…
  Building color-stark-dark…
  Building density-default…
  Building density-large…
  Building density-small…
✅ tokens.css written → tokens/output/css/tokens.css
```

Verify the output file exists:
```bash
ls -lh tokens/output/css/tokens.css
```

---

## Step 3 — Start the app

```bash
npm start
```

Expected: Angular dev server starts, `localhost:4200` loads `shift-calendar` page.

---

## If Step 1 shows remaining refs — Manual fix guide

### Primitive key map (source of truth from `primitives.json`)

| Broken ref pattern | Correct ref | Notes |
|---|---|---|
| `{colors.X-N}` | `{color.X.N}` | plural+hyphen → singular+dot |
| `{colors.neutral-N}` | `{color.gray.N}` | `neutral` maps to `gray` |
| `{colors.white}` | `{color.white}` | |
| `{colors.black}` | `{color.black}` | |
| `{colors.transparent}` | `{color.white}` | no transparent token |
| `{fonts.family.font-family-sans}` | `{font.family.sans}` | |
| `{fonts.family.font-family-mono}` | `{font.family.mono}` | |
| `{fonts.weight.regular-400}` | `{font.weight.regular}` | |
| `{fonts.weight.medium-500}` | `{font.weight.medium}` | |
| `{fonts.weight.semibold-600}` | `{font.weight.semibold}` | |
| `{fonts.weight.bold-700}` | `{font.weight.bold}` | |
| `{font..}` | depends on parent key context | see below |
| `{radius.radius-0}` | `{radius.none}` | |
| `{radius.radius-2}` | `{radius.sm}` | |
| `{radius.radius-4}` | `{radius.sm}` | |
| `{radius.radius-6}` | `{radius.md}` | |
| `{radius.radius-8}` | `{radius.md}` | |
| `{radius.radius-12}` | `{radius.lg}` | |
| `{radius.radius-16}` | `{radius.xl}` | |
| `{radius.radius-24}` | `{radius.2xl}` | |
| `{radius.radius-999}` | `{radius.full}` | |
| `{status-color.X-N}` | `{color.X.N}` | no status-color collection |
| `{color.yellow.900}` | `{color.yellow.800}` | 900 shade missing |

### Fixing `{font..}` by context

This malformed ref was created by a bad regex. Fix by parent key:
- Parent key contains `family` → `{font.family.sans}`
- Parent key contains `bold`, `strong`, `heading` → `{font.weight.semibold}`
- Parent key contains `medium` → `{font.weight.medium}`
- Parent key contains `regular`, `base`, `body` → `{font.weight.regular}`
- Parent key contains `size` → `{font.size.base}`
- Default fallback → `{font.weight.regular}`

---

## Available primitives (for safe mapping)

```
color:   white, black
         gray:   50 100 200 300 400 500 600 700 800 900
         blue:   50 100 200 300 400 500 600 700 800
         teal:   50 100 400 500 600 700 800
         green:  50 100 400 500 600 700 800
         red:    50 100 400 500 600 700 800
         yellow: 50 100 400 500 600 700 800  ← NO 900
         orange: 50 100 400 500 600 700
         purple: 50 100 400 500 600 700
         rose:   50 100 400 500 600 700
         cyan:   50 100 400 500 600 700

radius:  none, sm, md, lg, xl, 2xl, full, none-lg

font:
  family:      sans, mono
  weight:      regular, medium, semibold, bold
  size:        (check primitives.json)
  lineHeight:  (check primitives.json)

spacing, elevation, focus, motion, size: (check primitives.json)
```

---

## Key files

- `scripts/fix-token-refs.mjs` — auto-fix script (run this first)
- `scripts/build-tokens.mjs` — Style Dictionary v5 pipeline
- `tokens/sd-input/primitives.json` — primitive values source of truth
- `tokens/output/css/tokens.css` — generated output (does not exist until build passes)
- `src/styles.scss` — imports the generated tokens.css

---

*Last updated: May 25, 2026*
