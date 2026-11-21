# English Master Pro

> **PWA offline-first** para praticar *speaking* e *listening* de Inglês/Alemão (níveis A1–B1) com reconhecimento de voz, síntese nativa e sincronização opcional via Firebase.

---

## 🎯 O que faz

- **Frases curadas** (33 frases) organizadas por **nível CEFR** (A1, A2, B1) e **categoria** (Greetings, Travel, Useful, Daily).
- **Modo "Hear Native"** → síntese de voz do browser (SpeechSynthesis) com *locale* correto (`en-US` / `de-DE`).
- **Modo "Speak Now"** → reconhecimento de voz contínuo (Web Speech API) com correspondência *fuzzy* tolerante a pontuação e maiúsculas.
- **XP + persistência** → pontuação guardada no `localStorage`; sincroniza entre dispositivos se configurares Firebase.
- **PWA instalável** → `manifest` + `service worker` (via Vite PWA) → funciona 100 % offline após primeira carga.
- **Zero build-step para deploy** → `importmap` aponta Firebase para CDN estático → basta `npm run build` e servir a pasta `dist/` (GitHub Pages, Netlify, Vercel, Firebase Hosting…).

---

## 🛠 Stack

| Camada | Tecnologia |
|--------|------------|
| Build / Dev | Vite 8 + ESM |
| Testes | Vitest + jsdom + @vitest/coverage-v8 |
| Auth / DB | Firebase Auth (Google) + Firestore (opcional) |
| UI | Vanilla JS + CSS custom properties (dark mode only) |
| Voice | Web Speech API (SpeechSynthesis + SpeechRecognition) |

---

## 🚀 Quick start

```bash
# 1. Clona e instala
git clone https://github.com/<teu-user>/english-master-pro.git
cd english-master-pro
npm ci

# 2. Desenvolvimento (hot-reload)
npm run dev

# 3. Testes + cobertura
npm run test        # watch mode
npm run coverage    # relatório HTML em coverage/

# 4. Build de produção
npm run build       # sai em dist/
npm run preview     # serve dist/ localmente
```

---

## 🔐 Firebase (opcional — só para sync multi-device)

1. Cria projecto no [Firebase Console](https://console.firebase.google.com).
2. Ativa **Authentication → Google** e **Firestore** (modo test ou regras próprias).
3. Copia as chaves do **Web App** para `index.html`:

```js
const FIREBASE_CONFIG = {
    apiKey:            'TUA_API_KEY',
    authDomain:        'TEU_PROJECT.firebaseapp.com',
    projectId:         'TEU_PROJECT_ID',
    storageBucket:     'TEU_PROJECT.appspot.com',
    messagingSenderId: 'TEU_SENDER_ID',
    appId:             'TEU_APP_ID',
};
```

> Se deixares `apiKey: 'YOUR_API_KEY'` a app corre **sem Firebase** — só `localStorage`.

---

## 📂 Estrutura mínima

```
├── index.html        # Ponto de entrada + importmap + UI + wiring
├── app.js            # Lógica core (frases, state, voice, XP, cloud)
├── firebase.js       # Wrapper Firebase (auth + firestore)
├── app.test.js       # 100+ testes unitários (Vitest)
├── vite.config.js    # Config Vite + PWA plugin
└── package.json
```

---

## 🧪 Testes

```bash
npm run test        # watch
npm run coverage    # abre coverage/index.html
```

Cobertura alvo: **≥ 90 %** em `normalizeText`, `checkMatch`, `pickNextPhrase`, `switchLanguage`, `switchLevel`.

---

## 📱 PWA / Offline

- `vite.config.js` inclui `@vite-pwa/assets-generator` + `vite-plugin-pwa`.
- `manifest.webmanifest` + `sw.js` gerados no build.
- Para testar offline: `npm run build && npx serve dist` → abre no Chrome → DevTools → Application → Service Workers → "Offline".

---

## 🌐 Deploy GitHub Pages (exemplo)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 🤝 Contribuir

1. Fork → branch `feat/nome` ou `fix/nome`.
2. `npm run test` passa.
3. `npm run coverage` não baixa a linha.
4. PR com descrição clara + screenshots se houver UI.

---

## 📄 Licença

MIT — usa livremente, menciona a origem.

---

*Teste da plataforma*