"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LEVELS, BaseLevel } from "../data/levels";

interface GameContextType {
    unlockedLevels: string[];
    currentLevelId: string | null;
    setCurrentLevelId: (id: string | null) => void;
    unlockLevel: (id: string) => void;
    getLevelData: (id: string) => BaseLevel | undefined;
    // ── Perfil del niño ──────────────────────────────────────────────
    childName: string | null;
    setChildName: (name: string) => void;
    onboardingDone: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const PROGRESS_KEY = "appLectura_progreso_v2";
const NAME_KEY = "appLectura_nombre_v1";

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [unlockedLevels, setUnlockedLevels] = useState<string[]>(["level_m"]);
    const [currentLevelId, setCurrentLevelId] = useState<string | null>(null);
    const [childName, setChildNameState] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // Cargar todo desde localStorage al iniciar (solo en cliente)
    useEffect(() => {
        setIsClient(true);
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        if (savedProgress) setUnlockedLevels(JSON.parse(savedProgress));

        const savedName = localStorage.getItem(NAME_KEY);
        if (savedName) setChildNameState(savedName);
    }, []);

    // Persistir progreso
    useEffect(() => {
        if (isClient) localStorage.setItem(PROGRESS_KEY, JSON.stringify(unlockedLevels));
    }, [unlockedLevels, isClient]);

    const unlockLevel = (id: string) => {
        setUnlockedLevels((prev) => prev.includes(id) ? prev : [...prev, id]);
    };

    const setChildName = (name: string) => {
        localStorage.setItem(NAME_KEY, name);
        setChildNameState(name);
    };

    const getLevelData = (id: string) => LEVELS[id];

    return (
        <GameContext.Provider value={{
            unlockedLevels, currentLevelId, setCurrentLevelId,
            unlockLevel, getLevelData,
            childName, setChildName,
            onboardingDone: childName !== null,
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGameContext must be used within a GameProvider");
    return context;
};
