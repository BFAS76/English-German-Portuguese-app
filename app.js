// Funções de cloud injetadas pelo index.html após inicializar o Firebase
export const cloud = { save: null, load: null };

export const library = [
    // A1 — Iniciante
    { level: "A1", cat: "Greetings", en: "Good morning",               de: "Guten Morgen",                         pt: "Bom dia" },
    { level: "A1", cat: "Greetings", en: "Nice to meet you",            de: "Schön, Sie kennenzulernen",             pt: "Prazer em conhecê-lo" },
    { level: "A1", cat: "Greetings", en: "Thank you very much",         de: "Vielen Dank",                          pt: "Muito obrigado" },
    { level: "A1", cat: "Greetings", en: "Good night",                  de: "Gute Nacht",                           pt: "Boa noite" },
    { level: "A1", cat: "Useful",   en: "I don't understand",           de: "Ich verstehe nicht",                   pt: "Não entendo" },
    { level: "A1", cat: "Useful",   en: "Can you help me?",             de: "Können Sie mir helfen?",               pt: "Pode ajudar-me?" },
    { level: "A1", cat: "Useful",   en: "How much does it cost?",       de: "Wie viel kostet das?",                 pt: "Quanto custa?" },
    { level: "A1", cat: "Travel",   en: "Where is the bathroom?",       de: "Wo ist die Toilette?",                 pt: "Onde é a casa de banho?" },
    { level: "A1", cat: "Food",     en: "A glass of water, please",     de: "Ein Glas Wasser, bitte",               pt: "Um copo de água, por favor" },
    { level: "A1", cat: "Food",     en: "The bill, please",             de: "Die Rechnung, bitte",                  pt: "A conta, por favor" },
    { level: "A1", cat: "Numbers",  en: "What time is it?",             de: "Wie spät ist es?",                     pt: "Que horas são?" },
    { level: "A1", cat: "Numbers",  en: "Today is Monday",              de: "Heute ist Montag",                     pt: "Hoje é segunda-feira" },
    { level: "A1", cat: "Numbers",  en: "I have two brothers",          de: "Ich habe zwei Brüder",                 pt: "Tenho dois irmãos" },
    { level: "A1", cat: "Useful",   en: "I don't speak German",          de: "Ich spreche kein Deutsch",             pt: "Não falo alemão" },
    { level: "A1", cat: "Useful",   en: "Please repeat that",            de: "Bitte wiederholen Sie das",            pt: "Por favor, repita isso" },
    { level: "A1", cat: "Work",     en: "I work in an office",           de: "Ich arbeite in einem Büro",            pt: "Trabalho num escritório" },
    { level: "A1", cat: "Daily",    en: "I am tired",                    de: "Ich bin müde",                         pt: "Estou cansado(a)" },

    // A2 — Elementar
    { level: "A2", cat: "Greetings", en: "How is it going?",            de: "Wie läuft es?",                        pt: "Como estão as coisas?" },
    { level: "A2", cat: "Greetings", en: "Have a wonderful day",        de: "Haben Sie einen wunderschönen Tag",    pt: "Tenha um dia maravilhoso" },
    { level: "A2", cat: "Travel",   en: "Where can I find a taxi?",     de: "Wo finde ich ein Taxi?",               pt: "Onde posso encontrar um táxi?" },
    { level: "A2", cat: "Travel",   en: "I am lost, can you help me?",  de: "Ich habe mich verirrt, können Sie mir helfen?", pt: "Estou perdido(a), pode ajudar-me?" },
    { level: "A2", cat: "Travel",   en: "A table for two, please",      de: "Einen Tisch für zwei, bitte",          pt: "Uma mesa para dois, por favor" },
    { level: "A2", cat: "Useful",   en: "Could you speak slower, please?", de: "Könnten Sie bitte langsamer sprechen?", pt: "Poderia falar mais devagar, por favor?" },
    { level: "A2", cat: "Daily",    en: "What time does it open?",      de: "Wann öffnet es?",                      pt: "A que horas abre?" },
    { level: "A2", cat: "Daily",    en: "I would like a coffee, please", de: "Ich hätte gerne einen Kaffee, bitte", pt: "Queria um café, por favor" },
    { level: "A2", cat: "Food",     en: "I am allergic to nuts",        de: "Ich bin allergisch gegen Nüsse",       pt: "Sou alérgico(a) a frutos secos" },
    { level: "A2", cat: "Food",     en: "Could I have the menu?",       de: "Könnte ich die Speisekarte haben?",    pt: "Pode trazer-me a ementa?" },
    { level: "A2", cat: "Food",     en: "This is delicious",            de: "Das schmeckt köstlich",                pt: "Isto está delicioso" },
    { level: "A2", cat: "Numbers",  en: "It costs twenty euros",        de: "Es kostet zwanzig Euro",               pt: "Custa vinte euros" },
    { level: "A2", cat: "Numbers",  en: "The train leaves at half past six", de: "Der Zug fährt um halb sieben ab", pt: "O comboio parte às seis e meia" },
    { level: "A2", cat: "Work",     en: "I have a meeting this afternoon", de: "Ich habe heute Nachmittag eine Besprechung", pt: "Tenho uma reunião esta tarde" },
    { level: "A2", cat: "Work",     en: "I am looking for a job",       de: "Ich suche eine Arbeit",                pt: "Estou à procura de emprego" },
    { level: "A2", cat: "Useful",   en: "Could you write that down for me?", de: "Könnten Sie mir das aufschreiben?", pt: "Poderia escrever isso para mim?" },
    { level: "A2", cat: "Travel",   en: "How long does the journey take?", de: "Wie lange dauert die Fahrt?",        pt: "Quanto tempo dura a viagem?" },

    // B1 — Intermédio
    { level: "B1", cat: "Daily",    en: "I need to check my emails",    de: "Ich muss meine E-Mails checken",       pt: "Preciso de ver os meus e-mails" },
    { level: "B1", cat: "Daily",    en: "What do you do for a living?", de: "Was machen Sie beruflich?",            pt: "O que faz da vida?" },
    { level: "B1", cat: "Daily",    en: "Let's grab a coffee later",    de: "Lass uns später einen Kaffee trinken", pt: "Vamos tomar um café mais tarde" },
    { level: "B1", cat: "Useful",   en: "I don't understand what you mean", de: "Ich verstehe nicht, was Sie meinen", pt: "Não entendo o que quer dizer" },
    { level: "B1", cat: "Useful",   en: "How do you say this in German?", de: "Wie sagt man das auf Deutsch?",     pt: "Como se diz isto em alemão?" },
    { level: "B1", cat: "Daily",    en: "I have been living here for two years", de: "Ich wohne hier seit zwei Jahren", pt: "Vivo aqui há dois anos" },
    { level: "B1", cat: "Travel",   en: "Could you recommend a good restaurant?", de: "Könnten Sie mir ein gutes Restaurant empfehlen?", pt: "Pode recomendar um bom restaurante?" },
    { level: "B1", cat: "Daily",    en: "I am interested in learning new languages", de: "Ich interessiere mich dafür, neue Sprachen zu lernen", pt: "Tenho interesse em aprender novas línguas" },
    { level: "B1", cat: "Work",     en: "I would like to apply for this position", de: "Ich möchte mich für diese Stelle bewerben", pt: "Gostaria de me candidatar a este cargo" },
    { level: "B1", cat: "Work",     en: "Could we schedule a meeting for next week?", de: "Könnten wir ein Treffen für nächste Woche planen?", pt: "Podíamos marcar uma reunião para a próxima semana?" },
    { level: "B1", cat: "Work",     en: "I am responsible for the project", de: "Ich bin für das Projekt verantwortlich", pt: "Sou responsável pelo projeto" },
    { level: "B1", cat: "Work",     en: "I have been working here since 2020", de: "Ich arbeite hier seit 2020",      pt: "Trabalho aqui desde 2020" },
    { level: "B1", cat: "Food",     en: "I would rather have something vegetarian", de: "Ich würde lieber etwas Vegetarisches nehmen", pt: "Preferia algo vegetariano" },
    { level: "B1", cat: "Numbers",  en: "It takes about an hour to get there", de: "Es dauert etwa eine Stunde, um dorthin zu kommen", pt: "Leva cerca de uma hora a chegar lá" },
    { level: "B1", cat: "Numbers",  en: "We have been waiting for forty minutes", de: "Wir warten seit vierzig Minuten", pt: "Estamos à espera há quarenta minutos" },
    { level: "B1", cat: "Useful",   en: "It depends on the situation",   de: "Das hängt von der Situation ab",       pt: "Depende da situação" },
    { level: "B1", cat: "Travel",   en: "I would like to book a room for two nights", de: "Ich möchte ein Zimmer für zwei Nächte buchen", pt: "Gostaria de reservar um quarto para duas noites" },

    // ===================== Expansão =====================

    // Greetings
    { level: "A1", cat: "Greetings", en: "Hello, how are you?",                de: "Hallo, wie geht es Ihnen?",                 pt: "Olá, como está?" },
    { level: "A1", cat: "Greetings", en: "I'm fine, thank you",                de: "Mir geht es gut, danke",                    pt: "Estou bem, obrigado(a)" },
    { level: "A1", cat: "Greetings", en: "Goodbye",                            de: "Auf Wiedersehen",                           pt: "Adeus" },
    { level: "A1", cat: "Greetings", en: "See you soon",                       de: "Bis bald",                                  pt: "Até breve" },
    { level: "A1", cat: "Greetings", en: "Excuse me",                          de: "Entschuldigung",                            pt: "Com licença" },
    { level: "A1", cat: "Greetings", en: "I'm sorry",                          de: "Es tut mir leid",                           pt: "Desculpe" },
    { level: "A2", cat: "Greetings", en: "Welcome!",                           de: "Herzlich willkommen!",                      pt: "Bem-vindo(a)!" },

    // Useful
    { level: "A1", cat: "Useful",    en: "I need help",                        de: "Ich brauche Hilfe",                         pt: "Preciso de ajuda" },
    { level: "A1", cat: "Useful",    en: "I have a question",                  de: "Ich habe eine Frage",                       pt: "Tenho uma pergunta" },
    { level: "A1", cat: "Useful",    en: "No problem",                         de: "Kein Problem",                              pt: "Não há problema" },
    { level: "A1", cat: "Useful",    en: "Of course",                          de: "Natürlich",                                 pt: "Claro" },
    { level: "A2", cat: "Useful",    en: "What does this mean?",               de: "Was bedeutet das?",                         pt: "O que significa isto?" },
    { level: "A2", cat: "Useful",    en: "How do you spell that?",             de: "Wie schreibt man das?",                     pt: "Como se escreve isso?" },
    { level: "A2", cat: "Useful",    en: "I'm not sure",                       de: "Ich bin mir nicht sicher",                  pt: "Não tenho a certeza" },
    { level: "B1", cat: "Useful",    en: "I agree with you",                   de: "Ich stimme Ihnen zu",                       pt: "Concordo consigo" },
    { level: "B1", cat: "Useful",    en: "Could you explain that again?",      de: "Könnten Sie das noch einmal erklären?",     pt: "Poderia explicar isso outra vez?" },

    // Food
    { level: "A1", cat: "Food",      en: "Enjoy your meal",                    de: "Guten Appetit",                             pt: "Bom apetite" },
    { level: "A1", cat: "Food",      en: "Cheers!",                            de: "Prost!",                                    pt: "Saúde!" },
    { level: "A2", cat: "Food",      en: "I would like to order",             de: "Ich möchte bestellen",                      pt: "Queria pedir" },
    { level: "A2", cat: "Food",      en: "Is this spicy?",                     de: "Ist das scharf?",                           pt: "Isto é picante?" },
    { level: "A2", cat: "Food",      en: "I don't eat meat",                   de: "Ich esse kein Fleisch",                     pt: "Não como carne" },
    { level: "A2", cat: "Food",      en: "Another beer, please",               de: "Noch ein Bier, bitte",                      pt: "Mais uma cerveja, por favor" },
    { level: "B1", cat: "Food",      en: "What do you recommend?",             de: "Was empfehlen Sie?",                        pt: "O que recomenda?" },
    { level: "B1", cat: "Food",      en: "The food was excellent",             de: "Das Essen war ausgezeichnet",               pt: "A comida estava excelente" },

    // Travel
    { level: "A2", cat: "Travel",    en: "I have a reservation",               de: "Ich habe eine Reservierung",                pt: "Tenho uma reserva" },
    { level: "A2", cat: "Travel",    en: "One ticket to Berlin, please",       de: "Eine Fahrkarte nach Berlin, bitte",         pt: "Um bilhete para Berlim, por favor" },
    { level: "A2", cat: "Travel",    en: "Is this seat free?",                 de: "Ist dieser Platz frei?",                    pt: "Este lugar está livre?" },
    { level: "A2", cat: "Travel",    en: "I would like to check in",           de: "Ich möchte einchecken",                     pt: "Queria fazer o check-in" },
    { level: "B1", cat: "Travel",    en: "When does the next train leave?",    de: "Wann fährt der nächste Zug?",               pt: "Quando parte o próximo comboio?" },
    { level: "B1", cat: "Travel",    en: "Where is my gate?",                  de: "Wo ist mein Flugsteig?",                    pt: "Onde é a minha porta de embarque?" },
    { level: "B1", cat: "Travel",    en: "I missed my flight",                 de: "Ich habe meinen Flug verpasst",             pt: "Perdi o meu voo" },

    // Daily
    { level: "A1", cat: "Daily",     en: "I am going home",                    de: "Ich gehe nach Hause",                       pt: "Vou para casa" },
    { level: "A1", cat: "Daily",     en: "I am learning German",               de: "Ich lerne Deutsch",                         pt: "Estou a aprender alemão" },
    { level: "A2", cat: "Daily",     en: "I wake up early",                    de: "Ich stehe früh auf",                        pt: "Acordo cedo" },
    { level: "A2", cat: "Daily",     en: "I am very busy today",               de: "Ich bin heute sehr beschäftigt",            pt: "Estou muito ocupado(a) hoje" },
    { level: "A2", cat: "Daily",     en: "I need to go shopping",              de: "Ich muss einkaufen gehen",                  pt: "Preciso de ir às compras" },
    { level: "B1", cat: "Daily",     en: "What are you doing this weekend?",   de: "Was machst du dieses Wochenende?",          pt: "O que vais fazer este fim de semana?" },

    // Work
    { level: "A2", cat: "Work",      en: "I have a lot of work today",         de: "Ich habe heute viel Arbeit",                pt: "Tenho muito trabalho hoje" },
    { level: "A2", cat: "Work",      en: "I will send you an email",           de: "Ich schicke Ihnen eine E-Mail",             pt: "Vou enviar-lhe um e-mail" },
    { level: "B1", cat: "Work",      en: "Can we reschedule the meeting?",     de: "Können wir das Treffen verschieben?",       pt: "Podemos remarcar a reunião?" },
    { level: "B1", cat: "Work",      en: "The deadline is on Friday",          de: "Die Frist ist am Freitag",                  pt: "O prazo é na sexta-feira" },
    { level: "B1", cat: "Work",      en: "Let me think about it",              de: "Lassen Sie mich darüber nachdenken",        pt: "Deixe-me pensar nisso" },

    // Shopping
    { level: "A1", cat: "Shopping",  en: "I'll take it",                       de: "Ich nehme es",                              pt: "Levo este" },
    { level: "A1", cat: "Shopping",  en: "This is too expensive",              de: "Das ist zu teuer",                          pt: "Isto é demasiado caro" },
    { level: "A1", cat: "Shopping",  en: "Where can I pay?",                   de: "Wo kann ich bezahlen?",                     pt: "Onde posso pagar?" },
    { level: "A1", cat: "Shopping",  en: "Can I pay by card?",                 de: "Kann ich mit Karte zahlen?",                pt: "Posso pagar com cartão?" },
    { level: "A2", cat: "Shopping",  en: "I would like to pay",                de: "Ich möchte bezahlen",                       pt: "Queria pagar" },
    { level: "A2", cat: "Shopping",  en: "I'm just looking, thank you",        de: "Ich schaue mich nur um, danke",             pt: "Estou só a ver, obrigado(a)" },
    { level: "A2", cat: "Shopping",  en: "Is this on sale?",                   de: "Ist das im Angebot?",                       pt: "Isto está em promoção?" },
    { level: "A2", cat: "Shopping",  en: "Do you have a smaller size?",        de: "Haben Sie eine kleinere Größe?",            pt: "Tem um tamanho mais pequeno?" },
    { level: "A2", cat: "Shopping",  en: "Do you have this in a bigger size?", de: "Haben Sie das in einer größeren Größe?",    pt: "Tem isto num tamanho maior?" },
    { level: "B1", cat: "Shopping",  en: "Can I get a receipt?",               de: "Kann ich eine Quittung bekommen?",          pt: "Pode dar-me um recibo?" },
    { level: "B1", cat: "Shopping",  en: "Where are the fitting rooms?",       de: "Wo sind die Umkleidekabinen?",              pt: "Onde ficam os provadores?" },
    { level: "B1", cat: "Shopping",  en: "Can I return this?",                 de: "Kann ich das zurückgeben?",                 pt: "Posso devolver isto?" },

    // Health
    { level: "A1", cat: "Health",    en: "I need a doctor",                    de: "Ich brauche einen Arzt",                    pt: "Preciso de um médico" },
    { level: "A1", cat: "Health",    en: "I don't feel well",                  de: "Mir geht es nicht gut",                     pt: "Não me sinto bem" },
    { level: "A1", cat: "Health",    en: "I have a headache",                  de: "Ich habe Kopfschmerzen",                    pt: "Tenho dores de cabeça" },
    { level: "A1", cat: "Health",    en: "I have a fever",                     de: "Ich habe Fieber",                           pt: "Tenho febre" },
    { level: "A1", cat: "Health",    en: "It hurts here",                      de: "Es tut hier weh",                           pt: "Dói-me aqui" },
    { level: "A2", cat: "Health",    en: "Where is the nearest pharmacy?",     de: "Wo ist die nächste Apotheke?",              pt: "Onde fica a farmácia mais próxima?" },
    { level: "A2", cat: "Health",    en: "Call an ambulance, please",          de: "Rufen Sie einen Krankenwagen, bitte",       pt: "Chame uma ambulância, por favor" },
    { level: "A2", cat: "Health",    en: "My stomach hurts",                   de: "Ich habe Bauchschmerzen",                   pt: "Tenho dores de barriga" },
    { level: "B1", cat: "Health",    en: "I am allergic to penicillin",        de: "Ich bin allergisch gegen Penizillin",       pt: "Sou alérgico(a) à penicilina" },
    { level: "B1", cat: "Health",    en: "Do I need a prescription?",          de: "Brauche ich ein Rezept?",                   pt: "Preciso de uma receita?" },
    { level: "B1", cat: "Health",    en: "I have caught a cold",               de: "Ich habe mich erkältet",                    pt: "Estou constipado(a)" },
    { level: "B1", cat: "Health",    en: "Can you recommend a doctor?",        de: "Können Sie einen Arzt empfehlen?",          pt: "Pode recomendar um médico?" },

    // Directions
    { level: "A1", cat: "Directions", en: "Where is the train station?",       de: "Wo ist der Bahnhof?",                       pt: "Onde fica a estação de comboios?" },
    { level: "A1", cat: "Directions", en: "Is it far from here?",              de: "Ist es weit von hier?",                     pt: "É longe daqui?" },
    { level: "A1", cat: "Directions", en: "Turn left",                         de: "Biegen Sie links ab",                       pt: "Vire à esquerda" },
    { level: "A1", cat: "Directions", en: "Turn right",                        de: "Biegen Sie rechts ab",                      pt: "Vire à direita" },
    { level: "A1", cat: "Directions", en: "Go straight ahead",                 de: "Gehen Sie geradeaus",                       pt: "Siga em frente" },
    { level: "A2", cat: "Directions", en: "How do I get to the city centre?",  de: "Wie komme ich ins Stadtzentrum?",           pt: "Como vou para o centro da cidade?" },
    { level: "A2", cat: "Directions", en: "It's on the corner",                de: "Es ist an der Ecke",                        pt: "É na esquina" },
    { level: "A2", cat: "Directions", en: "Can you show me on the map?",       de: "Können Sie es mir auf der Karte zeigen?",   pt: "Pode mostrar-me no mapa?" },
    { level: "A2", cat: "Directions", en: "How far is the airport?",           de: "Wie weit ist der Flughafen?",               pt: "A que distância fica o aeroporto?" },
    { level: "A2", cat: "Directions", en: "I'm looking for this address",      de: "Ich suche diese Adresse",                   pt: "Estou à procura desta morada" },
    { level: "B1", cat: "Directions", en: "Which bus goes to the centre?",     de: "Welcher Bus fährt ins Zentrum?",            pt: "Que autocarro vai para o centro?" },
    { level: "B1", cat: "Directions", en: "Is there a bus stop nearby?",       de: "Gibt es eine Bushaltestelle in der Nähe?",  pt: "Há uma paragem de autocarro perto?" },

    // Weather
    { level: "A1", cat: "Weather",   en: "It is raining",                      de: "Es regnet",                                 pt: "Está a chover" },
    { level: "A1", cat: "Weather",   en: "It is sunny",                        de: "Es ist sonnig",                             pt: "Está sol" },
    { level: "A1", cat: "Weather",   en: "It is very cold today",              de: "Heute ist es sehr kalt",                    pt: "Hoje está muito frio" },
    { level: "A1", cat: "Weather",   en: "It is very hot",                     de: "Es ist sehr heiß",                          pt: "Está muito calor" },
    { level: "A1", cat: "Weather",   en: "It is windy",                        de: "Es ist windig",                             pt: "Está vento" },
    { level: "A1", cat: "Weather",   en: "The weather is nice",                de: "Das Wetter ist schön",                      pt: "O tempo está bom" },
    { level: "A2", cat: "Weather",   en: "What is the weather like today?",    de: "Wie ist das Wetter heute?",                 pt: "Como está o tempo hoje?" },
    { level: "A2", cat: "Weather",   en: "It is going to snow",                de: "Es wird schneien",                          pt: "Vai nevar" },
    { level: "B1", cat: "Weather",   en: "I think it will rain tomorrow",      de: "Ich glaube, es wird morgen regnen",         pt: "Acho que vai chover amanhã" },

    // Time
    { level: "A1", cat: "Time",      en: "See you tomorrow",                   de: "Bis morgen",                                pt: "Até amanhã" },
    { level: "A1", cat: "Time",      en: "See you later",                      de: "Bis später",                                pt: "Até logo" },
    { level: "A1", cat: "Time",      en: "What day is it today?",              de: "Welcher Tag ist heute?",                    pt: "Que dia é hoje?" },
    { level: "A2", cat: "Time",      en: "It is half past three",              de: "Es ist halb vier",                          pt: "São três e meia" },
    { level: "A2", cat: "Time",      en: "The meeting is at nine o'clock",     de: "Das Treffen ist um neun Uhr",               pt: "A reunião é às nove horas" },
    { level: "A2", cat: "Time",      en: "The shop opens at nine",             de: "Das Geschäft öffnet um neun",               pt: "A loja abre às nove" },
    { level: "B1", cat: "Time",      en: "I will be there in ten minutes",     de: "Ich bin in zehn Minuten da",                pt: "Chego daqui a dez minutos" },
    { level: "B1", cat: "Time",      en: "It is almost midnight",              de: "Es ist fast Mitternacht",                   pt: "É quase meia-noite" },
];

export const LANGUAGES = ['en', 'de'];
export const LEVELS = ['A1', 'A2', 'B1'];

export const state = {
    current: {},
    score: 0,
    audioInitialized: false,
    language: 'en',
    level: 'A1',
};

export function resetState() {
    state.current = {};
    state.score = 0;
    state.audioInitialized = false;
    state.language = 'en';
    state.level = 'A1';
}

export function getLangCode() {
    return state.language === 'de' ? 'de-DE' : 'en-US';
}

export function normalizeText(text) {
    return text.toLowerCase().replace(/[?.!,]/g, "").trim();
}

// Aceita correspondência exata ou parcial, mas exige que o que foi dito
// cubra pelo menos 60% do comprimento da frase alvo — assim dizer apenas
// uma palavra curta ("good") não valida uma frase inteira ("good morning").
export const MATCH_COVERAGE = 0.6;

export function checkMatch(spoken, target) {
    const s = normalizeText(spoken);
    const t = normalizeText(target);
    if (s === t) return true;
    if (s.length <= 3) return false;
    return t.includes(s) && s.length >= t.length * MATCH_COVERAGE;
}

export function pickNextPhrase(lib, currentEn, level = null) {
    const pool = level ? lib.filter(p => p.level === level) : lib;
    if (pool.length === 0) return null;
    if (pool.length === 1) return pool[0];
    let phrase;
    do {
        phrase = pool[Math.floor(Math.random() * pool.length)];
    } while (phrase.en === currentEn);
    return phrase;
}

export function updateLanguageUI() {
    document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === state.language);
    });
}

export function updateLevelUI() {
    document.querySelectorAll('[data-level]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.level === state.level);
    });
}

export function nextPhrase() {
    const phrase = pickNextPhrase(library, state.current.en, state.level);
    if (!phrase) return;
    state.current = phrase;
    document.getElementById('cat-display').innerText = `${state.current.cat} · ${state.current.level}`;
    const phraseEl = document.getElementById('phrase-display');
    phraseEl.innerText = state.current[state.language];
    phraseEl.lang = getLangCode();
    document.getElementById('translation-display').innerText = state.current.pt;
    const status = document.getElementById('status');
    status.innerText = "Listen and Repeat!";
    status.style.color = "#94a3b8";
}

export function switchLanguage(lang) {
    if (!LANGUAGES.includes(lang)) return;
    state.language = lang;
    if (state.current[lang]) {
        const phraseEl = document.getElementById('phrase-display');
        phraseEl.innerText = state.current[lang];
        phraseEl.lang = getLangCode();
    }
    updateLanguageUI();
    saveProgress();
}

export function switchLevel(level) {
    if (!LEVELS.includes(level)) return;
    state.level = level;
    updateLevelUI();
    saveProgress();
    nextPhrase();
}

export function saveProgress() {
    localStorage.setItem('englishAppScore', String(state.score));
    localStorage.setItem('englishAppLanguage', state.language);
    localStorage.setItem('englishAppLevel', state.level);
    cloud.save?.({ score: state.score, language: state.language, level: state.level });
}

export async function loadFromCloud() {
    const data = await cloud.load?.();
    if (!data) return;
    if (data.score > state.score) {
        state.score = data.score;
        document.getElementById('points').innerText = String(state.score);
        localStorage.setItem('englishAppScore', String(state.score));
    }
    if (data.language && LANGUAGES.includes(data.language)) {
        state.language = data.language;
        localStorage.setItem('englishAppLanguage', state.language);
    }
    if (data.level && LEVELS.includes(data.level)) {
        state.level = data.level;
        localStorage.setItem('englishAppLevel', state.level);
    }
    updateLanguageUI();
    updateLevelUI();
}

export function loadProgress() {
    const savedScore = localStorage.getItem('englishAppScore');
    if (savedScore !== null) {
        const parsed = parseInt(savedScore, 10);
        state.score = isNaN(parsed) ? 0 : parsed;
        document.getElementById('points').innerText = String(state.score);
    }

    const savedLang = localStorage.getItem('englishAppLanguage');
    if (savedLang && LANGUAGES.includes(savedLang)) state.language = savedLang;

    const savedLevel = localStorage.getItem('englishAppLevel');
    if (savedLevel && LEVELS.includes(savedLevel)) state.level = savedLevel;

    updateLanguageUI();
    updateLevelUI();
}

export function initAudio() {
    if (state.audioInitialized) return;
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(" "));
    state.audioInitialized = true;
    loadProgress();
    if (!state.current.en) nextPhrase();
}

// Escolhe uma voz instalada que corresponda ao idioma (ex.: uma voz alemã para
// de-DE), para o alemão não ser lido com sotaque inglês. Devolve null se não
// houver correspondência — o browser usa então a voz por omissão do idioma.
export function pickVoice(langCode) {
    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    const code = langCode.toLowerCase();
    const prefix = code.slice(0, 2);
    return voices.find(v => v.lang?.toLowerCase() === code)
        ?? voices.find(v => v.lang?.toLowerCase().startsWith(prefix))
        ?? null;
}

export function playVoice() {
    if (!state.current.en) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(state.current[state.language]);
    msg.lang = getLangCode();
    const voice = pickVoice(msg.lang);
    if (voice) msg.voice = voice;
    msg.rate = 0.8;
    window.speechSynthesis.speak(msg);
}

export function handleRecognitionResult(transcript) {
    const spoken = normalizeText(transcript);
    const target = normalizeText(state.current[state.language]);
    const status = document.getElementById('status');

    if (checkMatch(spoken, target)) {
        status.innerText = "✅ Excellent! +10 XP";
        status.style.color = "#4ade80";
        state.score += 10;
        document.getElementById('points').innerText = String(state.score);
        saveProgress();
        setTimeout(nextPhrase, 2000);
        return true;
    } else {
        status.innerText = `You said: "${spoken}"\nTry again!`;
        status.style.color = "#fb7185";
        return false;
    }
}

export function startRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Browser error");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getLangCode();

    recognition.onstart = () => {
        document.getElementById('status').innerText = "Listening...";
        document.getElementById('mic-btn').style.filter = "brightness(1.5)";
    };

    recognition.onresult = (event) => {
        handleRecognitionResult(event.results[0][0].transcript);
    };

    recognition.onerror = (event) => {
        const status = document.getElementById('status');
        const reason = event?.error === 'not-allowed'
            ? "Microphone blocked — allow access and try again."
            : event?.error === 'no-speech'
                ? "Didn't catch that — try again."
                : "Speech recognition error — try again.";
        status.innerText = reason;
        status.style.color = "#fb7185";
        document.getElementById('mic-btn').style.filter = "none";
    };

    recognition.onend = () => {
        document.getElementById('mic-btn').style.filter = "none";
    };

    recognition.start();
}
