import { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import LoginPage from '../../pages/Login/LoginPage';
import { getUser } from '../../../config/test-config';

const { Given, When, Then } = createBdd();

// Credentials lấy từ Config Layer theo tên tài khoản logic — feature không chứa user/password.
Given('User đăng nhập với tài khoản {string}', async ({ page }, accountKey: string) => {
  const user = getUser(accountKey);
  await LoginPage.openAndLogin(page, user.username, user.password);
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
