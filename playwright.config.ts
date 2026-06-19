import { defineBddConfig } from 'playwright-bdd';
import { config } from './config/test-config';

// LAYER 4 — Config được nạp từ ./config/test-config (đọc .env.<TEST_ENV>).
// baseURL + browser channel lấy từ config => đổi môi trường không cần sửa file này.
module.exports = {
  testDir: defineBddConfig({
    features: 'tests/features/**/*.feature',
    steps: 'tests/steps/**/*.steps.ts',
  }),
  use: {
    baseURL: config.baseURL,
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    storageState: undefined,
    launchOptions: {
      args: ['--incognito=false'],
      slowMo: 100,
    },
    contextOptions: {
      bypassCSP: true,
      viewport: null,
    },
    ignoreHTTPSErrors: true,
  },
  // Browser channel theo config:
  //   '' (rỗng)  -> Chromium bundled (mặc định, luôn chạy được trên CI Ubuntu)
  //   'msedge'   -> Microsoft Edge (máy local)
  // => Sửa lỗi CI fail do channel 'msedge' không có sẵn trên ubuntu-latest.
  projects: [
    {
      name: config.browserChannel || 'chromium',
      use: config.browserChannel ? { channel: config.browserChannel } : {},
    },
  ],
  reporter: [
    ['list'],
    ['json', { outputFile: './test-results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    // Bật CustomReporter khi cần xuất Excel + gửi email:
    // [require.resolve('bdd-playwright-core/dist/CustomReporter'), {
    //   outputFile: 'custom-test-results.xlsx',
    //   email: {
    //     host: 'smtp.gmail.com', port: 587,
    //     user: process.env.MAIL_USER, pass: process.env.MAIL_PASS,
    //     from: '"Auto Test" <bot@gmail.com>', to: 'team@company.com',
    //   },
    // }],
  ],
};
