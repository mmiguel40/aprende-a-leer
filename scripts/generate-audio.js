const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// ── Configuración ────────────────────────────────────────────────────
const API_KEY = process.env.GOOGLE_TTS_API_KEY;
const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

const outputDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ── Audios a generar: solo los que NO existen ya ──────────────────────
// Verificado el 2026-02-20 (ya existen: countdown_*.mp3, success.mp3,
// inst_manzana_m.mp3, syl_man/san/pa/ta/lu/ul/sa/za/ma.mp3,
// inst_pato/lupa/sapo.mp3)

const ALL_AUDIOS = {
    // ── Isla 1: Sílabas nuevas ──
    "inst_toro": "Escucha bien: Toro. Ahora elige la sílaba que falta.",
    "syl_to": "to",
    "syl_ro": "ro",
    "inst_nido": "Escucha bien: Nido. Ahora elige la sílaba que falta.",
    "syl_ni": "ni",
    "syl_mi": "mi",
    "inst_dedo": "Escucha bien: Dedo. Ahora elige la sílaba que falta.",
    "syl_de": "de",
    "syl_te": "te",
    "inst_jarra": "Escucha bien: Jarra. Ahora elige la sílaba que falta.",
    "syl_ja": "ja",
    "syl_ga": "ga",
    "inst_miel": "Escucha bien: Miel. Ahora elige la sílaba que falta.",
    "syl_miel": "miel",
    "syl_piel": "piel",
    "inst_cisne": "Escucha bien: Cisne. Ahora elige la sílaba que falta.",
    "syl_cis": "cis",
    "syl_sis": "sis",

    // ── Isla 2: Palabras ──
    "inst_word_mama": "Elige la palabra que falta en la oración.",
    "inst_word_papa": "Elige la palabra que falta en la oración.",
    "inst_word_mimo": "Elige la palabra que falta en la oración.",
    "inst_word_pala": "Elige la palabra que falta en la oración.",
    "inst_word_mesa": "Elige la palabra que falta en la oración.",
    "inst_word_sopa": "Elige la palabra que falta en la oración.",
    "inst_word_luna": "Elige la palabra que falta en la oración.",
    "inst_word_dado": "Elige la palabra que falta en la oración.",
    "inst_word_tela": "Elige la palabra que falta en la oración.",
    "inst_word_nido": "Elige la palabra que falta en la oración.",
    "word_mama": "mamá",
    "word_papa": "papá",
    "word_mimo": "mimo",
    "word_pala": "pala",
    "word_mesa": "mesa",
    "word_sopa": "sopa",
    "word_luna": "luna",
    "word_dado": "dado",
    "word_tela": "tela",
    "word_nido": "nido",
    "word_loma": "loma",
    "word_toma": "toma",
    "word_sala": "sala",

    // ── Isla 3: Oraciones ──
    "inst_sent_01": "Elige cómo se completa la oración.",
    "inst_sent_02": "Elige cómo se completa la oración.",
    "inst_sent_03": "Elige cómo se completa la oración.",
    "inst_sent_04": "Elige cómo se completa la oración.",
    "inst_sent_05": "Elige cómo se completa la oración.",
    "inst_sent_06": "Elige cómo se completa la oración.",
    "inst_sent_07": "Elige cómo se completa la oración.",
    "inst_sent_08": "Elige cómo se completa la oración.",
    "inst_sent_09": "Elige cómo se completa la oración.",
    "inst_sent_10": "Elige cómo se completa la oración.",
    "word_ama": "ama",
    "word_lima": "lima",
    "word_brilla": "brilla",
    "word_llama": "llama",
    "word_pinta": "pinta",
    "word_toca": "toca",
    "word_nada": "nada",
    "word_vuela": "vuela",
    "word_salta": "salta",
    "word_llora": "llora",
    "word_es": "es",
    "word_va": "va",
    "word_da": "da",
    "word_si": "sí",
    "word_pato": "pato",
    "word_duerme": "duerme",
    "word_come": "come",
};

// Filtrar los que ya existen
const missing = Object.fromEntries(
    Object.entries(ALL_AUDIOS).filter(([name]) =>
        !fs.existsSync(path.join(outputDir, `${name}.mp3`))
    )
);

// ── Función de generación ─────────────────────────────────────────────
async function generateAudio(filename, text) {
    const makeBody = (name) => ({
        input: { text },
        voice: { languageCode: 'es-ES', name },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 }
    });

    try {
        let response = await fetch(TTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(makeBody('es-ES-Neural2-A'))
        });

        if (!response.ok) {
            response = await fetch(TTS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(makeBody('es-ES-Standard-A'))
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ Error ${filename}:`, response.status, errorText);
                return false;
            }
            const data = await response.json();
            fs.writeFileSync(path.join(outputDir, `${filename}.mp3`), Buffer.from(data.audioContent, 'base64'));
            console.log(`✅ ${filename}.mp3 (Standard)`);
            return true;
        }

        const data = await response.json();
        fs.writeFileSync(path.join(outputDir, `${filename}.mp3`), Buffer.from(data.audioContent, 'base64'));
        console.log(`✅ ${filename}.mp3 (Neural2)`);
        return true;
    } catch (error) {
        console.error(`❌ ${filename}:`, error.message);
        return false;
    }
}

// ── Main ──────────────────────────────────────────────────────────────
async function main() {
    const total = Object.keys(missing).length;
    if (total === 0) {
        console.log('✅ ¡Todos los audios ya existen! No hay nada que generar.');
        return;
    }
    console.log(`\n🎙️  Generando ${total} audios nuevos...\n`);
    let errors = 0;
    for (const [filename, text] of Object.entries(missing)) {
        const ok = await generateAudio(filename, text);
        if (!ok) errors++;
    }
    console.log('\n──────────────────────────────────────────');
    if (errors === 0) {
        console.log('🎉 ¡Todos los audios generados correctamente!');
    } else {
        console.log(`⚠️  ${errors} audios fallaron. Puedes reintentar el script.`);
    }
    const allFiles = fs.readdirSync(outputDir).sort();
    console.log(`\n📂 public/audio/ — ${allFiles.length} archivos totales:`);
    allFiles.forEach(f => console.log(`   ${f}`));
}

main();
