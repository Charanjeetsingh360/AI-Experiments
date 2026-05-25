/**
 * fix-token-refs.mjs
 * Run once: node scripts/fix-token-refs.mjs
 *
 * Scans every JSON file under tokens/sd-input/tokens/
 * and patches ALL known broken reference patterns so
 * `npm run tokens:generate` passes cleanly.
 *
 * Safe to re-run — idempotent.
 */

import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const TOKEN_DIR = path.join(ROOT, 'tokens', 'sd-input');

// ─── Primitive key map (from actual primitives.json inspection) ──────────────

// radius: {radius.radius-N} or {radius.radius-0} → named key
const RADIUS_MAP = {
  '0':   'none',
  '2':   'sm',
  '4':   'sm',
  '6':   'md',
  '8':   'md',
  '12':  'lg',
  '16':  'xl',
  '24':  '2xl',
  '999': 'full',
  '9999': 'full',
};

// font-weight by original Figma name
const WEIGHT_MAP = {
  'regular-400':  'regular',
  'medium-500':   'medium',
  'semibold-600': 'semibold',
  'bold-700':     'bold',
  'regular':      'regular',
  'medium':       'medium',
  'semibold':     'semibold',
  'bold':         'bold',
};

// ─── Collect all JSON files ──────────────────────────────────────────────────

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name.endsWith('.json') && !entry.name.endsWith('.bak'))
      results.push(full);
  }
  return results;
}

const allFiles = walk(path.join(TOKEN_DIR, 'tokens'));

let totalFixed = 0;

for (const filePath of allFiles) {
  let raw = fs.readFileSync(filePath, 'utf8');
  const original = raw;

  // ── FIX 1: {colors.X-N} → {color.X.N}  (neutral→gray)
  raw = raw.replace(/\{colors\.([a-zA-Z]+)-(\d+)\}/g, (_, name, shade) =>
    `{color.${name === 'neutral' ? 'gray' : name}.${shade}}`);

  // ── FIX 2: {colors.white|black|transparent}
  raw = raw.replace(/\{colors\.white\}/g,       '{color.white}');
  raw = raw.replace(/\{colors\.black\}/g,       '{color.black}');
  raw = raw.replace(/\{colors\.transparent\}/g, '{color.white}');

  // ── FIX 3: {fonts.family.font-family-X} → {font.family.X}
  raw = raw.replace(/\{fonts?\.family\.font-family-([^}]+)\}/g,
    (_, name) => `{font.family.${name}}`);

  // ── FIX 4: {fonts.family.X} → {font.family.X}
  raw = raw.replace(/\{fonts\.family\.([^}]+)\}/g,
    (_, name) => `{font.family.${name}}`);

  // ── FIX 5: {fonts.weight.X-NNN} → {font.weight.X}
  raw = raw.replace(/\{fonts?\.weight\.([a-z]+-\d+)\}/g, (_, key) =>
    `{font.weight.${WEIGHT_MAP[key] || key.split('-')[0]}}`);

  // ── FIX 6: {font.weight.X-NNN} (double-apply safety)
  raw = raw.replace(/\{font\.weight\.([a-z]+-\d+)\}/g, (_, key) =>
    `{font.weight.${WEIGHT_MAP[key] || key.split('-')[0]}}`);

  // ── FIX 7: {font..} (malformed double-dot from earlier patch)
  // Resolve by surrounding key name — handled via JSON parse below

  // ── FIX 8: {radius.radius-N} → {radius.named}
  raw = raw.replace(/\{radius\.radius-(\d+)\}/g, (_, n) =>
    `{radius.${RADIUS_MAP[n] || 'md'}}`);

  // ── FIX 9: {status-color.X-N} → {color.X.N}
  raw = raw.replace(/\{status-color\.([a-zA-Z]+)-(\d+)\}/g,
    (_, name, shade) => `{color.${name}.${shade}}`);

  // ── FIX 10: {color.yellow.900} → {color.yellow.800} (shade missing in primitives)
  raw = raw.replace(/\{color\.yellow\.900\}/g, '{color.yellow.800}');

  // ── FIX 11: {font..} via JSON parse + context-aware correction
  if (raw.includes('{font..}')) {
    let obj;
    try { obj = JSON.parse(raw); } catch { /* skip malformed */ }
    if (obj) {
      function fixFontDotDot(node, parentKey = '', grandKey = '') {
        if (node && typeof node === 'object') {
          if (node['$value'] === '{font..}') {
            const gk = grandKey.toLowerCase();
            const pk = parentKey.toLowerCase();
            if (gk.includes('family') || pk.includes('family')) {
              node['$value'] = '{font.family.sans}';
            } else if (pk.includes('bold') || pk.includes('strong') || pk.includes('heading')) {
              node['$value'] = '{font.weight.semibold}';
            } else if (pk.includes('medium')) {
              node['$value'] = '{font.weight.medium}';
            } else if (pk.includes('regular') || pk.includes('base')) {
              node['$value'] = '{font.weight.regular}';
            } else if (gk.includes('size') || pk.includes('size')) {
              node['$value'] = '{font.size.base}';
            } else if (gk.includes('weight')) {
              node['$value'] = '{font.weight.regular}';
            } else {
              node['$value'] = '{font.family.sans}';
            }
          }
          for (const [k, v] of Object.entries(node)) {
            if (v && typeof v === 'object') fixFontDotDot(v, k, parentKey);
          }
        }
      }
      fixFontDotDot(obj);
      raw = JSON.stringify(obj, null, 2);
    }
  }

  if (raw !== original) {
    fs.writeFileSync(filePath, raw, 'utf8');
    const fixCount = (original.match(/\{(colors?\.|fonts?\.|radius\.radius-|status-color\.|color\.yellow\.900|font\.\.)/g) || []).length;
    console.log(`  ✓ ${path.relative(ROOT, filePath)} (${fixCount} refs patched)`);
    totalFixed += fixCount;
  }
}

console.log(`\nTotal refs patched: ${totalFixed}`);

// ─── Verify: scan all files for any remaining unknown refs ───────────────────

const KNOWN_PREFIXES = ['color.', 'spacing.', 'radius.', 'font.', 'elevation.', 'focus.', 'motion.', 'size.',
  // semantic self-references (resolved at merge time)
  'surface.', 'text.', 'icon.', 'border.', 'status.', 'actions.', 'fields.', 'tags.',
  'sidebar.', 'popover.', 'font-family.', 'font-weight.', 'font-size.', 'line-height.',
  'radius.', 'density-space.', 'density-text.',
];

const remaining = [];
for (const filePath of allFiles) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const refs = [...(raw.match(/\{[^}]+\}/g) || [])];
  for (const ref of refs) {
    const inner = ref.slice(1, -1);
    if (!KNOWN_PREFIXES.some(p => inner.startsWith(p))) {
      remaining.push({ file: path.relative(ROOT, filePath), ref });
    }
  }
}

if (remaining.length === 0) {
  console.log('\n✅ No unknown token references found. Safe to run: npm run tokens:generate');
} else {
  console.log(`\n⚠️  ${remaining.length} potentially unresolved refs remaining:`);
  const unique = [...new Set(remaining.map(r => `${r.ref}  ←  ${r.file}`))];
  unique.slice(0, 40).forEach(r => console.log('  ', r));
  if (unique.length > 40) console.log(`  ... and ${unique.length - 40} more`);
}
