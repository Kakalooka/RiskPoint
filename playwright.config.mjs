import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const STANDALONE = new URL('./dist/RiskPoint.html', import.meta.url);
const FROZEN_BUILD_1 = new URL('./final/RiskPoint-final.html', import.meta.url);

/**
 * Browser tests run against the production build, not the dev server:
 * - "preview": `vite preview` of `dist/` (the web build);
 * - "standalone": `dist/RiskPoint.html` opened from disk, the same kind of
 *   single-file artifact that is published;
 * - "frozen-build-1": a read-only smoke test of the approved, published Build 1
 *   (`final/RiskPoint-final.html`). It intentionally differs from `main` and is
 *   never rebuilt or modified; only the shared artifact smoke spec runs against it.
 * The web server command builds the web and standalone outputs before serving.
 */
export default defineConfig({
  testDir: './tests/browser',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'preview',
      testIgnore: /artifact\.spec\.mjs/,
      use: { baseURL: `http://127.0.0.1:${PORT}` },
      metadata: { entry: '/' },
    },
    {
      name: 'standalone',
      testMatch: /artifact\.spec\.mjs/,
      metadata: { entry: STANDALONE.href },
    },
    {
      name: 'frozen-build-1',
      testMatch: /artifact\.spec\.mjs/,
      metadata: { entry: FROZEN_BUILD_1.href },
    },
  ],
  webServer: {
    command: `npm run build:all && npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
