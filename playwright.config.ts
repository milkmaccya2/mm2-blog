import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // CI: astro preview は Cloudflare リモート接続を要求するため、
    // プリレンダリング済み静的ファイルを直接配信する
    command: isCI
      ? `npm run build && npx serve dist/client -l ${PORT}`
      : `npm run build && npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !isCI,
    timeout: 120 * 1000,
  },
});
