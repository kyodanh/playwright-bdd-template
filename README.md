# Playwright BDD Template

Framework kiểm thử tự động với **Playwright + BDD (Cucumber/Gherkin) + POM + TypeScript**.

---

## Quick Start

### Cách 1 — GitHub Template (khuyến nghị)

1. Nhấn **"Use this template"** → **"Create a new repository"** trên trang này
2. Clone repo vừa tạo về máy
3. Chạy setup:

```bash
npm run setup
```

### Cách 2 — degit (không cần GitHub account)

```bash
npx degit kyodanh/playwright-bdd-template ten-project-cua-ban
cd ten-project-cua-ban
npm run setup
```

> `npm run setup` tự động: cài dependencies, cài Playwright browsers (Chromium), tạo `.env.dev`.  
> Sau đó chỉ cần điền thông tin vào `.env.dev` rồi chạy `npm run bddgen && npm test`.

---

## Requirements

### Môi trường

| Công cụ | Phiên bản tối thiểu | Ghi chú |
|---|---|---|
| Node.js | 18 LTS trở lên | Kiểm tra: `node -v` |
| npm | 9 trở lên | Đi kèm Node.js |
| Microsoft Edge | bất kỳ | Chỉ cần khi chạy local với `BROWSER_CHANNEL=msedge` |

### VS Code Extensions (khuyến nghị)

| Extension | ID | Tác dụng |
|---|---|---|
| **Cucumber** | `cucumber.cucumber-vscode` | Highlight, autocomplete, Go-to-definition cho `.feature` |
| **Cucumber Full Support** | `alexkrechik.cucumberautocomplete` | Autocomplete step definitions khi gõ Gherkin |

> Cả hai extension đều đọc config từ `.vscode/settings.json` — đã được commit vào repo, không cần setup thêm.

### Workspace structure

`bdd-playwright-core` phải nằm **cùng cấp** với project (script setup tự clone):

```
MyProject/
├── bdd-playwright-core/     ← package dùng chung (setup tự clone)
├── playwright-bdd-template/ ← template gốc (repo này)
├── project-A/               ← dự án A (clone từ template)
└── project-B/               ← dự án B (clone từ template)
```

---

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ | TypeScript |
| Test Runner | Playwright ^1.51.0 |
| BDD Bridge | playwright-bdd ^9.1.0 |
| BDD Framework | @cucumber/cucumber ^11.2.0 |
| Core Utilities | bdd-playwright-core (local) |
| Browser (local) | Microsoft Edge |
| Browser (CI) | Chromium |
| CI/CD | GitHub Actions |

---

## Architecture — 5 Layers

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1 — Feature (Gherkin)                            │
│  tests/features/**/*.feature                            │
│  Viết bằng ngôn ngữ tự nhiên. BA/QA đọc được.          │
│  KHÔNG chứa credentials, URL, selector.                 │
└────────────────────────┬────────────────────────────────┘
                         │ gọi step text
┌────────────────────────▼────────────────────────────────┐
│  LAYER 2 — Step Definitions                             │
│  tests/steps/**/*.steps.ts                              │
│  Cầu nối Gherkin → Page Object.                        │
│  Không chứa logic UI, không chứa selector.              │
└────────────────────────┬────────────────────────────────┘
                         │ gọi hàm page object
┌────────────────────────▼────────────────────────────────┐
│  LAYER 2b — Locators                                    │
│  tests/Locators/AppLocator.ts                           │
│  Tập trung toàn bộ selector. Sửa UI → chỉ sửa ở đây.  │
└────────────────────────┬────────────────────────────────┘
                         │ getLocators()
┌────────────────────────▼────────────────────────────────┐
│  LAYER 3 — Page Objects (POM)                           │
│  tests/pages/**/*Page.ts                                │
│  Chứa toàn bộ logic tương tác với UI.                  │
│  Đọc locator từ AppLocator, đọc config từ Layer 4.      │
└────────────────────────┬────────────────────────────────┘
                         │ import
┌────────────────────────▼────────────────────────────────┐
│  LAYER 4 — Config                                       │
│  config/test-config.ts + .env.<env>                     │
│  Tách URL, credentials, browser channel ra khỏi code.  │
│  Đổi môi trường = đổi TEST_ENV, không sửa code.        │
└────────────────────────┬────────────────────────────────┘
                         │ import
┌────────────────────────▼────────────────────────────────┐
│  LAYER 5 — Core Utilities (bdd-playwright-core)         │
│  ../bdd-playwright-core/src/                            │
│  checkSuccessMessage, checkErrorMessage, createBaseConfig│
│  Dùng chung cho mọi project trong workspace.            │
└─────────────────────────────────────────────────────────┘
```

**Quy tắc phụ thuộc:** Layer trên chỉ gọi xuống layer dưới. Feature không bao giờ import trực tiếp Page Object.

---

## Cấu trúc dự án

```
playwright-bdd-template/
│
├── tests/
│   ├── features/               # Layer 1 — Gherkin scenarios
│   │   ├── 1.Login/
│   │   │   └── login.feature   # Example đầy đủ (chạy được)
│   │   └── 2.Dashboard/
│   │       └── dashboard.feature  # Skeleton — template cho module mới
│   │
│   ├── steps/                  # Layer 2 — Step definitions
│   │   ├── Login/login.steps.ts
│   │   └── Dashboard/dashboard.steps.ts  # Skeleton
│   │
│   ├── Locators/
│   │   └── AppLocator.ts       # Layer 2b — tất cả selector tập trung đây
│   │
│   ├── pages/                  # Layer 3 — Page Objects
│   │   ├── Login/LoginPage.ts  # Example đầy đủ + thư viện hàm mẫu (commented)
│   │   └── Dashboard/DashboardPage.ts  # Skeleton
│   │
│   └── data/
│       ├── csvHelper.ts        # Đọc CSV tại runtime (dùng trong steps)
│       └── login/
│           ├── login_valid.csv
│           └── login_invalid.csv
│
├── config/
│   └── test-config.ts          # Layer 4 — đọc .env, export config + getUser()
│
├── scripts/
│   ├── genExamples.js          # Tự động điền Examples table từ CSV
│   └── setup.sh                # Script setup môi trường cho người dùng mới
│
├── .github/workflows/
│   └── playwright.yml          # CI/CD GitHub Actions
│
├── .vscode/
│   └── settings.json           # Config Cucumber extension (commit vào repo)
│
├── .env.example                # Mẫu cấu hình (commit)
├── .env.dev                    # Cấu hình local dev (gitignore)
├── .env.staging                # Cấu hình staging (gitignore)
├── playwright.config.ts        # Playwright config (đọc từ config layer)
├── tsconfig.json
├── package.json
└── zip-report.js
```

---

## Core Files Reference

### `tests/Locators/AppLocator.ts` — Trung tâm selector

Tất cả CSS selector và ARIA locator đều khai báo tại đây. Page Object **không được** hardcode selector trực tiếp.

```typescript
export function getLocators() {
  return {
    loginLocators: {
      usernameInput: "input[name='username']",
      loginButton:   { role: 'button' as const, name: 'Đăng nhập' },
    },
    // Thêm module mới: dashboardLocators, productLocators, ...
  } as const;  // as const giữ literal type cho AriaRole
}
```

> **Khi UI thay đổi selector:** chỉ sửa ở đây — tất cả Page Object nhận ngay, không cần đụng vào test logic.

---

### `config/test-config.ts` — Config Layer

Đọc `.env.<TEST_ENV>` và export hai thứ:

**`config`** — cấu hình runtime:
```typescript
config.baseURL       // BASE_URL từ .env
config.loginPath     // LOGIN_PATH từ .env
config.browserChannel // BROWSER_CHANNEL từ .env ('' = Chromium, 'msedge' = Edge)
config.env           // tên môi trường hiện tại
```

**`getUser(key)`** — lấy credential theo tên logic:
```typescript
const user = getUser('admin');
// → đọc ACCOUNT_ADMIN_USERNAME + ACCOUNT_ADMIN_PASSWORD từ .env
// → throw rõ ràng nếu thiếu (không fail âm thầm)
```

Đổi môi trường chỉ cần:
```bash
TEST_ENV=staging npm test   # nạp .env.staging
TEST_ENV=dev npm test       # nạp .env.dev (mặc định)
```

---

### `tests/data/csvHelper.ts` — Đọc CSV tại runtime

Dùng trong step khi cần loop qua nhiều dòng dữ liệu **trong cùng một Scenario**:

```typescript
// Trong step definition
const rows = readCsv('login/login_valid.csv', ['username', 'password']);
for (const row of rows) {
  await LoginPage.openAndLogin(page, row.username, row.password);
}
```

Khác với `genExamples.js`: csvHelper đọc CSV **khi test chạy**, còn genExamples điền vào **trước khi chạy**.

---

### `scripts/genExamples.js` — Sinh Examples từ CSV

Đọc marker `# @csv:` trong feature file, tự điền bảng Examples từ CSV tương ứng.

```gherkin
Scenario Outline: Đăng nhập với <username>
  Given User đăng nhập thử với username "<username>" và password "<password>"

  Examples: # @csv:login/login_valid.csv cols:username,password
  (bảng dưới đây tự sinh — không sửa tay)
  | username | password    |
  | admin    | Admin@123   |
```

```bash
npm run gen:examples   # chỉ sinh Examples
npm run bddgen         # sinh Examples + sinh .spec.ts (chạy cái này trước khi test)
```

> **Khi nào dùng cái nào?**  
> `csvHelper` → loop nhiều dữ liệu trong 1 Scenario (không sinh thêm test case mới)  
> `genExamples` → mỗi row CSV = 1 Scenario riêng biệt trong Outline (Playwright chạy song song được)

---

## Workflow — Thêm module mới

### Bước 1 — Thêm locators

Mở `tests/Locators/AppLocator.ts`, thêm nhóm locator mới:

```typescript
productLocators: {
  searchInput:   "input[placeholder='Tìm sản phẩm']",
  addButton:     { role: 'button' as const, name: 'Thêm' },
  successToast:  ".toast-success",
},
```

### Bước 2 — Tạo Page Object

Tạo `tests/pages/Product/ProductPage.ts`. Tham khảo `LoginPage.ts` để biết các hàm mẫu (input*, press*, choose*, goto*, verify*, is*).

```typescript
import { Page } from '@playwright/test';
import { checkSuccessMessage } from 'bdd-playwright-core';
import { getLocators } from '../../Locators/AppLocator';

const locators = getLocators();

async function addProduct(page: Page, name: string) {
  const input = page.locator(locators.productLocators.searchInput);
  await input.waitFor({ state: 'visible' });
  await input.fill(name);
  await page.getByRole(locators.productLocators.addButton.role, {
    name: locators.productLocators.addButton.name,
  }).click();
  await page.waitForLoadState('networkidle');
}

async function verifyAdded(page: Page) {
  await checkSuccessMessage(page, 'Thêm thành công');
}

export default { addProduct, verifyAdded };
```

### Bước 3 — Tạo Step Definitions

Tạo `tests/steps/Product/product.steps.ts`:

```typescript
import { createBdd } from 'playwright-bdd';
import ProductPage from '../../pages/Product/ProductPage';

const { When, Then } = createBdd();

When('User thêm sản phẩm {string}', async ({ page }, name: string) => {
  await ProductPage.addProduct(page, name);
});

Then('Hệ thống xác nhận thêm thành công', async ({ page }) => {
  await ProductPage.verifyAdded(page);
});
```

### Bước 4 — Viết Feature file

Tạo `tests/features/3.Product/product.feature`. Copy skeleton từ `2.Dashboard/dashboard.feature`:

```gherkin
Feature: Quản lý sản phẩm

  @product @smoke
  Scenario: Thêm sản phẩm mới thành công
    Given User đăng nhập với tài khoản "admin"
    When User thêm sản phẩm "Laptop Dell"
    Then Hệ thống xác nhận thêm thành công
```

### Bước 5 — Sinh spec và chạy

```bash
npm run bddgen   # sinh .features-gen/*.spec.ts
npm run tag -- @product   # chạy riêng module vừa tạo
```

---

## Naming Conventions

### Hàm trong Page Object

| Prefix | Ý nghĩa | Ví dụ |
|---|---|---|
| `input*` | Điền dữ liệu vào form | `inputUsername`, `inputFile` |
| `press*` | Click button / submit | `pressLogin`, `pressDelete` |
| `choose*` | Chọn option / dropdown | `chooseRole`, `chooseCheckbox` |
| `goto*` | Điều hướng trang | `gotoProductList`, `gotoBack` |
| `verify*` | Assert / kiểm tra (throw nếu fail) | `verifyLoginSuccess`, `verifyToast` |
| `is*` | Trả về `Promise<boolean>` (không throw) | `isVisible`, `isDisabled` |

> Tham khảo toàn bộ hàm mẫu trong `tests/pages/Login/LoginPage.ts` (phần commented ở cuối file).

### Tên file

```
tests/features/<số>.<TênModule>/<tênModule>.feature
tests/steps/<TênModule>/<tênModule>.steps.ts
tests/pages/<TênModule>/<TênModule>Page.ts
tests/data/<tênModule>/<tênModule>_<loại>.csv
```

---

## Chiến lược Wait

**Không dùng `waitForTimeout`** — sleep cứng gây flaky test.

| Tình huống | Dùng |
|---|---|
| Sau `page.goto()` | `waitForLoadState('domcontentloaded')` |
| Sau click / submit gọi API | `waitForLoadState('networkidle')` |
| Chờ element cụ thể xuất hiện | `element.waitFor({ state: 'visible' })` |
| Chờ redirect | `page.waitForURL('/path')` |
| Chờ response API | `page.waitForResponse(url => url.includes('/api/'))` |

```typescript
// ❌ Tránh
await page.waitForTimeout(2000);

// ✅ Dùng
await page.waitForLoadState('networkidle');
await submitButton.waitFor({ state: 'visible' });
await page.waitForURL('/dashboard');
```

---

## Quản lý Test Data (CSV)

### Cấu trúc thư mục

```
tests/data/
├── csvHelper.ts             # utility đọc CSV
├── login/
│   ├── login_valid.csv      # tài khoản hợp lệ
│   └── login_invalid.csv    # tài khoản sai + error message mong đợi
└── <module>/
    └── <module>_data.csv
```

### Format CSV

```csv
username,password
admin,Admin@123
manager,Manager@123
```

- Dòng đầu: tên cột (header)
- Không có khoảng trắng thừa
- Không có dòng trống ở cuối
- Không dùng dấu phẩy trong giá trị (chưa hỗ trợ quoted CSV)

### Hai cách dùng CSV

**Cách 1 — Runtime loop** (`csvHelper`): Một Scenario, nhiều lần thực thi, kết quả gộp chung.

```gherkin
Scenario: Đăng nhập nhiều tài khoản từ CSV
  Then Tất cả tài khoản trong file CSV đăng nhập thành công
    | file                  | columns           |
    | login/login_valid.csv | username,password |
```

**Cách 2 — Outline + genExamples**: Mỗi row = 1 Scenario độc lập, Playwright chạy song song được.

```gherkin
Scenario Outline: Đăng nhập với <username>
  Given User đăng nhập thử với username "<username>" và password "<password>"
  Examples: # @csv:login/login_valid.csv cols:username,password
  | username | password |   ← tự sinh sau khi chạy npm run gen:examples
```

---

## CI/CD — GitHub Actions

File: `.github/workflows/playwright.yml`

**Trigger:** push hoặc PR vào nhánh `main`.

**Pipeline:**
1. Checkout code
2. Setup Node.js LTS
3. `npm ci`
4. Cài Chromium (không dùng Edge — Linux runner không có sẵn)
5. `npm run bddgen` — sinh spec từ feature
6. `npm run testless` — chạy headless
7. Upload report lên GitHub Artifacts (giữ 30 ngày)

**Inject secrets/variables:**

| Tên | Loại | Mô tả |
|---|---|---|
| `BASE_URL` | Variable | URL ứng dụng |
| `LOGIN_PATH` | Variable | Đường dẫn login |
| `ACCOUNT_ADMIN_USERNAME` | Secret | Tài khoản test |
| `ACCOUNT_ADMIN_PASSWORD` | Secret | Mật khẩu test |

> Nếu chưa cấu hình, CI dùng giá trị fallback từ `qassit.pages.dev` để chạy được ngay.  
> Cài trong GitHub: **Settings → Secrets and variables → Actions**.

---

## npm Scripts

| Lệnh | Tác dụng |
|---|---|
| `npm run setup` | Setup môi trường lần đầu (clone core, install, tạo .env.dev) |
| `npm run bddgen` | Sinh Examples từ CSV + sinh `.spec.ts` từ `.feature` |
| `npm run gen:examples` | Chỉ sinh Examples từ CSV (không sinh spec) |
| `npm run test` | Chạy có giao diện (headed) |
| `npm run testless` | Chạy headless |
| `npm run tag -- @tagname` | Chạy theo tag |
| `npm run zip` | Nén report thành `.zip` |

---

## Core Utilities (`bdd-playwright-core`)

```typescript
import {
  checkSuccessMessage,  // assert success toast/message xuất hiện trên trang
  checkErrorMessage,    // assert error toast/message xuất hiện trên trang
  createBaseConfig,     // tạo Playwright config với defaults BDD
} from 'bdd-playwright-core';
```

**`checkSuccessMessage` / `checkErrorMessage`**

```typescript
await checkSuccessMessage(page, 'Lưu thành công');
await checkErrorMessage(page, 'Tên đăng nhập hoặc mật khẩu không đúng');

// Nâng cao — chỉ định selector + timeout
await checkErrorMessage(page, 'Lỗi hệ thống', {
  selector: '.alert-danger',
  timeout: 5000,
});
```

**`createBaseConfig`** — dùng trong `playwright.config.ts`

```typescript
module.exports = createBaseConfig({
  use: { baseURL: config.baseURL },
  projects: [{ name: 'chromium' }],
});
// Defaults: testDir: '.features-gen', timeout: 60000, workers: 1, headless: false
```

> Thêm utility mới: sửa `../bdd-playwright-core/src/` → chạy `npm run build` trong thư mục đó.  
> Tất cả project dùng `file:` link nhận ngay — không cần `npm install` lại.

---

## Cập nhật workspace

### Thêm dự án mới

```bash
# Clone template
npx degit kyodanh/playwright-bdd-template project-moi
cd project-moi
npm run setup

# Đổi tên project trong package.json
# Điền .env.dev
# Bắt đầu viết test!
```

### Cập nhật bdd-playwright-core

```bash
cd ../bdd-playwright-core
# Thêm / sửa hàm trong src/
npm run build
# Tất cả project nhận ngay qua symlink
```
