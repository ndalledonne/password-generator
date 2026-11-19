# Password Generator

[🇫🇷 Français](README.md) | 🇬🇧 English

[![Tests](https://github.com/ndalledonne/password-generator/actions/workflows/tests.yml/badge.svg)](https://github.com/ndalledonne/password-generator/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A small web app that generates secure random passwords, right in the browser.
Plain HTML, CSS and JavaScript: no framework, no dependency, no server.

> The user interface is in French. This document describes it in English.

## Features

- Generate a password in one click.
- Copy it to the clipboard in one click.
- Choose the length:
  - quick buttons: 8, 12, 16 (default), 20, 24, 32;
  - select list with more values: from 6 to 128 characters.
- Choose the character types (all checked by default):
  - lowercase `a-z`
  - uppercase `A-Z`
  - digits `0-9`
  - special characters `!@#$%^&*()-_=+[]{};:,.?/`
- At least one character of each checked type is guaranteed.
- "Exclude similar characters" option (checked by default): removes `I`, `l`, `1`, `O`, `0`, `o`, which are easy to confuse when read.
- Options grouped in a collapsible panel, closed by default, with a summary of the settings.
- Light / dark theme following the system setting.
- Keyboard accessible and screen-reader friendly (ARIA labels, status region).

## Security

- Passwords are generated with the **Web Crypto API** (`crypto.getRandomValues`), the browser's cryptographic random number generator. `Math.random()` is never used.
- Selection is **unbiased** (rejection sampling), and characters are then shuffled (Fisher–Yates).
- **No data leaves the browser**: no server, no cookie, no analytics, no external resource (no font or library loaded from another site).
- A Content Security Policy (CSP) restricts the page to its own files.

See also [SECURITY.md](SECURITY.md).

## Demo

Live demo: *to be completed (your website or GitHub Pages URL)*.

## Installation and usage

Nothing to install.

```bash
git clone https://github.com/ndalledonne/password-generator.git
cd password-generator
```

Then open `index.html` in a browser.

### Deploying to your website

Upload `index.html` and the `assets/` folder to your web host, keeping the same folder structure. The other files (documentation, tests) are not needed at runtime.

> The modern Clipboard API requires the page to be served over **HTTPS** (or locally). Over plain HTTP, a fallback method is used.
>
> To prevent the page from being embedded in a third-party site (*clickjacking*), set the HTTP header `Content-Security-Policy: frame-ancestors 'self'` on your server. This rule cannot be set in the HTML.

### GitHub Pages

In the GitHub repository: **Settings → Pages → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.

## Project structure

```
password-generator/
├── index.html                 Main page
├── assets/
│   ├── css/style.css          Styles
│   ├── js/generator.js        Generation logic (testable, no UI)
│   ├── js/app.js              User interface
│   └── favicon.svg
├── tests/generator.test.js    Unit tests (Node.js)
├── .github/workflows/tests.yml  Continuous integration
├── CHANGELOG.md               Version history
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## Using the logic in your own code

`assets/js/generator.js` can be reused on its own.

In the browser, it exposes `window.PasswordGenerator`:

```html
<script src="assets/js/generator.js"></script>
<script>
  const pwd = PasswordGenerator.generate({ length: 20, symbols: false });
</script>
```

In Node.js (20 or later):

```js
const { generate } = require('./assets/js/generator.js');
generate(); // 16 characters, all types
```

| Option      | Type    | Default | Description                    |
|-------------|---------|---------|--------------------------------|
| `length`    | integer | `16`    | Length, from 4 to 128          |
| `lowercase` | boolean | `true`  | Include lowercase letters      |
| `uppercase` | boolean | `true`  | Include uppercase letters      |
| `digits`    | boolean | `true`  | Include digits                 |
| `symbols`   | boolean | `true`  | Include special characters     |
| `excludeSimilar` | boolean | `false` | Remove `I l 1 O 0 o`   |

A missing or `undefined` option takes its default value. `generate()` throws:
- an `Error` if no type is selected;
- a `RangeError` if the length is invalid;
- a `TypeError` on an unknown option or a non-boolean flag.

In the UI, "Exclude similar characters" is checked by default; in the API, `excludeSimilar` defaults to `false`.

## Tests

Tests use Node.js's built-in test runner. No dependency to install.

```bash
npm test
```

They also run automatically on GitHub Actions on every push and pull request.

## Browser support

Current browsers: Chrome, Edge, Firefox, Safari (versions released since 2020).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

Distributed under the MIT License. See [LICENSE](LICENSE).

© 2026 Nicolas DALLEDONNE
