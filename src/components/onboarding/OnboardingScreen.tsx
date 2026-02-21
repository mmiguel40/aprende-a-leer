"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ArrowRight, Sparkles } from "lucide-react";
import { useGameContext } from "@/context/GameContext";
import confetti from "canvas-confetti";

type Step = 1 | 2 | 3 | 4;

// ── Pantalla 1: Bienvenida ─────────────────────────────────────────────
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
    <motion.div
        key="step1"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30, filter: "blur(6px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-7 w-full max-w-xs text-center"
    >
        {/* Mascota animada */}
        <motion.div
            animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative"
        >
            <div className="w-36 h-36 rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-violet-500 shadow-2xl flex items-center justify-center">
                <span className="text-7xl drop-shadow-lg">🦜</span>
            </div>
            <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute -top-3 -right-3 text-2xl"
            >⭐</motion.span>
        </motion.div>

        <div>
            <h1 className="font-black text-3xl text-slate-800 leading-tight">
                ¡El Camino<br />de las Letras!
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-semibold">
                Aprende a leer jugando 🎮
            </p>
        </div>

        <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            onClick={onNext}
            className="flex items-center gap-3 text-white font-black text-xl py-5 px-10 rounded-[1.5rem]
                       bg-gradient-to-br from-sky-400 to-violet-500 shadow-xl border-b-[6px] border-black/15
                       active:border-b-0 active:translate-y-1 transition-all w-full justify-center"
        >
            <PlayCircle className="w-6 h-6" /> ¡Comenzar aventura!
        </motion.button>
    </motion.div>
);

// ── Pantalla 2: Input del nombre ───────────────────────────────────────
const NameStep = ({ onNext }: { onNext: (name: string) => void }) => {
    const [name, setName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 300); }, []);

    const handleSubmit = () => {
        if (name.trim().length >= 2) onNext(name.trim());
    };

    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-col items-center gap-6 w-full max-w-xs text-center"
        >
            <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl flex items-center justify-center"
            >
                <span className="text-5xl drop-shadow">👋</span>
            </motion.div>

            <div>
                <h2 className="font-black text-2xl text-slate-800">¿Cómo te llamas?</h2>
                <p className="text-slate-400 text-sm mt-1">Te llamaré así en cada aventura</p>
            </div>

            {/* Input grande táctil */}
            <div className="w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 20))}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Tu nombre aquí..."
                    maxLength={20}
                    className="w-full text-center text-2xl font-black text-slate-700 bg-white/90 border-4 border-white
                               rounded-2xl px-4 py-4 shadow-lg outline-none focus:border-sky-300 transition-colors
                               placeholder:text-slate-200 placeholder:font-semibold"
                    style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)" }}
                />
                {/* Preview del nombre letra a letra */}
                {name.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center gap-1 mt-3 flex-wrap"
                    >
                        {name.split("").map((char, i) => (
                            <motion.span
                                key={i}
                                initial={{ scale: 0, rotate: -15 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", damping: 12, delay: i * 0.03 }}
                                className="w-8 h-8 bg-gradient-to-br from-sky-400 to-violet-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow"
                            >
                                {char === " " ? "·" : char.toUpperCase()}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </div>

            <motion.button
                whileHover={name.trim().length >= 2 ? { scale: 1.04, y: -2 } : {}}
                whileTap={name.trim().length >= 2 ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={name.trim().length < 2}
                className={`flex items-center justify-center gap-2 w-full font-black text-lg py-5 rounded-[1.5rem] shadow-lg border-b-[5px] border-black/10 transition-all
                    ${name.trim().length >= 2
                        ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white active:border-b-0 active:translate-y-1"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
            >
                <ArrowRight className="w-5 h-5" /> ¡Ese soy yo!
            </motion.button>
        </motion.div>
    );
};

// ── Pantalla 3: Generando audio (loading) ──────────────────────────────
const LoadingStep = ({ name, onDone }: { name: string; onDone: () => void }) => {
    useEffect(() => {
        const generate = async () => {
            try {
                // Generar los dos audios en paralelo
                const safe = encodeURIComponent(name);
                await Promise.all([
                    fetch(`/api/generate-name-audio?name=${safe}&type=greeting`),
                    fetch(`/api/generate-name-audio?name=${safe}&type=name`),
                ]);
            } catch (e) {
                console.warn("TTS generation failed (will use silence)", e);
            }
            // Pasa a la siguiente pantalla independientemente del resultado
            setTimeout(onDone, 600);
        };
        generate();
    }, []);

    const DOTS = ["✨", "🌟", "⭐", "💫"];
    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-7 w-full max-w-xs text-center"
        >
            {/* Spinner temático */}
            <div className="relative w-36 h-36">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-36 h-36 rounded-full border-8 border-violet-100 border-t-violet-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-5xl"
                    >
                        🗺️
                    </motion.span>
                </div>
                {/* Estrellas orbitando */}
                {DOTS.map((d, i) => (
                    <motion.span
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear", delay: i * 0.75 }}
                        style={{ transformOrigin: "68px 68px", position: "absolute", top: i % 2 === 0 ? "0" : "auto", right: i % 2 === 0 ? "0" : "auto" }}
                        className="text-lg"
                    >
                        {d}
                    </motion.span>
                ))}
            </div>

            <div>
                <h2 className="font-black text-2xl text-slate-800">Preparando tu</h2>
                <h2 className="font-black text-2xl bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">
                    camino mágico...
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                    Configurando todo para <strong>{name}</strong> 🌟
                </p>
            </div>

            {/* Puntos animados */}
            <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [-6, 0, -6], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-3 h-3 bg-violet-400 rounded-full"
                    />
                ))}
            </div>
        </motion.div>
    );
};

// ── Pantalla 4: ¡Todo listo! ──────────────────────────────────────────
const ReadyStep = ({ name, onFinish }: { name: string; onFinish: () => void }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const fire = confetti.create(canvas, { resize: true, useWorker: true });

        // Burst inicial
        fire({ particleCount: 100, spread: 100, origin: { x: 0.5, y: 0.5 }, colors: ["#38bdf8", "#818cf8", "#fde68a", "#f9a8d4"] });
        setTimeout(() => {
            fire({ particleCount: 50, spread: 70, origin: { x: 0.2, y: 0.6 }, angle: 60, colors: ["#6ee7b7", "#fde68a"] });
            fire({ particleCount: 50, spread: 70, origin: { x: 0.8, y: 0.6 }, angle: 120, colors: ["#c084fc", "#f9a8d4"] });
        }, 300);

        // Reproducir saludo si existe
        const safeName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "_");
        const audio = new Audio(`/audio/greeting_${safeName}.mp3`);
        audio.play().catch(() => { });
    }, []);

    return (
        <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 14, stiffness: 200 }}
            className="flex flex-col items-center gap-6 w-full max-w-xs text-center"
        >
            {/* Canvas de confetti */}
            <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

            <motion.div
                animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-8xl drop-shadow-xl"
            >
                🎉
            </motion.div>

            <div>
                <p className="text-slate-500 text-base font-semibold">¡Todo listo,</p>
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-black text-4xl bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent"
                >
                    {name}!
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 text-sm mt-2"
                >
                    Tu aventura comienza ahora ✨
                </motion.p>
            </div>

            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onFinish}
                className="flex items-center justify-center gap-2 w-full text-white font-black text-xl py-5 rounded-[1.5rem] shadow-xl border-b-[6px] border-black/15 transition-all
                           bg-gradient-to-br from-sky-400 to-violet-500 active:border-b-0 active:translate-y-1"
            >
                <Sparkles className="w-6 h-6" /> ¡Al mapa!
            </motion.button>
        </motion.div>
    );
};

// ── Componente orquestador ────────────────────────────────────────────
export const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
    const { setChildName } = useGameContext();
    const [step, setStep] = useState<Step>(1);
    const [name, setName] = useState("");

    const handleName = (n: string) => {
        setName(n);
        setChildName(n);
        setStep(3);
    };

    return (
        <div
            className="w-full h-full min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #e0f2fe 0%, #f5f3ff 50%, #fdf2f8 100%)" }}
        >
            {/* Decoraciones de fondo */}
            <div className="absolute top-8 left-6 text-5xl opacity-10 select-none pointer-events-none">🌟</div>
            <div className="absolute top-20 right-8 text-4xl opacity-10 select-none pointer-events-none">✨</div>
            <div className="absolute bottom-16 left-10 text-5xl opacity-10 select-none pointer-events-none">🌈</div>
            <div className="absolute bottom-8 right-6 text-4xl opacity-10 select-none pointer-events-none">🎊</div>

            {/* Indicador de paso */}
            <div className="absolute top-6 flex gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <motion.div
                        key={s}
                        animate={{ scale: step === s ? 1.3 : 1, opacity: step === s ? 1 : 0.3 }}
                        className={`w-2 h-2 rounded-full ${step >= s ? "bg-violet-500" : "bg-slate-200"}`}
                    />
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && <WelcomeStep onNext={() => setStep(2)} />}
                {step === 2 && <NameStep onNext={handleName} />}
                {step === 3 && <LoadingStep name={name} onDone={() => setStep(4)} />}
                {step === 4 && <ReadyStep name={name} onFinish={onFinish} />}
            </AnimatePresence>
        </div>
    );
};
