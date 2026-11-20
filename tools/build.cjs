// Copies the app unchanged into build/deploy, which wrangler.jsonc serves.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src');
const destination = path.join(root, 'build', 'deploy');

fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });
for (const file of fs.readdirSync(source)) {
  fs.copyFileSync(path.join(source, file), path.join(destination, file));
}
console.log('Built ' + path.relative(root, destination));
