import { createBaseConfig } from 'bdd-playwright-core';

module.exports = createBaseConfig(
  {
    // Thêm CustomReporter để xuất Excel + gửi email (bỏ comment để bật):
    // reporter: [
    //   ['list'],
    //   ['html', { outputFolder: 'playwright-report', open: 'never' }],
    //   [require.resolve('bdd-playwright-core/dist/CustomReporter'), {
    //     outputFile: 'custom-test-results.xlsx',
    //     email: {
    //       host: 'smtp.gmail.com', port: 587,
    //       user: process.env.MAIL_USER,
    //       pass: process.env.MAIL_PASS,
    //       from: '"Auto Test" <bot@gmail.com>',
    //       to: 'team@company.com',
    //     },
    //   }],
    // ],
  }
);
