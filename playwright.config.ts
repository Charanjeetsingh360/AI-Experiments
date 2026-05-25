import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './tests/visual/results',
  timeout: 60_000,
  retries: 0,
  workers: 1, // serial to avoid port conflicts

  use: {
    baseURL: 'http://localhost:4200',
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
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start Angular dev server automatically if not already running
  webServer: {
    command: 'source ~/.zprofile && source ~/.zshrc && npm run start:4200',
    url: 'http://localhost:4200',
    reuseExistingServer: true, // won't restart if already running
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
