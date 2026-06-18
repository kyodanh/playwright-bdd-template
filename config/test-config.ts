// =============================================================================
// LAYER 4 — CONFIG LAYER
// Tách toàn bộ cấu hình môi trường + credentials ra khỏi code & feature file.
// Đổi môi trường = đổi biến TEST_ENV, KHÔNG cần sửa code hay .feature.
//
//   TEST_ENV=dev      npm test     → nạp .env.dev
//   TEST_ENV=staging  npm test     → nạp .env.staging
//   (mặc định: dev)
// =============================================================================
import * as dotenv from 'dotenv';
import * as path from 'path';

const TEST_ENV = process.env.TEST_ENV || 'dev';

// Nạp .env.<env> trước (ưu tiên cao), rồi .env làm fallback chung.
// dotenv KHÔNG ghi đè biến đã tồn tại trong process.env (vd: biến do CI inject).
dotenv.config({ path: path.resolve(__dirname, `../.env.${TEST_ENV}`) });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export interface UserCredential {
  username: string;
  password: string;
}

export const config = {
  /** Môi trường đang chạy (dev | staging | ci | ...) */
  env: TEST_ENV,
  /** Base URL của ứng dụng — gắn vào Playwright use.baseURL */
  baseURL: process.env.BASE_URL ?? '',
  /** Đường dẫn trang đăng nhập (tương đối so với baseURL) */
  loginPath: process.env.LOGIN_PATH ?? '/',
  /**
   * Channel trình duyệt:
   *   '' (rỗng) → Chromium bundled — KHUYẾN NGHỊ cho CI (luôn có sẵn)
   *   'msedge'  → Microsoft Edge (máy local)
   *   'chrome'  → Google Chrome
   */
  browserChannel: process.env.BROWSER_CHANNEL ?? '',
} as const;

/**
 * Lấy credential theo tên tài khoản logic (vd: "admin").
 * Đọc từ biến môi trường: ACCOUNT_<TÊN>_USERNAME / ACCOUNT_<TÊN>_PASSWORD.
 * Feature file chỉ tham chiếu tên "admin" — không bao giờ chứa user/password thật.
 */
export function getUser(key: string): UserCredential {
  const upper = key.trim().toUpperCase();
  const username = process.env[`ACCOUNT_${upper}_USERNAME`];
  const password = process.env[`ACCOUNT_${upper}_PASSWORD`];

  if (!username || !password) {
    throw new Error(
      `[config] Thiếu credential cho tài khoản "${key}". ` +
        `Hãy khai báo ACCOUNT_${upper}_USERNAME và ACCOUNT_${upper}_PASSWORD ` +
        `trong file .env.${config.env} (xem mẫu tại .env.example).`
    );
  }
  return { username, password };
}
