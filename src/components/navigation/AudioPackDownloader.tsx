"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle2, AlertCircle, Loader2, Wifi, WifiOff } from "lucide-react";
import { usePwaCache, PackInfo } from "@/hooks/usePwaCache";
import { Difficulty, DIFFICULTY_LABELS } from "@/data/levels";

const PACKS: { key: Difficulty; description: string; sizeMb: string }[] = [
    { key: "facil", description: "Sílabas · Isla 1", sizeMb: "~0.6 MB" },
    { key: "medio", description: "Palabras · Isla 2", sizeMb: "~0.4 MB" },
    { key: "dificil", description: "Oraciones · Isla 3", sizeMb: "~0.4 MB" },
];


// ── Tarjeta de paquete individual ─────────────────────────────────────
function PackCard({
    packKey,
    info,
    onDownload,
}: {
    packKey: Difficulty;
    info: PackInfo;
    onDownload: () => void;
}) {
    const meta = DIFFICULTY_LABELS[packKey];
    const { description, sizeMb } = PACKS.find((p) => p.key === packKey)!

    const bgMap: Record<Difficulty, string> = {
        facil: "from-green-50 to-green-100 border-green-200",
        medio: "from-yellow-50 to-yellow-100 border-yellow-200",
        dificil: "from-red-50 to-red-100 border-red-200",
    };

    const btnMap: Record<Difficulty, string> = {
        facil: "bg-green-500 hover:bg-green-600 shadow-green-200",
        medio: "bg-yellow-400 hover:bg-yellow-500 shadow-yellow-200",
        dificil: "bg-red-400 hover:bg-red-500 shadow-red-200",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl border-2 bg-gradient-to-br ${bgMap[packKey]} p-4 shadow-sm flex flex-col gap-3`}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <span className="text-3xl">{meta.emoji}</span>
                <div className="flex-1">
                    <p className="font-extrabold text-slate-700 text-base leading-tight">
                        Paquete {meta.label}
                    </p>
                    <p className="text-slate-500 text-xs">{description}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <span className="text-xs font-bold text-slate-500 bg-white/80 rounded-full px-2 py-0.5">{sizeMb}</span>
                    <span className="text-[10px] text-slate-400">{info.audioCount} archivos</span>
                </div>
            </div>

            {/* Barra de progreso (visible solo cuando descarga) */}
            {info.status === "downloading" && (
                <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-slate-600 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${info.progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>
            )}

            {/* Botón / Estado */}
            <div className="flex items-center justify-end gap-2">
                {info.status === "idle" && (
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={onDownload}
                        className={`flex items-center gap-1.5 text-white text-sm font-bold rounded-xl px-4 py-2 shadow-md transition-colors ${btnMap[packKey]}`}
                    >
                        <Download className="w-4 h-4" />
                        Descargar
                    </motion.button>
                )}

                {info.status === "downloading" && (
                    <span className="flex items-center gap-1.5 text-slate-500 text-sm font-semibold">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {info.progress}%
                    </span>
                )}

                {info.status === "done" && (
                    <span className="flex items-center gap-1.5 text-green-600 text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        Listo offline
                    </span>
                )}

                {info.status === "error" && (
                    <motion.button
                        whileTap={{ scale: 0.93 }}
                        onClick={onDownload}
                        className="flex items-center gap-1.5 text-red-500 text-sm font-semibold"
                    >
                        <AlertCircle className="w-4 h-4" />
                        Reintentar
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

// ── Componente principal ───────────────────────────────────────────────
export function AudioPackDownloader({ isOpen }: { isOpen: boolean }) {
    const { packState, downloadPack, swReady } = usePwaCache();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="downloader-panel"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 22, stiffness: 300 }}
                    className="absolute top-14 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm 
                               bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white p-5 flex flex-col gap-4"
                >
                    {/* Título */}
                    <div className="flex items-center gap-2">
                        {swReady ? (
                            <Wifi className="w-5 h-5 text-green-500" />
                        ) : (
                            <WifiOff className="w-5 h-5 text-slate-400" />
                        )}
                        <h2 className="font-extrabold text-slate-700 text-base">
                            Audios para jugar sin internet
                        </h2>
                    </div>

                    {!swReady && (
                        <p className="text-xs text-slate-400 bg-slate-100 rounded-xl px-3 py-2">
                            Tu navegador no soporta descarga offline, o el Service Worker aún está cargando.
                        </p>
                    )}

                    {/* Tarjetas */}
                    {PACKS.map((pack) => (
                        <PackCard
                            key={pack.key}
                            packKey={pack.key}
                            info={packState[pack.key]}
                            onDownload={() => downloadPack(pack.key)}
                        />
                    ))}

                    <p className="text-center text-xs text-slate-400">
                        Los audios se guardan en este dispositivo. <br />
                        Una vez descargados, el juego funciona sin conexión.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
