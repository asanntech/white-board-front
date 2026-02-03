import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  // スナップショットのパスからOS識別子を除外（darwin/linux間で共有可能に）
  snapshotPathTemplate: '{testDir}/{testFileDir}/{testFileName}-snapshots/{projectName}/{arg}{ext}',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev:clean',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
