import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

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

  const [august2ndCountdown, setAugust2ndCountdown] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });
  const [birthdayCountdowns, setBirthdayCountdowns] = useState<Record<string, TimeRemaining>>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const threeContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const birthdayPeople: BirthdayPerson[] = [
    { name: "Wayne Wu", date: "2025-08-11T00:00:00", emoji: "👑", color: "var(--neon-green)" },
  ];

  // Mouse tracking with trail effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });

      // Create mouse trail particle
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.left = `${event.clientX - 10}px`;
      trail.style.top = `${event.clientY - 10}px`;
      
      document.body.appendChild(trail);
      
      // Remove trail element after animation
      setTimeout(() => {
        if (document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Three.js scene setup
  useEffect(() => {
    if (!threeContainerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeContainerRef.current.appendChild(renderer.domElement);

    // Create floating bottles (bartender theme)
    const bottles: THREE.Mesh[] = [];
    const bottleGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 8);
    
    for (let i = 0; i < 15; i++) {
      const bottleMaterial = new THREE.MeshPhongMaterial({
        color: i % 3 === 0 ? 0x00ff88 : i % 3 === 1 ? 0xff0080 : 0x8b00ff,
        transparent: true,
        opacity: 0.7,
        emissive: i % 3 === 0 ? 0x002200 : i % 3 === 1 ? 0x220022 : 0x220088,
      });
      
      const bottle = new THREE.Mesh(bottleGeometry, bottleMaterial);
      bottle.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 10
      );
      bottle.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      scene.add(bottle);
      bottles.push(bottle);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00ff88, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff0080, 1, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    camera.position.z = 8;

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate bottles
      bottles.forEach((bottle, index) => {
        bottle.rotation.x += 0.01;
        bottle.rotation.y += 0.02;
        
        // Float up and down
        bottle.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
        
        // React to mouse movement
        bottle.position.x += mousePosition.x * 0.001;
        bottle.position.z += mousePosition.y * 0.001;
      });

      // Camera movement based on mouse
      camera.position.x = mousePosition.x * 2;
      camera.position.y = mousePosition.y * 1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      if (threeContainerRef.current && renderer.domElement) {
        threeContainerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mousePosition]);

  useEffect(() => {
    const partyDate = new Date("2025-08-11T00:00:00").getTime(); // Wayne's birthday: Aug 11
    const august2Date = new Date("2025-08-02T19:00:00").getTime(); // August 2nd party: 7pm

    const updateCountdowns = () => {
      const now = new Date().getTime();
      
      // Update Wayne's birthday countdown
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

      // Update August 2nd party countdown
      const august2Distance = august2Date - now;
      if (august2Distance < 0) {
        setAugust2ndCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
      } else {
        const days = Math.floor(august2Distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((august2Distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((august2Distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((august2Distance % (1000 * 60)) / 1000);

        setAugust2ndCountdown({
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
      {/* Three.js Background */}
      <div 
        ref={threeContainerRef} 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
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
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4">
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
              whileHover={{ 
                scale: 1.05, 
                rotateY: mousePosition.x * 10,
                rotateX: mousePosition.y * -10 
              }}
              animate={{
                rotateY: mousePosition.x * 2,
                rotateX: mousePosition.y * -2
              }}
            >
              <div 
                className="text-5xl md:text-7xl font-orbitron font-black neon-text"
                style={{ color: "var(--neon-green)" }}
              >
                {formatNumber(partyTimeRemaining.days)}
              </div>
              <div className="text-sm md:text-base font-inter mt-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                {partyTimeRemaining.days === 1 ? "FINAL DAY!" : partyTimeRemaining.days <= 7 ? "CHAOS DAYS" : "DAYS TO PARTY"}
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
              whileHover={{ 
                scale: 1.05,
                rotateY: mousePosition.x * 10,
                rotateX: mousePosition.y * -10 
              }}
              animate={{
                rotateY: mousePosition.x * 2,
                rotateX: mousePosition.y * -2
              }}
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
              whileHover={{ 
                scale: 1.05,
                rotateY: mousePosition.x * 10,
                rotateX: mousePosition.y * -10 
              }}
              animate={{
                rotateY: mousePosition.x * 2,
                rotateX: mousePosition.y * -2
              }}
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
              whileHover={{ 
                scale: 1.05,
                rotateY: mousePosition.x * 10,
                rotateX: mousePosition.y * -10 
              }}
              animate={{
                rotateY: mousePosition.x * 2,
                rotateX: mousePosition.y * -2
              }}
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

        {/* Genies Bartender Section */}
        <motion.div 
          className="w-full max-w-4xl mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.div 
            className="neon-border rounded-xl p-8 text-center"
            style={{ 
              backgroundColor: "rgba(26, 26, 26, 0.4)", 
              backdropFilter: "blur(15px)",
              borderColor: "var(--neon-green)"
            }}
            whileHover={{ scale: 1.02 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 255, 136, 0.3)",
                "0 0 40px rgba(0, 255, 136, 0.5)",
                "0 0 20px rgba(0, 255, 136, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.h3 
              className="font-orbitron text-2xl md:text-3xl font-bold mb-6"
              style={{ color: "var(--neon-green)" }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🐐 HIKING GOAT 🐐
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <motion.p 
                  className="text-lg font-inter mb-3"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--neon-pink)" }}
                >
                  🏔️ Mountain trail explorer
                </motion.p>
                <motion.p 
                  className="text-lg font-inter mb-3"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--neon-pink)" }}
                >
                  🥾 Adventure seeker
                </motion.p>
                <motion.p 
                  className="text-lg font-inter"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--neon-pink)" }}
                >
                  🌲 Nature enthusiast
                </motion.p>
              </div>
              <div>
                <motion.p 
                  className="text-lg font-inter mb-3"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--shadow-purple)" }}
                >
                  🎒 Summit conquerer
                </motion.p>
                <motion.p 
                  className="text-lg font-inter mb-3"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--shadow-purple)" }}
                >
                  🌟 Trail blazing legend
                </motion.p>
                <motion.p 
                  className="text-lg font-inter"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                  whileHover={{ x: 10, color: "var(--shadow-purple)" }}
                >
                  🎉 Birthday celebration mode: ON
                </motion.p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* August 2nd Party Countdown */}
        {!august2ndCountdown.isComplete && (
          <motion.div 
            className="w-full max-w-2xl mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div 
              className="neon-border rounded-xl p-6 text-center"
              style={{ 
                backgroundColor: "rgba(26, 26, 26, 0.3)", 
                backdropFilter: "blur(10px)",
                borderColor: "var(--shadow-purple)"
              }}
              whileHover={{ scale: 1.02 }}
              animate={{
                boxShadow: [
                  "0 0 15px rgba(139, 0, 255, 0.3)",
                  "0 0 25px rgba(139, 0, 255, 0.5)",
                  "0 0 15px rgba(139, 0, 255, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h4 
                className="font-orbitron text-lg md:text-xl font-bold mb-4"
                style={{ color: "var(--shadow-purple)" }}
              >
                🎭 AUGUST BDAY-VERSE PARTY 🎭
              </h4>
              <div className="text-sm md:text-base font-inter text-white">
                <p className="mb-2">August 2nd • 7:00 PM - 2:00 AM</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div 
                      className="text-lg md:text-xl font-orbitron font-bold"
                      style={{ color: "var(--shadow-purple)" }}
                    >
                      {formatNumber(august2ndCountdown.days)}
                    </div>
                    <div className="text-xs opacity-70">days</div>
                  </div>
                  <div>
                    <div 
                      className="text-lg md:text-xl font-orbitron font-bold"
                      style={{ color: "var(--shadow-purple)" }}
                    >
                      {formatNumber(august2ndCountdown.hours)}
                    </div>
                    <div className="text-xs opacity-70">hrs</div>
                  </div>
                  <div>
                    <div 
                      className="text-lg md:text-xl font-orbitron font-bold"
                      style={{ color: "var(--shadow-purple)" }}
                    >
                      {formatNumber(august2ndCountdown.minutes)}
                    </div>
                    <div className="text-xs opacity-70">mins</div>
                  </div>
                  <div>
                    <div 
                      className="text-lg md:text-xl font-orbitron font-bold"
                      style={{ color: "var(--shadow-purple)" }}
                    >
                      {formatNumber(august2ndCountdown.seconds)}
                    </div>
                    <div className="text-xs opacity-70">secs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
