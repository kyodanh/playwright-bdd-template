#!/bin/bash
set -e

echo "=== Playwright BDD Template Setup ==="

# Cài dependencies
echo "Installing npm dependencies..."
npm install

# Cài Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install --with-deps chromium

# Tạo .env.dev từ .env.example nếu chưa có
if [ ! -f ".env.dev" ]; then
  cp .env.example .env.dev
  echo ""
  echo "Created .env.dev — edit it with your BASE_URL and credentials before running tests."
else
  echo ".env.dev already exists, skipping."
fi

echo ""
echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Edit .env.dev with your app URL and test credentials"
echo "  2. npm run bddgen"
echo "  3. npm test"
