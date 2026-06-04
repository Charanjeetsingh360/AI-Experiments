import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

/**
 * Visual regression: rendered Angular routes vs Figma PNG baselines.
 *
 * Baselines live in tests/visual/figma-baselines/<slug>.png and are produced by:
 *   FIGMA_API_TOKEN=... npm run figma:export
 *
 * Add a route here AND a matching entry in scripts/figma-export.mjs ROUTE_NODE_MAP,
 * then re-run the exporter to refresh the baseline.
 */

interface Screen {
  slug: string;   // baseline filename without .png
  route: string;  // Angular route
}

const SCREENS: Screen[] = [
  { slug: 'home',            route: '/home' },
  { slug: 'shift-calendar',  route: '/shift-calendar' },
  { slug: 'clients',         route: '/clients' },
  { slug: 'availability',    route: '/availability' },
  { slug: 'documents',       route: '/documents' },
  { slug: 'messages',        route: '/messages' },
  { slug: 'caregiver-forms', route: '/caregiver-forms' },
  { slug: 'trainings',       route: '/trainings' },
];

const BASELINE_DIR = join(__dirname, 'figma-baselines');

for (const { slug, route } of SCREENS) {
  test(`${slug} matches Figma baseline`, async ({ page }) => {
    const baseline = join(BASELINE_DIR, `${slug}.png`);
    test.skip(!existsSync(baseline),
      `No Figma baseline for ${slug}. Run scripts/figma-export.mjs after adding the node-id.`);

    await page.goto(route, { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');
    await page.evaluate(() => document.fonts?.ready);

    await expect(page).toHaveScreenshot(`${slug}.png`, {
      // Figma exports are perfectly clean; allow tolerance for AA, sub-pixel text,
      // and any minor density drift while we converge on parity.
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
      // Match Figma frame exactly (1440x900); use viewport screenshot, not fullPage.
      fullPage: false,
    });
  });
}
