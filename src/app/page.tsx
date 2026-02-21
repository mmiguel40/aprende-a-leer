"use client";

import { useState } from "react";
import { GameBoard } from "@/components/game/GameBoard";
import { LevelMap } from "@/components/navigation/LevelMap";
import { OnboardingScreen } from "@/components/onboarding/OnboardingScreen";
import { AnimatePresence, motion } from "framer-motion";
import { useGameContext } from "@/context/GameContext";

type View = "onboarding" | "map" | "game";

function AppContent() {
  const { onboardingDone, childName } = useGameContext();
  // Si ya hay nombre registrado, arranca en mapa; si no, en onboarding
  const [currentView, setCurrentView] = useState<View>(onboardingDone ? "map" : "onboarding");

  // Cuando el niño completa el onboarding → reproducir saludo y pasar al mapa
  const handleOnboardingFinish = () => {
    setCurrentView("map");
    // El saludo ya se reproduce dentro de ReadyStep al hacer clic en "¡Al mapa!"
  };

  // Al volver al mapa desde el juego → reproducir saludo corto si es la primera vez del día
  const handleBackToMap = () => {
    setCurrentView("map");
  };

  return (
    <main className="flex h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">

        {currentView === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
            className="w-full h-full"
          >
            <OnboardingScreen onFinish={handleOnboardingFinish} />
          </motion.div>
        )}

        {currentView === "map" && (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04, filter: "blur(4px)" }}
            transition={{ duration: 0.4, type: "spring", damping: 22 }}
            className="w-full h-full max-w-lg"
          >
            <LevelMap onSelectLevel={() => setCurrentView("game")} />
          </motion.div>
        )}

        {currentView === "game" && (
          <motion.div
            key="game"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full"
          >
            <GameBoard onBack={handleBackToMap} />
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

// AppContent debe vivir dentro del GameProvider (definido en layout.tsx)
export default function Home() {
  return <AppContent />;
}
