#!/bin/bash
set -e

CORE_DIR="$(dirname "$0")/../../bdd-playwright-core"
CORE_REPO="https://github.com/kyodanh/bdd-playwright-core.git"

echo "=== Playwright BDD Template Setup ==="

# Clone bdd-playwright-core nếu chưa có
if [ ! -d "$CORE_DIR" ]; then
  echo "Cloning bdd-playwright-core..."
  git clone "$CORE_REPO" "$CORE_DIR"
else
  echo "bdd-playwright-core already exists, skipping clone."
fi

# Cài dependencies
echo "Installing npm dependencies..."
npm install

# Cài Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install

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
