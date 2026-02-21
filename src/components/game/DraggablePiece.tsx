"use client";

import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";

interface DraggablePieceProps {
    id: string;
    content: string;
    isHinted?: boolean;
}

// Gradientes rotativos para darle variedad visual a las piezas
const PIECE_GRADIENTS = [
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-emerald-400 to-green-500",
    "from-amber-400 to-orange-500",
    "from-pink-400 to-rose-500",
];

const getGradient = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return PIECE_GRADIENTS[Math.abs(hash) % PIECE_GRADIENTS.length];
};

export const DraggablePiece = ({ id, content, isHinted }: DraggablePieceProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    const style = transform
        ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
        : undefined;

    const gradient = getGradient(id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`relative z-10 touch-none ${isDragging ? "z-50" : ""}`}
        >
            <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 1.05, y: -2 }}
                animate={
                    isHinted
                        ? { y: [0, -8, 0], boxShadow: ["0 4px 14px rgba(0,0,0,.08)", "0 8px 28px rgba(250,204,21,.5)", "0 4px 14px rgba(0,0,0,.08)"] }
                        : isDragging
                            ? { scale: 1.1, rotate: 3 }
                            : {}
                }
                transition={isHinted ? { repeat: Infinity, duration: 1.3 } : { type: "spring", damping: 14 }}
                className={`
                    relative flex items-center justify-center
                    h-16 min-w-[64px] px-5 rounded-2xl
                    bg-gradient-to-br ${gradient}
                    shadow-md border-b-4 border-black/10
                    cursor-grab active:cursor-grabbing
                    ${isDragging ? "opacity-90 shadow-2xl border-b-0 translate-y-1" : ""}
                    ${isHinted ? "ring-4 ring-amber-300 ring-offset-2" : ""}
                `}
            >
                <span className="text-white font-black text-2xl md:text-3xl drop-shadow select-none">
                    {content}
                </span>
            </motion.div>
        </div>
    );
};
