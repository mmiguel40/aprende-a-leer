// =====================================================================
// levels.ts — Datos de todos los niveles del juego
// Basado en la secuencia pedagógica del libro Mi Jardín
// (Díaz de Cerio, 1947): Sílabas → Palabras → Oraciones
// =====================================================================

export type Difficulty = 'facil' | 'medio' | 'dificil';
export type GameMode = 'silaba' | 'palabra' | 'oracion';

export const DIFFICULTY_LABELS: Record<Difficulty, { label: string; emoji: string; color: string }> = {
    facil: { label: 'Fácil', emoji: '🟢', color: 'green' },
    medio: { label: 'Medio', emoji: '🟡', color: 'yellow' },
    dificil: { label: 'Difícil', emoji: '🔴', color: 'red' },
};

export const MODE_LABELS: Record<GameMode, { label: string; emoji: string; instruction: string }> = {
    silaba: { label: 'Sílabas', emoji: '🔤', instruction: 'Elige la sílaba que falta.' },
    palabra: { label: 'Palabras', emoji: '📝', instruction: 'Elige la palabra que falta.' },
    oracion: { label: 'Oraciones', emoji: '💬', instruction: 'Elige cómo se completa la oración.' },
};

export type BaseLevel = {
    id: string;
    island: 1 | 2 | 3;                    // Isla en el mapa
    mode: GameMode;                         // Tipo de ejercicio
    nextLevelId: string | null;
    illustration: string;
    targetDisplay: string;                 // Palabra u oración completa a mostrar
    missingPiece: string;                  // Sílaba, palabra o fragmento que falta
    options: string[];
    audioInstructionPath: string;
    requiredAudios: string[];
    difficulty: Difficulty;
};

// ── Isla 1 — Sílabas (10 niveles) ────────────────────────────────────
const ISLAND_1_LEVELS: Record<string, BaseLevel> = {
    level_m: {
        id: 'level_m', island: 1, mode: 'silaba', nextLevelId: 'level_p',
        illustration: '🍎', targetDisplay: 'Manzana', missingPiece: 'man',
        options: ['man', 'san', 'pan', 'lan'],
        audioInstructionPath: '/audio/inst_manzana_m.mp3',
        requiredAudios: ['/audio/inst_manzana_m.mp3', '/audio/syl_man.mp3', '/audio/syl_san.mp3', '/audio/countdown_3.mp3', '/audio/countdown_2.mp3', '/audio/countdown_1.mp3', '/audio/countdown_go.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    level_p: {
        id: 'level_p', island: 1, mode: 'silaba', nextLevelId: 'level_l',
        illustration: '🦆', targetDisplay: 'Pato', missingPiece: 'pa',
        options: ['pa', 'ta', 'ma', 'da'],
        audioInstructionPath: '/audio/inst_pato.mp3',
        requiredAudios: ['/audio/inst_pato.mp3', '/audio/syl_pa.mp3', '/audio/syl_ta.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    level_l: {
        id: 'level_l', island: 1, mode: 'silaba', nextLevelId: 'level_s',
        illustration: '🔍', targetDisplay: 'Lupa', missingPiece: 'lu',
        options: ['lu', 'ul', 'pu', 'mu'],
        audioInstructionPath: '/audio/inst_lupa.mp3',
        requiredAudios: ['/audio/inst_lupa.mp3', '/audio/syl_lu.mp3', '/audio/syl_ul.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    level_s: {
        id: 'level_s', island: 1, mode: 'silaba', nextLevelId: 'level_t',
        illustration: '🐸', targetDisplay: 'Sapo', missingPiece: 'sa',
        options: ['sa', 'za', 'ma', 'pa'],
        audioInstructionPath: '/audio/inst_sapo.mp3',
        requiredAudios: ['/audio/inst_sapo.mp3', '/audio/syl_sa.mp3', '/audio/syl_za.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    level_t: {
        id: 'level_t', island: 1, mode: 'silaba', nextLevelId: 'level_n',
        illustration: '🐂', targetDisplay: 'Toro', missingPiece: 'to',
        options: ['to', 'ro', 'so', 'lo'],
        audioInstructionPath: '/audio/inst_toro.mp3',
        requiredAudios: ['/audio/inst_toro.mp3', '/audio/syl_to.mp3', '/audio/syl_ro.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    level_n: {
        id: 'level_n', island: 1, mode: 'silaba', nextLevelId: 'level_d',
        illustration: '🐦', targetDisplay: 'Nido', missingPiece: 'ni',
        options: ['ni', 'mi', 'pi', 'li'],
        audioInstructionPath: '/audio/inst_nido.mp3',
        requiredAudios: ['/audio/inst_nido.mp3', '/audio/syl_ni.mp3', '/audio/syl_mi.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    level_d: {
        id: 'level_d', island: 1, mode: 'silaba', nextLevelId: 'level_j',
        illustration: '👆', targetDisplay: 'Dedo', missingPiece: 'de',
        options: ['de', 'te', 'pe', 'se'],
        audioInstructionPath: '/audio/inst_dedo.mp3',
        requiredAudios: ['/audio/inst_dedo.mp3', '/audio/syl_de.mp3', '/audio/syl_te.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    level_j: {
        id: 'level_j', island: 1, mode: 'silaba', nextLevelId: 'level_m2',
        illustration: '🍯', targetDisplay: 'Jarra', missingPiece: 'ja',
        options: ['ja', 'ga', 'ka', 'ra'],
        audioInstructionPath: '/audio/inst_jarra.mp3',
        requiredAudios: ['/audio/inst_jarra.mp3', '/audio/syl_ja.mp3', '/audio/syl_ga.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    level_m2: {
        id: 'level_m2', island: 1, mode: 'silaba', nextLevelId: 'level_s2',
        illustration: '🍯', targetDisplay: 'Miel', missingPiece: 'miel',
        options: ['miel', 'piel', 'fiel', 'biel'],
        audioInstructionPath: '/audio/inst_miel.mp3',
        requiredAudios: ['/audio/inst_miel.mp3', '/audio/syl_miel.mp3', '/audio/syl_piel.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
    level_s2: {
        id: 'level_s2', island: 1, mode: 'silaba', nextLevelId: 'word_mama',
        illustration: '🦢', targetDisplay: 'Cisne', missingPiece: 'cis',
        options: ['cis', 'sis', 'dis', 'bis'],
        audioInstructionPath: '/audio/inst_cisne.mp3',
        requiredAudios: ['/audio/inst_cisne.mp3', '/audio/syl_cis.mp3', '/audio/syl_sis.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
};

// ── Isla 2 — Palabras Completas (10 niveles) ─────────────────────────
const ISLAND_2_LEVELS: Record<string, BaseLevel> = {
    word_mama: {
        id: 'word_mama', island: 2, mode: 'palabra', nextLevelId: 'word_papa',
        illustration: '👩', targetDisplay: 'Mi ___ me ama', missingPiece: 'mamá',
        options: ['mamá', 'papá', 'loma', 'pala'],
        audioInstructionPath: '/audio/inst_word_mama.mp3',
        requiredAudios: ['/audio/inst_word_mama.mp3', '/audio/word_mama.mp3', '/audio/word_papa.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    word_papa: {
        id: 'word_papa', island: 2, mode: 'palabra', nextLevelId: 'word_mimo',
        illustration: '👨', targetDisplay: '___ lima la pala', missingPiece: 'papá',
        options: ['papá', 'mamá', 'toma', 'mesa'],
        audioInstructionPath: '/audio/inst_word_papa.mp3',
        requiredAudios: ['/audio/inst_word_papa.mp3', '/audio/word_papa.mp3', '/audio/word_mama.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    word_mimo: {
        id: 'word_mimo', island: 2, mode: 'palabra', nextLevelId: 'word_pala',
        illustration: '🐱', targetDisplay: 'El gato es ___', missingPiece: 'mimo',
        options: ['mimo', 'limo', 'pimo', 'simo'],
        audioInstructionPath: '/audio/inst_word_mimo.mp3',
        requiredAudios: ['/audio/inst_word_mimo.mp3', '/audio/word_mimo.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    word_pala: {
        id: 'word_pala', island: 2, mode: 'palabra', nextLevelId: 'word_mesa',
        illustration: '🪣', targetDisplay: 'La ___ es de papá', missingPiece: 'pala',
        options: ['pala', 'sala', 'mala', 'tala'],
        audioInstructionPath: '/audio/inst_word_pala.mp3',
        requiredAudios: ['/audio/inst_word_pala.mp3', '/audio/word_pala.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    word_mesa: {
        id: 'word_mesa', island: 2, mode: 'palabra', nextLevelId: 'word_sopa',
        illustration: '🪑', targetDisplay: 'La ___ es bonita', missingPiece: 'mesa',
        options: ['mesa', 'tesa', 'pesa', 'lesa'],
        audioInstructionPath: '/audio/inst_word_mesa.mp3',
        requiredAudios: ['/audio/inst_word_mesa.mp3', '/audio/word_mesa.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    word_sopa: {
        id: 'word_sopa', island: 2, mode: 'palabra', nextLevelId: 'word_luna',
        illustration: '🍲', targetDisplay: 'La ___ está caliente', missingPiece: 'sopa',
        options: ['sopa', 'ropa', 'popa', 'lopa'],
        audioInstructionPath: '/audio/inst_word_sopa.mp3',
        requiredAudios: ['/audio/inst_word_sopa.mp3', '/audio/word_sopa.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    word_luna: {
        id: 'word_luna', island: 2, mode: 'palabra', nextLevelId: 'word_dado',
        illustration: '🌙', targetDisplay: 'La ___ es redonda', missingPiece: 'luna',
        options: ['luna', 'tuna', 'puna', 'duna'],
        audioInstructionPath: '/audio/inst_word_luna.mp3',
        requiredAudios: ['/audio/inst_word_luna.mp3', '/audio/word_luna.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    word_dado: {
        id: 'word_dado', island: 2, mode: 'palabra', nextLevelId: 'word_tela',
        illustration: '🎲', targetDisplay: 'El ___ tiene puntos', missingPiece: 'dado',
        options: ['dado', 'lado', 'modo', 'sado'],
        audioInstructionPath: '/audio/inst_word_dado.mp3',
        requiredAudios: ['/audio/inst_word_dado.mp3', '/audio/word_dado.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    word_tela: {
        id: 'word_tela', island: 2, mode: 'palabra', nextLevelId: 'word_nido',
        illustration: '🧵', targetDisplay: 'La ___ es suave', missingPiece: 'tela',
        options: ['tela', 'pela', 'sela', 'mela'],
        audioInstructionPath: '/audio/inst_word_tela.mp3',
        requiredAudios: ['/audio/inst_word_tela.mp3', '/audio/word_tela.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
    word_nido: {
        id: 'word_nido', island: 2, mode: 'palabra', nextLevelId: 'sent_01',
        illustration: '🐣', targetDisplay: 'El pájaro tiene ___', missingPiece: 'nido',
        options: ['nido', 'mido', 'pido', 'lido'],
        audioInstructionPath: '/audio/inst_word_nido.mp3',
        requiredAudios: ['/audio/inst_word_nido.mp3', '/audio/word_nido.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
};

// ── Isla 3 — Completar Oración (10 niveles) ───────────────────────────
const ISLAND_3_LEVELS: Record<string, BaseLevel> = {
    sent_01: {
        id: 'sent_01', island: 3, mode: 'oracion', nextLevelId: 'sent_02',
        illustration: '❤️', targetDisplay: 'Amo a mi ___', missingPiece: 'mamá',
        options: ['mamá', 'sopa', 'dado', 'tela'],
        audioInstructionPath: '/audio/inst_sent_01.mp3',
        requiredAudios: ['/audio/inst_sent_01.mp3', '/audio/word_mama.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    sent_02: {
        id: 'sent_02', island: 3, mode: 'oracion', nextLevelId: 'sent_03',
        illustration: '🤗', targetDisplay: 'Mi mamá me ___', missingPiece: 'ama',
        options: ['ama', 'lima', 'pisa', 'toma'],
        audioInstructionPath: '/audio/inst_sent_02.mp3',
        requiredAudios: ['/audio/inst_sent_02.mp3', '/audio/word_ama.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    sent_03: {
        id: 'sent_03', island: 3, mode: 'oracion', nextLevelId: 'sent_04',
        illustration: '🪣', targetDisplay: 'Papá ___ la pala', missingPiece: 'lima',
        options: ['lima', 'mima', 'pisa', 'sala'],
        audioInstructionPath: '/audio/inst_sent_03.mp3',
        requiredAudios: ['/audio/inst_sent_03.mp3', '/audio/word_lima.mp3', '/audio/success.mp3'],
        difficulty: 'facil',
    },
    sent_04: {
        id: 'sent_04', island: 3, mode: 'oracion', nextLevelId: 'sent_05',
        illustration: '🐦', targetDisplay: 'El ___ es bonito', missingPiece: 'nido',
        options: ['nido', 'dado', 'tela', 'luna'],
        audioInstructionPath: '/audio/inst_sent_04.mp3',
        requiredAudios: ['/audio/inst_sent_04.mp3', '/audio/word_nido.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    sent_05: {
        id: 'sent_05', island: 3, mode: 'oracion', nextLevelId: 'sent_06',
        illustration: '🌙', targetDisplay: 'La luna ___ en el cielo', missingPiece: 'brilla',
        options: ['brilla', 'llama', 'pinta', 'toca'],
        audioInstructionPath: '/audio/inst_sent_05.mp3',
        requiredAudios: ['/audio/inst_sent_05.mp3', '/audio/word_brilla.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    sent_06: {
        id: 'sent_06', island: 3, mode: 'oracion', nextLevelId: 'sent_07',
        illustration: '🍲', targetDisplay: 'Mi ___ toma sopa', missingPiece: 'mamá',
        options: ['mamá', 'papá', 'nido', 'dado'],
        audioInstructionPath: '/audio/inst_sent_06.mp3',
        requiredAudios: ['/audio/inst_sent_06.mp3', '/audio/word_mama.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    sent_07: {
        id: 'sent_07', island: 3, mode: 'oracion', nextLevelId: 'sent_08',
        illustration: '🦆', targetDisplay: 'El pato ___ en el lago', missingPiece: 'nada',
        options: ['nada', 'vuela', 'salta', 'llora'],
        audioInstructionPath: '/audio/inst_sent_07.mp3',
        requiredAudios: ['/audio/inst_sent_07.mp3', '/audio/word_nada.mp3', '/audio/success.mp3'],
        difficulty: 'medio',
    },
    sent_08: {
        id: 'sent_08', island: 3, mode: 'oracion', nextLevelId: 'sent_09',
        illustration: '🪑', targetDisplay: 'La mesa ___ de madera', missingPiece: 'es',
        options: ['es', 'va', 'da', 'si'],
        audioInstructionPath: '/audio/inst_sent_08.mp3',
        requiredAudios: ['/audio/inst_sent_08.mp3', '/audio/word_es.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
    sent_09: {
        id: 'sent_09', island: 3, mode: 'oracion', nextLevelId: 'sent_10',
        illustration: '📚', targetDisplay: 'Mi ___ lee el libro', missingPiece: 'papá',
        options: ['papá', 'mamá', 'pato', 'luna'],
        audioInstructionPath: '/audio/inst_sent_09.mp3',
        requiredAudios: ['/audio/inst_sent_09.mp3', '/audio/word_papa.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
    sent_10: {
        id: 'sent_10', island: 3, mode: 'oracion', nextLevelId: null,
        illustration: '🐸', targetDisplay: 'El sapo ___ en la laguna', missingPiece: 'salta',
        options: ['salta', 'nada', 'duerme', 'come'],
        audioInstructionPath: '/audio/inst_sent_10.mp3',
        requiredAudios: ['/audio/inst_sent_10.mp3', '/audio/word_salta.mp3', '/audio/success.mp3'],
        difficulty: 'dificil',
    },
};

// ── Export combinado ───────────────────────────────────────────────────
export const LEVELS: Record<string, BaseLevel> = {
    ...ISLAND_1_LEVELS,
    ...ISLAND_2_LEVELS,
    ...ISLAND_3_LEVELS,
};

export const LEVELS_BY_ISLAND: Record<1 | 2 | 3, BaseLevel[]> = {
    1: Object.values(ISLAND_1_LEVELS),
    2: Object.values(ISLAND_2_LEVELS),
    3: Object.values(ISLAND_3_LEVELS),
};
