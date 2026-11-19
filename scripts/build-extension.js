/**
 * Builds the Chrome extension into dist/extension/.
 *
 * The popup reuses the site's code so both always behave the same:
 * - generator card markup taken from index.html,
 * - assets/js/generator.js, assets/js/app.js and assets/css/style.css copied as is,
 * - version taken from package.json.
 *
 * Usage: npm run build:extension
 *
 * @license MIT
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const SHARED_FILES = ['assets/js/generator.js', 'assets/js/app.js', 'assets/css/style.css'];
const CARD_PLACEHOLDER = /<!-- CARD:[^>]*-->/;

const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

function build(outDir = path.join(ROOT, 'dist', 'extension')) {
  fs.rmSync(outDir, { recursive: true, force: true });

  const write = (file, content) => {
    const dest = path.join(outDir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
  };
  const copy = (from, to = from) => write(to, fs.readFileSync(path.join(ROOT, from)));

  SHARED_FILES.forEach((file) => copy(file));
  copy('extension/popup.css', 'popup.css');
  for (const icon of fs.readdirSync(path.join(ROOT, 'extension', 'icons'))) {
    copy(`extension/icons/${icon}`, `icons/${icon}`);
  }

  const manifest = JSON.parse(read('extension/manifest.json'));
  manifest.version = JSON.parse(read('package.json')).version;
  write('manifest.json', `${JSON.stringify(manifest, null, 2)}\n`);

  const card = read('index.html').match(/^[ \t]*<section class="card"[\s\S]*?<\/section>/m);
  if (!card) throw new Error('Generator card (<section class="card">) not found in index.html');
  const template = read('extension/popup.html');
  if (!CARD_PLACEHOLDER.test(template)) throw new Error('CARD placeholder not found in extension/popup.html');
  write('popup.html', template.replace(CARD_PLACEHOLDER, () => card[0].trim()));

  return outDir;
}

module.exports = { build };

if (require.main === module) {
  const outDir = build();
  console.log(`Extension built in ${path.relative(ROOT, outDir).split(path.sep).join('/')}/`);
}
