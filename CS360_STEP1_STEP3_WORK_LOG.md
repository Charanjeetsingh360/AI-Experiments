# CS360 Step 1 to Step 3 Work Log

Date: Monday, May 25, 2026  
Project: `AI-Experiments`  
Local path: `/Users/netsmartz/Documents/PROJECTS/AI-Experiments`

## Purpose

This log records what was done before the next Git review or commit step. It captures the task list, approach, core problems identified, fixes applied, validation results, and pending decisions.

## Task list before next process

- [x] Install the CS360 Step 1 and Step 2 scaffold into the local repo.
- [x] Verify scaffold files are present.
- [x] Identify the existing Angular, Tailwind, and token pipeline structure.
- [x] Connect generated token CSS into the app stylesheet without breaking existing runtime CS360 variables.
- [x] Add token generation hooks before app start/build.
- [x] Fix the `DocumentItem` TypeScript build error.
- [x] Align `tokens:validate` with the real generated CSS output.
- [x] Run token generation.
- [x] Run token validation.
- [x] Run full Angular build.
- [ ] Review Git diff.
- [ ] Decide whether to commit all changes together or split into checkpoints.
- [ ] Decide whether to normalize theme/density names between config and emitted output.
- [ ] Decide whether to keep, merge, or remove `tailwind.config.snippet.js`.
- [ ] Run visual smoke test in browser.

## What was done

### Step 1 and Step 2 scaffold installation

Installed the scaffold package into the local `AI-Experiments` repo after the local connector initially blocked direct writes because no active writable workspace was attached to the thread.

Files installed:

- `.cursorrules`
- `FIGMA_TO_ANGULAR_PROMPT_TEMPLATE.md`
- `PENDING_FOR_STEP3.md`
- `tailwind.config.snippet.js`
- `tokens/README.md`
- `tokens/config/style-dictionary.config.js`
- `tokens/primitives.json`
- `tokens/semantic.json`

### Step 3 token pipeline wiring

The repo already had a more advanced token pipeline than the scaffold:

- `scripts/build-tokens.js`
- `scripts/validate-tokens.js`
- `style-dictionary`
- `tokens:generate`
- `tokens:validate`
- token-aware `tailwind.config.js`
- existing runtime CSS token layers in `src/styles/tokens/`

The generated file was:

```bash
tokens/output/css/tokens.css
```

The app stylesheet was updated to import the generated CSS while keeping the existing runtime CS360 token layers that define variables like `--cs360-font-sans`, `--cs360-bg`, and `--cs360-text-primary`.

### Build hooks

Added these scripts to `package.json`:

```json
"prebuild": "npm run tokens:generate",
"prestart": "npm run tokens:generate"
```

This ensures token CSS is regenerated before local start and production build.

### TypeScript build fix

The Angular build failed because mock document objects in `my-clients.component.ts` included `type`, `updatedOn`, and `fileFormat`, while `DocumentItem` only allowed `id`, `name`, and `description`.

Updated:

```bash
src/app/features/my-clients/components/client-documents-flyout/client-documents-flyout.component.ts
```

Current interface:

```ts
export interface DocumentItem {
  id: string;
  name: string;
  description?: string;
  type?: 'DOCUMENT' | 'COMPLIANCE';
  updatedOn?: string;
  fileFormat?: string;
}
```

### Token validator cleanup

The validator previously checked for an old output layout:

```bash
tokens/output/json/tokens.json
tokens/output/scss/
tokens/output/js/
tokens/output/tailwind/
```

But the generator now emits:

```bash
tokens/output/css/tokens.css
```

Updated:

```bash
scripts/validate-tokens.js
```

The validator now checks:

- CSS custom property naming
- generated `tokens.css` presence
- emitted theme selectors
- emitted density selectors
- OWASP/security checks against token names and values
- SHA256 integrity

It also creates:

```bash
tokens/output/manifest/token-manifest.json
```

## Core problems identified

### Problem 1: Direct local writes were blocked

The connector could read the repo but initially could not write to the project path because this thread had no active writable local workspace.

Solution:

- Created a downloadable/staged package.
- Installed it through Mac Terminal.
- Used exact local file operations only where safe.

### Problem 2: Step 3 already existed but was partially disconnected

The repo already had a token generator, validator, Tailwind config, and runtime CSS token layers. The generated CSS was not fully part of the app pipeline.

Solution:

- Connected generated token CSS through `src/styles.scss`.
- Preserved existing `src/styles/tokens/*.css` imports so current app variables continue to work.
- Added `prebuild` and `prestart` hooks.

### Problem 3: Validator expected old generated files

The validator looked for legacy JSON and folder outputs that are no longer created.

Solution:

- Rewrote validator logic to validate `tokens/output/css/tokens.css`.
- Added integrity manifest generation.

### Problem 4: `DocumentItem` type mismatch

Parent mock data used document metadata fields not allowed by the child component interface.

Solution:

- Added optional metadata fields to `DocumentItem`.
- Verified with TypeScript no-emit check.

## Validation results

### TypeScript

Command:

```bash
npx tsc --noEmit --pretty false
```

Result:

```bash
Command completed successfully
```

### Token validation

Command:

```bash
npm run tokens:validate
```

Result:

```bash
✅ Checks Passed: 6/7
✅ VALIDATION PASSED
```

Known warning:

```bash
⚠️  1077 potentially hardcoded values detected
```

Reason:

The current token generator resolves aliases to raw CSS values. This is expected for the current generator behavior and is not blocking validation.

### Angular build

Command:

```bash
npm run build
```

Result:

```bash
Application bundle generation complete.
Output location: /Users/netsmartz/Documents/PROJECTS/AI-Experiments/dist/ai-experiments-angular
```

## Pending items

### Git review

Changes are local only. Nothing has been committed or pushed.

Recommended next step:

```bash
git status
git diff
```

Then decide whether to commit as one checkpoint or split into multiple commits.

### Theme and density naming drift

Current emitted themes:

- `light`
- `soothing-dark`
- `high-contrast`
- `stark-dark`

Configured themes:

- `light`
- `dark`
- `highContrast`

Current emitted densities:

- `default`
- `large`
- `small`

Configured densities:

- `compact`
- `default`
- `comfortable`

Decision needed:

Normalize naming later if Figma sync and runtime theme/density switching need a single shared naming contract.

### Token hardcoded-value warning

The validator still reports many potentially hardcoded values because generated CSS contains resolved raw values.

Decision needed:

Choose whether to:

- keep as informational,
- change generator to preserve references,
- or whitelist expected generated semantic values.

### Visual smoke test

The build passes, but a browser smoke test is still recommended:

- app loads
- styles are intact
- token CSS does not visually regress screens
- theme/density selectors behave as expected

## Final verification checkpoint

### Final validation sequence

Commands run:

```bash
npm run tokens:validate
npx tsc --noEmit --pretty false
npm run build
```

Result:

- `tokens:validate` passed with `6/7` checks and the known informational hardcoded-value warning.
- `npx tsc --noEmit --pretty false` passed.
- `npm run build` passed.
- Production build output was generated at `dist/ai-experiments-angular`.

### Local dev server smoke check

Command run:

```bash
npm run start -- --host 127.0.0.1 --port 4200
```

Result:

- `prestart` successfully generated token CSS.
- Angular dev server compiled successfully.
- Server reported local URL: `http://127.0.0.1:4200/`.
- Automated localhost fetch was blocked by local connector permissions, so this is a compile/server-start smoke check, not a visual browser QA.

## Next recommended process

Before starting any new implementation step:

1. Write the task list.
2. Confirm the expected output.
3. Estimate risk and affected files.
4. Run the smallest safe change.
5. Validate with command output.
6. Update this log or create a new dated log.
7. Ask before committing, pushing, or deleting files.
