import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4200';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './tests/visual/results',
  // Resolve toHaveScreenshot('name.png') to tests/visual/figma-baselines/name.png
  // so Figma PNG exports act as the expected snapshots.
  snapshotPathTemplate: '{testDir}/figma-baselines/{arg}{ext}',
  timeout: 60_000,
  retries: 0,
  workers: 1, // serial to avoid port conflicts

  use: {
    baseURL,
    channel: 'chromium',
    viewport: { width: 1440, height: 900 }, // match Figma frame
    deviceScaleFactor: 1,
    colorScheme: 'light',
    // wait for Angular CD to settle
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 }, // override device default (1280x720)
        deviceScaleFactor: 1,
      },
    },
  ],

  // Start Angular dev server automatically if not already running
  webServer: {
    command: 'npm run start:4200 -- --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI, // local reuse only; CI should own the server
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'tests/visual/playwright-report', open: 'on-failure' }],
    ['json', { outputFile: 'tests/visual/results/test-results.json' }],
  ],
});
