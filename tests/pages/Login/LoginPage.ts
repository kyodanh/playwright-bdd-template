import { Page, expect, Response } from '@playwright/test';
import { checkSuccessMessage, checkErrorMessage } from 'bdd-playwright-core';
import { getLocators } from '../../Locators/AppLocator';
import { config } from '../../../config/test-config';

const locators = getLocators();

// State chia sẻ giữa các Scenario trong cùng một Feature
const GLOBAL_CONSTANTS = {
  currentUser: '',
};

// --- Actions ---

// url lấy từ Config Layer (baseURL + loginPath) — không truyền từ feature.
async function openAndLogin(page: Page, username: string, password: string) {
  await page.context().clearCookies();
  await page.goto(config.loginPath);
  await page.waitForLoadState('domcontentloaded');

  const usernameInput = page.locator(locators.loginLocators.usernameInput);
  const passwordInput = page.locator(locators.loginLocators.passwordInput);
  const loginButton = page.getByRole(locators.loginLocators.loginButton.role, {
    name: locators.loginLocators.loginButton.name,
  });

  await usernameInput.waitFor({ state: 'visible' });
  await usernameInput.fill(username);
  await passwordInput.fill(password);
  await loginButton.click();

  await page.waitForLoadState('networkidle');
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

// // =============================================================================
// // VÍ DỤ MẪU — copy & chỉnh selector/logic cho từng trang mới
// // Quy ước đặt tên:
// //   input*   — điền dữ liệu vào form field
// //   press*   — click button / submit
// //   choose*  — chọn option / dropdown / radio / checkbox
// //   goto*    — điều hướng trang
// //   verify*  — assert / kiểm tra kết quả
// //   is*      — trả về Promise<boolean> (không throw)
// // =============================================================================

// // --- input* ví dụ ---

// /** Điền text vào một input bất kỳ */
// async function inputText(page: Page, selector: string, value: string) {
//   const el = page.locator(selector);
//   await el.waitFor({ state: 'visible' });
//   await el.clear();
//   await el.fill(value);
// }

// /** Upload file */
// async function inputFile(page: Page, selector: string, filePath: string) {
//   await page.locator(selector).setInputFiles(filePath);
// }

// // --- press* ví dụ ---

// /** Click button theo role + name */
// async function pressButton(page: Page, name: string) {
//   await page.getByRole('button', { name }).click();
// }

// /** Click element theo selector, chờ visible trước */
// async function pressElement(page: Page, selector: string) {
//   const el = page.locator(selector);
//   await el.waitFor({ state: 'visible' });
//   await el.click();
// }

// /** Click và chờ navigation hoàn tất */
// async function pressAndWaitNavigation(page: Page, selector: string) {
//   await Promise.all([
//     page.waitForLoadState('networkidle'),
//     page.locator(selector).click(),
//   ]);
// }

// // --- choose* ví dụ ---

// /** Chọn option trong <select> bằng label hiển thị */
// async function chooseSelectByLabel(page: Page, selector: string, label: string) {
//   await page.locator(selector).selectOption({ label });
// }

// /** Chọn option trong <select> bằng value */
// async function chooseSelectByValue(page: Page, selector: string, value: string) {
//   await page.locator(selector).selectOption({ value });
// }

// /** Tick checkbox nếu chưa được check */
// async function chooseCheckbox(page: Page, selector: string, checked: boolean) {
//   const el = page.locator(selector);
//   if ((await el.isChecked()) !== checked) {
//     await el.click();
//   }
// }

// /** Chọn radio button theo label text */
// async function chooseRadio(page: Page, labelText: string) {
//   await page.getByLabel(labelText).check();
// }

// /** Chọn item trong dropdown tùy chỉnh (không phải <select>): click mở → click item */
// async function chooseDropdownItem(page: Page, triggerSelector: string, itemText: string) {
//   await page.locator(triggerSelector).click();
//   await page.getByRole('option', { name: itemText }).click();
// }

// // --- goto* ví dụ ---

// /** Điều hướng tới URL tuyệt đối */
// async function gotoUrl(page: Page, url: string) {
//   await page.goto(url);
//   await page.waitForLoadState('domcontentloaded');
// }

// /** Điều hướng tới URL tương đối (truyền baseUrl vào tham số) */
// async function gotoPath(page: Page, baseUrl: string, path: string) {
//   await page.goto(`${baseUrl}${path}`);
//   await page.waitForLoadState('domcontentloaded');
// }

// /** Nhấn nút Back của browser */
// async function gotoBack(page: Page) {
//   await page.goBack();
//   await page.waitForLoadState('domcontentloaded');
// }

// // --- verify* ví dụ ---

// /** Kiểm tra element hiển thị */
// async function verifyVisible(page: Page, selector: string) {
//   await expect(page.locator(selector)).toBeVisible();
// }

// /** Kiểm tra element ẩn / không còn trên DOM */
// async function verifyHidden(page: Page, selector: string) {
//   await expect(page.locator(selector)).toBeHidden();
// }

// /** Kiểm tra text xuất hiện trên trang */
// async function verifyTextVisible(page: Page, text: string) {
//   await expect(page.getByText(text)).toBeVisible();
// }

// /** Kiểm tra URL hiện tại khớp (substring) */
// async function verifyUrl(page: Page, urlPart: string) {
//   await expect(page).toHaveURL(new RegExp(urlPart));
// }

// /** Kiểm tra giá trị của input field */
// async function verifyInputValue(page: Page, selector: string, expected: string) {
//   await expect(page.locator(selector)).toHaveValue(expected);
// }

// /** Kiểm tra số lượng row trong table */
// async function verifyTableRowCount(page: Page, tableSelector: string, expectedCount: number) {
//   const rows = page.locator(`${tableSelector} tbody tr`);
//   await expect(rows).toHaveCount(expectedCount);
// }

// /** Kiểm tra toast / snackbar thành công rồi tự biến mất */
// async function verifyToast(page: Page, message: string) {
//   const toast = page.getByText(message);
//   await expect(toast).toBeVisible({ timeout: 5000 });
//   await expect(toast).toBeHidden({ timeout: 10000 });
// }

// /** Kiểm tra response API sau hành động (intercept) */
// async function verifyApiResponse(
//   page: Page,
//   urlPattern: string,
//   action: () => Promise<void>,
//   expectedStatus = 200,
// ) {
//   const [response] = await Promise.all([
//     page.waitForResponse((r: Response) => r.url().includes(urlPattern)),
//     action(),
//   ]);
//   expect(response.status()).toBe(expectedStatus);
// }

// // --- is* ví dụ ---

// /** Trả về true nếu element đang hiển thị */
// async function isVisible(page: Page, selector: string): Promise<boolean> {
//   return page.locator(selector).isVisible();
// }

// /** Trả về true nếu button đang bị disabled */
// async function isDisabled(page: Page, selector: string): Promise<boolean> {
//   return page.locator(selector).isDisabled();
// }

// /** Trả về true nếu checkbox đang được check */
// async function isChecked(page: Page, selector: string): Promise<boolean> {
//   return page.locator(selector).isChecked();
// }

export default {
  // Core
  openAndLogin,
  verifyLoginSuccess,
  verifyLoginError,
  GLOBAL_CONSTANTS,
  // // input*
  // inputText,
  // inputFile,
  // // press*
  // pressButton,
  // pressElement,
  // pressAndWaitNavigation,
  // // choose*
  // chooseSelectByLabel,
  // chooseSelectByValue,
  // chooseCheckbox,
  // chooseRadio,
  // chooseDropdownItem,
  // // goto*
  // gotoUrl,
  // gotoPath,
  // gotoBack,
  // // verify*
  // verifyVisible,
  // verifyHidden,
  // verifyTextVisible,
  // verifyUrl,
  // verifyInputValue,
  // verifyTableRowCount,
  // verifyToast,
  // verifyApiResponse,
  // // is*
  // isVisible,
  // isDisabled,
  // isChecked,
};
