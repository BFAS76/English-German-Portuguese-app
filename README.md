# English-German App

A single-page web app to practise **English** and **German** vocabulary and pronunciation, with every phrase translated into **Portuguese**.

Plain HTML, CSS and JavaScript modules. No framework, no build step required to run.

## Features

- **33 phrases** across CEFR levels **A1, A2 and B1**
- Switch the target language between **English** and **German**
- Portuguese translation shown alongside every phrase
- **Text-to-speech** playback of the target phrase (Web Speech API)
- **Speech recognition** to check pronunciation (Web Speech API)
- **XP and level progression** persisted in `localStorage`
- **Optional cloud sync** of progress via Google sign-in (Firebase Auth + Firestore)
- Works fully offline in local-only mode, without any Firebase configuration

## Tech Stack

| Area | Choice |
| --- | --- |
| Markup and logic | Vanilla HTML + JavaScript modules |
| Speech | `window.speechSynthesis`, `SpeechRecognition` / `webkitSpeechRecognition` |
| Auth and sync (optional) | Firebase 12 (`firebase/app`, `firebase/auth`, `firebase/firestore`) |
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
├── firebase.js       # optional Firebase init and cloud save/load
├── app.test.js       # Vitest test suite (jsdom)
├── test.html         # manual test harness
├── vitest.config.js  # Vitest configuration
├── package.json
└── package-lock.json
```

## Data Model

Each phrase carries its text for both target languages plus the Portuguese translation:

```js
{
  level: "A1",
  en: "Good morning",
  de: "Guten Morgen",
  pt: "Bom dia"
}
```

## Browser Support

Speech recognition relies on the Web Speech API and works best in **Chrome** and **Edge**. Text-to-speech works in all modern browsers. The app degrades gracefully when a speech API is unavailable.

## License

MIT
