import { NextRequest, NextResponse } from "next/server";

// Google TTS API Route — genera audio personalizado con el nombre del niño
// Se llama solo la primera vez (onboarding), el resultado se guarda en /public/audio/
const TTS_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY || "AIzaSyD02tTlrSU0iQJTFLmJEUFCp0U6AAFWNKQ"}`;

const fs = await import("fs/promises");
const path = await import("path");

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name")?.trim();
    const type = searchParams.get("type") ?? "greeting"; // "greeting" | "name"

    if (!name || name.length < 1) {
        return NextResponse.json({ error: "name param required" }, { status: 400 });
    }

    // Sanitizar el nombre para el nombre de archivo (lowercase, sin acentos complejos)
    const safeName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "_");

    const audioDir = path.join(process.cwd(), "public", "audio");
    const filename = `${type}_${safeName}.mp3`;
    const filePath = path.join(audioDir, filename);

    // Si el archivo ya existe, devolvemos el path (no regeneramos)
    try {
        await fs.access(filePath);
        return NextResponse.json({ success: true, path: `/audio/${filename}`, cached: true });
    } catch {
        // No existe, hay que generarlo
    }

    // Texto a sintetizar
    const texts: Record<string, string> = {
        greeting: `¡Bienvenido de vuelta, ${name}! ¿Qué quieres practicar hoy?`,
        name: name,
    };
    const text = texts[type] ?? name;

    // Llamar a Google TTS
    const body = {
        input: { text },
        voice: { languageCode: "es-ES", name: "es-ES-Neural2-A" },
        audioConfig: { audioEncoding: "MP3", speakingRate: 0.9 },
    };

    try {
        let response = await fetch(TTS_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        // Fallback a Standard si Neural2 falla
        if (!response.ok) {
            const fallbackBody = { ...body, voice: { languageCode: "es-ES", name: "es-ES-Standard-A" } };
            response = await fetch(TTS_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fallbackBody),
            });
        }

        if (!response.ok) {
            const err = await response.text();
            return NextResponse.json({ error: err }, { status: 502 });
        }

        const data = await response.json() as { audioContent: string };
        const audioBuffer = Buffer.from(data.audioContent, "base64");

        // Guardar en public/audio/ para que esté disponible offline via SW
        await fs.mkdir(audioDir, { recursive: true });
        await fs.writeFile(filePath, audioBuffer);

        return NextResponse.json({ success: true, path: `/audio/${filename}`, cached: false });
    } catch (error) {
        console.error("[generate-name-audio]", error);
        return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }
}
