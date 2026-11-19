'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generate, randomInt, CHARSETS, SIMILAR_CHARS, MIN_LENGTH, MAX_LENGTH, DEFAULT_LENGTH } = require('../assets/js/generator.js');

const has = (str, chars) => [...str].some((c) => chars.includes(c));
const onlyFrom = (str, chars) => [...str].every((c) => chars.includes(c));

test('default password: 16 characters, all four families', () => {
  const pwd = generate();
  assert.equal(pwd.length, 16);
  for (const chars of Object.values(CHARSETS)) {
    assert.ok(has(pwd, chars));
  }
});

test('respects the requested length', () => {
  for (const length of [MIN_LENGTH, 8, 12, 20, 32, 64, MAX_LENGTH]) {
    assert.equal(generate({ length }).length, length);
  }
});

test('uses only the selected families', () => {
  for (let i = 0; i < 200; i++) {
    const pwd = generate({ length: 12, uppercase: false, symbols: false });
    assert.ok(onlyFrom(pwd, CHARSETS.lowercase + CHARSETS.digits));
    assert.ok(has(pwd, CHARSETS.lowercase));
    assert.ok(has(pwd, CHARSETS.digits));
  }
});

test('works with a single family', () => {
  const pwd = generate({ length: 20, lowercase: false, uppercase: false, symbols: false });
  assert.match(pwd, /^[0-9]{20}$/);
});

test('throws when no family is selected', () => {
  assert.throws(
    () => generate({ lowercase: false, uppercase: false, digits: false, symbols: false }),
    /At least one character family/
  );
});

test('throws on invalid length', () => {
  for (const length of [0, MIN_LENGTH - 1, MAX_LENGTH + 1, 12.5, '16', NaN]) {
    assert.throws(() => generate({ length }), RangeError);
  }
});

test('randomInt stays within bounds', () => {
  for (let i = 0; i < 1000; i++) {
    const n = randomInt(7);
    assert.ok(Number.isInteger(n) && n >= 0 && n < 7);
  }
  assert.throws(() => randomInt(0), RangeError);
});

test('randomInt is roughly uniform', () => {
  const buckets = new Array(10).fill(0);
  const draws = 100000;
  for (let i = 0; i < draws; i++) buckets[randomInt(10)]++;
  for (const count of buckets) {
    assert.ok(Math.abs(count - draws / 10) < draws / 10 * 0.05, `unbalanced bucket: ${count}`);
  }
});

test('two passwords are different', () => {
  assert.notEqual(generate({ length: 32 }), generate({ length: 32 }));
});

test('excludeSimilar removes look-alike characters', () => {
  for (let i = 0; i < 300; i++) {
    const pwd = generate({ length: 64, excludeSimilar: true });
    assert.ok(!has(pwd, SIMILAR_CHARS), `found a similar character in ${pwd}`);
  }
});

test('excludeSimilar is off by default and keeps every family', () => {
  const seen = new Set();
  for (let i = 0; i < 300; i++) for (const c of generate({ length: 64 })) seen.add(c);
  for (const c of SIMILAR_CHARS) assert.ok(seen.has(c), `missing ${c}`);
  const pwd = generate({ length: 12, excludeSimilar: true });
  for (const chars of Object.values(CHARSETS)) assert.ok(has(pwd, chars));
});

test('undefined options fall back to defaults', () => {
  const pwd = generate({ length: undefined, symbols: undefined });
  assert.equal(pwd.length, DEFAULT_LENGTH);
  assert.ok(has(pwd, CHARSETS.symbols));
});

test('rejects unknown options and non-boolean flags', () => {
  assert.throws(() => generate({ lenght: 12 }), TypeError);
  assert.throws(() => generate({ symbols: 'false' }), TypeError);
  assert.throws(() => generate({ digits: 1 }), TypeError);
  assert.throws(() => generate(null), TypeError);
});

test('minimum length with every family', () => {
  for (let i = 0; i < 200; i++) {
    const pwd = generate({ length: MIN_LENGTH, excludeSimilar: true });
    assert.equal(pwd.length, MIN_LENGTH);
    for (const chars of Object.values(CHARSETS)) assert.ok(has(pwd, chars));
  }
});
