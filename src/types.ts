export interface Difference {
  id: string;
  name: string;
  hint: string;
  x: number; // percentage from left (0 to 100)
  y: number; // percentage from top (0 to 100)
  radius: number; // radius of click target in percentage (e.g. 5 to 10)
}

export type LevelTheme = 'underwater' | 'space' | 'forest' | 'candy' | 'dino' | 'toys' | 'magic' | 'arcade' | 'desert' | 'safari' | 'farm' | 'winter' | 'sky';

export interface Level {
  id: number;
  title: string;
  emoji: string;
  theme: LevelTheme;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bgColor: string; // Tailwind class like bg-sky-500
  accentColor: string; // Tailwind class like text-sky-600
  gradientClass: string; // Gradient class for card background
  differences: Difference[];
}

export interface UserStats {
  unlockedLevel: number; // Highest level unlocked (e.g. 1 means only level 1, etc.)
  starsEarned: Record<number, number>; // levelId -> stars (0 to 3)
  bestTimes: Record<number, number>; // levelId -> seconds taken
  completedModes: Record<number, ('timed' | 'zen')[]>; // levelId -> modes completed
}
