/**
 * Password Generator — user interface
 * Depends on assets/js/generator.js (window.PasswordGenerator).
 *
 * Structure: configuration → texts → DOM references → state →
 * helpers → length → character options → generate → copy → init.
 *
 * @license MIT
 */
(function () {
  'use strict';

  const { generate, CHARSETS, DEFAULT_LENGTH, MIN_LENGTH, MAX_LENGTH } = window.PasswordGenerator;

  /* ---------- Configuration ---------- */

  /** Length presets shown as buttons. */
  const PRESET_LENGTHS = [8, 12, 16, 20, 24, 32];

  /** Lengths offered in the select list (presets are always included). */
  const SELECT_LENGTHS = [...new Set([6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64, 96, 128, ...PRESET_LENGTHS])]
    .filter((n) => n >= MIN_LENGTH && n <= MAX_LENGTH)
    .sort((a, b) => a - b);

  /** Checkbox id → generator option. */
  const OPTION_INPUTS = {
    lowercase: 'opt-lowercase',
    uppercase: 'opt-uppercase',
    digits: 'opt-digits',
    symbols: 'opt-symbols',
    excludeSimilar: 'opt-exclude-similar'
  };

  /** Options that are character families (at least one must be checked). */
  const FAMILY_OPTIONS = ['lowercase', 'uppercase', 'digits', 'symbols'];

  /** Short labels used in the summary of the collapsed options panel. */
  const FAMILY_SHORT = { lowercase: 'a-z', uppercase: 'A-Z', digits: '0-9', symbols: '!@#' };

  /** Delay before a success message disappears (ms). */
  const STATUS_DELAY = 2500;

  /* ---------- Texts (French UI) ---------- */

  const TEXT = {
    lengthOption: (n) => `${n} caractères`,
    summaryNoFamily: 'aucun type de caractères',
    summarySimilar: 'sans similaires',
    noFamily: 'Cochez au moins un type de caractères.',
    copied: 'Copié dans le presse-papier.',
    copyFailed: 'Copie impossible : sélectionnez le mot de passe puis Ctrl+C (⌘+C sur Mac).',
    error: (message) => `Erreur : ${message}`
  };

  /* ---------- DOM references ---------- */

  const $ = (id) => document.getElementById(id);

  const dom = {
    password: $('password'),
    generate: $('btn-generate'),
    copy: $('btn-copy'),
    status: $('status'),
    presets: $('lengths'),
    select: $('length-select'),
    summary: $('options-summary'),
    symbolsSample: $('symbols-sample'),
    options: Object.fromEntries(
      Object.entries(OPTION_INPUTS).map(([option, id]) => [option, $(id)])
    )
  };

  /* ---------- State ---------- */

  const state = {
    length: DEFAULT_LENGTH,
    statusTimer: null
  };

  /* ---------- Helpers ---------- */

  function setStatus(message, { error = false, autoClear = false } = {}) {
    clearTimeout(state.statusTimer);
    dom.status.textContent = message;
    dom.status.classList.toggle('is-error', error);
    if (autoClear) {
      state.statusTimer = setTimeout(() => setStatus(''), STATUS_DELAY);
    }
  }

  function hasPassword() {
    return !dom.password.classList.contains('is-empty');
  }

  /** Short recap of the settings, shown next to "Options" (e.g. "16 caractères · a-z A-Z 0-9 !@#"). */
  function updateSummary() {
    const families = FAMILY_OPTIONS.filter((option) => dom.options[option].checked);
    const parts = [
      TEXT.lengthOption(state.length),
      families.length ? families.map((option) => FAMILY_SHORT[option]).join(' ') : TEXT.summaryNoFamily
    ];
    if (dom.options.excludeSimilar.checked) parts.push(TEXT.summarySimilar);
    dom.summary.textContent = parts.join(' · ');
  }

  /* ---------- Length ---------- */

  function buildLengthControls() {
    dom.presets.innerHTML = PRESET_LENGTHS.map((n) =>
      `<button type="button" class="chip" role="radio" data-length="${n}">${n}</button>`
    ).join('');
    dom.select.innerHTML = SELECT_LENGTHS.map((n) =>
      `<option value="${n}">${TEXT.lengthOption(n)}</option>`
    ).join('');
  }

  /** Reflects state.length on the buttons and the select list. */
  function syncLengthControls() {
    // If the length is not a preset, the first button stays reachable with Tab
    const tabTarget = PRESET_LENGTHS.includes(state.length) ? state.length : PRESET_LENGTHS[0];
    for (const button of dom.presets.querySelectorAll('[data-length]')) {
      const n = Number(button.dataset.length);
      button.setAttribute('aria-checked', String(n === state.length));
      button.tabIndex = n === tabTarget ? 0 : -1;
    }
    dom.select.value = String(state.length);
  }

  function setLength(n, { focusPreset = false } = {}) {
    state.length = n;
    syncLengthControls();
    updateSummary();
    if (focusPreset) {
      dom.presets.querySelector(`[data-length="${n}"]`)?.focus();
    }
  }

  function onPresetClick(event) {
    const button = event.target.closest('[data-length]');
    if (button) setLength(Number(button.dataset.length), { focusPreset: true });
  }

  /** Keyboard navigation of the radio group: arrows, Home, End. */
  function onPresetKeydown(event) {
    const last = PRESET_LENGTHS.length - 1;
    const current = PRESET_LENGTHS.indexOf(state.length);
    let index;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        index = current === -1 ? 0 : (current + 1) % PRESET_LENGTHS.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        index = current === -1 ? last : (current - 1 + PRESET_LENGTHS.length) % PRESET_LENGTHS.length;
        break;
      case 'Home':
        index = 0;
        break;
      case 'End':
        index = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    setLength(PRESET_LENGTHS[index], { focusPreset: true });
  }

  function onSelectChange() {
    setLength(Number(dom.select.value));
  }

  /* ---------- Character options ---------- */

  function readOptions() {
    const options = { length: state.length };
    for (const [option, input] of Object.entries(dom.options)) {
      options[option] = input.checked;
    }
    return options;
  }

  function hasFamily() {
    return FAMILY_OPTIONS.some((option) => dom.options[option].checked);
  }

  function onFamilyChange() {
    updateSummary();
    const ok = hasFamily();
    dom.generate.disabled = !ok;
    if (!ok) {
      setStatus(TEXT.noFamily, { error: true });
    } else if (dom.status.classList.contains('is-error')) {
      setStatus('');
    }
  }

  /* ---------- Generate ---------- */

  function onGenerate() {
    if (!hasFamily()) {
      onFamilyChange();
      return;
    }
    let password;
    try {
      password = generate(readOptions());
    } catch (err) {
      setStatus(TEXT.error(err.message), { error: true });
      return;
    }
    dom.password.textContent = password;
    dom.password.classList.remove('is-empty', 'is-fresh');
    void dom.password.offsetWidth; // restart the animation
    dom.password.classList.add('is-fresh');
    dom.copy.disabled = false;
    setStatus('');
  }

  /* ---------- Copy ---------- */

  /** Fallback for browsers or pages (plain HTTP) without the Clipboard API. */
  function legacyCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.className = 'visually-hidden';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length); // iOS
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    textarea.remove();
    dom.copy.focus(); // select() moved the focus: give it back to the button
    return ok;
  }

  async function onCopy() {
    if (!hasPassword()) return;
    const text = dom.password.textContent;
    let ok;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch (err) {
      ok = legacyCopy(text);
    }
    if (ok) {
      setStatus(TEXT.copied, { autoClear: true });
    } else {
      setStatus(TEXT.copyFailed, { error: true });
    }
  }

  /* ---------- Init ---------- */

  function init() {
    // Full list of special characters, read from the generator (single source of truth)
    dom.symbolsSample.textContent = [...CHARSETS.symbols].join(' ');
    buildLengthControls();
    syncLengthControls();
    onFamilyChange(); // the browser may restore checkbox states on reload

    dom.presets.addEventListener('click', onPresetClick);
    dom.presets.addEventListener('keydown', onPresetKeydown);
    dom.select.addEventListener('change', onSelectChange);
    FAMILY_OPTIONS.forEach((option) => dom.options[option].addEventListener('change', onFamilyChange));
    dom.options.excludeSimilar.addEventListener('change', updateSummary);
    dom.generate.addEventListener('click', onGenerate);
    dom.copy.addEventListener('click', onCopy);
  }

  init();
})();
