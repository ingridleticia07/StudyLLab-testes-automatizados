const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  forbidOnly: isCI,
  maxFailures: 0,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: isCI
    ? [
        ['line'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/playwright-results.json' }],
        ['junit', { outputFile: 'test-results/playwright-results.xml' }],
      ]
    : [
        ['line'],
        ['html', { open: 'never' }],
      ],
  use: {
    headless: true,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: isCI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
