import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// -----------------------------------------------------------------------------
// Mocks dos módulos Firebase (CDN/npm). Usamos factories para que os testes
// não dependam do pacote real estar instalado nem de qualquer rede.
// -----------------------------------------------------------------------------
const mockInitializeApp = vi.fn(() => ({ name: '[DEFAULT]' }));
vi.mock('firebase/app', () => ({
    initializeApp: (...args) => mockInitializeApp(...args),
}));

const mockGetAuth = vi.fn();
const mockSignInWithPopup = vi.fn();
const mockSignOut = vi.fn();
const mockOnAuthStateChanged = vi.fn();
vi.mock('firebase/auth', () => ({
    getAuth: (...args) => mockGetAuth(...args),
    signInWithPopup: (...args) => mockSignInWithPopup(...args),
    GoogleAuthProvider: vi.fn(function GoogleAuthProvider() {}),
    signOut: (...args) => mockSignOut(...args),
    onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
}));

const mockGetFirestore = vi.fn(() => ({ _type: 'firestore' }));
const mockDoc = vi.fn((...args) => ({ _ref: args }));
const mockSetDoc = vi.fn();
const mockGetDoc = vi.fn();
vi.mock('firebase/firestore', () => ({
    getFirestore: (...args) => mockGetFirestore(...args),
    doc: (...args) => mockDoc(...args),
    setDoc: (...args) => mockSetDoc(...args),
    getDoc: (...args) => mockGetDoc(...args),
}));

const VALID_CONFIG = {
    apiKey: 'real-key',
    authDomain: 'proj.firebaseapp.com',
    projectId: 'proj',
};

// Cada teste recebe um módulo fresco (o firebase.js guarda estado ao nível do
// módulo em `auth`/`db`), por isso usamos resetModules + import dinâmico.
async function freshModule() {
    vi.resetModules();
    return import('./firebase.js');
}

beforeEach(() => {
    vi.clearAllMocks();
    mockGetAuth.mockReturnValue({ currentUser: null });
    mockGetFirestore.mockReturnValue({ _type: 'firestore' });
});

afterEach(() => {
    vi.useRealTimers();
});

// -----------------------------------------------------------------------------
// initFirebase
// -----------------------------------------------------------------------------
describe('initFirebase', () => {
    it('não inicializa quando a config tem o placeholder YOUR_API_KEY', async () => {
        const fb = await freshModule();
        fb.initFirebase({ apiKey: 'YOUR_API_KEY' });
        expect(mockInitializeApp).not.toHaveBeenCalled();
        expect(fb.isReady()).toBe(false);
    });

    it('não inicializa quando a config é nula ou sem apiKey', async () => {
        const fb = await freshModule();
        fb.initFirebase(null);
        fb.initFirebase({});
        expect(mockInitializeApp).not.toHaveBeenCalled();
        expect(fb.isReady()).toBe(false);
    });

    it('inicializa auth e firestore com uma config válida', async () => {
        const fb = await freshModule();
        await fb.initFirebase(VALID_CONFIG);
        expect(mockInitializeApp).toHaveBeenCalledWith(VALID_CONFIG);
        expect(mockGetAuth).toHaveBeenCalled();
        expect(mockGetFirestore).toHaveBeenCalled();
        expect(fb.isReady()).toBe(true);
    });

    it('não lança e fica não-pronto se initializeApp falhar', async () => {
        const fb = await freshModule();
        mockInitializeApp.mockImplementationOnce(() => { throw new Error('boom'); });
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        await expect(fb.initFirebase(VALID_CONFIG)).resolves.toBeUndefined();
        expect(fb.isReady()).toBe(false);
        warn.mockRestore();
    });
});

// -----------------------------------------------------------------------------
// getCurrentUser / onAuthChange (modo não-pronto)
// -----------------------------------------------------------------------------
describe('sem Firebase inicializado', () => {
    it('getCurrentUser devolve null', async () => {
        const fb = await freshModule();
        expect(fb.getCurrentUser()).toBeNull();
    });

    it('onAuthChange devolve uma função noop e não regista listener', async () => {
        const fb = await freshModule();
        const unsub = fb.onAuthChange(() => {});
        expect(typeof unsub).toBe('function');
        expect(mockOnAuthStateChanged).not.toHaveBeenCalled();
        expect(() => unsub()).not.toThrow();
    });

    it('signIn devolve null', async () => {
        const fb = await freshModule();
        await expect(fb.signIn()).resolves.toBeNull();
        expect(mockSignInWithPopup).not.toHaveBeenCalled();
    });

    it('signOutUser não faz nada', async () => {
        const fb = await freshModule();
        await fb.signOutUser();
        expect(mockSignOut).not.toHaveBeenCalled();
    });

    it('cloudSave não escreve', async () => {
        const fb = await freshModule();
        await fb.cloudSave({ score: 10 });
        expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('cloudLoad devolve null', async () => {
        const fb = await freshModule();
        await expect(fb.cloudLoad()).resolves.toBeNull();
        expect(mockGetDoc).not.toHaveBeenCalled();
    });
});

// -----------------------------------------------------------------------------
// Fluxos com Firebase pronto e utilizador autenticado
// -----------------------------------------------------------------------------
describe('com Firebase pronto', () => {
    const USER = { uid: 'user-123', email: 'a@b.com', displayName: 'Ana B' };

    async function readyModuleWithUser() {
        mockGetAuth.mockReturnValue({ currentUser: USER });
        const fb = await freshModule();
        await fb.initFirebase(VALID_CONFIG);
        return fb;
    }

    it('getCurrentUser devolve o utilizador atual', async () => {
        const fb = await readyModuleWithUser();
        expect(fb.getCurrentUser()).toBe(USER);
    });

    it('onAuthChange regista o listener e devolve o unsubscribe', async () => {
        const unsubscribe = vi.fn();
        mockOnAuthStateChanged.mockReturnValueOnce(unsubscribe);
        const fb = await readyModuleWithUser();
        const cb = () => {};
        const result = fb.onAuthChange(cb);
        expect(mockOnAuthStateChanged).toHaveBeenCalledWith(expect.anything(), cb);
        expect(result).toBe(unsubscribe);
    });

    it('signIn chama signInWithPopup e devolve o utilizador', async () => {
        const fb = await readyModuleWithUser();
        mockSignInWithPopup.mockResolvedValueOnce({ user: USER });
        await expect(fb.signIn()).resolves.toBe(USER);
        expect(mockSignInWithPopup).toHaveBeenCalled();
    });

    it('signOutUser chama signOut', async () => {
        const fb = await readyModuleWithUser();
        await fb.signOutUser();
        expect(mockSignOut).toHaveBeenCalled();
    });

    it('cloudSave grava no doc do utilizador com updatedAt (após o debounce)', async () => {
        vi.useFakeTimers();
        const fb = await readyModuleWithUser();
        mockSetDoc.mockResolvedValue();
        fb.cloudSave({ score: 30, language: 'de', level: 'B1' });
        expect(mockSetDoc).not.toHaveBeenCalled(); // ainda em debounce
        await vi.advanceTimersByTimeAsync(fb.SAVE_DEBOUNCE_MS);
        expect(mockDoc).toHaveBeenCalledWith(expect.anything(), 'progress', 'user-123');
        const payload = mockSetDoc.mock.calls[0][1];
        expect(payload).toMatchObject({ score: 30, language: 'de', level: 'B1' });
        expect(typeof payload.updatedAt).toBe('number');
        vi.useRealTimers();
    });

    it('coalesce escritas rápidas numa só (debounce)', async () => {
        vi.useFakeTimers();
        const fb = await readyModuleWithUser();
        mockSetDoc.mockResolvedValue();
        fb.cloudSave({ score: 10 });
        fb.cloudSave({ score: 20 });
        fb.cloudSave({ score: 30 });
        await vi.advanceTimersByTimeAsync(fb.SAVE_DEBOUNCE_MS);
        expect(mockSetDoc).toHaveBeenCalledTimes(1);
        expect(mockSetDoc.mock.calls[0][1]).toMatchObject({ score: 30 });
        vi.useRealTimers();
    });

    it('flushCloudSave persiste imediatamente a escrita pendente', async () => {
        vi.useFakeTimers();
        const fb = await readyModuleWithUser();
        mockSetDoc.mockResolvedValue();
        fb.cloudSave({ score: 42 });
        await fb.flushCloudSave();
        expect(mockSetDoc).toHaveBeenCalledTimes(1);
        expect(mockSetDoc.mock.calls[0][1]).toMatchObject({ score: 42 });
        vi.useRealTimers();
    });

    it('cloudSave engole erros do Firestore silenciosamente', async () => {
        vi.useFakeTimers();
        const fb = await readyModuleWithUser();
        mockSetDoc.mockRejectedValue(new Error('offline'));
        fb.cloudSave({ score: 1 });
        // Se o erro não fosse engolido, este await rejeitaria e o teste falhava.
        await vi.advanceTimersByTimeAsync(fb.SAVE_DEBOUNCE_MS);
        expect(mockSetDoc).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('cloudLoad devolve os dados quando o documento existe', async () => {
        const fb = await readyModuleWithUser();
        const data = { score: 99, language: 'en', level: 'A2' };
        mockGetDoc.mockResolvedValueOnce({ exists: () => true, data: () => data });
        await expect(fb.cloudLoad()).resolves.toEqual(data);
    });

    it('cloudLoad devolve null quando o documento não existe', async () => {
        const fb = await readyModuleWithUser();
        mockGetDoc.mockResolvedValueOnce({ exists: () => false, data: () => ({}) });
        await expect(fb.cloudLoad()).resolves.toBeNull();
    });

    it('cloudLoad devolve null em caso de erro', async () => {
        const fb = await readyModuleWithUser();
        mockGetDoc.mockRejectedValueOnce(new Error('offline'));
        await expect(fb.cloudLoad()).resolves.toBeNull();
    });
});
