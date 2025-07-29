import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

interface BirthdayPerson {
  name: string;
  date: string;
  emoji: string;
  color: string;
}

export default function Home() {
  const [partyTimeRemaining, setPartyTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });

  const [birthdayCountdowns, setBirthdayCountdowns] = useState<Record<string, TimeRemaining>>({});

  const birthdayPeople: BirthdayPerson[] = [
    { name: "Wayne Wu", date: "2025-08-11T00:00:00", emoji: "👑", color: "var(--neon-green)" },
  ];

  useEffect(() => {
    const partyDate = new Date("2025-08-11T00:00:00").getTime(); // Wayne's birthday: Aug 11

    const updateCountdowns = () => {
      const now = new Date().getTime();
      
      // Update party countdown
      const partyDistance = partyDate - now;
      if (partyDistance < 0) {
        setPartyTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
      } else {
        const days = Math.floor(partyDistance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((partyDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((partyDistance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((partyDistance % (1000 * 60)) / 1000);

        setPartyTimeRemaining({
          days,
          hours,
          minutes,
          seconds,
          isComplete: false,
        });
      }

      // Update birthday countdowns
      const newBirthdayCountdowns: Record<string, TimeRemaining> = {};
      birthdayPeople.forEach(person => {
        const birthdayDate = new Date(person.date).getTime();
        const distance = birthdayDate - now;
        
        if (distance < 0) {
          newBirthdayCountdowns[person.name] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isComplete: true,
          };
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          newBirthdayCountdowns[person.name] = {
            days,
            hours,
            minutes,
            seconds,
            isComplete: false,
          };
        }
      });
      
      setBirthdayCountdowns(newBirthdayCountdowns);
    };

    // Update immediately and then every second
    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);

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
              className="font-orbitron text-4xl md:text-6xl font-black neon-text mb-4"
              style={{ color: "var(--neon-green)" }}
            >
              WAYNE'S BIRTHDAY
            </h1>
            <p className="font-inter text-lg md:text-xl mb-2" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
              👑 Time to get WASTED 👑
            </p>
            <p 
              className="font-inter text-sm md:text-base animate-party-bounce"
              style={{ color: "var(--neon-pink)" }}
            >
              August 11th • Leo King Birthday Bash
            </p>
          </div>
        </motion.div>

        {/* Party Countdown Display */}
        {!partyTimeRemaining.isComplete && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mb-12 w-full max-w-6xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Days */}
            <motion.div 
              className="neon-border rounded-xl p-6 md:p-8 text-center animate-pulse-glow"
              style={{ backgroundColor: "rgba(26, 26, 26, 0.5)", backdropFilter: "blur(10px)" }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-5xl md:text-7xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-green)" }}
              >
                {formatNumber(partyTimeRemaining.days)}
              </div>
              <div className="text-sm md:text-base font-inter mt-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {partyTimeRemaining.days === 1 ? "FINAL DAY!" : partyTimeRemaining.days < 7 ? "CHAOS DAYS" : "DAYS TO PARTY"}
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div 
              className="neon-border rounded-xl p-6 md:p-8 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-0.5s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-5xl md:text-7xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-pink)" }}
              >
                {formatNumber(partyTimeRemaining.hours)}
              </div>
              <div className="text-sm md:text-base font-inter mt-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {partyTimeRemaining.hours < 12 && partyTimeRemaining.days === 0 ? "FINAL HOURS!" : "WILD HOURS"}
              </div>
            </motion.div>

            {/* Minutes */}
            <motion.div 
              className="neon-border rounded-xl p-6 md:p-8 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-1s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-5xl md:text-7xl font-orbitron font-black neon-text"
                style={{ color: "var(--shadow-purple)" }}
              >
                {formatNumber(partyTimeRemaining.minutes)}
              </div>
              <div className="text-sm md:text-base font-inter mt-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {partyTimeRemaining.minutes < 30 && partyTimeRemaining.days === 0 && partyTimeRemaining.hours === 0 ? "LAST MINUTES!" : "WASTED MINUTES"}
              </div>
            </motion.div>

            {/* Seconds */}
            <motion.div 
              className="neon-border rounded-xl p-6 md:p-8 text-center animate-pulse-glow"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                animationDelay: "-1.5s" 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div 
                className="text-5xl md:text-7xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-green)" }}
              >
                {formatNumber(partyTimeRemaining.seconds)}
              </div>
              <div className="text-sm md:text-base font-inter mt-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                UNHINGED SECONDS
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Dynamic Birthday Quote */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="animate-float" style={{ animationDelay: "-1s" }}>
            <div 
              className="rounded-xl p-6 border-2"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.5)", 
                backdropFilter: "blur(10px)",
                borderColor: "var(--neon-green)"
              }}
            >
              <motion.p 
                className="font-orbitron text-xl md:text-2xl font-bold mb-4"
                style={{ color: "var(--neon-green)" }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    "0 0 10px var(--neon-green)",
                    "0 0 20px var(--neon-green)",
                    "0 0 10px var(--neon-green)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {partyTimeRemaining.days > 100 ? "🎯 THE LEO KING'S BIRTHDAY IS COMING" :
                 partyTimeRemaining.days > 30 ? "⚡ BIRTHDAY ENERGY BUILDING..." :
                 partyTimeRemaining.days > 14 ? "🔥 TWO WEEKS TILL CHAOS!" :
                 partyTimeRemaining.days > 7 ? "🚨 ONE WEEK WARNING!" :
                 partyTimeRemaining.days > 3 ? "💥 FINAL COUNTDOWN ACTIVATED" :
                 partyTimeRemaining.days > 1 ? "🎆 ALMOST BIRTHDAY TIME!" :
                 partyTimeRemaining.days === 1 ? "🎉 TOMORROW IS THE DAY!" :
                 "🍾 IT'S WAYNE'S BIRTHDAY!"}
              </motion.p>
              
              <p 
                className="font-inter text-base md:text-lg mb-3"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                August 11th • Leo King's Domain
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                <motion.span 
                  className="px-4 py-2 rounded-full font-bold"
                  style={{ 
                    backgroundColor: "rgba(0, 255, 136, 0.3)", 
                    color: "var(--neon-green)",
                    border: "1px solid var(--neon-green)"
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(0, 255, 136, 0.5)" }}
                >
                  👑 ROYAL VIBES
                </motion.span>
                <motion.span 
                  className="px-4 py-2 rounded-full font-bold"
                  style={{ 
                    backgroundColor: "rgba(255, 0, 128, 0.3)", 
                    color: "var(--neon-pink)",
                    border: "1px solid var(--neon-pink)"
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 0, 128, 0.5)" }}
                >
                  🍻 GET WASTED
                </motion.span>
                <motion.span 
                  className="px-4 py-2 rounded-full font-bold"
                  style={{ 
                    backgroundColor: "rgba(139, 0, 255, 0.3)", 
                    color: "var(--shadow-purple)",
                    border: "1px solid var(--shadow-purple)"
                  }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 0, 255, 0.5)" }}
                >
                  🎭 MAIN CHARACTER
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Birthday Hype Section */}
        <motion.div 
          className="w-full max-w-4xl mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leo Facts */}
            <motion.div 
              className="neon-border rounded-xl p-6"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.3)", 
                backdropFilter: "blur(10px)",
                borderColor: "var(--neon-green)"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 
                className="font-orbitron text-xl font-bold mb-4 text-center"
                style={{ color: "var(--neon-green)" }}
              >
                👑 LEO KING FACTS 👑
              </h3>
              <div className="space-y-2 text-sm md:text-base text-white">
                <p>🦁 Born to rule the party scene</p>
                <p>🌟 Main character energy 24/7</p>
                <p>🔥 Charisma level: MAXIMUM</p>
                <p>🎭 Drama tolerance: INFINITE</p>
                <p>🍻 Party stamina: LEGENDARY</p>
              </div>
            </motion.div>

            {/* Birthday Menu */}
            <motion.div 
              className="neon-border rounded-xl p-6"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.3)", 
                backdropFilter: "blur(10px)",
                borderColor: "var(--neon-pink)"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <h3 
                className="font-orbitron text-xl font-bold mb-4 text-center"
                style={{ color: "var(--neon-pink)" }}
              >
                🍸 WASTED MENU 🍸
              </h3>
              <div className="space-y-2 text-sm md:text-base text-white">
                <p>🥃 Leo's Golden Shots</p>
                <p>🍹 Birthday Chaos Cocktails</p>
                <p>🍾 Champagne for the King</p>
                <p>🍻 Liquid Courage Refills</p>
                <p>🥂 Celebration Ammunition</p>
              </div>
            </motion.div>
          </div>

          {/* Hype Messages */}
          <motion.div 
            className="mt-8 text-center"
            animate={{ 
              textShadow: [
                "0 0 10px var(--neon-green)",
                "0 0 20px var(--neon-pink)", 
                "0 0 10px var(--shadow-purple)",
                "0 0 20px var(--neon-green)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <p 
              className="font-orbitron text-lg md:text-xl font-bold"
              style={{ color: "var(--ghost-white)" }}
            >
              {partyTimeRemaining.days > 30 ? "🎯 BIRTHDAY PLANNING MODE ACTIVATED" :
               partyTimeRemaining.days > 7 ? "⚡ FINAL COUNTDOWN INITIATED" :
               partyTimeRemaining.days > 1 ? "🚨 DANGER ZONE: PARTY INCOMING" :
               "🔥 IT'S ALMOST TIME TO GET WASTED"}
            </p>
          </motion.div>
        </motion.div>

        {/* Party Celebration Message */}
        {partyTimeRemaining.isComplete && (
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
                🎉 PARTY TIME! 🎉
              </h2>
              <p 
                className="font-inter text-lg md:text-xl mb-4"
                style={{ color: "rgba(255, 255, 255, 1)" }}
              >
                The August BDAY-Verse has begun! Time to get absolutely wasted! 🍻
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
