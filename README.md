# English App

A single-page web app to practice **English (EN)** and **German (DE)** vocabulary and pronunciation, with translations in **Portuguese (PT)**.

No build step, no framework — plain HTML, CSS and ES modules, served statically.

## Features

- **33 phrases** across CEFR levels **A1, A2 and B1**
- Switch the target language between **English** and **German**
- Portuguese translation shown for every phrase
- **Text-to-speech** playback of the target phrase (Web Speech API)
- **Speech recognition** to check your pronunciation (Web Speech API)
- **XP and level progression**, persisted in `localStorage`
- **Optional Firebase** (Auth + Firestore) to sync progress across devices
- Works fully offline when Firebase is not configured

## Tech Stack

| Area | Choice |
|---|---|
| Markup / logic | Vanilla HTML + ES modules |
| Speech | `window.speechSynthesis`, `window.SpeechRecognition` / `webkitSpeechRecognition` |
| Auth & sync (optional) | Firebase 10.14.0 via CDN + import map |
| Tests | Vitest + jsdom + v8 coverage |

## Getting Started

The app is static, so any static server works:

```bash
npm install
npm run dev        # or: npx serve .
```

Then open the printed URL.

Run the tests:

```bash
npm test
npm run coverage
```

## Firebase Setup (optional)

Leave the Firebase config placeholders in `index.html` untouched to run in local-only mode. To enable sync:

1. Create a Firebase project and a Web App.
2. Enable **Authentication → Anonymous** and **Firestore**.
3. Replace the placeholders in the import-map config block in `index.html`
   (`YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, `YOUR_PROJECT_ID`, ...).
4. Redeploy. Progress is then stored per anonymous user and synced across devices.

## Project Structure

```
├── index.html        # layout, styles, Firebase import map
├── app.js            # phrases, language switching, TTS/ASR, XP, sync
├── firebase.js       # optional Firebase init and progress persistence
├── app.test.js       # Vitest specs (jsdom)
├── test.html         # manual test harness
├── package.json
└── package-lock.json
```

## Data Model

Each phrase is an object holding the target-language text per language plus the Portuguese translation:

```js
{
  level: "A1",
  en: "Good morning",
  de: "Guten Morgen",
  pt: "Bom dia"
}
```

## Browser Support

Speech recognition relies on the Web Speech API and currently works best in **Chrome** and **Edge**. Text-to-speech works in all modern browsers. The app degrades gracefully when an API is unavailable.

## License

MIT
