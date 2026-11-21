# English-app

A minimal PWA to practice English vocabulary with German translations.
Built with vanilla JavaScript, Vite, and the Web Speech API.

## Features
- **33 hard-coded phrases** (A1–B1), each with EN text + DE translation.
- **Text-to-Speech** via `SpeechSynthesis` (native browser voices).
- **Speech Recognition** via `SpeechRecognition` (Chrome/Edge) for pronunciation practice.
- **XP / Level system** persisted in `localStorage`.
- **Offline-first PWA** (Vite PWA plugin, service worker, installable).
- **Optional Firebase** (Auth + Firestore) for cloud sync — works fully offline without it.
- **Zero framework** — single HTML entry point, ~2 KB gzipped JS.

## Tech Stack
- **Vite 8** (dev server, build, PWA plugin)
- **Vitest** + **jsdom** + **v8** coverage
- **Firebase 11** (Auth, Firestore) — loaded dynamically only if configured
- **Vanilla ES modules** (no React, Vue, Svelte)

## Quick Start
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production bundle in /dist
npm run preview    # preview production build
npm test           # run Vitest suite
npm run coverage   # generate coverage report
```

## Firebase Setup (optional)
1. Create a Firebase project → Web App.
2. Enable **Authentication → Anonymous** and **Firestore**.
3. Copy the config object and paste it into `index.html` replacing `YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, `YOUR_PROJECT_ID`.
4. Deploy Firestore rules:
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
5. Redeploy — the app will now sync progress across devices.

## Project Structure
```
├── index.html          # entry point, loads firebase config, registers SW
├── app.js              # core logic (phrases, TTS, ASR, XP, Firebase sync)
├── firebase.js         # lazy Firebase init + sync helpers
├── app.test.js         # Vitest specs (jsdom)
├── vite.config.js      # Vite + PWA config
├── package.json
└── public/             # manifest.json, icons, offline fallback
```

## Testing
```bash
npm test           # watch mode
npm run coverage   # HTML report in ./coverage
```
Tests mock `SpeechSynthesis`, `SpeechRecognition`, `localStorage`, and Firebase.

## PWA / Offline
- `vite-plugin-pwa` generates a service worker with `workbox`.
- `manifest.json` + icons in `public/` make it installable.
- All assets cached on first visit; works fully offline.

## Deploy to GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```
Enable **Settings → Pages → GitHub Actions** as source.

## License
MIT — free to use, modify, distribute.