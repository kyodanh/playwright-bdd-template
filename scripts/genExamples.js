// Đọc marker "Examples: # @csv:file.csv cols:col1,col2" trong feature files
// → tự động điền rows từ CSV vào Examples table
// Chạy: node scripts/genExamples.js

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../tests/data');
const FEATURES_DIR = path.resolve(__dirname, '../tests/features');

// Marker: Examples: # @csv:login/login_valid.csv cols:username,password
const CSV_MARKER = /^(\s*)Examples:\s*#\s*@csv:([^\s]+)(?:\s+cols:([^\s]+))?/;

function findFeatureFiles(dir) {
  const results = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...findFeatureFiles(full));
    else if (item.name.endsWith('.feature')) results.push(full);
  }
  return results;
}

function readCsv(relativePath, columns) {
  const fullPath = path.join(DATA_DIR, relativePath);
  const lines = fs.readFileSync(fullPath, 'utf-8').trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  const allHeaders = lines[0].split(',').map(h => h.trim());
  const headers = columns ? columns.filter(c => allHeaders.includes(c)) : allHeaders;

  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return headers.map(h => values[allHeaders.indexOf(h)] ?? '');
  });

  return { headers, rows };
}

function formatTable(headers, rows, indent) {
  const colWidths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map(r => (r[i] ?? '').length))
  );
  const formatRow = cells =>
    indent + '| ' + cells.map((c, i) => c.padEnd(colWidths[i])).join(' | ') + ' |';
  return [formatRow(headers), ...rows.map(r => formatRow(r))].join('\n');
}

function processFeatureFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
  const newLines = [];
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(CSV_MARKER);
    if (!match) { newLines.push(lines[i]); continue; }

    const [, indent, csvFile, colStr] = match;
    const columns = colStr ? colStr.split(',') : null;
    const { headers, rows } = readCsv(csvFile, columns);

    newLines.push(lines[i]); // giữ dòng Examples: # @csv:...
    i++;

    // bỏ qua rows cũ
    while (i < lines.length && lines[i].trim().startsWith('|')) i++;
    i--; // bù lại vòng for

    newLines.push(formatTable(headers, rows, indent + '  '));
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf-8');
    console.log(`  updated: ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log('Generating Examples from CSV...');
findFeatureFiles(FEATURES_DIR).forEach(processFeatureFile);
console.log('Done.');
