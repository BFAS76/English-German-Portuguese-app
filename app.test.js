import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
    normalizeText,
    checkMatch,
    pickNextPhrase,
    getLangCode,
    updateLanguageUI,
    updateLevelUI,
    switchLanguage,
    switchBase,
    switchLevel,
    switchCategory,
    updateBaseUI,
    renderPhrase,
    library,
    LANGUAGES,
    LEVELS,
    CATEGORIES,
    ALL_CATEGORIES,
    cloud,
    state,
    resetState,
    saveProgress,
    loadFromCloud,
    loadProgress,
    initAudio,
    playVoice,
    nextPhrase,
    handleRecognitionResult,
    startRecognition,
    updateStatsUI,
    recordProgress,
    countCorrect,
    RECENT_WINDOW,
} from './app.js';

const DOM_TEMPLATE = `
    <div id="points">0</div>
    <div id="cat-display"></div>
    <div id="phrase-display"></div>
    <div id="translation-display"></div>
    <button class="btn-listen"></button>
    <button id="mic-btn"></button>
    <button class="btn-next"></button>
    <div id="status"></div>
    <button class="btn-lang active" data-lang="en"></button>
    <button class="btn-lang" data-lang="de"></button>
    <button class="btn-lang" data-lang="pt"></button>
    <button class="btn-base" data-base="en"></button>
    <button class="btn-base" data-base="de"></button>
    <button class="btn-base active" data-base="pt"></button>
    <button class="btn-level active" data-level="A1"></button>
    <button class="btn-level" data-level="A2"></button>
    <button class="btn-level" data-level="B1"></button>
    <select id="cat-select"></select>
    <div id="stats-total"></div>
    <div id="stats-levels"></div>
    <div id="stats-cats"></div>
`;

beforeEach(() => {
    document.body.innerHTML = DOM_TEMPLATE;
    localStorage.clear();
    vi.stubGlobal('SpeechSynthesisUtterance', vi.fn(function (text) { this.text = text; }));
    vi.stubGlobal('speechSynthesis', { speak: vi.fn(), cancel: vi.fn() });
    resetState();
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// library (integridade dos dados)
// ---------------------------------------------------------------------------
describe('library', () => {
    it('tem pelo menos 140 frases', () => {
        expect(library.length).toBeGreaterThanOrEqual(140);
    });

    it('cada frase tem level válido e en/de/pt/cat não vazios', () => {
        for (const p of library) {
            expect(LEVELS).toContain(p.level);
            for (const field of ['cat', 'en', 'de', 'pt']) {
                expect(typeof p[field]).toBe('string');
                expect(p[field].trim().length).toBeGreaterThan(0);
            }
        }
    });

    it('não tem frases em inglês duplicadas', () => {
        const seen = new Set();
        const dups = [];
        for (const p of library) {
            if (seen.has(p.en)) dups.push(p.en);
            seen.add(p.en);
        }
        expect(dups).toEqual([]);
    });

    it('inclui as categorias novas', () => {
        const cats = new Set(library.map(p => p.cat));
        for (const c of ['Shopping', 'Health', 'Directions', 'Weather', 'Time']) {
            expect(cats.has(c)).toBe(true);
        }
    });
});

// ---------------------------------------------------------------------------
// normalizeText
// ---------------------------------------------------------------------------
describe('normalizeText', () => {
    it('converte para minúsculas', () => {
        expect(normalizeText('Nice To Meet You')).toBe('nice to meet you');
    });

    it('remove pontuação ?.!,', () => {
        expect(normalizeText('Hello, world! How are you?')).toBe('hello world how are you');
    });

    it('remove espaços no início e no fim', () => {
        expect(normalizeText('  hello  ')).toBe('hello');
    });

    it('trata string vazia sem erros', () => {
        expect(normalizeText('')).toBe('');
    });
});

// ---------------------------------------------------------------------------
// checkMatch
// ---------------------------------------------------------------------------
describe('checkMatch', () => {
    it('aceita correspondência exata (case-insensitive)', () => {
        expect(checkMatch('Nice to meet you', 'Nice to meet you')).toBe(true);
    });

    it('aceita frase parcial com mais de 3 caracteres', () => {
        expect(checkMatch('nice to meet', 'Nice to meet you')).toBe(true);
    });

    it('rejeita frase parcial com 3 ou menos caracteres', () => {
        expect(checkMatch('hi', 'hi there friend')).toBe(false);
    });

    it('rejeita resposta completamente errada', () => {
        expect(checkMatch('goodbye everyone', 'nice to meet you')).toBe(false);
    });

    it('ignora pontuação na comparação', () => {
        expect(checkMatch('How is it going?', 'How is it going?')).toBe(true);
    });

    it('rejeita string vazia', () => {
        expect(checkMatch('', 'nice to meet you')).toBe(false);
    });

    it('rejeita quando o dito contém a frase alvo mas não o contrário', () => {
        expect(checkMatch('nice to meet you really', 'nice to meet you')).toBe(false);
    });

    it('funciona com frases em alemão', () => {
        expect(checkMatch('Guten Morgen', 'Guten Morgen')).toBe(true);
        expect(checkMatch('guten morgen', 'Guten Morgen')).toBe(true);
    });

    it('rejeita uma palavra curta que cobre pouco da frase alvo', () => {
        expect(checkMatch('good', 'good morning')).toBe(false);
    });

    it('aceita quando o dito cobre a maior parte da frase', () => {
        expect(checkMatch('thank you very', 'thank you very much')).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// pickNextPhrase
// ---------------------------------------------------------------------------
describe('pickNextPhrase', () => {
    it('devolve uma frase da biblioteca', () => {
        const phrase = pickNextPhrase(library, null);
        expect(library).toContain(phrase);
    });

    it('nunca devolve a mesma frase que a atual', () => {
        const current = library[0].en;
        for (let i = 0; i < 30; i++) {
            expect(pickNextPhrase(library, current).en).not.toBe(current);
        }
    });

    it('devolve null para biblioteca vazia', () => {
        expect(pickNextPhrase([], null)).toBeNull();
    });

    it('devolve o único item quando biblioteca tem 1 frase', () => {
        const single = [{ level: "A1", cat: "Test", en: "Hello", de: "Hallo", pt: "Olá" }];
        expect(pickNextPhrase(single, null)).toEqual(single[0]);
    });

    it('funciona na primeira chamada quando currentEn é undefined', () => {
        const phrase = pickNextPhrase(library, undefined);
        expect(phrase).toBeDefined();
        expect(phrase.en).toBeDefined();
    });

    it('devolve a única frase mesmo que seja a atual (biblioteca de 1 item)', () => {
        const single = [{ level: "A1", cat: "Test", en: "Hello", de: "Hallo", pt: "Olá" }];
        expect(pickNextPhrase(single, "Hello")).toEqual(single[0]);
    });

    it('filtra frases pelo nível especificado', () => {
        for (let i = 0; i < 20; i++) {
            expect(pickNextPhrase(library, null, 'B1').level).toBe('B1');
        }
    });

    it('devolve null quando nenhuma frase corresponde ao nível', () => {
        expect(pickNextPhrase(library, null, 'C2')).toBeNull();
    });

    it('sem filtro de nível devolve frases de qualquer nível', () => {
        const levels = new Set();
        for (let i = 0; i < 50; i++) {
            levels.add(pickNextPhrase(library, null).level);
        }
        expect(levels.size).toBeGreaterThan(1);
    });
});

// ---------------------------------------------------------------------------
// getLangCode
// ---------------------------------------------------------------------------
describe('getLangCode', () => {
    it('devolve en-US para inglês', () => {
        state.language = 'en';
        expect(getLangCode()).toBe('en-US');
    });

    it('devolve de-DE para alemão', () => {
        state.language = 'de';
        expect(getLangCode()).toBe('de-DE');
    });

    it('devolve pt-PT para português', () => {
        state.language = 'pt';
        expect(getLangCode()).toBe('pt-PT');
    });

    it('aceita uma língua explícita como argumento', () => {
        expect(getLangCode('pt')).toBe('pt-PT');
        expect(getLangCode('de')).toBe('de-DE');
    });
});

// ---------------------------------------------------------------------------
// switchLanguage
// ---------------------------------------------------------------------------
describe('switchLanguage', () => {
    beforeEach(() => {
        state.current = library.find(p => p.en === 'Good morning');
    });

    it('muda o state.language', () => {
        switchLanguage('de');
        expect(state.language).toBe('de');
    });

    it('atualiza o DOM com a frase na nova língua', () => {
        switchLanguage('de');
        expect(document.getElementById('phrase-display').innerText).toBe('Guten Morgen');
    });

    it('volta para inglês corretamente', () => {
        switchLanguage('de');
        switchLanguage('en');
        expect(document.getElementById('phrase-display').innerText).toBe('Good morning');
    });

    it('marca o botão correto como active', () => {
        switchLanguage('de');
        expect(document.querySelector('[data-lang="de"]').classList.contains('active')).toBe(true);
        expect(document.querySelector('[data-lang="en"]').classList.contains('active')).toBe(false);
    });

    it('ignora língua inválida', () => {
        switchLanguage('fr');
        expect(state.language).toBe('en');
    });

    it('guarda a preferência no localStorage', () => {
        switchLanguage('de');
        expect(localStorage.getItem('englishAppLanguage')).toBe('de');
    });
});

// ---------------------------------------------------------------------------
// switchLevel
// ---------------------------------------------------------------------------
describe('switchLevel', () => {
    it('muda o state.level', () => {
        switchLevel('A2');
        expect(state.level).toBe('A2');
    });

    it('carrega uma nova frase do nível selecionado', () => {
        switchLevel('B1');
        expect(state.current.level).toBe('B1');
    });

    it('marca o botão correto como active', () => {
        switchLevel('A2');
        expect(document.querySelector('[data-level="A2"]').classList.contains('active')).toBe(true);
        expect(document.querySelector('[data-level="A1"]').classList.contains('active')).toBe(false);
    });

    it('ignora nível inválido', () => {
        switchLevel('C1');
        expect(state.level).toBe('A1');
    });

    it('guarda a preferência no localStorage', () => {
        switchLevel('B1');
        expect(localStorage.getItem('englishAppLevel')).toBe('B1');
    });
});

// ---------------------------------------------------------------------------
// initAudio
// ---------------------------------------------------------------------------
describe('initAudio', () => {
    it('chama speechSynthesis.speak na primeira chamada', () => {
        initAudio();
        expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('é idempotente — segunda chamada não faz nada', () => {
        initAudio();
        initAudio();
        expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('marca audioInitialized como true', () => {
        initAudio();
        expect(state.audioInitialized).toBe(true);
    });

    it('chama nextPhrase na primeira vez quando não há frase atual', () => {
        initAudio();
        expect(state.current.en).toBeDefined();
    });

    it('não chama nextPhrase se já existir uma frase atual', () => {
        state.current = library[0];
        state.audioInitialized = false;
        initAudio();
        expect(state.current).toEqual(library[0]);
    });
});

// ---------------------------------------------------------------------------
// playVoice
// ---------------------------------------------------------------------------
describe('playVoice', () => {
    it('não faz nada se não houver frase atual', () => {
        playVoice();
        expect(window.speechSynthesis.cancel).not.toHaveBeenCalled();
        expect(window.speechSynthesis.speak).not.toHaveBeenCalled();
    });

    it('cancela síntese anterior e fala a frase atual', () => {
        state.current = library[0];
        playVoice();
        expect(window.speechSynthesis.cancel).toHaveBeenCalledTimes(1);
        expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1);
    });

    it('usa idioma en-US e velocidade 0.8 para inglês', () => {
        state.current = library[0];
        const utterance = { lang: '', rate: 0 };
        vi.mocked(SpeechSynthesisUtterance).mockImplementationOnce(function () { return utterance; });
        playVoice();
        expect(utterance.lang).toBe('en-US');
        expect(utterance.rate).toBe(0.8);
    });

    it('usa idioma de-DE para alemão', () => {
        state.current = library[0];
        state.language = 'de';
        const utterance = { lang: '', rate: 0 };
        vi.mocked(SpeechSynthesisUtterance).mockImplementationOnce(function () { return utterance; });
        playVoice();
        expect(utterance.lang).toBe('de-DE');
    });

    it('fala a frase alemã quando idioma é DE', () => {
        state.current = library.find(p => p.en === 'Good morning');
        state.language = 'de';
        playVoice();
        expect(vi.mocked(SpeechSynthesisUtterance)).toHaveBeenCalledWith('Guten Morgen');
    });

    it('escolhe uma voz correspondente ao idioma quando disponível', () => {
        const enVoice = { lang: 'en-US', name: 'English' };
        const deVoice = { lang: 'de-DE', name: 'German' };
        window.speechSynthesis.getVoices = vi.fn(() => [enVoice, deVoice]);
        state.current = library.find(p => p.en === 'Good morning');
        state.language = 'de';
        const utterance = { lang: '', rate: 0, voice: null };
        vi.mocked(SpeechSynthesisUtterance).mockImplementationOnce(function () { return utterance; });
        playVoice();
        expect(utterance.voice).toBe(deVoice);
    });

    it('não define voz quando nenhuma corresponde', () => {
        window.speechSynthesis.getVoices = vi.fn(() => [{ lang: 'fr-FR', name: 'French' }]);
        state.current = library.find(p => p.en === 'Good morning');
        const utterance = { lang: '', rate: 0, voice: null };
        vi.mocked(SpeechSynthesisUtterance).mockImplementationOnce(function () { return utterance; });
        playVoice();
        expect(utterance.voice).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// handleRecognitionResult
// ---------------------------------------------------------------------------
describe('handleRecognitionResult', () => {
    beforeEach(() => {
        state.current = library.find(p => p.en === 'Nice to meet you');
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('devolve true e atribui +10 XP numa resposta correta (EN)', () => {
        expect(handleRecognitionResult('Nice to meet you')).toBe(true);
        expect(state.score).toBe(10);
    });

    it('atualiza o DOM com o novo score', () => {
        handleRecognitionResult('Nice to meet you');
        expect(document.getElementById('points').innerText).toBe('10');
    });

    it('acumula pontos em respostas corretas consecutivas', () => {
        handleRecognitionResult('Nice to meet you');
        state.current = library.find(p => p.en === 'How is it going?');
        handleRecognitionResult('How is it going');
        expect(state.score).toBe(20);
    });

    it('devolve false e não altera score numa resposta errada', () => {
        expect(handleRecognitionResult('goodbye everyone')).toBe(false);
        expect(state.score).toBe(0);
    });

    it('mostra mensagem de erro com o que foi dito', () => {
        handleRecognitionResult('something wrong');
        expect(document.getElementById('status').innerText).toContain('something wrong');
    });

    it('agenda nextPhrase após 2000ms numa resposta correta', () => {
        handleRecognitionResult('Nice to meet you');
        const previousPhrase = state.current.en;
        vi.advanceTimersByTime(2000);
        expect(state.current.en).not.toBe(previousPhrase);
    });

    it('não agenda nextPhrase numa resposta errada', () => {
        handleRecognitionResult('something wrong');
        const previousPhrase = state.current.en;
        vi.advanceTimersByTime(2000);
        expect(state.current.en).toBe(previousPhrase);
    });

    it('avalia frase alemã corretamente quando idioma é DE', () => {
        state.current = library.find(p => p.en === 'Good morning');
        state.language = 'de';
        expect(handleRecognitionResult('Guten Morgen')).toBe(true);
    });

    it('rejeita frase inglesa quando idioma esperado é DE', () => {
        state.current = library.find(p => p.en === 'Good morning');
        state.language = 'de';
        expect(handleRecognitionResult('Good morning')).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// startRecognition
// ---------------------------------------------------------------------------
describe('startRecognition', () => {
    it('mostra alerta se SpeechRecognition não estiver disponível', () => {
        vi.stubGlobal('alert', vi.fn());
        vi.stubGlobal('SpeechRecognition', undefined);
        vi.stubGlobal('webkitSpeechRecognition', undefined);
        startRecognition();
        expect(window.alert).toHaveBeenCalledWith("Browser error");
    });

    it('usa webkitSpeechRecognition como fallback', () => {
        const mockStart = vi.fn();
        const MockRecognition = vi.fn(function () {
            return { lang: '', start: mockStart, onstart: null, onresult: null, onend: null };
        });
        vi.stubGlobal('SpeechRecognition', undefined);
        vi.stubGlobal('webkitSpeechRecognition', MockRecognition);
        startRecognition();
        expect(MockRecognition).toHaveBeenCalled();
        expect(mockStart).toHaveBeenCalled();
    });

    it('define o idioma como en-US quando língua é EN', () => {
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        startRecognition();
        expect(mockRecognition.lang).toBe('en-US');
    });

    it('define o idioma como de-DE quando língua é DE', () => {
        state.language = 'de';
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        startRecognition();
        expect(mockRecognition.lang).toBe('de-DE');
    });

    it('onstart atualiza o status para "Listening..."', () => {
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        startRecognition();
        mockRecognition.onstart();
        expect(document.getElementById('status').innerText).toBe('Listening...');
    });

    it('onend restaura o filtro do botão do microfone', () => {
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        document.getElementById('mic-btn').style.filter = 'brightness(1.5)';
        startRecognition();
        mockRecognition.onend();
        expect(document.getElementById('mic-btn').style.filter).toBe('none');
    });

    it('onerror mostra mensagem de permissão e repõe o botão do microfone', () => {
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null, onerror: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        document.getElementById('mic-btn').style.filter = 'brightness(1.5)';
        startRecognition();
        mockRecognition.onerror({ error: 'not-allowed' });
        expect(document.getElementById('status').innerText).toContain('Microphone');
        expect(document.getElementById('mic-btn').style.filter).toBe('none');
    });

    it('onerror trata no-speech com uma mensagem própria', () => {
        const mockRecognition = { lang: '', start: vi.fn(), onstart: null, onresult: null, onend: null, onerror: null };
        vi.stubGlobal('SpeechRecognition', vi.fn(function () { return mockRecognition; }));
        startRecognition();
        mockRecognition.onerror({ error: 'no-speech' });
        expect(document.getElementById('status').innerText).toContain("Didn't catch that");
    });
});

// ---------------------------------------------------------------------------
// saveProgress / loadProgress
// ---------------------------------------------------------------------------
describe('saveProgress', () => {
    it('guarda o score atual no localStorage', () => {
        state.score = 50;
        saveProgress();
        expect(localStorage.getItem('englishAppScore')).toBe('50');
    });

    it('guarda zero quando o score é 0', () => {
        saveProgress();
        expect(localStorage.getItem('englishAppScore')).toBe('0');
    });

    it('sobrescreve valor anterior com o novo score', () => {
        state.score = 30;
        saveProgress();
        state.score = 80;
        saveProgress();
        expect(localStorage.getItem('englishAppScore')).toBe('80');
    });

    it('guarda a língua atual', () => {
        state.language = 'de';
        saveProgress();
        expect(localStorage.getItem('englishAppLanguage')).toBe('de');
    });

    it('guarda o nível atual', () => {
        state.level = 'B1';
        saveProgress();
        expect(localStorage.getItem('englishAppLevel')).toBe('B1');
    });
});

describe('loadProgress', () => {
    it('restaura o score do localStorage para o state', () => {
        localStorage.setItem('englishAppScore', '70');
        loadProgress();
        expect(state.score).toBe(70);
    });

    it('atualiza o DOM com o score carregado', () => {
        localStorage.setItem('englishAppScore', '40');
        loadProgress();
        expect(document.getElementById('points').innerText).toBe('40');
    });

    it('não altera o score se não houver nada guardado', () => {
        loadProgress();
        expect(state.score).toBe(0);
    });

    it('trata valor corrompido no localStorage — usa 0', () => {
        localStorage.setItem('englishAppScore', 'abc');
        loadProgress();
        expect(state.score).toBe(0);
    });

    it('restaura a língua do localStorage', () => {
        localStorage.setItem('englishAppLanguage', 'de');
        loadProgress();
        expect(state.language).toBe('de');
    });

    it('restaura o nível do localStorage', () => {
        localStorage.setItem('englishAppLevel', 'B1');
        loadProgress();
        expect(state.level).toBe('B1');
    });

    it('ignora língua inválida no localStorage', () => {
        localStorage.setItem('englishAppLanguage', 'fr');
        loadProgress();
        expect(state.language).toBe('en');
    });

    it('ignora nível inválido no localStorage', () => {
        localStorage.setItem('englishAppLevel', 'C2');
        loadProgress();
        expect(state.level).toBe('A1');
    });
});

describe('integração save/load', () => {
    it('score, língua e nível mantêm-se após simular fechar e reabrir a app', () => {
        state.current = library.find(p => p.en === 'Nice to meet you');
        state.language = 'de';
        state.level = 'A2';
        vi.useFakeTimers();
        handleRecognitionResult('Schön, Sie kennenzulernen');
        vi.useRealTimers();

        resetState();
        expect(state.score).toBe(0);
        expect(state.language).toBe('en');
        expect(state.level).toBe('A1');

        loadProgress();
        expect(state.score).toBe(10);
        expect(state.language).toBe('de');
        expect(state.level).toBe('A2');
    });
});

// ---------------------------------------------------------------------------
// saveProgress — cloud.save
// ---------------------------------------------------------------------------
describe('saveProgress com cloud.save', () => {
    beforeEach(() => {
        cloud.save = vi.fn();
        cloud.load = null;
    });

    afterEach(() => {
        cloud.save = null;
        cloud.load = null;
    });

    it('chama cloud.save com score, língua e nível corretos', () => {
        state.score = 30;
        state.language = 'de';
        state.level = 'B1';
        saveProgress();
        expect(cloud.save).toHaveBeenCalledWith(expect.objectContaining({ score: 30, language: 'de', level: 'B1' }));
    });

    it('chama cloud.save mesmo com score zero', () => {
        saveProgress();
        expect(cloud.save).toHaveBeenCalledWith(expect.objectContaining({ score: 0, language: 'en', level: 'A1' }));
    });

    it('chama cloud.save após resposta correta', () => {
        state.current = library.find(p => p.en === 'Nice to meet you');
        vi.useFakeTimers();
        handleRecognitionResult('Nice to meet you');
        vi.useRealTimers();
        expect(cloud.save).toHaveBeenCalledWith(expect.objectContaining({ score: 10 }));
    });

    it('não lança erro se cloud.save for null', () => {
        cloud.save = null;
        expect(() => saveProgress()).not.toThrow();
    });
});

// ---------------------------------------------------------------------------
// loadFromCloud
// ---------------------------------------------------------------------------
describe('loadFromCloud', () => {
    beforeEach(() => {
        cloud.load = vi.fn().mockResolvedValue(null);
    });

    afterEach(() => {
        cloud.load = null;
    });

    it('atualiza o score se Firebase tem valor maior', async () => {
        state.score = 10;
        cloud.load.mockResolvedValueOnce({ score: 50, language: 'en', level: 'A1' });
        await loadFromCloud();
        expect(state.score).toBe(50);
        expect(document.getElementById('points').innerText).toBe('50');
    });

    it('não altera o score se Firebase tem valor menor', async () => {
        state.score = 80;
        cloud.load.mockResolvedValueOnce({ score: 30, language: 'en', level: 'A1' });
        await loadFromCloud();
        expect(state.score).toBe(80);
    });

    it('não faz nada se cloud.load devolver null', async () => {
        state.score = 20;
        await loadFromCloud();
        expect(state.score).toBe(20);
    });

    it('não faz nada se cloud.load for null', async () => {
        cloud.load = null;
        state.score = 20;
        await loadFromCloud();
        expect(state.score).toBe(20);
    });

    it('restaura língua e nível do Firebase', async () => {
        cloud.load.mockResolvedValueOnce({ score: 0, language: 'de', level: 'B1' });
        await loadFromCloud();
        expect(state.language).toBe('de');
        expect(state.level).toBe('B1');
    });

    it('ignora língua inválida vinda do Firebase', async () => {
        cloud.load.mockResolvedValueOnce({ score: 0, language: 'fr', level: 'A1' });
        await loadFromCloud();
        expect(state.language).toBe('en');
    });

    it('sincroniza score para o localStorage após carregar do Firebase', async () => {
        state.score = 0;
        cloud.load.mockResolvedValueOnce({ score: 60, language: 'en', level: 'A1' });
        await loadFromCloud();
        expect(localStorage.getItem('englishAppScore')).toBe('60');
    });
});

// ---------------------------------------------------------------------------
// pickNextPhrase — filtro por categoria
// ---------------------------------------------------------------------------
describe('pickNextPhrase (categoria)', () => {
    it('filtra pela categoria indicada', () => {
        for (let i = 0; i < 20; i++) {
            expect(pickNextPhrase(library, null, null, 'Shopping').cat).toBe('Shopping');
        }
    });

    it('combina filtro de nível e de categoria', () => {
        for (let i = 0; i < 20; i++) {
            const p = pickNextPhrase(library, null, 'A1', 'Weather');
            expect(p.level).toBe('A1');
            expect(p.cat).toBe('Weather');
        }
    });

    it('ALL_CATEGORIES não filtra por categoria', () => {
        const cats = new Set();
        for (let i = 0; i < 60; i++) cats.add(pickNextPhrase(library, null, null, ALL_CATEGORIES).cat);
        expect(cats.size).toBeGreaterThan(1);
    });

    it('devolve null quando a combinação nível+categoria não existe', () => {
        expect(pickNextPhrase(library, null, 'C2', 'Shopping')).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// switchCategory
// ---------------------------------------------------------------------------
describe('switchCategory', () => {
    it('muda o state.category', () => {
        switchCategory('Shopping');
        expect(state.category).toBe('Shopping');
    });

    it('carrega uma frase da categoria selecionada', () => {
        switchCategory('Shopping');
        expect(state.current.cat).toBe('Shopping');
    });

    it('ignora categoria inválida', () => {
        switchCategory('DoesNotExist');
        expect(state.category).toBe(ALL_CATEGORIES);
    });

    it('aceita ALL_CATEGORIES', () => {
        switchCategory('Shopping');
        switchCategory(ALL_CATEGORIES);
        expect(state.category).toBe(ALL_CATEGORIES);
    });

    it('guarda a categoria no localStorage', () => {
        switchCategory('Health');
        expect(localStorage.getItem('englishAppCategory')).toBe('Health');
    });
});

// ---------------------------------------------------------------------------
// estatísticas de progresso
// ---------------------------------------------------------------------------
describe('estatísticas', () => {
    it('recordProgress incrementa por categoria e por nível', () => {
        recordProgress({ level: 'A1', cat: 'Food', en: 'x' });
        recordProgress({ level: 'A1', cat: 'Food', en: 'y' });
        recordProgress({ level: 'B1', cat: 'Work', en: 'z' });
        expect(state.stats.byCategory.Food).toBe(2);
        expect(state.stats.byCategory.Work).toBe(1);
        expect(state.stats.byLevel.A1).toBe(2);
        expect(state.stats.byLevel.B1).toBe(1);
    });

    it('recordProgress ignora frases sem categoria/nível', () => {
        recordProgress({});
        recordProgress(null);
        expect(countCorrect()).toBe(0);
    });

    it('countCorrect soma os acertos de todos os níveis', () => {
        recordProgress({ level: 'A1', cat: 'Food', en: 'x' });
        recordProgress({ level: 'A2', cat: 'Food', en: 'y' });
        expect(countCorrect()).toBe(2);
    });

    it('handleRecognitionResult regista a frase correta nas stats', () => {
        state.current = library.find(p => p.en === 'Nice to meet you');
        vi.useFakeTimers();
        handleRecognitionResult('Nice to meet you');
        vi.useRealTimers();
        expect(state.stats.byLevel.A1).toBe(1);
        expect(state.stats.byCategory.Greetings).toBe(1);
    });

    it('updateStatsUI escreve os totais no DOM', () => {
        recordProgress({ level: 'A1', cat: 'Food', en: 'x' });
        updateStatsUI();
        expect(document.getElementById('stats-total').innerText).toBe('1');
        expect(document.getElementById('stats-levels').innerText).toContain('A1: 1');
        expect(document.getElementById('stats-cats').innerText).toContain('Food: 1');
    });
});

// ---------------------------------------------------------------------------
// persistência de categoria e estatísticas
// ---------------------------------------------------------------------------
describe('persistência de categoria e stats', () => {
    it('guarda e restaura a categoria', () => {
        state.category = 'Travel';
        saveProgress();
        resetState();
        expect(state.category).toBe(ALL_CATEGORIES);
        loadProgress();
        expect(state.category).toBe('Travel');
    });

    it('guarda e restaura as estatísticas', () => {
        recordProgress({ level: 'A2', cat: 'Health', en: 'x' });
        saveProgress();
        resetState();
        loadProgress();
        expect(state.stats.byCategory.Health).toBe(1);
        expect(state.stats.byLevel.A2).toBe(1);
    });

    it('ignora estatísticas corrompidas no localStorage', () => {
        localStorage.setItem('englishAppStats', 'not-json');
        loadProgress();
        expect(state.stats).toEqual({ byCategory: {}, byLevel: {} });
    });

    it('ignora categoria inválida no localStorage', () => {
        localStorage.setItem('englishAppCategory', 'Bogus');
        loadProgress();
        expect(state.category).toBe(ALL_CATEGORIES);
    });
});

describe('loadFromCloud (categoria e stats)', () => {
    beforeEach(() => {
        cloud.load = vi.fn().mockResolvedValue(null);
    });
    afterEach(() => {
        cloud.load = null;
    });

    it('restaura a categoria vinda do Firebase', async () => {
        cloud.load.mockResolvedValueOnce({ score: 0, category: 'Directions' });
        await loadFromCloud();
        expect(state.category).toBe('Directions');
    });

    it('ignora categoria inválida vinda do Firebase', async () => {
        cloud.load.mockResolvedValueOnce({ score: 0, category: 'Bogus' });
        await loadFromCloud();
        expect(state.category).toBe(ALL_CATEGORIES);
    });

    it('funde as estatísticas mantendo o máximo por chave', async () => {
        state.stats = { byCategory: { Food: 5 }, byLevel: { A1: 5 } };
        cloud.load.mockResolvedValueOnce({ score: 0, stats: { byCategory: { Food: 2, Work: 3 }, byLevel: { A1: 8 } } });
        await loadFromCloud();
        expect(state.stats.byCategory.Food).toBe(5);
        expect(state.stats.byCategory.Work).toBe(3);
        expect(state.stats.byLevel.A1).toBe(8);
    });
});

// ---------------------------------------------------------------------------
// pickNextPhrase — repetição espaçada (janela + peso por domínio)
// ---------------------------------------------------------------------------
describe('pickNextPhrase (repetição espaçada)', () => {
    const LIB = [
        { level: 'A1', cat: 'T', en: 'A', de: 'a', pt: 'a' },
        { level: 'A1', cat: 'T', en: 'B', de: 'b', pt: 'b' },
        { level: 'A1', cat: 'T', en: 'C', de: 'c', pt: 'c' },
        { level: 'A1', cat: 'T', en: 'D', de: 'd', pt: 'd' },
    ];

    it('evita a frase atual e as recentes (não repete cedo)', () => {
        for (let i = 0; i < 40; i++) {
            const p = pickNextPhrase(LIB, 'A', 'A1', 'T', { recent: ['B', 'C'] });
            expect(['A', 'B', 'C']).not.toContain(p.en);
            expect(p.en).toBe('D');
        }
    });

    it('recomeça (ignora a janela) quando ela cobre tudo menos a atual', () => {
        for (let i = 0; i < 40; i++) {
            const p = pickNextPhrase(LIB, 'A', 'A1', 'T', { recent: ['B', 'C', 'D'] });
            expect(p.en).not.toBe('A');
            expect(['B', 'C', 'D']).toContain(p.en);
        }
    });

    it('dá mais peso às frases menos dominadas', () => {
        const two = [
            { level: 'A1', cat: 'T', en: 'weak', de: 'x', pt: 'x' },
            { level: 'A1', cat: 'T', en: 'strong', de: 'y', pt: 'y' },
        ];
        const mastery = { strong: 3 }; // pesos: weak=1, strong=0.25, total=1.25
        expect(pickNextPhrase(two, null, 'A1', 'T', { mastery, rand: () => 0.5 }).en).toBe('weak');
        expect(pickNextPhrase(two, null, 'A1', 'T', { mastery, rand: () => 0.95 }).en).toBe('strong');
    });

    it('as frases falhadas aparecem muito mais do que as dominadas', () => {
        const two = [
            { level: 'A1', cat: 'T', en: 'weak', de: 'x', pt: 'x' },
            { level: 'A1', cat: 'T', en: 'strong', de: 'y', pt: 'y' },
        ];
        const mastery = { strong: 9 }; // strong bem mais improvável
        let weak = 0;
        for (let i = 0; i < 400; i++) {
            if (pickNextPhrase(two, null, 'A1', 'T', { mastery }).en === 'weak') weak++;
        }
        expect(weak).toBeGreaterThan(300);
    });

    it('nunca faz a dominada desaparecer de todo (continua a haver revisão)', () => {
        const two = [
            { level: 'A1', cat: 'T', en: 'weak', de: 'x', pt: 'x' },
            { level: 'A1', cat: 'T', en: 'strong', de: 'y', pt: 'y' },
        ];
        // rand=0.999 cai sempre na última fatia (a dominada), por maior que seja o domínio
        expect(pickNextPhrase(two, null, 'A1', 'T', { mastery: { strong: 50 }, rand: () => 0.999 }).en).toBe('strong');
    });

    it('nextPhrase regista a frase mostrada na janela de recentes', () => {
        nextPhrase();
        expect(state.recent.length).toBe(1);
        expect(state.recent[0]).toBe(state.current.en);
    });

    it('a janela de recentes nunca excede RECENT_WINDOW', () => {
        for (let i = 0; i < 30; i++) nextPhrase();
        expect(state.recent.length).toBeLessThanOrEqual(RECENT_WINDOW);
    });
});

// ---------------------------------------------------------------------------
// persistência do domínio por frase (mastery)
// ---------------------------------------------------------------------------
describe('persistência de domínio (mastery)', () => {
    it('recordProgress incrementa o domínio por frase', () => {
        recordProgress({ level: 'A1', cat: 'Food', en: 'Good night' });
        recordProgress({ level: 'A1', cat: 'Food', en: 'Good night' });
        expect(state.mastery['Good night']).toBe(2);
    });

    it('guarda e restaura o domínio', () => {
        recordProgress({ level: 'A1', cat: 'Food', en: 'Good night' });
        saveProgress();
        resetState();
        expect(state.mastery).toEqual({});
        loadProgress();
        expect(state.mastery['Good night']).toBe(1);
    });

    it('ignora domínio corrompido no localStorage', () => {
        localStorage.setItem('englishAppMastery', 'not-json');
        loadProgress();
        expect(state.mastery).toEqual({});
    });

    it('funde o domínio vindo do Firebase mantendo o máximo por frase', async () => {
        cloud.load = vi.fn().mockResolvedValueOnce({ score: 0, mastery: { X: 2, Y: 5 } });
        state.mastery = { X: 7, Z: 1 };
        await loadFromCloud();
        expect(state.mastery.X).toBe(7);
        expect(state.mastery.Y).toBe(5);
        expect(state.mastery.Z).toBe(1);
        cloud.load = null;
    });
});

// ---------------------------------------------------------------------------
// língua base (dica) vs língua-alvo (aprender)
// ---------------------------------------------------------------------------
describe('língua base e alvo', () => {
    beforeEach(() => {
        state.current = library.find(p => p.en === 'Good morning');
    });

    it('por omissão fala pt e aprende en', () => {
        expect(state.base).toBe('pt');
        expect(state.language).toBe('en');
    });

    it('renderPhrase mostra o alvo na frase e a base na dica', () => {
        state.language = 'de';
        state.base = 'pt';
        renderPhrase();
        expect(document.getElementById('phrase-display').innerText).toBe('Guten Morgen');
        expect(document.getElementById('translation-display').innerText).toBe('Bom dia');
    });

    it('a dica aparece em inglês quando a base é en', () => {
        state.base = 'en';
        state.language = 'de';
        renderPhrase();
        expect(document.getElementById('translation-display').innerText).toBe('Good morning');
    });

    it('switchBase muda a língua base', () => {
        switchBase('en');
        expect(state.base).toBe('en');
    });

    it('switchBase ignora língua inválida', () => {
        switchBase('fr');
        expect(state.base).toBe('pt');
    });

    it('escolher como base a língua que se aprende troca as duas', () => {
        // base=pt, alvo=en -> escolher base=en deve trocar o alvo para pt
        switchBase('en');
        expect(state.base).toBe('en');
        expect(state.language).toBe('pt');
    });

    it('escolher como alvo a língua base troca as duas', () => {
        // base=pt, alvo=en -> aprender pt deve trocar a base para en
        switchLanguage('pt');
        expect(state.language).toBe('pt');
        expect(state.base).toBe('en');
    });

    it('aprender português é possível (alvo pt, dica na base)', () => {
        switchBase('en');          // falo inglês...
        switchLanguage('pt');      // ...aprendo português
        expect(state.language).toBe('pt');
        expect(state.base).toBe('en');
        renderPhrase();
        expect(document.getElementById('phrase-display').innerText).toBe('Bom dia');
        expect(document.getElementById('translation-display').innerText).toBe('Good morning');
    });

    it('switchBase marca o botão base correto como active', () => {
        switchBase('de');
        expect(document.querySelector('[data-base="de"]').classList.contains('active')).toBe(true);
        expect(document.querySelector('[data-base="pt"]').classList.contains('active')).toBe(false);
    });

    it('guarda e restaura a língua base', () => {
        state.base = 'de';
        state.language = 'en';
        saveProgress();
        resetState();
        expect(state.base).toBe('pt');
        loadProgress();
        expect(state.base).toBe('de');
    });

    it('nunca deixa a base igual ao alvo ao carregar', () => {
        localStorage.setItem('englishAppLanguage', 'de');
        localStorage.setItem('englishAppBase', 'de');
        loadProgress();
        expect(state.language).toBe('de');
        expect(state.base).not.toBe('de');
    });

    it('restaura a base vinda do Firebase', async () => {
        cloud.load = vi.fn().mockResolvedValueOnce({ score: 0, base: 'en', language: 'de' });
        await loadFromCloud();
        expect(state.base).toBe('en');
        cloud.load = null;
    });
});
