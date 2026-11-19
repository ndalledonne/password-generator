/**
 * Password Generator — core logic
 *
 * Generates random passwords with the Web Crypto API
 * (crypto.getRandomValues). No password ever leaves the browser.
 * This file has no access to the DOM, so it can be tested and reused alone.
 *
 * Works as a classic browser script (exposes window.PasswordGenerator)
 * and as a CommonJS module (for the Node.js tests).
 *
 * @license MIT
 */
(function (root, factory) {
  'use strict';
  const api = factory(globalThis.crypto);
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.PasswordGenerator = api;
  }
})(typeof self !== 'undefined' ? self : this, function (cryptoObj) {
  'use strict';

  /* ---------- Constants ---------- */

  /** Character families available for generation (order = option order). */
  const CHARSETS = Object.freeze({
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?/'
  });

  /** Look-alike characters removed when excludeSimilar is true. */
  const SIMILAR_CHARS = 'Il1O0o';

  /** Allowed length range and default length. */
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 128;
  const DEFAULT_LENGTH = 16;

  /** Default options of generate(). */
  const DEFAULTS = Object.freeze({
    length: DEFAULT_LENGTH,
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    excludeSimilar: false
  });

  /** Same families without look-alike characters, computed once. */
  const CHARSETS_NO_SIMILAR = Object.freeze(
    Object.fromEntries(
      Object.entries(CHARSETS).map(([key, chars]) => [
        key,
        [...chars].filter((c) => !SIMILAR_CHARS.includes(c)).join('')
      ])
    )
  );

  /* ---------- Randomness ---------- */

  /**
   * Returns a uniformly distributed integer in [0, max).
   * Uses rejection sampling to avoid modulo bias.
   * @param {number} max - Exclusive upper bound (1 to 2^32).
   * @returns {number}
   */
  function randomInt(max) {
    if (!Number.isInteger(max) || max < 1 || max > 0x100000000) {
      throw new RangeError('max must be an integer between 1 and 2^32');
    }
    if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
      throw new Error('Web Crypto API (crypto.getRandomValues) is not available');
    }
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    let value;
    do {
      cryptoObj.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);
    return value % max;
  }

  /** Returns a random character from a string. */
  function pick(chars) {
    return chars[randomInt(chars.length)];
  }

  /** In-place Fisher–Yates shuffle. */
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /* ---------- Options ---------- */

  /**
   * Merges options with the defaults and validates them.
   * Options set to undefined fall back to their default value.
   * @throws {TypeError}  On an unknown option or a non-boolean flag.
   * @throws {RangeError} On an invalid length.
   */
  function normalizeOptions(options) {
    if (options === null || typeof options !== 'object') {
      throw new TypeError('options must be an object');
    }
    const opts = { ...DEFAULTS };
    for (const [key, value] of Object.entries(options)) {
      if (!(key in DEFAULTS)) {
        throw new TypeError(`Unknown option: ${key}`);
      }
      if (value === undefined) continue;
      if (key !== 'length' && typeof value !== 'boolean') {
        throw new TypeError(`Option ${key} must be a boolean`);
      }
      opts[key] = value;
    }
    if (!Number.isInteger(opts.length) || opts.length < MIN_LENGTH || opts.length > MAX_LENGTH) {
      throw new RangeError(`length must be an integer between ${MIN_LENGTH} and ${MAX_LENGTH}`);
    }
    return opts;
  }

  /* ---------- Public API ---------- */

  /**
   * Generates a password.
   * Contains at least one character from each selected family.
   *
   * @param {Object}  [options]
   * @param {number}  [options.length=16]          - From MIN_LENGTH to MAX_LENGTH.
   * @param {boolean} [options.lowercase=true]
   * @param {boolean} [options.uppercase=true]
   * @param {boolean} [options.digits=true]
   * @param {boolean} [options.symbols=true]
   * @param {boolean} [options.excludeSimilar=false] - Remove look-alike characters (I l 1 O 0 o).
   * @returns {string}
   * @throws {Error}      If no family is selected.
   * @throws {TypeError}  On an unknown option or a non-boolean flag.
   * @throws {RangeError} If the length is invalid.
   */
  function generate(options = {}) {
    const opts = normalizeOptions(options);
    const source = opts.excludeSimilar ? CHARSETS_NO_SIMILAR : CHARSETS;
    const sets = Object.keys(CHARSETS)
      .filter((key) => opts[key])
      .map((key) => source[key]);

    if (sets.length === 0) {
      throw new Error('At least one character family must be selected');
    }
    if (opts.length < sets.length) {
      throw new RangeError('length must be at least the number of selected families');
    }

    const pool = sets.join('');
    const chars = sets.map(pick); // guarantees one character of each selected family
    while (chars.length < opts.length) {
      chars.push(pick(pool));
    }
    return shuffle(chars).join('');
  }

  return Object.freeze({
    CHARSETS,
    SIMILAR_CHARS,
    MIN_LENGTH,
    MAX_LENGTH,
    DEFAULT_LENGTH,
    DEFAULTS,
    randomInt,
    generate
  });
});
