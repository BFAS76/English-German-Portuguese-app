// O SDK do Firebase é carregado preguiçosamente (dynamic import) apenas quando
// há uma configuração real. Em modo local (placeholder) o SDK nunca é obtido do
// CDN, por isso a app arranca mais depressa e funciona offline (PWA).

let auth = null;
let db = null;
let provider = null;

// Referências para as funções do SDK, preenchidas após o carregamento.
let _signInWithPopup = null;
let _signOut = null;
let _onAuthStateChanged = null;
let _doc = null;
let _setDoc = null;
let _getDoc = null;

export async function initFirebase(config) {
    if (!config?.apiKey || config.apiKey === 'YOUR_API_KEY') return;
    try {
        const [appMod, authMod, dbMod] = await Promise.all([
            import('firebase/app'),
            import('firebase/auth'),
            import('firebase/firestore'),
        ]);
        const app = appMod.initializeApp(config);
        auth = authMod.getAuth(app);
        db = dbMod.getFirestore(app);
        provider = new authMod.GoogleAuthProvider();
        _signInWithPopup = authMod.signInWithPopup;
        _signOut = authMod.signOut;
        _onAuthStateChanged = authMod.onAuthStateChanged;
        _doc = dbMod.doc;
        _setDoc = dbMod.setDoc;
        _getDoc = dbMod.getDoc;
    } catch (e) {
        console.warn('Firebase não iniciado:', e.message);
    }
}

export function isReady() {
    return auth !== null && db !== null;
}

export function getCurrentUser() {
    return auth?.currentUser ?? null;
}

export function onAuthChange(callback) {
    if (!auth) return () => {};
    return _onAuthStateChanged(auth, callback);
}

export async function signIn() {
    if (!auth) return null;
    const result = await _signInWithPopup(auth, provider);
    return result.user;
}

export async function signOutUser() {
    if (!auth) return;
    await flushCloudSave();
    await _signOut(auth);
}

// Debounce das escritas no Firestore: saveProgress corre a cada resposta certa
// e a cada troca de língua/nível, mas o localStorage já guarda tudo de imediato.
// Só precisamos de persistir na cloud o último estado, não cada passo.
export const SAVE_DEBOUNCE_MS = 1500;
let saveTimer = null;
let pendingData = null;

async function flushSave() {
    saveTimer = null;
    const data = pendingData;
    pendingData = null;
    if (!db || !auth?.currentUser || !data) return;
    try {
        await _setDoc(_doc(db, 'progress', auth.currentUser.uid), {
            ...data,
            updatedAt: Date.now(),
        });
    } catch (e) {
        // falha silenciosa — localStorage já tem os dados
    }
}

export function cloudSave(data) {
    if (!db || !auth?.currentUser) return;
    pendingData = data;
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(flushSave, SAVE_DEBOUNCE_MS);
}

// Persiste imediatamente qualquer escrita pendente (ex.: antes de sair).
export function flushCloudSave() {
    if (!saveTimer) return;
    clearTimeout(saveTimer);
    return flushSave();
}

export async function cloudLoad() {
    if (!db || !auth?.currentUser) return null;
    try {
        const snap = await _getDoc(_doc(db, 'progress', auth.currentUser.uid));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        return null;
    }
}
