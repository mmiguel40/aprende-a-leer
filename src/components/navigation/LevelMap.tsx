"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LevelNode, NodeState } from "./LevelNode";
import { AudioPackDownloader } from "./AudioPackDownloader";
import { useGameContext } from "@/context/GameContext";
import { LEVELS_BY_ISLAND, BaseLevel } from "@/data/levels";
import { Volume2 } from "lucide-react";


// ── Config visual de cada isla ─────────────────────────────────────────
const ISLAND_CONFIG = {
    1: {
        emoji: "🏝️",
        title: "Isla de Sílabas",
        subtitle: "Aprende las primeras letras",
        bg: "from-sky-400 to-blue-500",
        nodeBg: "bg-sky-50",
        border: "border-sky-300",
        badge: "bg-sky-100 text-sky-700",
        mascot: "🦜",
        locked_text: "text-sky-300",
    },
    2: {
        emoji: "🌿",
        title: "Isla de Palabras",
        subtitle: "Construye palabras completas",
        bg: "from-emerald-400 to-green-500",
        nodeBg: "bg-emerald-50",
        border: "border-emerald-300",
        badge: "bg-emerald-100 text-emerald-700",
        mascot: "🦋",
        locked_text: "text-emerald-300",
    },
    3: {
        emoji: "✨",
        title: "Isla de Oraciones",
        subtitle: "¡Forma oraciones completas!",
        bg: "from-violet-400 to-purple-500",
        nodeBg: "bg-violet-50",
        border: "border-violet-300",
        badge: "bg-violet-100 text-violet-700",
        mascot: "🦄",
        locked_text: "text-violet-300",
    },
} as const;

// ── Helper: estado del nodo ────────────────────────────────────────────
function getNodeState(
    levelId: string,
    indexInIsland: number,
    islandLevels: BaseLevel[],
    unlockedLevels: string[]
): NodeState {
    const isUnlocked = unlockedLevels.includes(levelId);
    if (!isUnlocked) return "locked";
    const unlockedInIsland = islandLevels.filter((l) => unlockedLevels.includes(l.id));
    const isLastUnlocked = indexInIsland === unlockedInIsland.length - 1;
    return isLastUnlocked ? "current" : "completed";
}

// ── Componente ─────────────────────────────────────────────────────────
export const LevelMap = ({ onSelectLevel }: { onSelectLevel: (id: string) => void }) => {
    const { unlockedLevels, setCurrentLevelId, childName } = useGameContext();
    const [showDownloader, setShowDownloader] = useState(false);

    const handleNodeClick = (id: string, state: NodeState) => {
        if (state !== "locked") {
            setCurrentLevelId(id);
            onSelectLevel(id);
        }
    };

    return (
        <div className="w-full h-full min-h-screen relative overflow-y-auto flex flex-col items-center"
            style={{ background: "linear-gradient(160deg, #e0f2fe 0%, #f0fdf4 50%, #faf5ff 100%)" }}>

            {/* ── Header sticky personalizado ── */}
            <div className="sticky top-0 z-30 w-full flex items-center justify-between px-4 py-3
                            bg-white/60 backdrop-blur-lg border-b border-white/50 shadow-sm">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">🗺️</span>
                    <div>
                        {childName ? (
                            <>
                                <p className="font-black text-slate-700 text-base leading-none">
                                    ¡Hola, {childName}! 👋
                                </p>
                                <p className="text-slate-400 text-xs font-semibold">¿Qué practicamos hoy?</p>
                            </>
                        ) : (
                            <>
                                <p className="font-black text-slate-700 text-base leading-none">El Camino</p>
                                <p className="text-slate-400 text-xs font-semibold">de las Letras</p>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Botón saludo personalizado */}
                    {childName && (
                        <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => {
                                const safeName = childName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "_");
                                const audio = new Audio(`/audio/greeting_${safeName}.mp3`);
                                audio.play().catch(() => { });
                            }}
                            className="bg-white/90 text-violet-500 p-2 rounded-2xl shadow-sm border border-white"
                            title="Escuchar saludo"
                        >
                            <Volume2 className="w-4 h-4" />
                        </motion.button>
                    )}

                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setShowDownloader((v) => !v)}
                        className={`flex items-center gap-1.5 text-xs font-bold rounded-2xl px-3 py-2 shadow transition-all ${showDownloader
                            ? "bg-slate-700 text-white shadow-slate-300"
                            : "bg-white text-slate-500 hover:bg-slate-50 shadow-slate-100"
                            }`}
                    >
                        <span>📥</span> Audios
                    </motion.button>
                </div>
            </div>


            {/* Panel de descarga */}
            <div className="relative w-full max-w-sm px-4 pt-2 z-20">
                <AudioPackDownloader isOpen={showDownloader} />
            </div>

            {/* ── Islas ── */}
            <div className="w-full max-w-sm px-4 pt-4 pb-10 flex flex-col gap-5">
                {([1, 2, 3] as const).map((islandNum, islandIdx) => {
                    const cfg = ISLAND_CONFIG[islandNum];
                    const islandLevels = LEVELS_BY_ISLAND[islandNum];
                    const isIslandLocked = !islandLevels.some((l) => unlockedLevels.includes(l.id));

                    return (
                        <motion.div
                            key={islandNum}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: islandIdx * 0.12, type: "spring", damping: 20 }}
                            className={`relative rounded-[2rem] overflow-hidden shadow-lg border-2 ${cfg.border} ${isIslandLocked ? "opacity-60" : ""}`}
                        >
                            {/* Banner de isla */}
                            <div className={`bg-gradient-to-r ${cfg.bg} px-5 pt-4 pb-10 flex items-center justify-between`}>
                                <div>
                                    <p className="text-white font-black text-lg leading-tight drop-shadow">{cfg.emoji} {cfg.title}</p>
                                    <p className="text-white/80 text-xs font-semibold mt-0.5">{cfg.subtitle}</p>
                                </div>
                                <motion.span
                                    animate={isIslandLocked ? {} : { rotate: [0, -10, 10, -5, 0] }}
                                    transition={{ repeat: Infinity, duration: 4, delay: islandIdx }}
                                    className="text-5xl drop-shadow-md"
                                >
                                    {cfg.mascot}
                                </motion.span>
                            </div>

                            {/* Panel de nodos (superpuesto sobre el banner) */}
                            <div className="bg-white/85 backdrop-blur-sm mx-3 -mt-6 rounded-2xl shadow-inner border border-white px-4 py-4 mb-3">
                                {isIslandLocked ? (
                                    <div className="flex flex-col items-center gap-1 py-2">
                                        <span className="text-3xl">🔒</span>
                                        <p className="text-slate-400 text-xs font-bold">
                                            Completa la isla anterior para desbloquear
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-5 gap-2 justify-items-center">
                                        {islandLevels.map((level, index) => {
                                            const state = getNodeState(level.id, index, islandLevels, unlockedLevels);
                                            return (
                                                <LevelNode
                                                    key={level.id}
                                                    label={`${index + 1}`}
                                                    state={state}
                                                    position={{ x: 50, y: 50 }}
                                                    onClick={() => handleNodeClick(level.id, state)}
                                                    static
                                                    islandNum={islandNum}
                                                />
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Progreso textual */}
                            {!isIslandLocked && (
                                <div className="px-5 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-500">Progreso</span>
                                        <span className="text-xs font-bold text-slate-400">
                                            {islandLevels.filter((l) => unlockedLevels.includes(l.id) &&
                                                getNodeState(l.id, islandLevels.indexOf(l), islandLevels, unlockedLevels) === "completed"
                                            ).length} / {islandLevels.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full bg-gradient-to-r ${cfg.bg}`}
                                            initial={{ width: "0%" }}
                                            animate={{
                                                width: `${(islandLevels.filter((l) => unlockedLevels.includes(l.id)).length / islandLevels.length) * 100}%`
                                            }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    );
                })}

                {/* Footer decorativo */}
                <div className="text-center text-slate-300 text-sm font-bold pt-2">
                    ¡Sigue aprendiendo! ⭐
                </div>
            </div>
        </div>
    );
};
