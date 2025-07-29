import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface GameState {
  mode: 'countdown' | 'hiking' | 'skiing';
  hikerPosition: number;
  skierPosition: number;
  speed: number;
  obstacles: Array<{ id: number; position: number; type: 'tree' | 'rock' }>;
  score: number;
}

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [gameState, setGameState] = useState<GameState>({
    mode: 'countdown',
    hikerPosition: 50,
    skierPosition: 50,
    speed: 1,
    obstacles: [],
    score: 0
  });

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date("2025-08-11T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Hiking game logic
  useEffect(() => {
    if (gameState.mode === 'hiking') {
      const gameLoop = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          hikerPosition: Math.max(0, prev.hikerPosition - 0.5), // Slowly move down if not moving
          score: prev.score + 1
        }));
      }, 100);

      return () => clearInterval(gameLoop);
    }
  }, [gameState.mode]);

  // Skiing game logic
  useEffect(() => {
    if (gameState.mode === 'skiing') {
      const gameLoop = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          obstacles: prev.obstacles
            .map(obs => ({ ...obs, position: obs.position + prev.speed }))
            .filter(obs => obs.position < 100),
          score: prev.score + prev.speed
        }));

        // Add new obstacles randomly
        if (Math.random() < 0.1) {
          setGameState(prev => ({
            ...prev,
            obstacles: [...prev.obstacles, {
              id: Date.now(),
              position: 0,
              type: Math.random() > 0.5 ? 'tree' : 'rock'
            }]
          }));
        }
      }, 100);

      return () => clearInterval(gameLoop);
    }
  }, [gameState.mode, gameState.speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.mode === 'hiking') {
        if (e.key === 'ArrowUp' || e.key === 'w') {
          setGameState(prev => ({
            ...prev,
            hikerPosition: Math.min(100, prev.hikerPosition + 5)
          }));
        }
      } else if (gameState.mode === 'skiing') {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          setGameState(prev => ({
            ...prev,
            skierPosition: Math.max(0, prev.skierPosition - 10)
          }));
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          setGameState(prev => ({
            ...prev,
            skierPosition: Math.min(100, prev.skierPosition + 10)
          }));
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.mode]);

  const startHikingGame = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'hiking',
      hikerPosition: 0,
      score: 0
    }));
  };

  const startSkiingGame = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'skiing',
      skierPosition: 50,
      score: 0,
      obstacles: []
    }));
  };

  const backToCountdown = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'countdown'
    }));
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        
        <AnimatePresence mode="wait">
          {/* Countdown Mode */}
          {gameState.mode === 'countdown' && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center"
            >
              {/* Header */}
              <motion.div className="mb-8">
                <h1 
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{ color: "var(--earth-brown)" }}
                >
                  🏔️ Wayne's Mountain Adventure 🎿
                </h1>
                <p 
                  className="text-lg md:text-xl"
                  style={{ color: "var(--forest-green)" }}
                >
                  Birthday countdown to August 11th, 2025
                </p>
              </motion.div>

              {/* Countdown Display */}
              <div className="grid grid-cols-4 gap-4 mb-12 max-w-2xl">
                {[
                  { value: timeRemaining.days, label: "DAYS", color: "var(--mountain-blue)" },
                  { value: timeRemaining.hours, label: "HOURS", color: "var(--forest-green)" },
                  { value: timeRemaining.minutes, label: "MINUTES", color: "var(--earth-brown)" },
                  { value: timeRemaining.seconds, label: "SECONDS", color: "var(--tree-green)" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div 
                      className="text-3xl md:text-5xl font-bold"
                      style={{ color: item.color }}
                    >
                      {formatNumber(item.value)}
                    </div>
                    <div 
                      className="text-sm md:text-base mt-2"
                      style={{ color: "var(--earth-brown)" }}
                    >
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Wayne's Character (Placeholder) */}
              <motion.div 
                className="mb-8"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div 
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-b from-orange-300 to-orange-500 flex items-center justify-center text-4xl"
                  style={{ border: "3px solid var(--earth-brown)" }}
                >
                  🧑‍🦱
                </div>
                <p className="mt-2 font-bold" style={{ color: "var(--earth-brown)" }}>
                  Wayne
                </p>
              </motion.div>

              {/* Game Buttons */}
              <div className="flex gap-4 justify-center">
                <motion.button
                  onClick={startHikingGame}
                  className="px-6 py-3 rounded-lg font-bold text-white"
                  style={{ backgroundColor: "var(--forest-green)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🥾 Start Hiking
                </motion.button>
                <motion.button
                  onClick={startSkiingGame}
                  className="px-6 py-3 rounded-lg font-bold text-white"
                  style={{ backgroundColor: "var(--mountain-blue)" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎿 Start Skiing
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Hiking Game */}
          {gameState.mode === 'hiking' && (
            <motion.div
              key="hiking"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="w-full max-w-4xl"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "var(--earth-brown)" }}>
                  🥾 Mountain Hiking
                </h2>
                <p style={{ color: "var(--forest-green)" }}>
                  Use ↑ or W to climb up! Score: {gameState.score}
                </p>
              </div>

              {/* Hiking Trail */}
              <div 
                className="relative w-full h-96 rounded-lg overflow-hidden"
                style={{ backgroundColor: "var(--forest-green)" }}
              >
                {/* Trail markers */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-1 bg-white/30"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
                
                {/* Wayne hiking character */}
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-b from-orange-300 to-orange-500 flex items-center justify-center text-2xl"
                  style={{ 
                    bottom: `${gameState.hikerPosition}%`,
                    border: "2px solid var(--earth-brown)"
                  }}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  🧑‍🦱
                </motion.div>

                {/* Trees */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${Math.random() * 80 + 10}%`,
                      top: `${Math.random() * 80 + 10}%`
                    }}
                  >
                    🌲
                  </div>
                ))}
              </div>

              <div className="text-center mt-4">
                <motion.button
                  onClick={backToCountdown}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--earth-brown)", color: "white" }}
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back to Countdown
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Skiing Game */}
          {gameState.mode === 'skiing' && (
            <motion.div
              key="skiing"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full max-w-4xl"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold" style={{ color: "var(--mountain-blue)" }}>
                  🎿 Ski Down
                </h2>
                <p style={{ color: "var(--forest-green)" }}>
                  Use ← → or A/D to avoid obstacles! Score: {gameState.score}
                </p>
              </div>

              {/* Ski Slope */}
              <div 
                className="relative w-full h-96 rounded-lg overflow-hidden"
                style={{ backgroundColor: "var(--snow-white)" }}
              >
                {/* Ski tracks */}
                <div className="absolute inset-0 opacity-30">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-full bg-gray-400"
                      style={{ left: `${20 + i * 15}%` }}
                    />
                  ))}
                </div>

                {/* Wayne skiing character */}
                <motion.div
                  className="absolute bottom-4 w-12 h-12 rounded-full bg-gradient-to-b from-orange-300 to-orange-500 flex items-center justify-center text-2xl"
                  style={{ 
                    left: `${gameState.skierPosition}%`,
                    border: "2px solid var(--mountain-blue)"
                  }}
                  animate={{ rotate: [-5, 5] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  🧑‍🦱
                </motion.div>

                {/* Obstacles */}
                {gameState.obstacles.map((obstacle) => (
                  <motion.div
                    key={obstacle.id}
                    className="absolute text-3xl"
                    style={{ 
                      top: `${obstacle.position}%`,
                      left: `${Math.random() * 80 + 10}%`
                    }}
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                  >
                    {obstacle.type === 'tree' ? '🌲' : '🪨'}
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-4">
                <motion.button
                  onClick={backToCountdown}
                  className="px-4 py-2 rounded-lg"
                  style={{ backgroundColor: "var(--mountain-blue)", color: "white" }}
                  whileHover={{ scale: 1.05 }}
                >
                  ← Back to Countdown
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}