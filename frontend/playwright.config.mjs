import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: 2,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:5173',
        browserName: 'chromium',
        channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
        viewport: { width: 1440, height: 1000 },
        trace: 'retain-on-failure',
    },
    webServer: [
        { command: 'npm run dev -- --host 127.0.0.1 --port 5173 --strictPort', url: 'http://127.0.0.1:5173', reuseExistingServer: !process.env.CI },
        { command: 'npm run dev:demo -- --host 127.0.0.1 --port 5174 --strictPort', url: 'http://127.0.0.1:5174', reuseExistingServer: !process.env.CI },
    ],
});
