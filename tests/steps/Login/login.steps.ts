import { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import LoginPage from '../../pages/Login/LoginPage';
import { getUser } from '../../../config/test-config';
import { readCsv } from '../../data/csvHelper';

const { Given, When, Then } = createBdd();

// -------------------------------------------------------------------
// Single account từ config (không chứa credentials trong feature)
// -------------------------------------------------------------------
Given('User đăng nhập với tài khoản {string}', async ({ page }, accountKey: string) => {
  const user = getUser(accountKey);
  await LoginPage.openAndLogin(page, user.username, user.password);
});

Then('Hệ thống chuyển đến màn hình dashboard', async ({ page }) => {
  await LoginPage.verifyLoginSuccess(page);
});

// -------------------------------------------------------------------
// TC02 — Nhiều tài khoản hợp lệ từ CSV: verify ngay sau mỗi lần login
// -------------------------------------------------------------------
Then('Tất cả tài khoản trong file CSV đăng nhập thành công', async ({ page }, dataTable: DataTable) => {
  const cfg = dataTable.hashes()[0];
  const columns = cfg.columns.split(',').map((c: string) => c.trim());
  const rows = readCsv(cfg.file, columns);

  for (const row of rows) {
    await LoginPage.openAndLogin(page, row.username, row.password);
    await LoginPage.verifyLoginSuccess(page);
  }
});

// -------------------------------------------------------------------
// TC03 — Nhiều tài khoản sai từ CSV: verify lỗi ngay sau mỗi lần login
// -------------------------------------------------------------------
Then('Tất cả tài khoản trong file CSV bị từ chối với lỗi tương ứng', async ({ page }, dataTable: DataTable) => {
  const cfg = dataTable.hashes()[0];
  const columns = cfg.columns.split(',').map((c: string) => c.trim());
  const rows = readCsv(cfg.file, columns);

  for (const row of rows) {
    await LoginPage.openAndLogin(page, row.username, row.password);
    await LoginPage.verifyLoginError(page, row.error_message);
  }
});

// TC05 — Outline: đăng nhập trực tiếp bằng username/password từ Examples
Given('User đăng nhập thử với username {string} và password {string}', async ({ page }, username: string, password: string) => {
  await LoginPage.openAndLogin(page, username, password);
});

Then('Hệ thống hiển thị thông báo lỗi {string}', async ({ page }, errorMessage: string) => {
  await LoginPage.verifyLoginError(page, errorMessage);
});

Then('Hệ thống hiển thị thông báo lỗi đăng nhập', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes();
  for (const row of data) {
    await LoginPage.verifyLoginError(page, row.message);
  }
});
