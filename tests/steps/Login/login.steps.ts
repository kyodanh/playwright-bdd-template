import { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import LoginPage from '../../pages/Login/LoginPage';

const { Given, When, Then } = createBdd();

Given('User thực hiện mở web và đăng nhập', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes();
  for (const row of data) {
    await LoginPage.openAndLogin(page, row.url, row.username, row.password);
  }
});

Then('Hệ thống chuyển đến màn hình dashboard', async ({ page }) => {
  await LoginPage.verifyLoginSuccess(page);
});

Then('Hệ thống hiển thị thông báo lỗi đăng nhập', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes();
  for (const row of data) {
    await LoginPage.verifyLoginError(page, row.message);
  }
});

// TODO: Thêm step definitions cho các luồng khác tại đây
