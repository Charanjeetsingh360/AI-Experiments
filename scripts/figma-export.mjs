#!/usr/bin/env node
/**
 * CS360 Figma Baseline Exporter
 * ─────────────────────────────
 * Exports Figma frames as PNG baselines used by Playwright visual tests.
 *
 * Usage:
 *   FIGMA_API_TOKEN=<your_token> npm run figma:export
 *
 * Add more routes by extending ROUTE_NODE_MAP below.
 * Node IDs are found in Figma → Inspect panel → right-click frame → Copy link.
 * The node-id param in the URL (e.g. node-id=183-59750) is your ID.
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const CONFIG     = JSON.parse(fs.readFileSync(path.join(ROOT, 'figma-mcp.config.json'), 'utf8'));

const FILE_KEY   = CONFIG.figmaConfig.figmaFileId;          // XCvAxa7G7QgiTfk08G2LGg
const API_BASE   = CONFIG.figmaConfig.figmaAPIEndpoint;     // https://api.figma.com/v1
const TOKEN      = process.env.FIGMA_API_TOKEN || process.env.FIGMA_TOKEN;
const OUTPUT_DIR = path.join(ROOT, 'tests/visual/figma-baselines');

if (!TOKEN) {
  console.error('❌  Set FIGMA_API_TOKEN env var first. Keep it in your shell or CI secret, never in source.');
  process.exit(1);
}

/**
 * ROUTE → FIGMA NODE MAP
 * ----------------------
 * key   : URL slug (used as filename: <key>.png)
 * value : Figma node-id with colon replaced by hyphen  (e.g. 183:59750 → 183-59750)
 *         Open Figma → right-click frame → Copy link → grab node-id query param
 */
// slug → Figma node-id (URL form with hyphen, e.g. "183-59750")
// Set TODO entries by opening the frame in Figma → right-click → Copy link
// and pasting the node-id query param value here. Entries with the literal
// string "TODO" are skipped at export time.
// Auto-discovered from Figma file XCvAxa7G7QgiTfk08G2LGg (Charan & Mehak Dec 2025 page)
// Verify each frame in Figma before relying on diffs; replace with a more
// canonical frame ID if the auto-pick doesn't match the implemented route.
const ROUTE_NODE_MAP = {
  'home':            '2766-112482',   // V3 / home
  'shift-calendar':  '183-59750',     // V3 / My Schedule / Assigned
  'clients':         '183-59846',     // Caregiver Web App / Client process / My Clients
  'availability':    '183-59885',     // V2 / Availability & Unavailability / Availability
  'documents':       '183-59993',     // V1 / Key Documents
  'messages':        '412-220750',    // Chat V3 / Full Screen
  'caregiver-forms': '183-127256',    // Caregiver Forms
  'trainings':       '183-59923',     // Trainings / V3
};

// Figma API expects colon-separated IDs (183:59750), URLs use hyphens
const toFigmaId  = id => id.replace('-', ':');
const toSlugId   = id => id.replace(':', '-');

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const liveEntries = Object.entries(ROUTE_NODE_MAP).filter(([, id]) => id && id !== 'TODO');
  const skipped     = Object.entries(ROUTE_NODE_MAP).filter(([, id]) => !id || id === 'TODO');

  if (skipped.length) {
    console.log(`ℹ️   Skipping ${skipped.length} route(s) without node-id: ${skipped.map(([s]) => s).join(', ')}`);
  }

  if (!liveEntries.length) {
    console.error('❌  No live ROUTE_NODE_MAP entries to export. Fill in node-ids first.');
    process.exit(1);
  }

  const nodeIds   = liveEntries.map(([, id]) => toFigmaId(id)).join(',');
  const endpoint  = `${API_BASE}/images/${FILE_KEY}?ids=${encodeURIComponent(nodeIds)}&scale=1&format=png`;

  console.log(`\n📐  Requesting PNG exports from Figma…`);
  console.log(`    File : ${FILE_KEY}`);
  console.log(`    Nodes: ${nodeIds}\n`);

  let data;
  try {
    data = await fetchJSON(endpoint);
  } catch (err) {
    console.error('❌  Figma API request failed:', err.message);
    process.exit(1);
  }

  if (data.err) {
    console.error('❌  Figma API error:', data.err);
    process.exit(1);
  }

  let passed = 0, failed = 0;

  for (const [slug, rawId] of liveEntries) {
    const figmaId  = toFigmaId(rawId);
    const imageUrl = data.images?.[figmaId];

    if (!imageUrl) {
      console.warn(`⚠️   No image URL returned for node ${figmaId} (${slug}) — check the node-id is correct and the frame is visible.`);
      failed++;
      continue;
    }

    const dest = path.join(OUTPUT_DIR, `${slug}.png`);
    try {
      await downloadFile(imageUrl, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`✅  ${slug}.png  (${size} KB)  →  ${dest}`);
      passed++;
    } catch (err) {
      console.error(`❌  Failed to download ${slug}:`, err.message);
      failed++;
    }
  }

  console.log(`\n── Summary ──────────────────────────────`);
  console.log(`   Exported : ${passed}`);
  console.log(`   Failed   : ${failed}`);
  console.log(`   Output   : ${OUTPUT_DIR}`);
  console.log(`─────────────────────────────────────────\n`);

  if (failed > 0) process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'X-Figma-Token': TOKEN,
        'User-Agent': 'cs360-visual-test/1.0',
      },
    };
    https.get(url, options, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} from Figma API`));
        res.resume();
        return;
      }
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        try   { resolve(JSON.parse(body)); }
        catch { reject(new Error('Invalid JSON from Figma API')); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} downloading image`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

run();
