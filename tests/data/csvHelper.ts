import * as fs from 'fs';
import * as path from 'path';

type CsvRow = Record<string, string>;

/**
 * Đọc file CSV và trả về mảng object với key là tên cột.
 * @param relativePath - đường dẫn tương đối từ thư mục tests/data/
 * @param columns - (tuỳ chọn) chỉ lấy các cột này, bỏ qua cột khác
 */
export function readCsv(relativePath: string, columns?: string[]): CsvRow[] {
  const fullPath = path.resolve(__dirname, relativePath);
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const row: CsvRow = {};
    headers.forEach((header, i) => {
      if (!columns || columns.includes(header)) {
        row[header] = values[i] ?? '';
      }
    });
    return row;
  });
}
