"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DraggablePiece } from "./DraggablePiece";
import { DropZone } from "./DropZone";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowLeft, PlayCircle } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import { MODE_LABELS } from "@/data/levels";
import confetti from "canvas-confetti";

type GameState = "onboarding" | "countdown" | "playing" | "completed";

// ── Tema visual por isla ──────────────────────────────────────────────
const ISLAND_THEME = {
    1: {
        bg: "from-sky-400 via-blue-400 to-indigo-500",
        optionsBg: "bg-sky-50/90 border-sky-100",
        name: "Isla de Sílabas",
        mascot: "🦜",
        completionMsg: "¡Sílaba correcta!",
        confettiColors: ["#38bdf8", "#818cf8", "#c084fc", "#fde68a", "#ffffff"],
    },
    2: {
        bg: "from-emerald-400 via-green-400 to-teal-500",
        optionsBg: "bg-emerald-50/90 border-emerald-100",
        name: "Isla de Palabras",
        mascot: "🦋",
        completionMsg: "¡Palabra encontrada!",
        confettiColors: ["#34d399", "#6ee7b7", "#fde68a", "#f9a8d4", "#ffffff"],
    },
    3: {
        bg: "from-violet-400 via-purple-400 to-indigo-500",
        optionsBg: "bg-violet-50/90 border-violet-100",
        name: "Isla de Oraciones",
        mascot: "🦄",
        completionMsg: "¡Oración completa!",
        confettiColors: ["#a78bfa", "#c4b5fd", "#f9a8d4", "#fde68a", "#ffffff"],
    },
} as const;

// ── Renderiza la frase mostrando el hueco ─────────────────────────────
// Modo sílaba: parte la palabra por la sílaba real (ej: "lu" en "Lupa" → ["", "pa"])
// Modo palabra/oración: parte por el marcador ___ explícito
function buildParts(targetDisplay: string, missingPiece: string, mode: string): string[] {
    if (mode === "silaba") {
        // Buscar la sílaba (insensible a mayúsculas) dentro de la palabra
        const lower = targetDisplay.toLowerCase();
        const idx = lower.indexOf(missingPiece.toLowerCase());
        if (idx === -1) return [targetDisplay]; // Fallback: no se encontró
        return [
            targetDisplay.slice(0, idx),
            targetDisplay.slice(idx + missingPiece.length),
        ];
    }
    return targetDisplay.split("___");
}

export const GameBoard = ({ onBack }: { onBack?: () => void }) => {
    const { currentLevelId, getLevelData, unlockLevel } = useGameContext();
    const level = currentLevelId ? getLevelData(currentLevelId) : null;
    const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

    if (!level) return (
        <div className="flex items-center justify-center h-full">
            <p className="text-red-400 font-bold">Nivel no encontrado</p>
        </div>
    );

    const theme = ISLAND_THEME[level.island];
    const modeMeta = MODE_LABELS[level.mode];
    const parts = buildParts(level.targetDisplay, level.missingPiece, level.mode);

    const [gameState, setGameState] = useState<GameState>("onboarding");
    const [countdown, setCountdown] = useState(3);
    const [filledSlot, setFilledSlot] = useState<string | null>(null);
    const [errors, setErrors] = useState(0);
    const [wiggleKey, setWiggleKey] = useState(0); // key trigger sin estado booleano

    // Reset al cambiar nivel
    useEffect(() => {
        setGameState("onboarding");
        setCountdown(3);
        setFilledSlot(null);
        setErrors(0);
    }, [currentLevelId]);

    // Cuenta regresiva con delays correctos
    useEffect(() => {
        if (gameState !== "countdown") return;
        if (countdown > 0) {
            playAudio(`/audio/countdown_${countdown}.mp3`);
            const t = setTimeout(() => setCountdown((c) => c - 1), 1500);
            return () => clearTimeout(t);
        }
        playAudio("/audio/countdown_go.mp3");
        const t1 = setTimeout(() => setGameState("playing"), 400);
        const t2 = setTimeout(() => playInstruction(), 1200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [gameState, countdown]);

    const playAudio = (path: string) => {
        const a = new Audio(path);
        a.play().catch(() => { });
    };
    const playInstruction = () => playAudio(level.audioInstructionPath);

    const fireConfetti = useCallback(() => {
        const canvas = confettiCanvasRef.current;
        if (!canvas) return;
        const fire = confetti.create(canvas, { resize: true, useWorker: true });
        const colors = [...theme.confettiColors]; // readonly → mutable

        // Primer burst
        fire({ particleCount: 80, spread: 90, origin: { x: 0.5, y: 0.6 }, colors, ticks: 200 });
        // Ráfagas laterales con delay
        setTimeout(() => {
            fire({ particleCount: 40, spread: 60, origin: { x: 0.15, y: 0.7 }, colors, angle: 60 });
            fire({ particleCount: 40, spread: 60, origin: { x: 0.85, y: 0.7 }, colors, angle: 120 });
        }, 250);
    }, [theme.confettiColors]);


    const handleDragStart = (event: DragStartEvent) => {
        const id = String(event.active.id);
        const prefix = level.mode === "silaba" ? "syl" : "word";
        playAudio(`/audio/${prefix}_${id}.mp3`);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over?.id !== "drop-slot") return;

        if (active.id === level.missingPiece) {
            setFilledSlot(String(active.id));
            setErrors(0);
            playAudio("/audio/success.mp3");
            if (level.nextLevelId) unlockLevel(level.nextLevelId);
            // Mostrar confetti antes de transicionar
            setTimeout(() => fireConfetti(), 100);
            setTimeout(() => setGameState("completed"), 1200);
        } else {
            setErrors((p) => p + 1);
            setWiggleKey((k) => k + 1); // trigger animación shake
        }
    };

    const showHint = errors >= 3;

    const renderTarget = () => (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {parts.map((part, i) => (
                <React.Fragment key={i}>
                    {part.trim() && (
                        <span className={`
                            font-black bg-white/90 shadow-sm border-2 border-white/80
                            px-4 py-2 rounded-2xl text-slate-700 capitalize leading-none
                            ${level.mode === "silaba" ? "text-4xl md:text-5xl" : "text-xl md:text-2xl"}
                        `}>
                            {part.trim()}
                        </span>
                    )}
                    {i < parts.length - 1 && (
                        <DropZone
                            id="drop-slot"
                            expectedContent={level.missingPiece}
                            isFilledWith={filledSlot ?? undefined}
                            isHinted={showHint}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col w-full h-full min-h-screen relative overflow-hidden select-none"
            style={{ background: "linear-gradient(160deg, #e0f2fe 0%, #f0fdf4 50%, #faf5ff 100%)" }}>

            {/* Canvas de confetti (fullscreen, no interactivo) */}
            <canvas
                ref={confettiCanvasRef}
                className="fixed inset-0 pointer-events-none z-50 w-full h-full"
            />

            {/* Fondo decorativo de isla */}
            <div className={`absolute top-0 inset-x-0 h-44 bg-gradient-to-br ${theme.bg} opacity-15 rounded-b-[3rem]`} />

            {/* ── Header ── */}
            <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2 gap-3">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={onBack}
                    className="flex items-center gap-1.5 bg-white/85 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-sm border border-white font-bold text-slate-600 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Mapa
                </motion.button>

                <div className="flex items-center gap-2 bg-white/75 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-white flex-1 justify-center">
                    <span className="text-xl">{theme.mascot}</span>
                    <div>
                        <p className="text-slate-600 font-black text-xs leading-none">{theme.name}</p>
                        <p className="text-slate-400 text-[10px] font-semibold">{modeMeta.emoji} {modeMeta.label}</p>
                    </div>
                </div>

                <AnimatePresence>
                    {gameState === "playing" ? (
                        <motion.button
                            key="volume"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={playInstruction}
                            className={`shrink-0 bg-gradient-to-br ${theme.bg} text-white p-3 rounded-2xl shadow-lg border-b-4 border-black/10`}
                        >
                            <Volume2 className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <div key="spacer" className="w-[52px] shrink-0" />
                    )}
                </AnimatePresence>
            </div>

            {/* ── Contenido central ── */}
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-4">
                <AnimatePresence mode="wait">

                    {/* ONBOARDING */}
                    {gameState === "onboarding" && (
                        <motion.div
                            key="onboarding"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col items-center gap-5 w-full max-w-sm"
                        >
                            <motion.div
                                animate={{ y: [-6, 6, -6] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                className={`relative w-40 h-40 rounded-[2.5rem] bg-gradient-to-br ${theme.bg} shadow-2xl flex items-center justify-center`}
                            >
                                <span className="text-7xl drop-shadow-lg">{level.illustration}</span>
                                <span className="absolute -top-3 -right-3 bg-white text-xs font-bold text-slate-600 px-2 py-1 rounded-xl shadow-md">
                                    {modeMeta.emoji} {modeMeta.label}
                                </span>
                            </motion.div>

                            <p className="text-slate-600 font-bold text-base text-center">{modeMeta.instruction}</p>

                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.94, y: 3 }}
                                onClick={() => { setCountdown(3); setGameState("countdown"); }}
                                className={`flex items-center gap-3 text-white font-black text-xl py-5 px-12 rounded-[1.5rem]
                                           bg-gradient-to-br ${theme.bg} shadow-xl border-b-[6px] border-black/15
                                           active:border-b-0 active:translate-y-1 transition-all`}
                            >
                                <PlayCircle className="w-7 h-7" /> ¡Empezar!
                            </motion.button>
                        </motion.div>
                    )}

                    {/* COUNTDOWN */}
                    {gameState === "countdown" && (
                        <motion.div
                            key="countdown"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={countdown}
                                    initial={{ scale: 0.2, opacity: 0, rotate: -20 }}
                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                    exit={{ scale: 1.5, opacity: 0 }}
                                    transition={{ type: "spring", damping: 14, stiffness: 200 }}
                                    className={`w-44 h-44 rounded-[2.5rem] bg-gradient-to-br ${theme.bg} shadow-2xl flex items-center justify-center`}
                                >
                                    <span className="text-[80px] font-black text-white drop-shadow-lg leading-none">
                                        {countdown > 0 ? countdown : "🚀"}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* PLAYING */}
                    {gameState === "playing" && (
                        <motion.div
                            key="playing"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center gap-4 w-full max-w-sm"
                        >
                            {/* Ilustración */}
                            <motion.div
                                animate={{ y: [-4, 4, -4] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                className={`w-24 h-24 rounded-[1.75rem] bg-gradient-to-br ${theme.bg} shadow-xl flex items-center justify-center`}
                            >
                                <span className="text-5xl drop-shadow">{level.illustration}</span>
                            </motion.div>

                            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                                {/* Palabra/Oración con hueco */}
                                <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-md border-2 border-white">
                                    {renderTarget()}
                                </div>

                                {/* Piezas arrastrables */}
                                <div className={`w-full rounded-3xl p-4 border-2 ${theme.optionsBg} shadow-inner`}>
                                    <p className="text-center text-slate-400 text-xs font-bold mb-3 uppercase tracking-widest">
                                        Arrastra la respuesta ↑
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        {level.options.map((opt) => {
                                            const isCorrect = opt === level.missingPiece;
                                            if (filledSlot === opt) return <div key={opt} className="w-16 h-16" />;
                                            return (
                                                <motion.div
                                                    key={`${opt}-${wiggleKey}`}
                                                    animate={wiggleKey > 0 && !isCorrect
                                                        ? { x: [-10, 10, -8, 8, -4, 4, 0] }
                                                        : {}
                                                    }
                                                    transition={{ duration: 0.45, ease: "easeInOut" }}
                                                >
                                                    <DraggablePiece
                                                        id={opt}
                                                        content={opt}
                                                        isHinted={showHint && isCorrect}
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </DndContext>

                            {/* Feedback de errores */}
                            <AnimatePresence>
                                {errors > 0 && errors < 3 && (
                                    <motion.p
                                        key={errors}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-amber-500 text-sm font-bold text-center"
                                    >
                                        {errors === 1 ? "🟡 ¡Inténtalo de nuevo!" : "🟠 ¡Casi! Una pista en camino..."}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* COMPLETED */}
                    {gameState === "completed" && (
                        <motion.div
                            key="completed"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", damping: 16, stiffness: 180 }}
                            className="flex flex-col items-center gap-5 w-full max-w-sm"
                        >
                            <div className={`w-full rounded-[2.5rem] bg-gradient-to-br ${theme.bg} p-8 shadow-2xl flex flex-col items-center gap-4`}>
                                <motion.span
                                    initial={{ scale: 0, rotate: -30 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", damping: 10, delay: 0.1 }}
                                    className="text-7xl drop-shadow-xl"
                                >
                                    {level.illustration}
                                </motion.span>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="text-white font-black text-2xl text-center drop-shadow"
                                >
                                    {theme.completionMsg}
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4, type: "spring" }}
                                    className="bg-white/30 backdrop-blur-sm rounded-2xl px-8 py-3"
                                >
                                    <p className="text-white font-black text-4xl text-center tracking-wide">
                                        {level.missingPiece}
                                    </p>
                                </motion.div>
                            </div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={onBack}
                                className="w-full flex items-center justify-center gap-2 bg-white/90 border-2 border-white text-slate-700 font-black text-xl py-5 rounded-[1.5rem] shadow-lg"
                            >
                                ¡Siguiente Reto! 🚀
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
