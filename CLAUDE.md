# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Overview

A single-page web app to practise **English** and **German** vocabulary and
pronunciation, with every phrase translated into **Portuguese**. Plain HTML, CSS
and JavaScript modules — no framework. The app runs with no build step; the
tooling (Vite, Vitest) exists only for local dev-serving and tests.

## Commands

```bash
npm install          # install dev dependencies (Vitest, jsdom, Vite, Firebase)
npm test             # run the test suite once (vitest run)
npm run test:watch   # tests in watch mode
npm run coverage     # tests with v8 coverage
npm run dev          # Vite dev server
npm run build        # Vite production build
npm run preview      # preview the build
```

CI (`.github/workflows/ci.yml`) runs `npm ci` + `npm test` on Node 22, on every
push to `main` and on every pull request. The test tooling (Vitest 5) requires
Node 22 or newer.

## Running the app

No build is required. Open `index.html` directly, or serve the folder with any
static file server. The import map in `index.html` maps the `firebase/*` bare
specifiers to the Firebase CDN (12.14.0), so the modules resolve in the browser
without bundling.

## Architecture

Three source files, each with one responsibility:

- **`index.html`** — layout, inline styles, the Firebase config object, and the
  wiring that connects DOM events to `app.js`. It also injects the Firebase
  cloud functions into `app.js` via the exported `cloud` object.
- **`app.js`** — the testable core: the phrase `library`, the `state` object,
  language/level switching, speech synthesis and recognition, XP scoring, and
  `localStorage` persistence. Has no direct Firebase dependency; it calls
  `cloud.save` / `cloud.load` only if `index.html` has wired them.
- **`firebase.js`** — optional Google sign-in (Firebase Auth) and per-user
  progress sync (Firestore). Inert until a real config is supplied; stays in
  local-only mode while `apiKey` is the `YOUR_API_KEY` placeholder.

**Data model** — each phrase carries both target languages plus the Portuguese
translation:

```js
{ level: "A1", cat: "Greetings", en: "Good morning", de: "Guten Morgen", pt: "Bom dia" }
```

`level` is one of `A1` / `A2` / `B1` (CEFR); `cat` is a free-text category.

**`state`** holds `current` (the shown phrase), `score`, `audioInitialized`,
`language` (`'en'` | `'de'`) and `level`.

**Flow** — user hears the phrase (`SpeechSynthesis`, rate 0.8) → speaks it
(`SpeechRecognition` / `webkitSpeechRecognition`) → `handleRecognitionResult`
normalizes and compares via `checkMatch`; a match awards 10 XP and schedules the
next phrase.

**Matching** — `normalizeText` lowercases and strips `?.!,`; `checkMatch` accepts
an exact match, or a partial one that covers at least `MATCH_COVERAGE` (60%) of
the target length, so a single short word does not validate a whole phrase.

**Persistence** — `localStorage` keys `englishAppScore`, `englishAppLanguage`,
`englishAppLevel`. When signed in, progress also syncs to Firestore; cloud writes
are debounced (`SAVE_DEBOUNCE_MS`, 1.5s) and `loadFromCloud` only raises the
local score, never lowers it.

## Conventions

- ES modules throughout; logic lives in small exported functions so it can be
  unit-tested. The DOM is accessed by element id.
- Theme uses CSS custom properties on `:root`: primary `#00f2fe`, background
  `#0f172a`, card `#1e293b`. Mobile-first; keep touch targets large.
- Speech and Firebase APIs are feature-detected and degrade gracefully when
  unavailable.

## Testing

Vitest with the `jsdom` environment (`vitest.config.js`).

- `app.test.js` sets a DOM template in `beforeEach`, stubs the speech globals,
  and resets state via `resetState()`.
- `firebase.test.js` mocks `firebase/app`, `firebase/auth` and
  `firebase/firestore` with `vi.mock`, and re-imports the module per test
  (`vi.resetModules()`) because `firebase.js` holds module-level state. Debounce
  tests use fake timers.

## Known gotchas

- The runtime Firebase version is the CDN build pinned in the `index.html`
  import map, **not** the npm `firebase` dependency (used only for tests/types).
  Keep them aligned.
- The test tooling (Vitest 5 / Vite 8 / jsdom 31) needs **Node 22+**. On older
  Node, `localStorage` is not wired into the jsdom environment and `app.test.js`
  fails; CI pins Node 22 for this reason.
