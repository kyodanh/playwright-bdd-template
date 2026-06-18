import { Page, expect } from '@playwright/test';
import { checkSuccessMessage, checkErrorMessage } from 'bdd-playwright-core';
import { getLocators } from '../../Locators/AppLocator';

const locators = getLocators();

// State chia sẻ giữa các Scenario trong cùng một Feature
const GLOBAL_CONSTANTS = {
  currentUser: '',
};

// --- Actions ---

async function openAndLogin(page: Page, url: string, username: string, password: string) {
  await page.goto(url);
  await page.waitForLoadState();
  await page.locator(locators.loginLocators.usernameInput).fill(username);
  await page.locator(locators.loginLocators.passwordInput).fill(password);
  await page.getByRole(locators.loginLocators.loginButton.role, {
    name: locators.loginLocators.loginButton.name,
  }).click();
  await page.waitForTimeout(2000);
  GLOBAL_CONSTANTS.currentUser = username;
}

// --- Verifications ---

async function verifyLoginSuccess(page: Page) {
  await expect(page.locator(locators.loginLocators.dashboardText)).toBeVisible({ timeout: 10000 });
  console.log(`✅ Đăng nhập thành công với user: ${GLOBAL_CONSTANTS.currentUser}`);
}

async function verifyLoginError(page: Page, message: string) {
  await checkErrorMessage(page, message);
}

// TODO: Thêm các hàm cho Page này bên dưới
// Quy ước đặt tên:
//   input*   — điền dữ liệu vào form field
//   press*   — click button
//   choose*  — chọn option / dropdown
//   goto*    — điều hướng trang
//   verify*  — assert / kiểm tra kết quả
//   is*      — trả về Promise<boolean>

export default { openAndLogin, verifyLoginSuccess, verifyLoginError, GLOBAL_CONSTANTS };
