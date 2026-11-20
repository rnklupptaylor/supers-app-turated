// Basic checks: the script parses, the footer shows the package version,
// and the page loads nothing from other sites.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { version } = require('../package.json');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
let failures = 0;
function check(ok, message) {
  console.log((ok ? 'ok   ' : 'FAIL ') + message);
  if (!ok) failures++;
}

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
check(scripts.length > 0, 'page has an inline script');
scripts.forEach((code, i) => {
  try { new vm.Script(code); check(true, 'script ' + (i + 1) + ' parses'); }
  catch (e) { check(false, 'script ' + (i + 1) + ' parses: ' + e.message); }
});

const shortVersion = 'v' + version.split('.').slice(0, 2).join('.');
const shown = [...html.matchAll(/SupersAPPturated (v\d+\.\d+)/g)].map((m) => m[1]);
check(shown.length > 0 && shown.every((v) => v === shortVersion),
  'every version label is ' + shortVersion + ' (found ' + [...new Set(shown)].join(', ') + ')');

const external = html.match(/<(script|link|img|iframe)[^>]*(src|href)=["']https?:/gi) || [];
check(external.length === 0, 'no resources loaded from other sites');

if (failures) { console.error(failures + ' check(s) failed'); process.exit(1); }
console.log('All checks passed');
