import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export default function Home() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  useEffect(() => {
    const targetDate = new Date("2025-08-11T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    // Update immediately and then every second
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Floating particles animation variants
  const particleVariants = {
    float: {
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-4 h-4 bg-white rounded-full opacity-30"
          variants={particleVariants}
          animate="float"
        />
        <motion.div
          className="absolute top-32 right-20 w-3 h-3 rounded-full opacity-40"
          style={{ backgroundColor: "var(--neon-green)" }}
          variants={particleVariants}
          animate="float"
          transition={{ delay: -1 }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-5 h-5 rounded-full opacity-25"
          style={{ backgroundColor: "var(--neon-pink)" }}
          variants={particleVariants}
          animate="float"
          transition={{ delay: -2 }}
        />
        <motion.div
          className="absolute top-1/2 right-10 w-2 h-2 rounded-full opacity-50"
          style={{ backgroundColor: "var(--shadow-purple)" }}
          variants={particleVariants}
          animate="float"
          transition={{ delay: -0.5 }}
        />
        <motion.div
          className="absolute bottom-32 right-1/3 w-6 h-6 rounded-full opacity-20"
          style={{ backgroundColor: "var(--neon-green)" }}
          variants={particleVariants}
          animate="float"
          transition={{ delay: -3 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="animate-float">
            <h1 
              className="glitch-text font-orbitron text-4xl md:text-6xl font-black neon-text mb-4 animate-neon-flicker"
              style={{ color: "var(--neon-green)" }}
              data-text="AUGUST BDAY-VERSE"
            >
              AUGUST BDAY-VERSE
            </h1>
            <p className="font-inter text-lg md:text-xl mb-2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              🎂 Wayne's Birthday Countdown 🎂
            </p>
            <p 
              className="font-inter text-sm md:text-base animate-party-bounce"
              style={{ color: "var(--neon-pink)" }}
            >
              Spooky • Spicy • Slightly Unhinged
            </p>
          </div>
        </motion.div>

        {/* Countdown Display */}
        {!timeRemaining.isComplete && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8 w-full max-w-4xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Days */}
            <motion.div 
              className="neon-border rounded-xl p-4 md:p-6 text-center animate-pulse-glow"
              style={{ backgroundColor: "rgba(26, 26, 26, 0.5)", backdropFilter: "blur(10px)" }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-3xl md:text-5xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-green)" }}
              >
                {formatNumber(timeRemaining.days)}
              </div>
              <div className="text-xs md:text-sm font-inter mt-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                CHAOTIC DAYS
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              className="neon-border rounded-xl p-4 md:p-6 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-0.5s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-3xl md:text-5xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-pink)" }}
              >
                {formatNumber(timeRemaining.hours)}
              </div>
              <div className="text-xs md:text-sm font-inter mt-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                HAUNTED HOURS
              </div>
            </motion.div>

            {/* Minutes */}
            <motion.div 
              className="neon-border rounded-xl p-4 md:p-6 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-1s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-3xl md:text-5xl font-orbitron font-black neon-text"
                style={{ color: "var(--shadow-purple)" }}
              >
                {formatNumber(timeRemaining.minutes)}
              </div>
              <div className="text-xs md:text-sm font-inter mt-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                WASTED MINUTES
              </div>
            </motion.div>

            {/* Seconds */}
            <motion.div 
              className="neon-border rounded-xl p-4 md:p-6 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-1.5s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-3xl md:text-5xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-green)" }}
              >
                {formatNumber(timeRemaining.seconds)}
              </div>
              <div className="text-xs md:text-sm font-inter mt-2" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                UNHINGED SECONDS
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Party Details */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="animate-float" style={{ animationDelay: "-1s" }}>
            <div 
              className="rounded-xl p-6 border"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.3)", 
                backdropFilter: "blur(10px)",
                borderColor: "rgba(255, 0, 128, 0.3)"
              }}
            >
              <p 
                className="font-inter text-lg md:text-xl mb-2"
                style={{ color: "var(--neon-pink)" }}
              >
                👑 Time to get WASTED 👑
              </p>
              <p 
                className="font-inter text-sm md:text-base mb-3"
                style={{ color: "rgba(255, 255, 255, 0.8)" }}
              >
                August 11th • Leo Grade Birthday Drama
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
                <span 
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: "rgba(0, 255, 136, 0.2)", 
                    color: "var(--neon-green)" 
                  }}
                >
                  Spooky Cute
                </span>
                <span 
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: "rgba(255, 0, 128, 0.2)", 
                    color: "var(--neon-pink)" 
                  }}
                >
                  Haunted Hotness
                </span>
                <span 
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: "rgba(139, 0, 255, 0.2)", 
                    color: "var(--shadow-purple)" 
                  }}
                >
                  Campy Chaos
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Celebration Message */}
        {timeRemaining.isComplete && (
          <motion.div 
            className="text-center animate-party-bounce"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          >
            <div 
              className="rounded-xl p-8 mb-4 border-2"
              style={{ 
                backgroundColor: "rgba(0, 255, 136, 0.2)", 
                borderColor: "var(--neon-green)" 
              }}
            >
              <h2 
                className="font-orbitron text-3xl md:text-5xl font-black neon-text mb-4"
                style={{ color: "var(--neon-green)" }}
              >
                🎉 IT'S WAYNE'S BIRTHDAY! 🎉
              </h2>
              <p 
                className="font-inter text-lg md:text-xl mb-4"
                style={{ color: "rgba(255, 255, 255, 1)" }}
              >
                Let the chaos begin! Time to get absolutely wasted! 🍻
              </p>
              <motion.div 
                className="text-4xl md:text-6xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎂👑🎊🥳🎈
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="text-center text-xs md:text-sm font-inter"
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p>Dress Code: Black ⚫ White ⚪ Green 🟢</p>
          <p className="mt-1">Ghostly Chic meets Glam Goblin ✨</p>
        </motion.div>
      </div>
    </div>
  );
}
