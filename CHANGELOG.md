# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Favicon in every format: `favicon.ico` (16, 32, 48 px) for older browsers and search engines, `apple-touch-icon.png` for iPhone/iPad home screens, 192 and 512 px icons with a web app manifest for Android.

## [1.4.0] - 2026-11-19

### Added

- Automatic deployment to the Nuxit hosting (`password-generator.nicolasdalledonne.fr`) over FTPS when a `v*` tag is pushed, after the tests pass.

### Changed

- Tests now run on Node.js 22 and 24, and Node.js 22 or later is required (Node.js 20 is no longer maintained).
- GitHub Actions `checkout` and `setup-node` updated to v7 (Node.js 24 runtime), removing the Node.js 20 deprecation warnings.

## [1.3.0] - 2026-11-19

### Changed

- New professional design: key icon next to the title, white card, blue accent, segmented control for lengths, checkbox tiles.
- Favicon updated to match the new colours.

### Added

- Options panel collapsed by default (native `<details>` element), with a short summary of the current settings shown next to "Options".
- Full list of special characters shown under "Caractères spéciaux", read from `generator.js` so the display always matches the generator.

### Fixed

- Sample characters (e.g. `I l 1 O 0 o`) no longer wrap or get cut on small screens.

## [1.2.0] - 2026-11-19

### Changed

- "Exclude similar characters" is now checked by default in the UI (the API default stays `false`).
- `generate()` now validates its options: unknown options and non-boolean flags throw a `TypeError` (previously, a value such as `"false"` was silently treated as `true`).
- Options set to `undefined` now fall back to their default value instead of causing an error.
- `generator.js` exports `DEFAULT_LENGTH` and `DEFAULTS`; the UI reads its default length from it.
- `app.js` reorganized into clear sections (configuration, texts, DOM, state, handlers, init); UI texts grouped in one place.
- Length buttons are created once and updated, instead of being rebuilt on every click.
- Theme colors no longer depend on the CSS `light-dark()` function, so the page works in browsers released since 2020.

### Added

- Keyboard: `Home` and `End` keys on the length buttons.
- Documentation: advice on the `frame-ancestors` HTTP header against clickjacking.
- Unit tests for option validation and the minimum length.

### Fixed

- Copy fallback: keyboard focus was lost after copying; it now returns to the "Copy" button.
- Copy fallback: text selection on iOS.
- Generate button state now matches the checkboxes after a page reload (browsers can restore checkbox states).

## [1.1.0] - 2026-11-19

### Added

- Length select list with more values: 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 96, 128. It stays in sync with the preset buttons.
- "Exclude similar characters" checkbox (unchecked by default) that removes `I`, `l`, `1`, `O`, `0` and `o`.
- `excludeSimilar` option and `SIMILAR_CHARS` constant in `generator.js`.
- Unit tests for the new option.

### Changed

- Single changelog, in English (`CHANGELOG.en.md` removed).
- Tests now run on Node.js 20, 22 and 24 (Node.js 18 is no longer maintained).

## [1.0.0] - 2026-11-19

### Added

- Random password generation with the Web Crypto API (`crypto.getRandomValues`), unbiased selection.
- "Copy" button to the clipboard, with a fallback when the Clipboard API is unavailable.
- Length presets: 8, 12, 16 (default), 20, 24, 32.
- Checkboxes for character types: lowercase, uppercase, digits, special characters (all checked by default).
- At least one character of each checked type is guaranteed.
- "Generate" button disabled, with a message, when no type is checked.
- Automatic light / dark theme.
- Accessibility: keyboard navigation, ARIA roles, status region.
- Content Security Policy (CSP), no external resources.
- Unit tests (Node.js) and GitHub Actions continuous integration.
- French and English documentation.

[Unreleased]: https://github.com/ndalledonne/password-generator/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/ndalledonne/password-generator/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/ndalledonne/password-generator/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ndalledonne/password-generator/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ndalledonne/password-generator/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ndalledonne/password-generator/releases/tag/v1.0.0
