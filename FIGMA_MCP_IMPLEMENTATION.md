# Figma MCP Implementation Guide

Technical documentation for Figma MCP integration architecture and implementation details.

## Architecture Overview

### Integration Flow

```
Figma Design File
    ↓ (Figma API)
    ↓
Sync Script
    ├─ Authenticate with FIGMA_API_TOKEN
    ├─ Fetch variables from file
    ├─ Extract themes & densities
    ↓
Convert to Token Format
    ├─ Map Figma variables to token structure
    ├─ Apply transformations
    ├─ Validate naming conventions
    ↓
Style Dictionary
    ├─ Read token definitions
    ├─ Apply platform-specific transforms
    ├─ Generate outputs
    ↓
Multi-Format Outputs
    ├─ tokens/output/json/tokens.json
    ├─ tokens/output/scss/_tokens-*.scss
    ├─ tokens/output/js/tokens.js
    ├─ tokens/output/tailwind/theme-extend.js
    └─ tokens/output/figma/variables.json
    ↓
Validation & Audit
    ├─ Naming convention checks
    ├─ Theme coverage verification
    ├─ OWASP security validation
    ├─ Integrity hash generation
    ↓
Git Integration
    ├─ Auto-commit changes
    ├─ Create PR for review
    └─ Push to repository
```

## Configuration Files

### figma-mcp.config.json

Main configuration file controlling sync behavior.

**Key sections:**

```json
{
  "figmaConfig": {
    "figmaFileId": "YOUR_FILE_ID",
    "figmaAPIEndpoint": "https://api.figma.com/v1",
    "tokenSetId": "cs360"
  },
  
  "themes": {
    "light": {...},
    "dark": {...},
    "highContrast": {...}
  },
  
  "densityModes": {
    "compact": {...},
    "default": {...},
    "comfortable": {...}
  },
  
  "automation": {
    "enableDailySync": true,
    "dailySyncTime": "02:00",
    "autoCreatePR": true
  }
}
```

### style-dictionary.config.js

Style Dictionary configuration defining token transformation and export.

**Platforms:**
1. CSS - Plain CSS variables
2. SCSS - SCSS variables & CSS custom properties
3. JavaScript - Runtime token access
4. JSON - Master token registry
5. Tailwind - Tailwind theme extension

## Token Structure

### 4-Layer Architecture

```
Layer 1: Primitives
├── Colors: blue-500, neutral-900, etc.
├── Spacing: space-1 through space-96
├── Radii: radius-sm through radius-full
├── Shadows: shadow-xs through shadow-2xl
└── Typography: font-size-xs through font-size-4xl

Layer 2: Semantic (Theme-mapped)
├── Themes:
│   ├── Light Mode
│   ├── Dark Mode
│   └── High-Contrast Mode
└── Variables:
    ├── --cs360-action-primary-default
    ├── --cs360-text-primary
    └── --cs360-bg-surface

Layer 2b: Density Modes
├── Compact (0.75x scale)
├── Default (1.0x scale)
└── Comfortable (1.5x scale)

Layer 3: Styles
├── Typography utilities
├── Elevation classes
├── Focus rings
└── Skeleton animations

Layer 4: Components
├── Buttons
├── Forms
├── Cards
├── Tables
└── etc.
```

### Naming Convention

```
--cs360-{category}-{role}-{variant}

Examples:
--cs360-action-primary-default
--cs360-text-secondary
--cs360-bg-surface-hover
--cs360-space-4
```

## Validation Framework

### OWASP Compliance Checks

1. **Input Validation**
   - Token naming pattern
   - Color format verification
   - Value range checking

2. **Credential Protection**
   - No API tokens in output
   - Environment variables only
   - GitHub Secrets encryption

3. **Audit Trails**
   - Sync timestamp
   - Token count
   - Integrity hash

4. **Security Patterns**
   - No SQL injection vectors
   - No XSS patterns
   - Sanitized output

5. **Data Integrity**
   - SHA256 checksums
   - Manifest verification
   - Tamper detection

### Validation Script (validate-tokens.js)

Runs 7 checks:

1. Token Naming Conventions
   - Kebab-case format
   - Proper prefix
   - No unsafe characters

2. Token Format
   - All output formats generated
   - Files created successfully

3. Theme Coverage
   - Light, Dark, High-Contrast
   - All themes have variables

4. Density Coverage
   - Compact, Default, Comfortable
   - All modes have variables

5. Hardcoded Values
   - Semantic layer references primitives
   - No hex values in components

6. Security Compliance
   - No credentials in output
   - OWASP patterns checked

7. Token Integrity
   - SHA256 hash generated
   - Manifest created

## Automation Pipeline

### GitHub Actions Workflow

**File:** `.github/workflows/figma-mcp-sync.yml`

**Triggers:**
- Schedule: Daily at 2 AM UTC
- Manual: Via Actions UI
- Webhook: Can be configured

**Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run sync script
5. Generate tokens
6. Validate tokens
7. Commit changes
8. Create PR

**On Error:**
- Continue execution
- Log audit entry
- Report in workflow summary

## Scripts

### sync-figma-tokens.js

Pulls variables from Figma API.

```bash
npm run figma:sync
```

**Process:**
1. Load configuration
2. Authenticate with API token
3. Fetch Figma file
4. Extract variables
5. Convert to token format
6. Save to `tokens/sd-input/`
7. Generate audit log

### validate-tokens.js

Validates generated tokens.

```bash
npm run tokens:validate
```

**Outputs:**
- Console validation report
- Manifest JSON
- Audit log entry

### generate tokens (via Style Dictionary)

```bash
npm run tokens:generate
```

**Outputs:**
- `tokens/output/json/tokens.json`
- `tokens/output/scss/_tokens-*.scss`
- `tokens/output/js/tokens.js`
- `tokens/output/tailwind/theme-extend.js`
- `tokens/output/figma/variables.json`

## Output Files

### JSON Output

Master token registry:
```json
{
  "--cs360-action-primary-default": "#0077FF",
  "--cs360-text-primary": "#111827",
  "--cs360-bg-surface": "#FFFFFF",
  ...
}
```

### SCSS Output

CSS custom properties:
```scss
:root {
  --cs360-action-primary-default: #0077FF;
  --cs360-text-primary: #111827;
  ...
}
```

### JavaScript Output

Runtime access:
```javascript
export const tokens = {
  color: {
    action: {
      primary: {
        default: '#0077FF'
      }
    }
  }
};
```

### Tailwind Output

Theme extension:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--cs360-action-primary-default)'
      }
    }
  }
};
```

## Integration Points

### In Components

**SCSS:**
```scss
.button {
  background: var(--cs360-action-primary-default);
  padding: var(--cs360-space-4);
}
```

**Tailwind:**
```html
<button class="bg-primary-default p-4">Click</button>
```

**Angular:**
```typescript
import { tokens } from './tokens/output/js/tokens';

@Component({
  styles: [`
    :host {
      --primary-color: ${tokens.color.action.primary.default};
    }
  `]
})
```

## Security Considerations

### Credential Management

- **Never** commit API tokens
- Use GitHub Secrets for tokens
- Rotate tokens quarterly
- Mask tokens in logs

### Input Validation

- Validate token names
- Check color formats
- Verify spacing scales
- Sanitize user input

### Output Security

- No credentials in output files
- No SQL patterns
- No XSS vectors
- Integrity hashing

### Audit Logging

- Every sync logged
- Timestamp recorded
- Changes tracked
- Compliance maintained

## Troubleshooting

### Token Generation Fails

**Check:**
- Figma API token valid
- File ID correct
- Network connectivity
- Node.js version (18+)

**Fix:**
```bash
npm run tokens:generate
npm run tokens:validate
```

### Validation Fails

**Check:**
- Token naming conventions
- Theme coverage
- Density modes
- Hardcoded values

**Fix:**
```bash
npm run tokens:validate
cat tokens/audit-logs/*.json
```

### GitHub Actions Fails

**Check:**
- GitHub Secret configured
- Workflow file syntax
- Branch protection rules

**Debug:**
- View Actions logs
- Check commit messages
- Verify permissions

## Performance Metrics

### Token Generation

- **Time:** <5 seconds typically
- **Output size:** ~50KB (JSON)
- **Token count:** 150-300 tokens

### Validation

- **Time:** <2 seconds
- **Checks:** 7 validations
- **Passes:** 100% on valid setup

### Sync Process

- **Total time:** <3 minutes
- **API calls:** 10-20
- **Rate limit:** 100 requests/hour

## Best Practices

1. **Token Organization**
   - Group by category
   - Use consistent naming
   - Document purposes

2. **Figma Management**
   - Keep variables organized
   - Update descriptions
   - Maintain consistency

3. **Validation**
   - Always validate before merge
   - Review generated files
   - Test in all themes

4. **Monitoring**
   - Check audit logs
   - Monitor PR creation
   - Track sync history

## Future Enhancements

- Component variant mapping
- Figma component sync
- Contrast ratio validation
- Accessibility scoring
- Documentation generation
- Version history tracking

## Related Documentation

- Setup Guide: `FIGMA_MCP_SETUP.md`
- Phase 1 Summary: `PHASE_1_COMPLETE.md`
- README: `README.md`


---

## Figma Annotation Architecture
_Last updated: 2026-06-01 | See `.cursorrules` for full AI instruction contract_

### What Annotations Are

Annotations are **typed, categorised intent blocks** added to specific Figma layers in Dev Mode.
They carry information that Figma's inspect panel and MCP cannot deliver automatically:
behavioural rules, API contracts, transition specs, and business logic.

The Figma MCP server delivers annotations inside `annotations[]` on each node.
All AI agents MUST read them before generating code.

### Annotation Categories

| Category | Purpose |
|---|---|
| **Development** | Angular component selector, @Inputs/@Outputs, API endpoints, data models |
| **Interaction** | State machine, hover/active/disabled/focus, animations, transitions, events |
| **Accessibility** | ARIA roles/labels, keyboard navigation, screen reader behaviour |
| **Content** | Text bindings, dynamic formats, fallback values, i18n notes |
| **AI** | Direct code-gen instruction, MCP-specific edge case, override hint |

### Core Rules

- **One annotation = one category = one concern.** Never mix concerns in a single block.
- **Write only what MCP cannot fetch.** Tokens, layout values, variant properties — skip these.
- **Write when:** behaviour is invisible in the layer tree, API/transitions/business rules needed.
- **If no annotation exists:** generate from inspect data, mark unknowns with `// TODO:`.

### Annotated Frames — Caregiver Web Portal

Figma File: `XCvAxa7G7QgiTfk08G2LGg` | Page: Caregiver Web App | Code: Angular

| Frame | Annotations Present |
|---|---|
| V3 / home | Dev (sidenav, charts), Interaction (nav states, clock-out btn), Content (shift duration) |
| V3 / My Schedule / Assigned | Dev (page spec, data model, API), Interaction (clock-out 4-step flow) |
| Login | Dev (form contract), Interaction (validation states) |
| Client Sign / Caregiver Sign | Dev (signature canvas), Interaction (submit flow) |
| Goals / Goal Details | Dev (CRUD API, form fields), Content (field formats) |
| Security & Privacy | Dev (form, validation), Content (field labels) |
| Secret Question | Dev (dropdown + text, save API) |
| Clock-Out / Add Expense | Dev (ExpenseCode model, API), Content (header, shift time format) |
| All Notes popup | Dev (NoteItem model, pagination, search), Content (header binding) |

### MCP Token Budget Guide

| Token Range | Action |
|---|---|
| < 20k | Safe — select full frame |
| 20k–40k | OK — verify annotations load completely |
| 40k–47k | Caution — prefer sub-component selection |
| 47k+ ⚠️ | Split — select individual sections or components |

### Active Plugin Connections (verified 2026-06-01)

- Figma Developer MCP (VS Code) ✓
- Anima — Figma to Angular/React/HTML ✓
- Jira ✓
- Stark — Contrast & Accessibility ✓
- Figma to Code (HTML/Tailwind/Flutter/SwiftUI) ✓

---
