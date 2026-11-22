# English-German-Portuguese App

A single-page web app to practise **English**, **German** and **Portuguese** vocabulary and pronunciation. Learn any of the three languages, with a hint in a language you already know.

Plain HTML, CSS and JavaScript modules. No framework, no build step required to run.

## Features

- **146 phrases** across CEFR levels **A1, A2 and B1** (54 / 52 / 40)
- **12 categories**: Greetings, Useful, Travel, Food, Numbers, Daily, Work, Shopping, Health, Directions, Weather and Time
- **Category filter** to practise one category at a time (or all)
- **Progress stats** of correct answers, broken down by level and by category
- **Learn any of the three languages**: pick the language you speak (the hint) and the one you are learning — English, German **or** Portuguese, in any combination
- The phrase is shown in the language you are learning, with a hint in the language you already speak
- **Text-to-speech** playback of the target phrase (Web Speech API)
- **Speech recognition** to check pronunciation (Web Speech API)
- **XP and level progression** persisted in `localStorage`
- **Optional cloud sync** of progress via Google sign-in (Firebase Auth + Firestore)
- **Installable PWA** — add it to your home screen and use it offline (service worker + web manifest)
- Works fully offline in local-only mode, without any Firebase configuration (the Firebase SDK is loaded lazily, only when a real config is present)

## Tech Stack

| Area | Choice |
| --- | --- |
| Markup and logic | Vanilla HTML + JavaScript modules |
| Speech | `window.speechSynthesis`, `SpeechRecognition` / `webkitSpeechRecognition` |
| Auth and sync (optional) | Firebase 12.14.0, loaded from the CDN via an import map in `index.html` |
| Tests | Vitest with jsdom and v8 coverage |

## Getting Started

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

To run the tests:

```bash
npm test           # single run
npm run test:watch # watch mode
npm run coverage   # coverage report
```

## Firebase Setup (optional)

The app runs in local-only mode while the Firebase config in `firebase.js` keeps its placeholder values. To enable cloud sync:

1. Create a Firebase project and register a Web App.
2. Enable **Authentication → Google** as a sign-in provider.
3. Enable **Cloud Firestore**.
4. Copy the web app config into `firebase.js`, replacing the placeholder values.
5. Add Firestore security rules allowing each user to read and write only their own document:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /progress/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

6. Redeploy. Progress is then stored per user and synced across devices.

## Project Structure

```
├── index.html        # layout, styles and UI structure
├── app.js            # phrases, language switching, speech, XP and sync
├── firebase.js       # optional Firebase init and cloud save/load (lazy-loaded)
├── manifest.webmanifest  # PWA manifest (installable app)
├── sw.js             # service worker (offline app shell cache)
├── icon-192.png      # PWA icon
├── icon-512.png      # PWA icon (maskable)
├── app.test.js       # Vitest test suite for app.js (jsdom)
├── firebase.test.js  # Vitest test suite for firebase.js (mocked)
├── vitest.config.js  # Vitest configuration
├── .github/workflows/ci.yml  # CI: runs the tests on push and PR
├── LICENSE
├── package.json
└── package-lock.json
```

## Language Notes

The phrase set deliberately mixes formal (*Sie*) and informal (*du*) German
registers, matching how each phrase is most naturally said (e.g. a polite
request uses *Sie*, while "Let's grab a coffee" uses *du*). Portuguese
translations use the European Portuguese variant, with `(a)` endings where the
adjective would otherwise assume the speaker's gender.

## Data Model

Each phrase carries its text for both target languages plus the Portuguese translation:

```js
{
  level: "A1",
  cat: "Greetings",
  en: "Good morning",
  de: "Guten Morgen",
  pt: "Bom dia"
}
```

## Browser Support

Speech recognition relies on the Web Speech API and works best in **Chrome** and **Edge**. Text-to-speech works in all modern browsers. The app degrades gracefully when a speech API is unavailable.

## License

MIT
