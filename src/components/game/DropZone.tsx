"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface DropZoneProps {
    id: string;
    expectedContent: string;
    isFilledWith?: string;
    isHinted?: boolean;
}

export const DropZone = ({ id, expectedContent, isFilledWith, isHinted }: DropZoneProps) => {
    const { isOver, setNodeRef } = useDroppable({ id, data: { expectedContent } });

    return (
        <div
            ref={setNodeRef}
            className={`
                relative flex items-center justify-center
                min-h-[64px] min-w-[64px] px-5 rounded-2xl
                border-[3px] border-dashed transition-all duration-200
                ${isFilledWith
                    ? "border-emerald-400 bg-emerald-50 scale-105"
                    : isOver
                        ? "border-sky-400 bg-sky-50 scale-105 shadow-lg shadow-sky-100"
                        : isHinted
                            ? "border-amber-400 bg-amber-50 animate-pulse"
                            : "border-slate-200 bg-white/50"
                }
            `}
        >
            <AnimatePresence>
                {isFilledWith ? (
                    <motion.div
                        key="filled"
                        initial={{ scale: 0, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <span className="text-emerald-700 font-black text-3xl md:text-4xl drop-shadow-sm">
                            {isFilledWith}
                        </span>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="empty"
                        animate={isHinted ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="flex items-center justify-center"
                    >
                        <span className={`text-2xl font-black select-none
                            ${isOver ? "text-sky-300" : "text-slate-200"}`}>
                            ___
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
