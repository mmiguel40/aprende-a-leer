"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LEVELS, Difficulty } from "@/data/levels";

// ── Tipos ─────────────────────────────────────────────────────────────
export type PackStatus = "idle" | "downloading" | "done" | "error";

export interface PackInfo {
    status: PackStatus;
    progress: number; // 0–100
    audioCount: number;
}

type PackState = Record<Difficulty, PackInfo>;

// ── Helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = "appLectura_cached_packs_v1";

/** Colectar todos los audios agrupados por dificultad */
function buildAudiosByDifficulty(): Record<Difficulty, string[]> {
    const result: Record<Difficulty, string[]> = { facil: [], medio: [], dificil: [] };

    const SHARED_AUDIOS = [
        "/audio/countdown_3.mp3",
        "/audio/countdown_2.mp3",
        "/audio/countdown_1.mp3",
        "/audio/countdown_go.mp3",
        "/audio/success.mp3",
    ];

    for (const level of Object.values(LEVELS)) {
        const diff = level.difficulty;
        for (const url of level.requiredAudios) {
            if (!result[diff].includes(url)) {
                result[diff].push(url);
            }
        }
    }

    // Los audios compartidos van al paquete más básico (fácil)
    for (const url of SHARED_AUDIOS) {
        if (!result.facil.includes(url)) {
            result.facil.push(url);
        }
    }

    return result;
}

const audiosByDifficulty = buildAudiosByDifficulty();

// ── Hook ──────────────────────────────────────────────────────────────
export function usePwaCache() {
    const swRef = useRef<ServiceWorker | null>(null);
    const [swReady, setSwReady] = useState(false);

    const [packState, setPackState] = useState<PackState>(() => {
        const saved = typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEY)
            : null;
        const savedPacks: Difficulty[] = saved ? JSON.parse(saved) : [];

        const initial = (d: Difficulty): PackInfo => ({
            status: savedPacks.includes(d) ? "done" : "idle",
            progress: savedPacks.includes(d) ? 100 : 0,
            audioCount: audiosByDifficulty[d].length,
        });

        return {
            facil: initial("facil"),
            medio: initial("medio"),
            dificil: initial("dificil"),
        };
    });

    // Registrar el Service Worker y escuchar sus mensajes
    useEffect(() => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
                const sw = reg.active || reg.waiting || reg.installing;
                if (sw) { swRef.current = sw; setSwReady(true); }
                reg.addEventListener("updatefound", () => {
                    const newSw = reg.installing;
                    if (newSw) newSw.addEventListener("statechange", () => {
                        if (newSw.state === "activated") { swRef.current = newSw; setSwReady(true); }
                    });
                });
            })
            .catch(console.error);

        const onMessage = (event: MessageEvent) => {
            const { type, packName, loaded, total, done } = event.data || {};

            if (type === "PACK_PROGRESS") {
                const diff = packName as Difficulty;
                setPackState((prev) => ({
                    ...prev,
                    [diff]: {
                        ...prev[diff],
                        status: "downloading",
                        progress: Math.round((loaded / total) * 100),
                    },
                }));
            }

            if (type === "PACK_DONE") {
                const diff = packName as Difficulty;
                setPackState((prev) => {
                    const next = {
                        ...prev,
                        [diff]: { ...prev[diff], status: "done" as PackStatus, progress: 100 },
                    };
                    // Persistir en localStorage
                    const done: Difficulty[] = (Object.keys(next) as Difficulty[]).filter(
                        (k) => next[k].status === "done"
                    );
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
                    return next;
                });
            }

            if (type === "PACK_ERROR") {
                const diff = packName as Difficulty;
                setPackState((prev) => ({
                    ...prev,
                    [diff]: { ...prev[diff], status: "error", progress: 0 },
                }));
            }
        };

        navigator.serviceWorker.addEventListener("message", onMessage);
        return () => navigator.serviceWorker.removeEventListener("message", onMessage);
    }, []);

    // Función pública para iniciar la descarga de un paquete
    const downloadPack = useCallback(async (difficulty: Difficulty) => {
        const registration = await navigator.serviceWorker.ready;
        const sw = registration.active;
        if (!sw) return;

        setPackState((prev) => ({
            ...prev,
            [difficulty]: { ...prev[difficulty], status: "downloading", progress: 0 },
        }));

        sw.postMessage({
            type: "CACHE_PACK",
            packName: difficulty,
            urls: audiosByDifficulty[difficulty],
        });
    }, []);

    return { packState, downloadPack, swReady };
}
