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
│   ├── features/               # LAYER 1 — Kịch bản Gherkin (.feature)
│   │   └── 1.Login/            # Nhóm theo module
│   │
│   ├── steps/                  # LAYER 2 — Step Definitions
│   │   └── Login/
│   │
│   ├── pages/                  # LAYER 3 — Page Objects
│   │   └── Login/
│   │
│   └── Locators/               # LAYER 4 — Locators tập trung
│       └── AppLocator.ts
│
├── .features-gen/              # Auto-generated bởi bddgen — KHÔNG sửa tay
├── file_upload/                # File đính kèm dùng trong test
├── docs/                       # Tài liệu dự án
├── .github/workflows/          # CI/CD GitHub Actions
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

### 3. Cấu hình URL & credentials
Mở file `tests/features/` → thay `https://your-app.com/login` và thông tin đăng nhập trong `Examples`.

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
  await page.locator(locators.exampleLocators.searchInput).fill(val1);
  GLOBAL_CONSTANTS.sharedValue = val1;
}

async function verifyResult(page: Page, message: string) {
  await checkSuccessMessage(page, message);
}

export default { doSomething, verifyResult, GLOBAL_CONSTANTS };
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
