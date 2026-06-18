# Playwright BDD Template

> **GitHub Template** — Nhấn **"Use this template"** để tạo dự án automation mới từ template này.

Framework kiểm thử tự động với **Playwright + BDD (Cucumber/Gherkin) + POM + TypeScript**.  
Core utilities được cung cấp sẵn qua package `bdd-playwright-core`.

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | TypeScript |
| Test Runner | Playwright ^1.51.0 |
| BDD Bridge | playwright-bdd ^8.2.0 |
| BDD Framework | @cucumber/cucumber ^11.2.0 |
| Core Utilities | bdd-playwright-core (local) |
| Browser | Microsoft Edge (msedge) |
| CI/CD | GitHub Actions |

---

## Cấu trúc dự án

```
playwright-bdd-template/
│
├── tests/
│   ├── features/               # LAYER 1 — Test case (Gherkin .feature, dễ đọc)
│   │   └── 1.Login/            # Nhóm theo module
│   │
│   ├── steps/                  # cầu nối Gherkin → Page Object
│   │   └── Login/
│   │
│   ├── pages/                  # LAYER 2 — POM (Page Objects)
│   │   └── Login/
│   │   └── ../Locators/AppLocator.ts   # locators tập trung (thuộc POM)
│   │
│                               # LAYER 3 — Utility: import từ package bdd-playwright-core
│
├── config/                     # LAYER 4 — Config (env + credentials tách khỏi code)
│   └── test-config.ts
├── .env.example                #   mẫu cấu hình (commit)
├── .env.dev / .env.staging     #   cấu hình theo môi trường (gitignore)
│
├── playwright-report/          # LAYER 5 — Report (html/json/xlsx + email)
│
├── .features-gen/              # Auto-generated bởi bddgen — KHÔNG sửa tay
├── file_upload/                # File đính kèm dùng trong test
├── .github/workflows/          # CI/CD GitHub Actions (Chromium)
├── playwright.config.ts
├── tsconfig.json
└── zip-report.js
```

---

## Bắt đầu dự án mới từ template

### 1. Tạo repo từ template
Nhấn **"Use this template"** trên GitHub → đặt tên repo mới → clone về.

### 2. Cài dependencies
```bash
npm install
npx playwright install
```

### 3. Cấu hình môi trường & credentials (Config Layer)
URL và tài khoản **không nằm trong feature file** — chúng được tách ra Config Layer (`.env.<env>` + `config/test-config.ts`).

```bash
# Copy file mẫu rồi điền giá trị thật (file .env.* đã được .gitignore)
cp .env.example .env.dev
```

```dotenv
# .env.dev
BASE_URL=https://your-app.com
LOGIN_PATH=/login
BROWSER_CHANNEL=msedge          # local dùng Edge; để trống = Chromium (cho CI)
ACCOUNT_ADMIN_USERNAME=admin@gmail.com
ACCOUNT_ADMIN_PASSWORD=Admin@123
```

Đổi môi trường chỉ cần đổi biến `TEST_ENV` — **không sửa code, không sửa .feature**:

```bash
TEST_ENV=dev      npm test     # nạp .env.dev (mặc định)
TEST_ENV=staging  npm test     # nạp .env.staging
```

Trong feature file chỉ tham chiếu **tên tài khoản logic**, credentials do Config Layer cấp:

```gherkin
Given User đăng nhập với tài khoản "admin"   # -> ACCOUNT_ADMIN_* trong .env
```

### 4. Thêm module mới
```
tests/features/2.TenModule/tenmodule.feature   ← viết Gherkin
tests/steps/TenModule/tenmodule.steps.ts       ← viết step definitions
tests/pages/TenModule/TenModulePage.ts         ← viết page object
tests/Locators/AppLocator.ts                   ← thêm locators
```

### 5. Sinh spec và chạy test
```bash
# Sinh file .spec.js từ .feature (chạy sau mỗi lần thêm/sửa .feature)
npm run bddgen

# Chạy có giao diện (headed)
npm run test

# Chạy headless
npm run testless

# Chạy theo tag
npm run tag -- @login

# Chạy và nén report
npm run zip
```

---

## Viết test theo pattern chuẩn

### Feature file
```gherkin
@tag @smoke
Scenario Outline: Tên kịch bản
  Given Bước chuẩn bị
    | col1   | col2   |
    | <col1> | <col2> |
  When Bước thực hiện
  Then Bước kiểm tra kết quả

  Examples:
    | col1 | col2  |
    | val1 | val2  |
```

### Step Definition
```typescript
import { DataTable } from '@cucumber/cucumber';
import { createBdd } from 'playwright-bdd';
import MyPage from '../../pages/MyModule/MyPage';

const { Given, When, Then } = createBdd();

Given('Bước chuẩn bị', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes();
  for (const row of data) {
    await MyPage.doSomething(page, row.col1, row.col2);
  }
});
```

### Page Object
```typescript
import { Page } from '@playwright/test';
import { checkSuccessMessage } from 'bdd-playwright-core';
import { getLocators } from '../../Locators/AppLocator';

const locators = getLocators();
const GLOBAL_CONSTANTS = { sharedValue: '' };

async function doSomething(page: Page, val1: string, val2: string) {
  // Dùng biến trung gian — không gọi locator trực tiếp 2 lần
  const searchInput = page.locator(locators.exampleLocators.searchInput);

  // Chờ element sẵn sàng trước khi tương tác
  await searchInput.waitFor({ state: 'visible' });

  // Kiểm tra trạng thái trước khi fill/click
  if (!(await searchInput.isDisabled())) {
    await searchInput.fill(val1);
  }

  GLOBAL_CONSTANTS.sharedValue = val1;
}

async function verifyResult(page: Page, message: string) {
  await checkSuccessMessage(page, message);
}

export default { doSomething, verifyResult, GLOBAL_CONSTANTS };
```

### Chiến lược Wait — Tránh `waitForTimeout`

| Phương thức | Khi nào dùng |
|---|---|
| `waitForLoadState('domcontentloaded')` | Sau `page.goto()` — DOM xong, chưa cần asset |
| `waitForLoadState('networkidle')` | Sau click/submit — chờ API response hoàn tất |
| `element.waitFor({ state: 'visible' })` | Chờ một element cụ thể xuất hiện |
| `page.waitForURL('/path')` | Chờ redirect đến URL đích |
| `waitForTimeout(ms)` | **Tránh dùng** — sleep cứng, dễ gây flaky test |

```typescript
// ❌ Tránh — sleep cứng không đảm bảo
await page.waitForTimeout(2000);

// ✅ Dùng — chờ đúng điều kiện thực tế
await page.waitForLoadState('networkidle');
await submitButton.waitFor({ state: 'visible' });
await page.waitForURL('/dashboard');
```

### Kiểm tra trạng thái element trước khi tương tác

```typescript
const input = page.locator("input[name='username']");

// Chờ visible
await input.waitFor({ state: 'visible' });

// Chỉ fill/click nếu không bị disabled
if (!(await input.isDisabled())) {
  await input.fill(value);
}

// Chỉ click nếu button enabled và visible
const btn = page.getByRole('button', { name: 'Lưu' });
if (await btn.isVisible() && !(await btn.isDisabled())) {
  await btn.click();
}
```

---

## Utilities từ bdd-playwright-core

```typescript
import {
  checkErrorMessage,       // kiểm tra thông báo lỗi trên trang
  checkSuccessMessage,     // kiểm tra thông báo thành công
  checkErrorMessage_maxlenght,
  generateRandomString,    // sinh chuỗi ngẫu nhiên
  getRandomCode,           // sinh mã ngẫu nhiên: getRandomCode('HD', 0, 99999) → 'HD_12345'
  diseases,                // danh sách bệnh ICD-10
} from 'bdd-playwright-core';
```

---

## CI/CD

GitHub Actions tự động chạy khi push/PR lên `main`:
1. Checkout code
2. Setup Node.js LTS
3. `npm ci`
4. `npx playwright install --with-deps`
5. `npm run bddgen`
6. `npm run testless`
7. Upload report lên GitHub Artifacts (giữ 30 ngày)
