"use client";

import { motion } from "framer-motion";
import { Lock, Star, Play } from "lucide-react";

export type NodeState = "locked" | "current" | "completed";

// Colores por isla
const ISLAND_COLORS = {
    1: { current: "bg-sky-400 border-sky-500 shadow-sky-200", completed: "bg-sky-300 border-sky-400" },
    2: { current: "bg-emerald-400 border-emerald-500 shadow-emerald-200", completed: "bg-emerald-300 border-emerald-400" },
    3: { current: "bg-violet-400 border-violet-500 shadow-violet-200", completed: "bg-violet-300 border-violet-400" },
} as const;

interface LevelNodeProps {
    label: string;
    state: NodeState;
    position: { x: number; y: number };
    onClick?: () => void;
    static?: boolean;
    islandNum?: 1 | 2 | 3;
}

export const LevelNode = ({
    label,
    state,
    position,
    onClick,
    static: isStatic,
    islandNum = 1,
}: LevelNodeProps) => {
    const isLocked = state === "locked";
    const isCurrent = state === "current";
    const isCompleted = state === "completed";
    const colors = ISLAND_COLORS[islandNum];

    const wrapperStyle = isStatic
        ? {}
        : { left: `${position.x}%`, top: `${position.y}%`, transform: "translate(-50%, -50%)" };

    return (
        <div className={isStatic ? "relative" : "absolute"} style={wrapperStyle}>
            <motion.button
                onClick={!isLocked ? onClick : undefined}
                whileHover={!isLocked ? { scale: 1.12, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.93 } : {}}
                animate={isCurrent ? { y: [0, -5, 0] } : {}}
                transition={isCurrent ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" } : {}}
                className={`
                    relative flex items-center justify-center
                    w-12 h-12 rounded-full border-[3px]
                    transition-all duration-200
                    ${isLocked ? "bg-white border-slate-200 cursor-not-allowed" : ""}
                    ${isCurrent ? `${colors.current} cursor-pointer shadow-lg shadow-sky-200` : ""}
                    ${isCompleted ? `${colors.completed} cursor-pointer` : ""}
                `}
            >
                {/* Locked */}
                {isLocked && (
                    <Lock className="text-slate-300 w-5 h-5" />
                )}

                {/* Current */}
                {isCurrent && (
                    <>
                        <span className="text-white text-base font-black drop-shadow">{label}</span>
                        {/* Badge play animado */}
                        <motion.div
                            animate={{ scale: [1, 1.25, 1] }}
                            transition={{ repeat: Infinity, duration: 1.4 }}
                            className="absolute -top-2 -right-2 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-md border-2 border-yellow-300"
                        >
                            <Play className="w-3 h-3 text-yellow-500 ml-0.5" fill="currentColor" />
                        </motion.div>
                    </>
                )}

                {/* Completed */}
                {isCompleted && (
                    <>
                        <span className="text-white text-base font-black drop-shadow">{label}</span>
                        <motion.div
                            initial={{ scale: 0, rotate: -90 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 10 }}
                            className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-yellow-300 rounded-full w-5 h-5 flex items-center justify-center shadow"
                        >
                            <Star className="w-3 h-3 text-white fill-white" />
                        </motion.div>
                    </>
                )}
            </motion.button>
        </div>
    );
};
