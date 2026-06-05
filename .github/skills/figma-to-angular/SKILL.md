---
name: figma-to-angular
description: "End-to-end Figma-to-Angular workflow for CareGiver 360. Use when given a Figma URL or node ID, or asked to implement, convert, or pixel-perfect match a design. Triggers: 'implement figma', 'figma to angular', 'convert figma', 'pixel perfect', 'match figma', 'figma link', 'figma url', 'implement design', 'figma node', 'figma component'."
argument-hint: "Figma URL or node ID to implement"
---

# Figma → Angular Skill

End-to-end conversion of a Figma design node into a pixel-perfect Angular standalone component for CareGiver 360.

## When to Use

- User provides a Figma URL or node ID and wants an Angular component
- User says "implement this design", "match figma", "pixel perfect"
- Any design-to-code task for the CareGiver 360 portal

---

## Workflow — 5 Phases (Execute in Order, No Skipping)

### Phase 1 — Fetch Figma Data

Parse the Figma URL and call the API:

```
URL format: figma.com/design/{FILE_ID}/...?node-id={NODE_ID}
NODE_ID format: replace "-" with ":" (e.g. 4445-169799 → 4445:169799)
```

**Option A — Figma MCP (preferred if available):**
```
get_design_context(fileKey: FILE_ID, nodeId: NODE_ID)
```

**Option B — REST API fallback:**
```http
GET https://api.figma.com/v1/files/{FILE_ID}/nodes?ids={NODE_ID}&depth=15
X-FIGMA-TOKEN: ${FIGMA_API_TOKEN}
```

> Do NOT proceed to Phase 2 without Figma data in hand.

---

### Phase 2 — Extract Properties

For **every frame/component node**, read:
- `layoutMode` → HORIZONTAL / VERTICAL / NONE
- `primaryAxisSizingMode` / `counterAxisSizingMode` → FIXED / HUG / FILL
- `primaryAxisAlignItems` / `counterAxisAlignItems` → MIN / CENTER / MAX / SPACE_BETWEEN
- `itemSpacing` → gap in px
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` → exact px

For **every text node**, read:
- `fontSize`, `fontWeight`, `lineHeightPx`
- `fills[0].color` → resolve hex, then map to token

For **every child node**, read:
- `layoutSizingHorizontal` / `layoutSizingVertical` → HUG / FILL / FIXED

See [token-mapping.md](./references/token-mapping.md) for all mapping tables.

---

### Phase 3 — Map to Design Tokens

Using [token-mapping.md](./references/token-mapping.md):

1. Map all colors → `--cs360-*` semantic tokens
2. Map all spacing/padding/gap → `--density-space-*` tokens
3. Map sizing modes → CSS flex/width utilities
4. Map typography → `--density-text-*` and font-weight utilities

> **NEVER proceed to Phase 4 with unmapped values. All hex, px, and raw values must be resolved to tokens first.**

---

### Phase 4 — Implement Component

Use the skeleton in [implementation-patterns.md](./references/implementation-patterns.md).

1. Create folder: `src/app/shared/components/cs-<name>/`
2. Generate three files:
   - `cs-<name>.component.ts` — TypeScript, standalone, OnPush
   - `cs-<name>.component.html` — Template from Phase 3 mappings
   - `cs-<name>.component.scss` — Empty or minimal overrides only
3. Export from `src/app/shared/components/index.ts`

**Strict implementation rules:**
- Outer wrapper must mirror Figma frame layout (flex-direction, alignment, padding, gap)
- Each child must match its individual HUG/FILL/FIXED sizing
- Text nodes: exact font-size token, font-weight, line-height, color token
- Icons: ALWAYS `<cs-icon name="..." [size]="N" />` — never raw SVG
- Never add properties that weren't in the Figma data

---

### Phase 5 — Validate

1. **Build check**: `ng build --no-progress 2>&1 | tail -20` — must be zero errors
2. **Screenshot QA**: run `npm run qa:visual` to compare rendered Angular routes against Figma PNG baselines in `tests/visual/figma-baselines`
3. **Fix loop**: up to 2 low-cost passes for layout/token corrections
4. **Escalate** to premium model only after 2 failed passes with persistent visual mismatch

To refresh Figma baselines, run `FIGMA_API_TOKEN=<token> npm run qa:visual:refresh-baselines`. Never write the token into a file.

### Figma Baseline Integrity Rule

Before trusting or committing any PNG in `tests/visual/figma-baselines`, verify the filename, `ROUTE_NODE_MAP` entry, Figma node name, and visible screenshot content all describe the same screen. Do not rely on auto-discovered node IDs or fuzzy frame-name matches. For example, `messages.png` must render the Messages/Chat frame and active Messages nav item, while `caregiver-forms.png` must render the Caregiver Forms frame and active Caregiver Forms nav item; if they are swapped, regenerate each PNG from its exact Figma node instead of renaming blindly.

---

## Hard Redlines

| ❌ Never | ✅ Always |
|----------|----------|
| SVG paths from Figma for icons | `<cs-icon name="material_name" [size]="N" />` |
| Hardcoded hex colors | `text-[var(--cs360-text-primary)]` |
| Setting `font-family` in a component | Inter is globally inherited — do nothing |
| `min-h` on a HUG container | No size constraint on HUG nodes |
| Writing code before Phase 1–3 complete | Always fetch → extract → map first |
| Tailwind raw spacing on interactive elements | `p-[var(--density-space-N)]` |
| MCP/API tokens committed to source | `FIGMA_API_TOKEN` from shell env or CI secret |

---

## Cost Discipline

1. Fetch Figma data with MCP/REST (zero model cost).
2. Resolve all tokens locally using [token-mapping.md](./references/token-mapping.md).
3. Generate boilerplate with small model tier.
4. Validate locally with `ng build` and Playwright diff.
5. Premium model only for ambiguous architecture decisions or after 2 failed correction passes.

**Max 2 low-cost correction passes → Max 1 premium pass per issue.**
