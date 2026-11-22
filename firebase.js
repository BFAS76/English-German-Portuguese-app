import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as fbSignOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

let auth = null;
let db = null;
const provider = new GoogleAuthProvider();

export function initFirebase(config) {
    if (!config?.apiKey || config.apiKey === 'YOUR_API_KEY') return;
    try {
        const app = initializeApp(config);
        auth = getAuth(app);
        db = getFirestore(app);
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
    return onAuthStateChanged(auth, callback);
}

export async function signIn() {
    if (!auth) return null;
    const result = await signInWithPopup(auth, provider);
    return result.user;
}

export async function signOutUser() {
    if (!auth) return;
    await flushCloudSave();
    await fbSignOut(auth);
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
        await setDoc(doc(db, 'progress', auth.currentUser.uid), {
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
        const snap = await getDoc(doc(db, 'progress', auth.currentUser.uid));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        return null;
    }
}
