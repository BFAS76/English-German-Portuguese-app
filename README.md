# English & German Vocabulary Trainer

A minimal, offline-first PWA to practice **English** and **German** vocabulary with **Portuguese** translations.
Built with vanilla JavaScript, Vite, and the Web Speech API — no framework, ~3 KB gzipped.

## Features
- **33 curated phrases** (A1–B1) with **EN**, **DE**, and **PT** fields.
- **Dual target languages**: switch between 🇬🇧 English and 🇩🇪 German practice modes.
- **Text-to-Speech** via `SpeechSynthesis` (native browser voices).
- **Speech Recognition** via `SpeechRecognition` (Chrome/Edge) for pronunciation scoring.
- **XP / Level progression** persisted in `localStorage`.
- **Offline-first PWA** — installable, works without network after first visit.
- **Optional Firebase sync** (Auth + Firestore) loaded via CDN (v10.14.0) — zero cost, zero build step.
- **Zero dependencies in production** — single `index.html` entry point.

## Tech Stack
- **Vite 5+** (dev server, build, `vite-plugin-pwa`)
- **Vitest** + **jsdom** + **@vitest/coverage-v8**
- **Firebase 10.14** (Auth, Firestore) — imported via `<script type="importmap">` in `index.html`
- **Vanilla ES Modules** — no React, Vue, Svelte, bundler runtime

## Quick Start
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in /dist
npm run preview    # preview production build
npm test           # run Vitest suite (watch mode)
npm run coverage   # generate HTML coverage report
```

## Firebase Setup (optional — app works fully offline without it)
1. Create a Firebase project → **Web App** (</>).
2. Enable **Authentication → Anonymous** sign-in.
3. Enable **Cloud Firestore** (start in test mode, lock down later).
4. Copy the Firebase config object.
5. Open `index.html` and replace the placeholder values in the `<script type="importmap">` / `firebaseConfig` object:
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     // ...
   };
   ```
6. Deploy Firestore rules (user-scoped access):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
7. Reload — progress now syncs across devices anonymously.

## Project Structure
```
├── index.html          # entry point, importmap, Firebase config, SW registration
├── app.js              # core logic: phrases, TTS, ASR, XP, level, Firebase sync
├── firebase.js         # lazy Firebase init (auth, firestore) + sync helpers
├── app.test.js         # Vitest specs (jsdom mocks for Speech*, localStorage, Firebase)
├── package.json
├── vitest.config.js    # Vitest + jsdom + coverage config
├── vite.config.js      # Vite + PWA plugin config (if present)
└── public/
    ├── manifest.json   # PWA manifest
    ├── sw.js           # generated service worker (workbox)
    └── icons/          # PWA icons (192, 512, maskable)
```

## Testing
```bash
npm test           # watch mode, re-runs on file change
npm run coverage   # HTML report in ./coverage/index.html
```
Mocks cover:
- `window.speechSynthesis` + `SpeechSynthesisUtterance`
- `window.SpeechRecognition` / `webkitSpeechRecognition`
- `localStorage`
- `fetch` (Firebase REST calls)
- Dynamic `import('firebase/...')` via importmap

## PWA / Offline
- `vite-plugin-pwa` (Workbox) generates a precaching service worker.
- `manifest.json` + icons in `public/` make the app installable.
- All static assets cached on first load; Firestore writes are queued offline via `enableIndexedDbPersistence()`.

## Deploy to GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```
Enable **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## License
MIT — free to use, modify, distribute.