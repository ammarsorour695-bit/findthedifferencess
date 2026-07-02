import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Timer,
  Heart,
  Sparkles,
  HelpCircle,
  Trophy,
  Play,
  RefreshCw,
  Home,
  Award,
  ChevronRight,
  Zap,
  CheckCircle2,
  Clock,
  Baby
} from 'lucide-react';
import { sound } from './components/SoundEngine';
import { levels } from './levelsData';
import { Level, Difference, UserStats } from './types';
import LevelCanvas from './components/LevelCanvas';
import { getTranslation, translateSpeech } from './i18n';

// Load our generated mascot image from assets
const NANO_BANANA_IMG = "/src/assets/images/nano_banana_1782828304542.jpg";

export default function App() {
  // Language translation mode: 'en' | 'ar'
  const [lang, setLang] = useState<'en' | 'ar'>(() => {
    return (localStorage.getItem('game_lang') as 'en' | 'ar') || 'en';
  });

  // Simple translate helper
  const t = (key: string) => getTranslation(key, lang);

  // Synchronize document attributes when language toggles
  useEffect(() => {
    localStorage.setItem('game_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Game screens: 'welcome' | 'playing' | 'victory' | 'gameover'
  const [gameState, setGameState] = useState<'welcome' | 'playing' | 'victory' | 'gameover'>('welcome');
  
  // Selected Level and Mode
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [gameMode, setGameMode] = useState<'timed' | 'zen'>('timed');
  
  // Game state variables
  const [foundDifferenceIds, setFoundDifferenceIds] = useState<string[]>([]);
  const [hearts, setHearts] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(100); // 100 seconds to start
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Hint system
  const [hintCooldown, setHintCooldown] = useState<number>(0);
  const [activeHintId, setActiveHintId] = useState<string | null>(null);
  const [bananaSpeech, setBananaSpeech] = useState<string>("Hey there! I am Nano Banana. Let's find some tricky differences!");

  // Success / Error interactive ripples
  const [successRipples, setSuccessRipples] = useState<{ x: number; y: number; id: string }[]>([]);
  const [errorRipples, setErrorRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Stars calculation preview (derived dynamically)
  const starsPreview = gameMode === 'timed'
    ? (secondsElapsed <= 40 ? 3 : (secondsElapsed <= 80 ? 2 : 1))
    : 3;

  // Confetti particles for success screen
  const [confetti, setConfetti] = useState<{ id: number; emoji: string; x: number; y: number; size: number; delay: number }[]>([]);

  // User persistent stats
  const [stats, setStats] = useState<UserStats>({
    unlockedLevel: 1,
    starsEarned: {},
    bestTimes: {},
    completedModes: {}
  });

  // Track newly unlocked level ID in current session for celebration animation
  const [newlyUnlockedLevelId, setNewlyUnlockedLevelId] = useState<number | null>(null);

  // Timers refs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hintTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nano_banana_difference_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStats(prev => ({
          ...prev,
          ...parsed
        }));
      } catch (e) {
        console.warn("Could not load stats, using defaults");
      }
    }
  }, []);

  // Save stats to localStorage
  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('nano_banana_difference_stats', JSON.stringify(newStats));
  };

  // Sound system volume setting
  useEffect(() => {
    sound.setMute(isMuted);
  }, [isMuted]);

  // Handle Game Timer and star rating preview
  useEffect(() => {
    if (gameState === 'playing') {
      timerIntervalRef.current = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);

        if (gameMode === 'timed') {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleGameOver();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [gameState, gameMode]);

  // Handle Hint cooldown timer
  useEffect(() => {
    let cooldownInterval: NodeJS.Timeout;
    if (hintCooldown > 0) {
      cooldownInterval = setInterval(() => {
        setHintCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownInterval);
  }, [hintCooldown]);

  // Quick helper to change Banana mascot speech bubble with a cute delay
  const speakBanana = (text: string, duration: number = 5000) => {
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    setBananaSpeech(text);
    speechTimeoutRef.current = setTimeout(() => {
      setBananaSpeech("Keep searching, Detective! You can do it! 🔍🍌");
    }, duration);
  };

  // Launch a level
  const startLevel = (level: Level, mode: 'timed' | 'zen') => {
    sound.playClick();
    if (newlyUnlockedLevelId === level.id) {
      setNewlyUnlockedLevelId(null);
    }
    setCurrentLevel(level);
    setGameMode(mode);
    setFoundDifferenceIds([]);
    setHearts(mode === 'timed' ? 5 : 9999);
    setTimeLeft(100);
    setSecondsElapsed(0);
    setHintCooldown(0);
    setActiveHintId(null);
    setSuccessRipples([]);
    setErrorRipples([]);
    setGameState('playing');
    speakBanana(`Level ${level.id}: ${level.title}! Let's find the 5 sneaky tweaks! 🚀`);
  };

  // Trigger hint
  const triggerHint = () => {
    if (hintCooldown > 0 && gameMode === 'timed') return;

    // Find first unfound difference
    const unfound = currentLevel.differences.find(d => !foundDifferenceIds.includes(d.id));
    if (unfound) {
      sound.playHint();
      setActiveHintId(unfound.id);
      speakBanana(`Aha! Look over here: "${unfound.hint}"`, 8000);
      
      // Set cooldown (15s for timed, 0 for zen)
      if (gameMode === 'timed') {
        setHintCooldown(15);
      } else {
        setHintCooldown(3);
      }

      // Hide hint spotlight after 6 seconds
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = setTimeout(() => {
        setActiveHintId(null);
      }, 6000);
    } else {
      speakBanana("Wow, you already found everything! Just click them all! 🎉");
    }
  };

  // Handle wrong click penalty
  const triggerMistake = (x: number, y: number) => {
    sound.playMistake();
    
    // Add red cross feedback
    const errId = Date.now();
    setErrorRipples(prev => [...prev, { x, y, id: errId }]);
    setTimeout(() => {
      setErrorRipples(prev => prev.filter(r => r.id !== errId));
    }, 1000);

    if (gameMode === 'timed') {
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        handleGameOver();
      } else {
        speakBanana("Whoops! That spot looks identical on both sides. Look closer! 🤔");
      }
    } else {
      speakBanana("Not quite there! Take your time, there's no pressure in Zen Mode! 😊");
    }
  };

  // Handle successful click
  const triggerSuccess = (diff: Difference) => {
    sound.playSuccess();
    
    if (foundDifferenceIds.includes(diff.id)) return;

    const next = [...foundDifferenceIds, diff.id];
    setFoundDifferenceIds(next);
    
    // Add green success ripples
    const ripId = `${diff.id}-${Date.now()}`;
    setSuccessRipples(prev => [...prev, { x: diff.x, y: diff.y, id: ripId }]);
    setTimeout(() => {
      setSuccessRipples(prev => prev.filter(r => r.id !== ripId));
    }, 1200);

    // Check for Level Clear!
    if (next.length === currentLevel.differences.length) {
      handleLevelComplete();
    } else {
      const remaining = currentLevel.differences.length - next.length;
      speakBanana(`Awesome! You found: ${diff.name}! Only ${remaining} more left! ⭐`);
    }

    // Reset active hint if it was found
    if (activeHintId === diff.id) {
      setActiveHintId(null);
    }
  };

  // Master Canvas click handler
  const handleCanvasClick = (pctX: number, pctY: number) => {
    // Check if the click coordinates hit any of the remaining differences
    let hitFound = false;

    for (const diff of currentLevel.differences) {
      // Skip if already found
      if (foundDifferenceIds.includes(diff.id)) continue;

      // Distance formula in percentage space
      const distance = Math.sqrt(Math.pow(pctX - diff.x, 2) + Math.pow(pctY - diff.y, 2));
      
      // Check if distance falls within the target radius (generous +2% cushion for fat fingers)
      if (distance <= (diff.radius + 2.5)) {
        triggerSuccess(diff);
        hitFound = true;
        break;
      }
    }

    if (!hitFound) {
      triggerMistake(pctX, pctY);
    }
  };

  // Run when user runs out of time or hearts
  const handleGameOver = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    sound.playMistake();
    setGameState('gameover');
    speakBanana("Oh no! Don't worry, Detective. Practice makes perfect! Try again! 🍌💛");
  };

  // Run when user successfully finds all 5 differences
  const handleLevelComplete = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    sound.playVictory();
    setGameState('victory');

    // Calculate stars
    let earnedStars = 3;
    if (gameMode === 'timed') {
      if (secondsElapsed <= 40) earnedStars = 3;
      else if (secondsElapsed <= 80) earnedStars = 2;
      else earnedStars = 1;
    } else {
      earnedStars = 3; // Zen mode is always a 3-star smiley reward!
    }

    // Prepare cute congratulations speech
    const speechOptions = [
      `Incredible! You spotted all the changes in just ${secondsElapsed} seconds! You are a master explorer! 🏆🍌`,
      `Sensational! Nano Banana is super proud of your hawk eyes! You earned ${earnedStars} stars! ⭐⭐⭐`,
      `Perfect score! You are getting really good at this game, Detective! Let's unlock the next scene!`
    ];
    speakBanana(speechOptions[Math.floor(Math.random() * speechOptions.length)], 10000);

    // Save and update stats
    const updatedStars = { ...stats.starsEarned };
    const currentRecord = updatedStars[currentLevel.id] || 0;
    if (earnedStars > currentRecord) {
      updatedStars[currentLevel.id] = earnedStars;
    }

    const updatedTimes = { ...stats.bestTimes };
    const bestTime = updatedTimes[currentLevel.id];
    if (!bestTime || secondsElapsed < bestTime) {
      updatedTimes[currentLevel.id] = secondsElapsed;
    }

    const updatedModes = { ...stats.completedModes };
    const levelModes = updatedModes[currentLevel.id] || [];
    if (!levelModes.includes(gameMode)) {
      levelModes.push(gameMode);
    }
    updatedModes[currentLevel.id] = levelModes;

    // Unlock next level
    let unlocked = stats.unlockedLevel;
    if (currentLevel.id === stats.unlockedLevel && stats.unlockedLevel < levels.length) {
      unlocked = stats.unlockedLevel + 1;
      setNewlyUnlockedLevelId(unlocked);
    }

    saveStats({
      unlockedLevel: unlocked,
      starsEarned: updatedStars,
      bestTimes: updatedTimes,
      completedModes: updatedModes
    });

    // Trigger sweet visual emoji confetti particles
    const particles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      emoji: ['⭐', '🍌', '🍭', '🎈', '🎉', '🐠', '🚀'][Math.floor(Math.random() * 7)],
      x: Math.random() * 100,
      y: 100 + Math.random() * 50,
      size: 16 + Math.random() * 24,
      delay: Math.random() * 2
    }));
    setConfetti(particles);
  };

  // Exit back to welcome select screen
  const exitToMain = () => {
    sound.playClick();
    setGameState('welcome');
    speakBanana("Welcome back to the Playroom! Pick a level and let's get hunting! 🔍🍌");
  };

  // Skip to next unlocked level if there is one
  const handleNextLevel = () => {
    const nextId = currentLevel.id + 1;
    const nextLevel = levels.find(l => l.id === nextId);
    if (nextLevel && nextId <= stats.unlockedLevel) {
      startLevel(nextLevel, gameMode);
    } else {
      exitToMain();
    }
  };

  // Calculate total stars collected
  const totalStars = (Object.values(stats.starsEarned) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div id="game-root" className="min-h-screen bg-[#FFF9E6] text-[#432C0B] flex flex-col font-sans select-none selection:bg-[#FFD95A] selection:text-[#432C0B]">
      
      {/* Dynamic Animated CSS Confetti overlay for Victory Screen */}
      {gameState === 'victory' && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((p) => (
            <div
              key={`confetti-${p.id}`}
              className="absolute animate-float-up text-center opacity-80"
              style={{
                left: `${p.x}%`,
                fontSize: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                bottom: `-10%`,
              }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      )}

      {/* HEADER BAR */}
      <header id="game-header" className="bg-[#FFD95A] border-b-4 border-[#E2B200] py-4 px-4 md:px-8 sticky top-0 z-30 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3 cursor-pointer" onClick={exitToMain}>
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md transform -rotate-3 border border-[#E2B200]/40 shrink-0 animate-bounce-slow">
            <span className="text-2xl">🍌</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tight text-[#432C0B] flex items-center gap-1.5 uppercase">
              Nano Banana <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#FF7043] font-black border-2 border-[#FFE8A1]">Tweak Spotter</span>
            </h1>
            <p className="text-[10px] text-[#8D6E45] font-bold hidden sm:block">Find the Differences Kids Game</p>
          </div>
        </div>

        {/* Global Sound & Score indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/50 px-4 py-2 rounded-full border-2 border-white text-[#432C0B] text-xs font-bold shadow-sm">
            <span className="text-sm">⭐</span> <span className="font-black text-[#FF7043]">{totalStars}</span> {t("Stars Earned")}
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="px-3 py-2.5 rounded-xl bg-white hover:bg-[#FFF3CD] text-[#FF7043] font-black text-xs transition-all border-b-4 border-gray-200 active:translate-y-0.5 active:border-b-2 shadow-sm flex items-center gap-1.5 shrink-0"
            title={lang === 'en' ? "Switch to Arabic Mode" : "التغيير إلى الإنجليزية"}
          >
            <span className="text-base leading-none">🌐</span>
            <span>{lang === 'en' ? 'العربية' : 'English'}</span>
          </button>

          <button
            id="btn-toggle-sound"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl bg-white hover:bg-[#FFF3CD] text-[#FF7043] transition-all border-b-4 border-gray-200 active:translate-y-0.5 active:border-b-2 shadow-sm flex items-center justify-center shrink-0"
            title={isMuted ? "Unmute" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </header>

      {/* MAIN GAME CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">

        {/* ================= WELCOME / LEVEL SELECT SCREEN ================= */}
        {gameState === 'welcome' && (
          <div id="screen-welcome" className="flex flex-col gap-8 animate-fade-in py-4">
            
            {/* HERO HERO SECTION WITH MASCOT */}
            <div className="bg-white border-4 border-[#FFD95A] rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
              
              {/* Mascot Photo */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 rounded-3xl bg-[#FFD95A] opacity-60 blur-md group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[#FFD95A] shadow-md bg-white transform rotate-2">
                  <img
                    src={NANO_BANANA_IMG}
                    alt="Nano Banana Mascot"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#FF7043] border-2 border-white text-xs text-white font-black px-3 py-1 rounded-full shadow-md">
                  {t("Hi, kids! 🍌")}
                </div>
              </div>

              {/* Cheerful Hello Banner */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE8A1] border-2 border-[#E2B200] text-[#432C0B] text-xs font-black mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7043]" /> {t("Children's Special Spot-the-Differences Edition")}
                </div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#432C0B] tracking-tight leading-tight">
                  {t("Can you spot the sneaky changes?")}
                </h2>
                <p className="text-[#6D4C1D] mt-3 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
                  {t("Oh no! A playful space monkey tweaked my favorite cartoon drawings when I wasn't looking! Can you help me find all 5 differences in each scene? You can choose a relaxed Zen Play or the exciting Timed Mission to earn gold stars!")}
                </p>
                
                {/* Banana Balloon Quote */}
                <div className={`mt-5 bg-[#FFF9E6] ${lang === 'ar' ? 'border-r-4 rounded-l-2xl' : 'border-l-4 rounded-r-2xl'} border-[#FF7043] p-4 text-xs md:text-sm text-[#432C0B] font-bold shadow-inner`}>
                  {t("Each drawing has exactly 5 hidden differences. Look very closely, some are super tricky but super fun!")}
                </div>
              </div>
            </div>

            {/* LEVEL SELECTION HEADER */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-[#E2B200]/30 pb-3">
                <h3 className="text-lg md:text-2xl font-black text-[#432C0B] flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#FF7043]" /> {t("Choose Your Adventure")}
                </h3>
                <span className="text-xs text-[#8D6E45] font-bold bg-[#FFE8A1]/40 px-3 py-1 rounded-full border border-[#E2B200]/20">
                  {stats.unlockedLevel} / {levels.length} {t("Levels Unlocked")}
                </span>
              </div>

              {/* LEVEL GRID */}
              <div id="level-selection-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {levels.map((level) => {
                  const isUnlocked = level.id <= stats.unlockedLevel;
                  const isNewlyUnlocked = level.id === newlyUnlockedLevelId;
                  const stars = stats.starsEarned[level.id] || 0;
                  const bestTime = stats.bestTimes[level.id];
                  const modesComp = stats.completedModes[level.id] || [];

                  return (
                    <div
                      key={`level-card-${level.id}`}
                      className={`relative rounded-3xl border-4 overflow-hidden flex flex-col shadow-md transition-all duration-300 ${
                        isNewlyUnlocked
                          ? 'bg-[#FFFDE6] border-[#FFD95A] animate-unlock-celebration -translate-y-1 z-10'
                          : isUnlocked
                            ? 'bg-white hover:bg-[#FFF9E6] border-white hover:border-[#FFD95A] hover:-translate-y-1'
                            : 'bg-[#FFF9E6]/40 border-dashed border-gray-300 opacity-60'
                      }`}
                    >
                      {/* Newly Unlocked Badge */}
                      {isNewlyUnlocked && (
                        <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-gradient-to-r from-[#FF7043] to-[#FFD95A] text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-bl-2xl rounded-tr-xl shadow-md border-b-2 border-l-2 border-white/60 animate-bounce z-20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-white fill-current animate-pulse" />
                          {t("NEW!")}
                        </span>
                      )}

                      {/* Level Thumbnail Background color banner */}
                      <div className={`h-24 bg-gradient-to-r ${level.gradientClass} p-4 flex items-center justify-between relative`}>
                        {/* Huge translucent emoji background */}
                        <span className="absolute right-4 bottom-2 text-7xl opacity-20 pointer-events-none">
                          {level.emoji}
                        </span>

                        <div className="flex items-center gap-2.5 z-10">
                          <span className="text-3xl bg-white/25 p-2 rounded-2xl border border-white/25 shadow-sm">
                            {level.emoji}
                          </span>
                          <div>
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/95">
                              {t("Level")} {level.id}
                            </span>
                            <h4 className="font-extrabold text-sm md:text-base text-white truncate max-w-[150px] drop-shadow-[0_1.5px_3px_rgba(67,44,11,0.5)]">
                              {t(level.title)}
                            </h4>
                          </div>
                        </div>

                        {/* Difficulty Tag */}
                        <span className={`z-10 text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase text-white ${
                          level.difficulty === 'Easy' ? 'bg-[#4CAF50]' :
                          level.difficulty === 'Medium' ? 'bg-[#FF7043]' : 'bg-rose-500'
                        }`}>
                          {t(level.difficulty)}
                        </span>
                      </div>

                      {/* Level Statistics / Play Buttons */}
                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        
                        {/* Stats block */}
                        {isUnlocked ? (
                          <div className="flex items-center justify-between text-xs text-[#8D6E45] border-b border-[#E2B200]/20 pb-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-[#8D6E45] font-bold">{t("Stars Earned")}</span>
                              <div className="flex gap-0.5">
                                {Array.from({ length: 3 }).map((_, i) => (
                                  <span key={`star-${level.id}-${i}`} className="text-sm">
                                    {i < stars ? '⭐' : '☆'}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-1 text-right">
                              <span className="text-[10px] text-[#8D6E45] font-bold">{t("Best Time")}</span>
                              <span className="font-black text-[#432C0B] flex items-center gap-1 justify-end">
                                <Clock className="w-3 h-3 text-[#FF7043]" /> {bestTime ? `${bestTime}s` : '---'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-10 flex items-center justify-center border-b border-gray-200 pb-3">
                            <span className="text-xs text-[#8D6E45] font-bold flex items-center gap-1.5">
                              🔒 {t("Complete previous level to unlock")}
                            </span>
                          </div>
                        )}

                        {/* Play Mode Action Buttons */}
                        {isUnlocked ? (
                          <div className="grid grid-cols-2 gap-3 mt-1">
                            <button
                              id={`btn-play-zen-level-${level.id}`}
                              onClick={() => startLevel(level, 'zen')}
                              className="py-2 px-3 rounded-xl bg-white hover:bg-[#E0F7FA] text-[#00838F] border-b-4 border-[#B2EBF2] hover:border-[#80DEEA] font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5 active:border-b-2"
                            >
                              <Baby className="w-3.5 h-3.5" /> {t("Zen Mode")}
                            </button>
                            <button
                              id={`btn-play-timed-level-${level.id}`}
                              onClick={() => startLevel(level, 'timed')}
                              className="py-2 px-3 rounded-xl bg-[#FF7043] hover:bg-[#F4511E] text-white border-b-4 border-[#BF360C] font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5 active:border-b-2"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> {t("Time Mode")}
                            </button>
                          </div>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl bg-gray-200/50 text-gray-400 border border-gray-300 text-center text-xs font-black">
                            {t("Locked")} 🔒
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= PLAYING GAMEPLAY SCREEN ================= */}
        {gameState === 'playing' && (
          <div id="screen-playing" className="flex flex-col gap-6 animate-fade-in">
            
            {/* TOP BAR / CONTROL CONTROLS WITH TIME, LIVES, PROGRESS */}
            <div className="bg-white/95 backdrop-blur-md border-4 border-[#FFD95A] rounded-3xl p-5 flex flex-wrap gap-4 items-center justify-between shadow-md text-[#432C0B]">
              
              {/* Level Info & Mode Tag */}
              <div className="flex items-center gap-3">
                <button
                  id="btn-back-to-menu"
                  onClick={exitToMain}
                  className="px-4 py-2 text-xs font-black text-[#FF7043] bg-white hover:bg-[#FFF3CD] rounded-xl border-b-4 border-gray-200 hover:border-[#FFD95A] active:translate-y-0.5 active:border-b-2 shadow-sm transition-all"
                >
                  ◀ {t("Exit")}
                </button>
                <div className="h-6 w-1 bg-[#FFD95A]" />
                <div>
                  <h3 className="font-black text-[#432C0B] flex items-center gap-1.5 text-sm md:text-base">
                    <span>{currentLevel.emoji}</span> {t(currentLevel.title)}
                  </h3>
                  <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase mt-0.5 ${
                    gameMode === 'timed' ? 'bg-[#FF7043]/10 text-[#FF7043] border border-[#FF7043]/30' : 'bg-[#00838F]/10 text-[#00838F] border border-[#00838F]/30'
                  }`}>
                    {gameMode === 'timed' ? <Zap className="w-2.5 h-2.5" /> : <Baby className="w-2.5 h-2.5" />} {t(gameMode === 'timed' ? "Timed Mode" : "Relaxed Zen Mode")}
                  </span>
                </div>
              </div>

              {/* STARS / TIME PREVIEW HUD */}
              <div className="flex items-center gap-6">
                
                {/* Dynamic Timer Display (if Timed mode) */}
                {gameMode === 'timed' ? (
                  <div className="flex items-center gap-2">
                    <Timer className={`w-5 h-5 ${timeLeft < 20 ? 'text-rose-500 animate-pulse' : 'text-[#FF7043]'}`} />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-[#8D6E45] font-black">{t("Time Left")}</span>
                      <span className={`font-black text-sm md:text-base tracking-wider ${timeLeft < 20 ? 'text-rose-600 animate-pulse' : 'text-[#432C0B]'}`}>
                        {timeLeft} {t("seconds")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#00838F]" />
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-[#8D6E45] font-black">{t("Zen Elapsed")}</span>
                      <span className="font-black text-sm md:text-base text-[#00838F]">
                        {secondsElapsed}s ({t("Easy")})
                      </span>
                    </div>
                  </div>
                )}

                {/* Stars Indicator */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] uppercase tracking-widest text-[#8D6E45] font-black">{t("Current Rating")}</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span
                        key={`hud-star-${i}`}
                        className={`text-lg transition-transform duration-300 ${i < starsPreview ? 'scale-110' : 'opacity-20 scale-95'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hearts / Mistakes Remaining */}
                <div className="flex items-center gap-2">
                  <Heart className={`w-5 h-5 ${hearts <= 1 ? 'text-rose-600 animate-pulse fill-rose-600' : 'text-rose-500 fill-rose-500/20'}`} />
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-[#8D6E45] font-black">{t("Lives Left")}</span>
                    <span className="font-black text-sm md:text-base text-rose-600">
                      {gameMode === 'timed' ? `${hearts} / 5` : `∞ ${t("infinite")}`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#8D6E45] font-black block">{t("Differences Spot")}</span>
                  <span className="font-black text-sm md:text-base text-[#4CAF50]">
                    {foundDifferenceIds.length} / {currentLevel.differences.length} {t("Found")}
                  </span>
                </div>
                
                {/* Visual bullet points for found items */}
                <div className="flex gap-1.5">
                  {Array.from({ length: currentLevel.differences.length }).map((_, i) => (
                    <div
                      key={`progress-dot-${i}`}
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 ${
                        i < foundDifferenceIds.length
                          ? 'bg-[#4CAF50] border-[#2E7D32] scale-110 shadow-md'
                          : 'bg-white border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

            </div>

            {/* DUAL INTERACTIVE CANVASES (LEFT & RIGHT SIDES) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
              
              {/* Left Side: Original Image */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black uppercase text-[#432C0B] tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4CAF50]" /> {t("Original Drawing")}
                  </span>
                  <span className="text-[10px] text-[#8D6E45] font-bold italic">{t("Click on changes either side!")}</span>
                </div>
                
                <LevelCanvas
                  level={currentLevel}
                  isRightSide={false}
                  foundDifferenceIds={foundDifferenceIds}
                  hintingDifferenceId={activeHintId}
                  onCanvasClick={handleCanvasClick}
                  showSuccessRipple={successRipples}
                  showErrorRipple={errorRipples}
                />
              </div>

              {/* Right Side: Tweaked Image */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-2">
                  <span className="text-xs font-black uppercase text-[#FF7043] tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FF7043]" /> {t("Modified Version (5 Tweaks)")}
                  </span>
                  <span className="text-[10px] text-[#8D6E45] font-bold italic">{t("Spot differences here!")}</span>
                </div>

                <LevelCanvas
                  level={currentLevel}
                  isRightSide={true}
                  foundDifferenceIds={foundDifferenceIds}
                  hintingDifferenceId={activeHintId}
                  onCanvasClick={handleCanvasClick}
                  showSuccessRipple={successRipples}
                  showErrorRipple={errorRipples}
                />
              </div>

            </div>

            {/* GAMEPLAY FOOTER: MASCOT HELPER, HINT TRIGGER, REMAINING LIST */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* MASCOT CHAT PANEL */}
              <div className="bg-white border-4 border-[#FFD95A] rounded-3xl p-4 md:col-span-8 flex items-center gap-4 shadow-md text-[#432C0B]">
                {/* Photo */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#FFD95A] shrink-0 bg-white">
                  <img
                    src={NANO_BANANA_IMG}
                    alt="Nano Banana"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Speech Bubble */}
                <div className="relative bg-[#FFF9E6] border-2 border-[#FFE8A1] px-4 py-3 rounded-2xl flex-1">
                  {/* Speech bubble pointer tip */}
                  <div className={`absolute ${lang === 'ar' ? 'right-[-6px] border-r-2 border-b-2' : 'left-[-6px] border-l-2 border-b-2'} top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFF9E6] border-[#FFE8A1] transform rotate-45`} />
                  <p className="text-xs md:text-sm text-[#432C0B] font-bold leading-relaxed">
                    {translateSpeech(bananaSpeech, lang)}
                  </p>
                </div>
              </div>

              {/* ACTION HUD: HINT TRIGGER BUTTON */}
              <div className="md:col-span-4 flex flex-col justify-center gap-3">
                <button
                  id="btn-use-hint"
                  onClick={triggerHint}
                  disabled={hintCooldown > 0 && gameMode === 'timed'}
                  className={`relative w-full py-3.5 px-4 rounded-2xl font-black text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 border active:translate-y-0.5 active:border-b-2 ${
                    hintCooldown > 0 && gameMode === 'timed'
                      ? 'bg-gray-200 border-b-4 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-[#FF7043] hover:bg-[#F4511E] text-white border-b-4 border-[#BF360C] border-t-0 border-l-0 border-r-0'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 fill-current" />
                  {hintCooldown > 0 && gameMode === 'timed' ? (
                    <span>{t("Hint Cooldown:")} ({hintCooldown}s)</span>
                  ) : (
                    <span>{t("Ask Nano Banana for Hint!")}</span>
                  )}
                  {gameMode === 'zen' && <span className="text-[10px] bg-black/10 text-[#432C0B] px-1.5 py-0.5 rounded font-black">{lang === 'en' ? 'FREE' : 'مجاني 🎁'}</span>}
                </button>

                <button
                  id="btn-reset-level"
                  onClick={() => startLevel(currentLevel, gameMode)}
                  className="w-full py-2.5 px-4 rounded-2xl font-black text-xs bg-white hover:bg-[#FFF3CD] text-[#FF7043] border-b-4 border-gray-200 hover:border-[#FFD95A] transition-all flex items-center justify-center gap-1.5 shadow-sm active:translate-y-0.5 active:border-b-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> {t("Start Level Over")}
                </button>
              </div>

            </div>

            {/* FOUND LIST HUD FOR CHILDREN TRACKING */}
            <div className="bg-white border-4 border-[#FFD95A] rounded-3xl p-5 shadow-sm flex flex-col gap-2">
              <span className="text-[10px] uppercase font-black text-[#8D6E45] tracking-wider">
                🔎 {t("Detected Tweak Journal")}
              </span>
              <div className="flex flex-wrap gap-2">
                {currentLevel.differences.map((diff) => {
                  const found = foundDifferenceIds.includes(diff.id);
                  return (
                    <div
                      key={`journal-diff-${diff.id}`}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                        found
                          ? 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50] shadow-inner font-black'
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                    >
                      <span>{found ? '✅' : '❓'}</span>
                      <span>{found ? t(diff.name) : (lang === 'en' ? 'Secret Tweak' : 'تعديل سري 🔒')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================= VICTORY LEVEL SUCCESS SCREEN ================= */}
        {gameState === 'victory' && (
          <div id="screen-victory" className="max-w-2xl w-full mx-auto bg-white border-8 border-[#FFD95A] rounded-[2rem] p-6 md:p-10 shadow-2xl animate-scale-up text-center flex flex-col items-center gap-6 my-6 text-[#432C0B]">
            
            <div className="w-24 h-24 bg-[#FFD95A] rounded-3xl border-4 border-white flex items-center justify-center text-5xl shadow-lg animate-bounce transform rotate-3">
              🎉
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-black tracking-widest text-[#FF7043] bg-[#FFE8A1] px-3 py-1 rounded-full border border-[#E2B200]/30">{t("Mission Accomplished!")}</span>
              <h2 className="text-2xl md:text-3xl font-black text-[#432C0B] mt-2">
                {t("You spotted all the tweaks!")}
              </h2>
            </div>

            {/* STARS EARNED SHOWCASE */}
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => {
                let earnedStars = 3;
                if (gameMode === 'timed') {
                  if (secondsElapsed <= 40) earnedStars = 3;
                  else if (secondsElapsed <= 80) earnedStars = 2;
                  else earnedStars = 1;
                }
                const active = i < earnedStars;
                return (
                  <span
                    key={`victory-star-${i}`}
                    className={`text-5xl transition-all duration-500 ${active ? 'scale-115 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]' : 'opacity-20 scale-90'}`}
                  >
                    ⭐
                  </span>
                );
              })}
            </div>

            {/* PERFORMANCE HIGHLIGHT CARD */}
            <div className="bg-[#FFF9E6] border-4 border-[#FFE8A1] rounded-2xl p-5 w-full grid grid-cols-2 gap-4">
              <div className="border-r border-[#FFE8A1] flex flex-col items-center justify-center p-2">
                <span className="text-[10px] uppercase text-[#8D6E45] font-black">{t("Total Time")}</span>
                <span className="text-2xl font-black text-[#FF7043] mt-1">{secondsElapsed} {t("seconds")}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2">
                <span className="text-[10px] uppercase text-[#8D6E45] font-black">{t("Game Mode")}</span>
                <span className="text-base font-black text-[#00838F] mt-1 uppercase tracking-wide">
                  {gameMode === 'timed' ? `⏱ ${t("Timed Mode")}` : `🌸 ${t("Relaxed Zen Mode")}`}
                </span>
              </div>
            </div>

            {/* MASCOT CHAT */}
            <div className="bg-[#FFF9E6] border-2 border-[#FFE8A1] rounded-2xl p-4 flex items-center gap-4 w-full">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#FFD95A] bg-white shrink-0">
                <img
                  src={NANO_BANANA_IMG}
                  alt="Nano Banana Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs md:text-sm italic text-[#432C0B] font-bold text-left leading-relaxed">
                "{translateSpeech(bananaSpeech, lang)}"
              </p>
            </div>

            {/* ACTION FOOTER BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-4">
              <button
                id="btn-victory-home"
                onClick={exitToMain}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-[#FFF3CD] text-[#FF7043] border-b-4 border-gray-200 hover:border-[#FFD95A] font-bold text-sm transition-all shadow-sm active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" /> {t("Main Menu")}
              </button>
              <button
                id="btn-victory-replay"
                onClick={() => startLevel(currentLevel, gameMode)}
                className="py-3.5 px-4 rounded-xl bg-white hover:bg-[#E0F7FA] text-[#00838F] border-b-4 border-[#B2EBF2] hover:border-[#80DEEA] font-bold text-sm transition-all shadow-sm active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> {t("Replay")}
              </button>
              
              {/* Play Next level (locked if none or not unlocked yet) */}
              {(() => {
                const nextId = currentLevel.id + 1;
                const nextLevel = levels.find(l => l.id === nextId);
                const isNextUnlocked = nextId <= stats.unlockedLevel;
                
                return (
                  <button
                    id="btn-victory-next"
                    disabled={!nextLevel || !isNextUnlocked}
                    onClick={handleNextLevel}
                    className={`py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all shadow-md active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-1.5 ${
                      nextLevel && isNextUnlocked
                        ? 'bg-[#4CAF50] hover:bg-[#43A047] text-white border-b-4 border-[#2E7D32] border-t-0 border-l-0 border-r-0'
                        : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {t("Next Level")} <ChevronRight className="w-4 h-4" />
                  </button>
                );
              })()}
            </div>

          </div>
        )}

        {/* ================= GAME OVER / LIVES EXHAUSTED SCREEN ================= */}
        {gameState === 'gameover' && (
          <div id="screen-gameover" className="max-w-md w-full mx-auto bg-white border-8 border-rose-200 rounded-[2rem] p-6 md:p-8 shadow-2xl animate-scale-up text-center flex flex-col items-center gap-5 my-8 text-[#432C0B]">
            
            <div className="w-20 h-20 bg-rose-50 rounded-2xl border-4 border-rose-300 text-rose-500 flex items-center justify-center text-4xl shadow-md animate-pulse transform -rotate-3">
              💔
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-black tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">{t("Never Give Up!")}</span>
              <h2 className="text-xl md:text-2xl font-black text-[#432C0B] mt-2">
                {t("Ran Out of Hearts!")}
              </h2>
              <p className="text-[#6D4C1D] text-xs md:text-sm mt-1 font-medium">
                {t("Spotting tweaks is hard work! No worries, you can try again, or switch to Relaxed Zen Mode for unlimited hints and infinite lives!")}
              </p>
            </div>

            {/* MASCOT QUOTE */}
            <div className="bg-[#FFF9E6] border-2 border-[#FFE8A1] rounded-2xl p-4 flex items-center gap-3 w-full">
              <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#FFD95A] bg-white shrink-0">
                <img
                  src={NANO_BANANA_IMG}
                  alt="Nano Banana Mascot"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-xs text-[#432C0B] font-bold text-left italic">
                "{translateSpeech(bananaSpeech, lang)}"
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-2 w-full mt-2">
              <button
                id="btn-gameover-retry-timed"
                onClick={() => startLevel(currentLevel, 'timed')}
                className="w-full py-3.5 rounded-2xl bg-[#FF7043] hover:bg-[#F4511E] text-white border-b-4 border-[#BF360C] font-black text-sm transition-all shadow-md active:translate-y-0.5 active:border-b-2"
              >
                {t("Try Timed Mode Again")}
              </button>
              <button
                id="btn-gameover-play-zen"
                onClick={() => startLevel(currentLevel, 'zen')}
                className="w-full py-2.5 rounded-2xl bg-white hover:bg-[#E0F7FA] text-[#00838F] border-b-4 border-[#B2EBF2] hover:border-[#80DEEA] font-bold text-xs transition-all shadow-sm active:translate-y-0.5 active:border-b-2"
              >
                {t("Switch to Relaxed Zen Mode")}
              </button>
              <button
                id="btn-gameover-home"
                onClick={exitToMain}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-[#8D6E45] font-black text-xs rounded-xl border border-gray-300 transition-all"
              >
                {t("Exit to Levels Directory")}
              </button>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer id="game-footer" className="bg-[#FFD95A] py-6 px-4 border-t-4 border-[#E2B200] text-center text-xs text-[#432C0B] flex flex-col gap-2 mt-auto">
        <p className="font-bold text-[#432C0B]">
          {t("Designed with 🍌 Nano Banana for the Awesome Detectives of Earth.")}
        </p>
        <p className="text-[10px] text-[#8D6E45] font-bold">
          {t("All graphics generated live using crisp inline responsive vectors. Offline-capable state engine.")}
        </p>
      </footer>
    </div>
  );
}
