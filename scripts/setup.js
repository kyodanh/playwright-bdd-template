const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });
const root = path.resolve(__dirname, '..');

console.log('=== Playwright BDD Template Setup ===');

console.log('\nInstalling npm dependencies...');
run('npm install');

console.log('\nInstalling Playwright browsers...');
run('npx playwright install --with-deps chromium');

const envDev = path.join(root, '.env.dev');
const envExample = path.join(root, '.env.example');
if (!fs.existsSync(envDev)) {
  fs.copyFileSync(envExample, envDev);
  console.log('\nCreated .env.dev — edit it with your BASE_URL and credentials before running tests.');
} else {
  console.log('\n.env.dev already exists, skipping.');
}

console.log('\n=== Setup complete! ===');
console.log('Next steps:');
console.log('  1. Edit .env.dev with your app URL and test credentials');
console.log('  2. npm run bddgen');
console.log('  3. npm test');
