'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { build } = require('../scripts/build-extension.js');

const ROOT = path.join(__dirname, '..');
const outDir = build(fs.mkdtempSync(path.join(os.tmpdir(), 'pwgen-ext-')));
const readOut = (file) => fs.readFileSync(path.join(outDir, file), 'utf8');

test('extension manifest: MV3, version from package.json, no permissions', () => {
  const manifest = JSON.parse(readOut('manifest.json'));
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.host_permissions, undefined);
  for (const icon of [...Object.values(manifest.icons), manifest.action.default_popup]) {
    assert.ok(fs.existsSync(path.join(outDir, icon)), `missing ${icon}`);
  }
});

test('extension popup: contains every element used by app.js', () => {
  const popup = readOut('popup.html');
  const appJs = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8');
  const ids = [...appJs.matchAll(/\$\('([^']+)'\)|'(opt-[a-z-]+)'/g)].map((m) => m[1] || m[2]);
  assert.ok(ids.length > 10);
  for (const id of ids) {
    assert.ok(popup.includes(`id="${id}"`), `popup.html has no #${id}`);
  }
  assert.doesNotMatch(popup, /<!-- CARD/);
});

test('extension popup: every local script and stylesheet is bundled', () => {
  const popup = readOut('popup.html');
  const refs = [...popup.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 4);
  for (const ref of refs) {
    assert.ok(fs.existsSync(path.join(outDir, ref)), `missing ${ref}`);
  }
});
