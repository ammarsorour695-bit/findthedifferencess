import React, { useRef } from 'react';
import { Level, Difference } from '../types';

interface LevelCanvasProps {
  level: Level;
  isRightSide: boolean;
  foundDifferenceIds: string[];
  hintingDifferenceId: string | null;
  onCanvasClick: (x: number, y: number) => void;
  showSuccessRipple: { x: number; y: number; id: string }[];
  showErrorRipple: { x: number; y: number; id: number }[];
}

export default function LevelCanvas({
  level,
  isRightSide,
  foundDifferenceIds,
  hintingDifferenceId,
  onCanvasClick,
  showSuccessRipple,
  showErrorRipple
}: LevelCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert to percentage
    const pctX = Math.round((clickX / rect.width) * 100);
    const pctY = Math.round((clickY / rect.height) * 100);

    onCanvasClick(pctX, pctY);
  };

  // Check if a specific difference is already found
  const isFound = (diffId: string) => foundDifferenceIds.includes(diffId);

  // Helper to render found difference indicators
  const renderFoundHighlights = () => {
    return level.differences.map((diff) => {
      const activeHint = hintingDifferenceId === diff.id;
      const found = isFound(diff.id);

      if (!found && !activeHint) return null;

      return (
        <div
          key={`highlight-${diff.id}`}
          className="absolute pointer-events-none rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            left: `${diff.x}%`,
            top: `${diff.y}%`,
            width: `${diff.radius * 2}%`,
            height: `${diff.radius * 2}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {found && (
            <div className="w-full h-full rounded-full border-4 border-amber-400 bg-amber-400/20 animate-pulse flex items-center justify-center">
              <span className="text-[10px] md:text-xs font-bold text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                ⭐
              </span>
            </div>
          )}
          {activeHint && !found && (
            <div className="w-full h-full rounded-full border-4 border-rose-500 bg-rose-500/10 animate-ping absolute" />
          )}
          {activeHint && !found && (
            <div className="w-full h-full rounded-full border-4 border-dashed border-rose-400 bg-rose-400/20 animate-spin absolute" />
          )}
        </div>
      );
    });
  };

  return (
    <div
      id={`canvas-${isRightSide ? 'right' : 'left'}`}
      ref={containerRef}
      onClick={handleClick}
      className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden cursor-crosshair shadow-2xl select-none border-8 border-white bg-gradient-to-b ${level.gradientClass} transition-all duration-500`}
    >
      {/* SVG Canvas Content */}
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ==================== THEME 1: SPACE ==================== */}
        {level.theme === 'space' && (
          <>
            {/* Background stars */}
            <circle cx="40" cy="50" r="1.5" fill="#fff" opacity="0.6" className="animate-pulse" />
            <circle cx="120" cy="80" r="1" fill="#fff" opacity="0.4" />
            <circle cx="280" cy="40" r="2" fill="#fff" opacity="0.8" className="animate-pulse" />
            <circle cx="340" cy="90" r="1.5" fill="#fff" opacity="0.5" />
            <circle cx="80" cy="240" r="1" fill="#fff" opacity="0.6" />
            <circle cx="370" cy="220" r="2" fill="#fff" opacity="0.7" />
            <circle cx="220" cy="180" r="1.5" fill="#fff" opacity="0.4" />

            {/* Glowing Nebulae */}
            <radialGradient id="nebula1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </radialGradient>
            <circle cx="300" cy="100" r="70" fill="url(#nebula1)" />

            <radialGradient id="nebula2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
            <circle cx="100" cy="200" r="80" fill="url(#nebula2)" />

            {/* Difference 1: Saturn's Ring (Target X:20, Y:30) */}
            <g transform="translate(80, 90)">
              {/* Saturn Body */}
              <circle cx="0" cy="0" r="28" fill="#f59e0b" />
              <path d="M -24 -14 Q 0 -6 24 -14 Q 24 -6 -24 -14" fill="#d97706" opacity="0.5" />
              <circle cx="-10" cy="-10" r="6" fill="#fbbf24" opacity="0.3" />
              {/* Ring (Different on Right side) */}
              {(!isRightSide || isFound('space-planet-ring')) ? (
                <ellipse
                  cx="0"
                  cy="0"
                  rx="48"
                  ry="12"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="6"
                  transform="rotate(-15)"
                  opacity="0.85"
                />
              ) : (
                // On Right side (modified): no rings!
                <ellipse
                  cx="0"
                  cy="0"
                  rx="0"
                  ry="0"
                  fill="none"
                  stroke="transparent"
                  strokeWidth="0"
                />
              )}
            </g>

            {/* Difference 2: Alien's Eyes (Target X:80, Y:25) */}
            <g transform="translate(320, 75)">
              {/* Spaceship Dome & Body */}
              <ellipse cx="0" cy="15" rx="35" ry="12" fill="#475569" />
              <ellipse cx="0" cy="15" rx="28" ry="6" fill="#38bdf8" opacity="0.7" />
              <path d="M -20 15 L -25 25 L -15 25 Z" fill="#64748b" />
              <path d="M 20 15 L 25 25 L 15 25 Z" fill="#64748b" />

              {/* Alien Head */}
              <ellipse cx="0" cy="-2" rx="16" ry="12" fill="#22c55e" />
              {/* Alien Antenna */}
              <line x1="0" y1="-12" x2="0" y2="-22" stroke="#22c55e" strokeWidth="3" />
              <circle cx="0" cy="-23" r="4" fill="#a855f7" />

              {/* Alien Glass Dome */}
              <path d="M -24 10 A 24 24 0 0 1 24 10 Z" fill="#38bdf8" opacity="0.35" stroke="#0284c7" strokeWidth="2" />

              {/* Alien Eyes: 3 Eyes (Left) vs 1 Eye (Right) */}
              {(!isRightSide || isFound('space-alien-eyes')) ? (
                <>
                  {/* Left Eye */}
                  <circle cx="-6" cy="-2" r="3.5" fill="#fff" />
                  <circle cx="-6" cy="-2" r="1.5" fill="#000" />
                  {/* Middle Eye */}
                  <circle cx="0" cy="-6" r="4.5" fill="#fff" />
                  <circle cx="0" cy="-6" r="2" fill="#000" />
                  {/* Right Eye */}
                  <circle cx="6" cy="-2" r="3.5" fill="#fff" />
                  <circle cx="6" cy="-2" r="1.5" fill="#000" />
                </>
              ) : (
                // Only 1 giant eye on the modified right side
                <>
                  <circle cx="0" cy="-4" r="7" fill="#fff" />
                  <circle cx="0" cy="-4" r="3.5" fill="#a855f7" />
                  <circle cx="0" cy="-4" r="1.5" fill="#000" />
                </>
              )}
            </g>

            {/* Difference 3: Rocket Booster Flame (Target X:50, Y:70) */}
            <g transform="translate(200, 210)">
              {/* Booster Flame */}
              {(!isRightSide || isFound('space-rocket-flame')) ? (
                // Red/Orange/Yellow flame
                <path d="M -10 15 L 0 45 L 10 15 Z" fill="#ef4444" className="animate-bounce">
                  <animate attributeName="d" values="M -10 15 L 0 45 L 10 15 Z; M -10 15 L 0 32 L 10 15 Z; M -10 15 L 0 45 L 10 15 Z" dur="0.15s" repeatCount="indefinite" />
                </path>
              ) : (
                // Blue/Purple futuristic plasma flame
                <path d="M -10 15 L 0 45 L 10 15 Z" fill="#3b82f6">
                  <animate attributeName="d" values="M -10 15 L 0 45 L 10 15 Z; M -10 15 L 0 32 L 10 15 Z; M -10 15 L 0 45 L 10 15 Z" dur="0.15s" repeatCount="indefinite" />
                </path>
              )}

              {/* Rocket Body */}
              <path d="M -12 15 L -12 -35 Q 0 -60 12 -35 L 12 15 Z" fill="#e11d48" />
              {/* Fins */}
              <path d="M -12 5 L -24 20 L -12 15 Z" fill="#9f1239" />
              <path d="M 12 5 L 24 20 L 12 15 Z" fill="#9f1239" />
              {/* Nose cone color */}
              <path d="M -12 -35 Q 0 -60 12 -35 Z" fill="#fb7185" />
              {/* Port hole */}
              <circle cx="0" cy="-15" r="7" fill="#38bdf8" stroke="#fff" strokeWidth="2" />
              <circle cx="2" cy="-17" r="2" fill="#fff" opacity="0.6" />
            </g>

            {/* Difference 4: Astronaut Visor Color (Target X:18, Y:75) */}
            <g transform="translate(72, 225)">
              {/* Cute Space Banana */}
              {/* Space suit body */}
              <rect x="-12" y="-10" width="24" height="25" rx="10" fill="#e2e8f0" />
              {/* Arms */}
              <rect x="-18" y="-5" width="6" height="15" rx="3" fill="#cbd5e1" />
              <rect x="12" y="-5" width="6" height="15" rx="3" fill="#cbd5e1" />
              {/* Banana face sticking out inside visor */}
              {/* Visor shield */}
              {(!isRightSide || isFound('space-astronaut-visor')) ? (
                // Red Visor
                <rect x="-9" y="-2" width="18" height="12" rx="4" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />
              ) : (
                // Golden Yellow Visor
                <rect x="-9" y="-2" width="18" height="12" rx="4" fill="#fbbf24" stroke="#fff" strokeWidth="1.5" />
              )}
              {/* Little cute banana curve shape on suit */}
              <path d="M -4 10 Q 0 14 4 10" fill="none" stroke="#eab308" strokeWidth="3.5" strokeLinecap="round" />
            </g>

            {/* Difference 5: Shooting Star Trail (Target X:75, Y:75) */}
            <g transform="translate(300, 225)">
              {/* Trail Lines */}
              {(!isRightSide || isFound('space-shooting-star')) ? (
                <>
                  <line x1="-15" y1="-15" x2="-35" y2="-35" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="4 4" />
                  <line x1="-5" y1="-15" x2="-25" y2="-35" stroke="#fde047" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="-15" y1="-5" x2="-35" y2="-25" stroke="#fde047" strokeWidth="2" strokeDasharray="3 3" />
                </>
              ) : (
                // No trails!
                null
              )}
              {/* Star */}
              <path
                d="M 0 -12 L 3 -3 L 12 -3 L 5 3 L 8 12 L 0 6 L -8 12 L -5 3 L -12 -3 L -3 -3 Z"
                fill="#facc15"
                stroke="#fef08a"
                strokeWidth="1"
              />
            </g>
          </>
        )}

        {/* ==================== THEME 2: UNDERWATER ==================== */}
        {level.theme === 'underwater' && (
          <>
            {/* Water Waves / Rays */}
            <path d="M 0 30 Q 100 20 200 30 T 400 30 L 400 0 L 0 0 Z" fill="#0c4a6e" opacity="0.3" />
            <path d="M 0 60 Q 100 50 200 60 T 400 60 L 400 0 L 0 0 Z" fill="#0c4a6e" opacity="0.15" />

            {/* Sandy floor */}
            <path d="M 0 250 Q 150 235 300 255 T 400 250 L 400 300 L 0 300 Z" fill="#eab308" opacity="0.85" />
            <path d="M 0 260 Q 200 250 400 265 L 400 300 L 0 300 Z" fill="#ca8a04" opacity="0.7" />

            {/* Bubbles floating */}
            <circle cx="120" cy="180" r="4" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.6" />
            <circle cx="125" cy="165" r="2.5" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.5" />
            <circle cx="210" cy="100" r="5" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.7" />
            <circle cx="340" cy="150" r="3" fill="none" stroke="#e0f2fe" strokeWidth="1" opacity="0.4" />

            {/* Starfish on sand */}
            <path
              d="M 310 270 L 314 262 L 322 263 L 316 268 L 318 276 L 311 271 L 304 275 L 307 268 L 301 262 L 308 261 Z"
              fill="#fb923c"
              stroke="#ea580c"
              strokeWidth="1"
            />

            {/* Difference 1: Octopus Captain Hat (Target X:25, Y:40) */}
            <g transform="translate(100, 120)">
              {/* Octopus Tentacles */}
              <path d="M -25 20 Q -40 35 -20 40 Q -10 30 -15 20" fill="#ec4899" />
              <path d="M -12 25 Q -25 45 -5 45 Q 0 30 -5 20" fill="#ec4899" />
              <path d="M 12 25 Q 25 45 5 45 Q 0 30 5 20" fill="#ec4899" />
              <path d="M 25 20 Q 40 35 20 40 Q 10 30 15 20" fill="#ec4899" />

              {/* Octopus Head */}
              <circle cx="0" cy="5" r="26" fill="#ec4899" />

              {/* Eyes */}
              <circle cx="-8" cy="2" r="4.5" fill="#fff" />
              <circle cx="-8" cy="2" r="2" fill="#000" />
              <circle cx="8" cy="2" r="4.5" fill="#fff" />
              <circle cx="8" cy="2" r="2" fill="#000" />
              {/* Cheerful blush */}
              <circle cx="-16" cy="8" r="3" fill="#f43f5e" opacity="0.5" />
              <circle cx="16" cy="8" r="3" fill="#f43f5e" opacity="0.5" />
              {/* Mouth */}
              <path d="M -4 10 Q 0 14 4 10" fill="none" stroke="#881337" strokeWidth="2.5" strokeLinecap="round" />

              {/* Captain Hat (Difference) */}
              {(!isRightSide || isFound('sea-octopus-hat')) ? (
                // Green Pirate Captain Hat with gold trim
                <g transform="translate(0, -22)">
                  <path d="M -24 5 Q 0 -18 24 5 Z" fill="#15803d" stroke="#facc15" strokeWidth="2.5" />
                  <rect x="-18" y="2" width="36" height="4" fill="#fb923c" />
                  <circle cx="0" cy="-5" r="3" fill="#fff" />
                  <line x1="-3" y1="-5" x2="3" y2="-5" stroke="#000" strokeWidth="1" />
                  <line x1="0" y1="-8" x2="0" y2="-2" stroke="#000" strokeWidth="1" />
                </g>
              ) : (
                // White & Blue Sailor Hat
                <g transform="translate(0, -22)">
                  <ellipse cx="0" cy="2" rx="18" ry="5" fill="#fff" stroke="#1d4ed8" strokeWidth="2" />
                  <path d="M -12 2 C -12 -12 12 -12 12 2" fill="#fff" />
                  <rect x="-10" y="-3" width="20" height="3" fill="#1d4ed8" />
                </g>
              )}
            </g>

            {/* Difference 2: Treasure Gold vs Gems (Target X:75, Y:80) */}
            <g transform="translate(300, 240)">
              {/* Sea weeds behind chest */}
              <path d="M -22 -10 Q -30 -30 -15 -45" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />

              {/* Chest Body (Bottom half) */}
              <rect x="-24" y="-2" width="48" height="22" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              {/* Golden trim */}
              <rect x="-22" y="-2" width="4" height="22" fill="#facc15" />
              <rect x="18" y="-2" width="4" height="22" fill="#facc15" />

              {/* Loot (Difference inside Chest) */}
              {(!isRightSide || isFound('sea-chest-loot')) ? (
                // Glistening Gold Coins
                <g transform="translate(0, -8)">
                  <circle cx="-12" cy="3" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="-4" cy="1" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="6" cy="4" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
                  <circle cx="12" cy="2" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
                </g>
              ) : (
                // Shiny Violet Gems
                <g transform="translate(0, -8)">
                  <polygon points="-12,5 -7,0 -12,-5 -17,0" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
                  <polygon points="-2,3 3,-2 -2,-7 -7,-2" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" />
                  <polygon points="8,5 13,0 8,-5 3,0" fill="#c084fc" stroke="#7e22ce" strokeWidth="1" />
                  <polygon points="14,2 19,-3 14,-8 9,-3" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
                </g>
              )}

              {/* Lid (Leaning open) */}
              <path d="M -24 -2 L -18 -18 L 18 -18 L 24 -2 Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
              <rect x="-5" y="0" width="10" height="6" fill="#94a3b8" rx="1" />
            </g>

            {/* Difference 3: Clownfish Direction (Target X:50, Y:20) */}
            <g transform="translate(200, 60)">
              <g transform={(!isRightSide || isFound('sea-fish-direction')) ? "scale(1, 1)" : "scale(-1, 1)"}>
                {/* Clownfish body */}
                <ellipse cx="0" cy="0" rx="20" ry="12" fill="#f97316" />
                {/* White Stripe */}
                <rect x="-4" y="-11" width="6" height="22" fill="#fff" rx="1" />
                {/* Tail fin */}
                <path d="M -18 0 L -28 -10 L -24 0 L -28 10 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                {/* Eye */}
                <circle cx="10" cy="-3" r="3" fill="#fff" />
                <circle cx="11" cy="-3" r="1.2" fill="#000" />
                {/* Fin */}
                <path d="M 0 4 Q -5 12 0 10 Z" fill="#fff" stroke="#f97316" />
              </g>
            </g>

            {/* Difference 4: Baby Seahorse (Target X:85, Y:55) */}
            <g transform="translate(340, 165)">
              {/* Green Sea Grass strands */}
              <path d="M -10 90 Q -25 30 -5 -10 Q 5 30 -2 90" fill="#10b981" opacity="0.9" />
              <path d="M 5 90 Q 25 20 0 -25 Q -15 25 12 90" fill="#059669" opacity="0.8" />

              {/* Seahorse (Difference) */}
              {(!isRightSide || isFound('sea-seahorse-hide')) ? (
                // Baby Seahorse curled on seaweed
                <g transform="translate(-4, 25)">
                  {/* Tail curly */}
                  <path d="M 0 15 Q 8 20 2 25 Q -4 20 0 15" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Body */}
                  <ellipse cx="0" cy="5" rx="5" ry="9" fill="#fbbf24" />
                  {/* Head */}
                  <circle cx="-2" cy="-6" r="5" fill="#fbbf24" />
                  {/* Snout */}
                  <rect x="-9" y="-7" width="6" height="2.5" fill="#fbbf24" rx="1" />
                  {/* Eye */}
                  <circle cx="-1.5" cy="-7" r="1" fill="#000" />
                  {/* Back fin */}
                  <path d="M 4 2 Q 8 2 4 6 Z" fill="#f59e0b" />
                </g>
              ) : null}
            </g>

            {/* Difference 5: Submarine Windows (Target X:45, Y:60) */}
            <g transform="translate(180, 180)">
              {/* Submarine Body */}
              <rect x="-35" y="-18" width="70" height="36" rx="18" fill="#f97316" stroke="#c2410c" strokeWidth="2.5" />
              {/* Periscope */}
              <path d="M 0 -18 L 0 -28 L 8 -28" fill="none" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              {/* Propeller */}
              <rect x="-39" y="-12" width="4" height="24" rx="2" fill="#cbd5e1" />

              {/* Windows (Difference) */}
              {(!isRightSide || isFound('sea-sub-portholes')) ? (
                // 3 Windows
                <>
                  <circle cx="-16" cy="0" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  <circle cx="16" cy="0" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </>
              ) : (
                // Only 2 Windows (middle and right)
                <>
                  <circle cx="-8" cy="0" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  <circle cx="12" cy="0" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                </>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 3: DINOSAUR ==================== */}
        {level.theme === 'dino' && (
          <>
            {/* Soft primeval sky */}
            <rect x="0" y="0" width="400" height="150" fill="#fef3c7" opacity="0.3" />
            {/* Sun rays */}
            <polygon points="0,0 120,0 60,300" fill="#fef08a" opacity="0.1" />

            {/* Mountains */}
            <polygon points="120,180 200,80 280,180" fill="#15803d" opacity="0.3" />

            {/* Jungle floor */}
            <path d="M 0 220 Q 120 195 240 225 T 400 215 L 400 300 L 0 300 Z" fill="#22c55e" opacity="0.85" />
            <path d="M 0 240 Q 200 230 400 245 L 400 300 L 0 300 Z" fill="#15803d" opacity="0.7" />

            {/* Prehistoric Trees */}
            <g transform="translate(30, 160)">
              <rect x="-4" y="0" width="8" height="70" fill="#78350f" />
              <ellipse cx="0" cy="-10" rx="20" ry="15" fill="#166534" />
              <ellipse cx="-12" cy="-2" rx="15" ry="12" fill="#15803d" />
              <ellipse cx="12" cy="-2" rx="15" ry="12" fill="#15803d" />
            </g>

            {/* Difference 1: Brachiosaurus Bowtie (Target X:25, Y:55) */}
            <g transform="translate(100, 165)">
              {/* Dino Legs */}
              <rect x="-16" y="20" width="10" height="35" rx="4" fill="#3b82f6" />
              <rect x="6" y="20" width="10" height="35" rx="4" fill="#3b82f6" />
              {/* Dino Tail */}
              <path d="M -22 15 Q -55 35 -60 10 Q -45 5 -20 5" fill="#3b82f6" />

              {/* Dino Body */}
              <ellipse cx="0" cy="12" rx="28" ry="18" fill="#3b82f6" />

              {/* Dino Neck & Head */}
              <path d="M 14 5 C 18 -35 24 -55 24 -70 C 24 -75 35 -75 35 -68 C 35 -60 22 -35 22 5 Z" fill="#3b82f6" />

              {/* Eye & Mouth */}
              <circle cx="28" cy="-68" r="2.5" fill="#000" />
              <path d="M 28 -62 Q 32 -62 31 -65" fill="none" stroke="#1d4ed8" strokeWidth="1.5" />

              {/* Spotted Back */}
              <circle cx="-10" cy="5" r="4" fill="#1d4ed8" opacity="0.3" />
              <circle cx="2" cy="0" r="3" fill="#1d4ed8" opacity="0.3" />
              <circle cx="-4" cy="12" r="5" fill="#1d4ed8" opacity="0.3" />

              {/* Bowtie on Neck (Difference) */}
              {(!isRightSide || isFound('dino-bowtie')) ? (
                // Red Bowtie
                <g transform="translate(20, -35)">
                  <polygon points="-6,-4 0,0 -6,4" fill="#ef4444" />
                  <polygon points="6,-4 0,0 6,4" fill="#ef4444" />
                  <circle cx="0" cy="0" r="2" fill="#fff" />
                </g>
              ) : (
                // Yellow Bowtie
                <g transform="translate(20, -35)">
                  <polygon points="-6,-4 0,0 -6,4" fill="#eab308" />
                  <polygon points="6,-4 0,0 6,4" fill="#eab308" />
                  <circle cx="0" cy="0" r="2" fill="#fff" />
                </g>
              )}
            </g>

            {/* Difference 2: Volcano Eruption Shape (Target X:75, Y:25) */}
            <g transform="translate(300, 75)">
              {/* Volcano Peak */}
              <polygon points="-30,60 0,10 30,60" fill="#78350f" stroke="#451a03" strokeWidth="2" />
              <polygon points="-12,30 0,10 12,30" fill="#ef4444" /> {/* Lava Flow */}

              {/* Eruption smoke / cloud */}
              {(!isRightSide || isFound('dino-volcano')) ? (
                // Actively erupting orange/red smoke
                <g transform="translate(0, -8)">
                  <circle cx="-8" cy="0" r="12" fill="#f97316" opacity="0.8" />
                  <circle cx="8" cy="2" r="10" fill="#f97316" opacity="0.8" />
                  <circle cx="0" cy="-8" r="14" fill="#ef4444" opacity="0.9" />
                  <circle cx="0" cy="-4" r="8" fill="#fde047" />
                </g>
              ) : (
                // Gentle puffy PINK HEART-SHAPED smoke
                <g transform="translate(0, -10)" className="animate-bounce">
                  <path
                    d="M 0 -2 C -10 -15 -20 -5 0 10 C 20 -5 10 -15 0 -2"
                    fill="#f472b6"
                    opacity="0.9"
                  />
                </g>
              )}
            </g>

            {/* Difference 3: Spotted Dino Eggs (Target X:80, Y:80) */}
            <g transform="translate(320, 240)">
              {/* Straw Nest */}
              <ellipse cx="0" cy="15" rx="25" ry="8" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />

              {/* Egg 1 */}
              <g transform="translate(-8, 5) rotate(-15)">
                <ellipse cx="0" cy="0" rx="9" ry="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                {(!isRightSide || isFound('dino-eggs')) ? (
                  // Circular Blue spots
                  <>
                    <circle cx="-3" cy="-4" r="2.5" fill="#3b82f6" />
                    <circle cx="3" cy="2" r="2" fill="#3b82f6" />
                    <circle cx="-2" cy="5" r="1.5" fill="#3b82f6" />
                  </>
                ) : (
                  // Zebra Orange stripes
                  <>
                    <line x1="-7" y1="-4" x2="2" y2="-8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="-8" y1="2" x2="4" y2="-2" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="-6" y1="8" x2="6" y2="4" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}
              </g>

              {/* Egg 2 */}
              <g transform="translate(8, 7) rotate(20)">
                <ellipse cx="0" cy="0" rx="9" ry="13" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
                {(!isRightSide || isFound('dino-eggs')) ? (
                  <>
                    <circle cx="2" cy="-5" r="2.5" fill="#3b82f6" />
                    <circle cx="-3" cy="1" r="2" fill="#3b82f6" />
                    <circle cx="2" cy="5" r="1.5" fill="#3b82f6" />
                  </>
                ) : (
                  <>
                    <line x1="-5" y1="-6" x2="4" y2="-10" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="-7" y1="0" x2="5" y2="-4" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="-5" y1="6" x2="7" y2="2" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                )}
              </g>
            </g>

            {/* Difference 4: Pterodactyl Pilot Cap (Target X:45, Y:15) */}
            <g transform="translate(180, 45)">
              {/* Cute Pterodactyl flying */}
              {/* Wings */}
              <path d="M -15 -2 Q -35 -20 -10 -8 Q 15 -20 -5 -2 Z" fill="#a855f7" />

              {/* Body */}
              <ellipse cx="0" cy="0" rx="14" ry="7" fill="#a855f7" />
              {/* Beak */}
              <polygon points="10,-2 24,1 10,4" fill="#facc15" />

              {/* Head (Difference) */}
              {(!isRightSide || isFound('dino-pterodactyl-cap')) ? (
                // Normal purple head with eye
                <>
                  <circle cx="8" cy="-4" r="5" fill="#a855f7" />
                  <circle cx="9" cy="-5" r="1" fill="#000" />
                </>
              ) : (
                // Head wearing leather aviator pilot cap with goggles
                <>
                  <circle cx="8" cy="-4" r="5.5" fill="#78350f" />
                  <rect x="6" y="-7" width="6" height="3" fill="#e2e8f0" rx="1" stroke="#000" strokeWidth="0.5" />
                  <line x1="4" y1="-5" x2="13" y2="-5" stroke="#000" strokeWidth="1" />
                </>
              )}
            </g>

            {/* Difference 5: Fossil Rock Crystal (Target X:15, Y:82) */}
            <g transform="translate(60, 245)">
              {/* Grey rock slab */}
              <path d="M -25 15 L -20 -15 L 20 -10 L 25 15 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
              {/* Shell carving */}
              <path d="M -5 2 Q -2 -5 5 -1" fill="none" stroke="#64748b" strokeWidth="2.5" />

              {/* Crystal (Difference) */}
              {(!isRightSide || isFound('dino-fossil-crystal')) ? (
                // Plain grey stone protrusion
                <polygon points="12,-12 18,-2 14,5 8,-5" fill="#64748b" />
              ) : (
                // Large GLOWING ORANGE wizard crystal
                <g>
                  <polygon points="10,-22 18,-6 14,5 6,-5" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
                  <polygon points="10,-22 14,-6 12,5 6,-5" fill="#fde047" opacity="0.7" />
                  {/* Magic sparkles */}
                  <circle cx="5" cy="-20" r="1.5" fill="#fde047" className="animate-ping" />
                  <circle cx="20" cy="-12" r="1" fill="#fde047" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 4: CANDYLAND ==================== */}
        {level.theme === 'candy' && (
          <>
            {/* Soft pink sky */}
            <rect x="0" y="0" width="400" height="160" fill="#fdf2f8" opacity="0.4" />

            {/* Creamy chocolate river bottom-left */}
            <path d="M 0 200 C 100 200 80 300 200 300 L 0 300 Z" fill="#7c2d12" opacity="0.9" />

            {/* Sweet pink hills */}
            <path d="M 0 240 Q 150 200 300 235 T 400 220 L 400 300 L 0 300 Z" fill="#f472b6" opacity="0.85" />
            <path d="M 0 260 Q 200 240 400 255 L 400 300 L 0 300 Z" fill="#db2777" opacity="0.7" />

            {/* Candy cane decor */}
            <g transform="translate(360, 190)">
              <rect x="-3" y="0" width="6" height="40" fill="#fff" rx="1" />
              <path d="M -3 10 L 3 15 M -3 20 L 3 25 M -3 30 L 3 35" stroke="#ef4444" strokeWidth="2" />
              <path d="M -3 0 Q 3 -15 -10 -10" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Difference 1: Gingerbread Chimney (Target X:30, Y:55) */}
            <g transform="translate(120, 165)">
              {/* Gingerbread Walls */}
              <rect x="-30" y="0" width="60" height="50" rx="6" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
              {/* Frosting Roof */}
              <polygon points="-38,2 0,-30 38,2" fill="#fff" stroke="#e2e8f0" strokeWidth="1" />
              <polygon points="-34,2 0,-24 34,2" fill="#d97706" />

              {/* Door & Window */}
              <rect x="-10" y="18" width="20" height="32" rx="4" fill="#15803d" />
              <circle cx="0" cy="8" r="8" fill="#facc15" stroke="#fff" strokeWidth="1.5" />

              {/* Gumdrops */}
              <circle cx="-25" cy="40" r="5" fill="#ef4444" />
              <circle cx="25" cy="40" r="5" fill="#3b82f6" />

              {/* Chimney (Difference) */}
              {(!isRightSide || isFound('candy-chimney')) ? (
                // Candy-Cane Red & White striped Chimney
                <g transform="translate(-20, -25)">
                  <rect x="-5" y="-8" width="10" height="20" fill="#fff" stroke="#78350f" strokeWidth="1" />
                  <line x1="-5" y1="2" x2="5" y2="-2" stroke="#ef4444" strokeWidth="3.5" />
                  <line x1="-5" y1="-4" x2="5" y2="-8" stroke="#ef4444" strokeWidth="3.5" />
                </g>
              ) : (
                // Plain solid brown gingerbread chimney
                <g transform="translate(-20, -25)">
                  <rect x="-5" y="-8" width="10" height="20" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
                </g>
              )}
            </g>

            {/* Difference 2: Giant Swirl Lollipop (Target X:78, Y:65) */}
            <g transform="translate(310, 195)">
              {/* White Stick */}
              <rect x="-3" y="0" width="6" height="60" fill="#fff" rx="1" />

              {/* Lollipop Swirl Head */}
              {(!isRightSide || isFound('candy-lollipop')) ? (
                // Blue/White Swirl
                <g>
                  <circle cx="0" cy="-22" r="24" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
                  <path d="M 0 -22 A 16 16 0 0 1 12 -12 A 10 10 0 0 0 0 -22" fill="#fff" opacity="0.8" />
                  <path d="M 0 -22 A 16 16 0 0 0 -12 -32 A 10 10 0 0 1 0 -22" fill="#fff" opacity="0.8" />
                </g>
              ) : (
                // Pink/Purple Swirl
                <g>
                  <circle cx="0" cy="-22" r="24" fill="#ec4899" stroke="#be185d" strokeWidth="2" />
                  <path d="M 0 -22 A 16 16 0 0 1 12 -12 A 10 10 0 0 0 0 -22" fill="#c084fc" opacity="0.8" />
                  <path d="M 0 -22 A 16 16 0 0 0 -12 -32 A 10 10 0 0 1 0 -22" fill="#c084fc" opacity="0.8" />
                </g>
              )}
            </g>

            {/* Difference 3: Happy Gummy Bear (Target X:52, Y:80) */}
            <g transform="translate(210, 240)">
              {/* Gummy Bear body layout */}
              {(!isRightSide || isFound('candy-gummybear')) ? (
                // Red Gummy Bear
                <g>
                  {/* Ears */}
                  <circle cx="-10" cy="-14" r="5" fill="#f43f5e" opacity="0.9" />
                  <circle cx="10" cy="-14" r="5" fill="#f43f5e" opacity="0.9" />
                  {/* Legs */}
                  <ellipse cx="-8" cy="15" rx="5" ry="6" fill="#f43f5e" opacity="0.9" />
                  <ellipse cx="8" cy="15" rx="5" ry="6" fill="#f43f5e" opacity="0.9" />
                  {/* Body & Head */}
                  <ellipse cx="0" cy="4" rx="13" ry="12" fill="#f43f5e" opacity="0.9" />
                  <circle cx="0" cy="-8" r="10" fill="#f43f5e" opacity="0.9" />
                  {/* Eyes and snout */}
                  <circle cx="-3" cy="-10" r="1.5" fill="#fff" />
                  <circle cx="3" cy="-10" r="1.5" fill="#fff" />
                  <ellipse cx="0" cy="-6" rx="3.5" ry="2" fill="#fda4af" />
                  {/* Shiny highlights */}
                  <ellipse cx="-5" cy="0" rx="2" ry="4" fill="#fff" opacity="0.4" />
                </g>
              ) : (
                // Lime Green Gummy Bear
                <g>
                  {/* Ears */}
                  <circle cx="-10" cy="-14" r="5" fill="#84cc16" opacity="0.9" />
                  <circle cx="10" cy="-14" r="5" fill="#84cc16" opacity="0.9" />
                  {/* Legs */}
                  <ellipse cx="-8" cy="15" rx="5" ry="6" fill="#84cc16" opacity="0.9" />
                  <ellipse cx="8" cy="15" rx="5" ry="6" fill="#84cc16" opacity="0.9" />
                  {/* Body & Head */}
                  <ellipse cx="0" cy="4" rx="13" ry="12" fill="#84cc16" opacity="0.9" />
                  <circle cx="0" cy="-8" r="10" fill="#84cc16" opacity="0.9" />
                  {/* Eyes and snout */}
                  <circle cx="-3" cy="-10" r="1.5" fill="#fff" />
                  <circle cx="3" cy="-10" r="1.5" fill="#fff" />
                  <ellipse cx="0" cy="-6" rx="3.5" ry="2" fill="#bef264" />
                  {/* Shiny highlights */}
                  <ellipse cx="-5" cy="0" rx="2" ry="4" fill="#fff" opacity="0.4" />
                </g>
              )}
            </g>

            {/* Difference 4: Marshmallow Cloud Face (Target X:50, Y:15) */}
            <g transform="translate(200, 45)">
              {/* Fluffy Marshmallow Cloud Body */}
              <path
                d="M -25 10 A 15 15 0 0 1 -10 -15 A 22 22 0 0 1 20 -15 A 15 15 0 0 1 30 10 Z"
                fill="#fff"
                stroke="#fda4af"
                strokeWidth="1.5"
              />

              {/* Cloud Face (Difference) */}
              {(!isRightSide || isFound('candy-cloud-face')) ? (
                // Sleeping with "Zzz"
                <g>
                  <path d="M -8 -2 Q -5 1 -2 -2" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 2 -2 Q 5 1 8 -2" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                  <g transform="translate(24, -20)">
                    <text x="0" y="0" fill="#ec4899" fontSize="9" fontWeight="bold" className="animate-pulse">Z</text>
                    <text x="6" y="-6" fill="#f472b6" fontSize="6" fontWeight="bold">z</text>
                  </g>
                </g>
              ) : (
                // Wide Awake and Smiling
                <g>
                  {/* Big cute open cartoon eyes */}
                  <circle cx="-6" cy="-4" r="3.5" fill="#f43f5e" />
                  <circle cx="-5.5" cy="-5" r="1" fill="#fff" />
                  <circle cx="6" cy="-4" r="3.5" fill="#f43f5e" />
                  <circle cx="6.5" cy="-5" r="1" fill="#fff" />
                  {/* Smiling cheeks blush */}
                  <circle cx="-12" cy="0" r="3" fill="#f472b6" opacity="0.6" />
                  <circle cx="12" cy="0" r="3" fill="#f472b6" opacity="0.6" />
                  {/* Happy mouth */}
                  <path d="M -4 1 Q 0 6 4 1" fill="none" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
            </g>

            {/* Difference 5: Floating Lake Fruit (Target X:15, Y:78) */}
            <g transform="translate(60, 235)">
              {/* Bubbles on Chocolate river */}
              <circle cx="-20" cy="20" r="2" fill="#fff" opacity="0.2" />
              <circle cx="20" cy="15" r="3" fill="#fff" opacity="0.15" />

              {/* Floating Fruit (Difference) */}
              {(!isRightSide || isFound('candy-lake-fruit')) ? (
                // Bright Red Cherry
                <g transform="translate(0, 5)">
                  {/* Stem */}
                  <path d="M 0 -10 Q 15 -25 18 -15" fill="none" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Body */}
                  <circle cx="0" cy="-5" r="8" fill="#e11d48" />
                  <circle cx="-2" cy="-7" r="2" fill="#fff" opacity="0.6" />
                </g>
              ) : (
                // Strawberry with green hat
                <g transform="translate(0, 5)">
                  {/* Leaf hat */}
                  <polygon points="-7,-11 0,-6 7,-11 3,-4 -3,-4" fill="#22c55e" />
                  {/* Body */}
                  <path d="M -6 -5 C -8 3 0 12 0 12 C 0 12 8 3 6 -5 Z" fill="#ef4444" />
                  {/* Seeds */}
                  <circle cx="-2" cy="-1" r="0.7" fill="#fef08a" />
                  <circle cx="2" cy="1" r="0.7" fill="#fef08a" />
                  <circle cx="0" cy="5" r="0.7" fill="#fef08a" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 5: TOYS ==================== */}
        {level.theme === 'toys' && (
          <>
            {/* Playroom Wallpaper */}
            <rect x="0" y="0" width="400" height="150" fill="#ecfeff" opacity="0.3" />
            {/* Rainbow Arch */}
            <path d="M 120 180 A 80 80 0 0 1 280 180" fill="none" stroke="#fecdd3" strokeWidth="6" opacity="0.4" />
            <path d="M 126 180 A 74 74 0 0 1 274 180" fill="none" stroke="#fef08a" strokeWidth="6" opacity="0.4" />
            <path d="M 132 180 A 68 68 0 0 1 268 180" fill="none" stroke="#ccfbf1" strokeWidth="6" opacity="0.4" />

            {/* Wooden Playroom Floor */}
            <rect x="0" y="180" width="400" height="120" fill="#fef3c7" opacity="0.8" />
            <line x1="0" y1="210" x2="400" y2="210" stroke="#d97706" strokeWidth="1" opacity="0.3" />
            <line x1="0" y1="250" x2="400" y2="250" stroke="#d97706" strokeWidth="1" opacity="0.3" />

            {/* Building Blocks */}
            <g transform="translate(60, 215)">
              <rect x="-15" y="-15" width="30" height="30" fill="#ef4444" rx="2" />
              <text x="0" y="5" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">A</text>
            </g>
            <g transform="translate(90, 215)">
              <rect x="-15" y="-15" width="30" height="30" fill="#3b82f6" rx="2" />
              <text x="0" y="5" fill="#fff" fontSize="16" fontWeight="bold" textAnchor="middle">B</text>
            </g>

            {/* Difference 1: Teddy Bear Badge (Target X:22, Y:65) */}
            <g transform="translate(88, 195)">
              {/* Teddy Ears */}
              <circle cx="-16" cy="-16" r="8" fill="#92400e" />
              <circle cx="-16" cy="-16" r="4.5" fill="#fda4af" />
              <circle cx="16" cy="-16" r="8" fill="#92400e" />
              <circle cx="16" cy="-16" r="4.5" fill="#fda4af" />

              {/* Teddy Arms/Legs */}
              <ellipse cx="-18" cy="8" rx="6" ry="10" fill="#92400e" />
              <ellipse cx="18" cy="8" rx="6" ry="10" fill="#92400e" />
              <circle cx="-12" cy="24" r="7" fill="#92400e" />
              <circle cx="12" cy="24" r="7" fill="#92400e" />

              {/* Teddy Body & Head */}
              <circle cx="0" cy="10" r="18" fill="#92400e" />
              <circle cx="0" cy="-10" r="15" fill="#92400e" />

              {/* Face Details */}
              <circle cx="-5" cy="-12" r="1.5" fill="#000" />
              <circle cx="5" cy="-12" r="1.5" fill="#000" />
              <ellipse cx="0" cy="-8" rx="5" ry="3.5" fill="#fef08a" />
              <polygon points="-2,-9 2,-9 0,-7" fill="#000" />

              {/* Chest Badge (Difference) */}
              {(!isRightSide || isFound('toy-teddy-badge')) ? (
                // Bright golden Star Badge
                <g transform="translate(0, 8)">
                  <polygon points="0,-6 2,-2 6,-2 3,1 4,5 0,3 -4,5 -3,1 -6,-2 -2,-2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                </g>
              ) : (
                // Blue Heart Badge
                <g transform="translate(0, 8)">
                  <path d="M 0 -3 C -3 -6 -6 -3 -3 2 L 0 5 L 3 2 C 6 -3 3 -6 0 -3" fill="#3b82f6" />
                </g>
              )}
            </g>

            {/* Difference 2: Toy Robot's Gift (Target X:78, Y:65) */}
            <g transform="translate(310, 195)">
              {/* Robot Antenna */}
              <line x1="0" y1="-18" x2="0" y2="-28" stroke="#64748b" strokeWidth="2.5" />
              <circle cx="0" cy="-28" r="3" fill="#ef4444" />

              {/* Robot Legs */}
              <rect x="-10" y="16" width="6" height="15" fill="#475569" rx="1" />
              <rect x="4" y="16" width="6" height="15" fill="#475569" rx="1" />

              {/* Robot Head & Body */}
              <rect x="-15" y="-18" width="30" height="15" rx="2" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
              <rect x="-18" y="-3" width="36" height="20" rx="3" fill="#64748b" stroke="#334155" strokeWidth="1.5" />

              {/* Robot Eye screens */}
              <rect x="-10" y="-15" width="7" height="4" fill="#38bdf8" />
              <rect x="3" y="-15" width="7" height="4" fill="#38bdf8" />

              {/* Wind-up Key on Back */}
              <path d="M -18 7 L -24 7 C -27 4 -27 10 -24 10 Z" fill="#d97706" />

              {/* Arm holding item */}
              <path d="M 18 5 L 28 0" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" />

              {/* Gift Item (Difference) */}
              {(!isRightSide || isFound('toy-robot-item')) ? (
                // Red floating balloon
                <g transform="translate(32, -18)">
                  <line x1="-4" y1="18" x2="0" y2="4" stroke="#94a3b8" strokeWidth="1" />
                  <ellipse cx="0" cy="0" rx="7" ry="10" fill="#ef4444" />
                  <polygon points="-1,10 1,10 0,12" fill="#ef4444" />
                </g>
              ) : (
                // Mini cartoon Banana!
                <g transform="translate(28, -8) rotate(45)">
                  <path d="M -4 -8 Q 4 4 12 -4 Q 6 1 -4 -8" fill="#eab308" stroke="#ca8a04" strokeWidth="0.5" />
                  <rect x="-5" y="-10" width="2" height="3" fill="#78350f" />
                </g>
              )}
            </g>

            {/* Difference 3: Choo-Choo Train Number (Target X:50, Y:78) */}
            <g transform="translate(200, 235)">
              {/* Train Track */}
              <line x1="-50" y1="28" x2="50" y2="28" stroke="#475569" strokeWidth="3" />
              <line x1="-30" y1="24" x2="-30" y2="32" stroke="#475569" strokeWidth="2" />
              <line x1="0" y1="24" x2="0" y2="32" stroke="#475569" strokeWidth="2" />
              <line x1="30" y1="24" x2="30" y2="32" stroke="#475569" strokeWidth="2" />

              {/* Wheels */}
              <circle cx="-20" cy="18" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="20" cy="18" r="8" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />

              {/* Engine Boiler & Cabin */}
              <rect x="-35" y="-12" width="55" height="24" fill="#1d4ed8" rx="2" />
              <rect x="5" y="-24" width="22" height="36" fill="#dc2626" rx="2" />
              {/* Chimney */}
              <rect x="-26" y="-24" width="8" height="14" fill="#1e293b" />
              <polygon points="-28,-24 -20,-24 -18,-29 -30,-29" fill="#facc15" />

              {/* Cabin window */}
              <rect x="10" y="-18" width="12" height="12" fill="#e2e8f0" rx="1" />

              {/* Painted number (Difference) */}
              {(!isRightSide || isFound('toy-train-number')) ? (
                // Number 5
                <text x="-10" y="5" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">5</text>
              ) : (
                // Number 3
                <text x="-10" y="5" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">3</text>
              )}
            </g>

            {/* Difference 4: Spinning Top Sparkles (Target X:50, Y:40) */}
            <g transform="translate(200, 120)">
              {/* Spinning Top shape */}
              <ellipse cx="0" cy="8" rx="16" ry="6" fill="#f97316" />
              <polygon points="-16,8 16,8 0,22" fill="#f59e0b" />
              <rect x="-3" y="-8" width="6" height="16" fill="#84cc16" rx="1.5" />
              <circle cx="0" cy="-9" r="4" fill="#a855f7" />

              {/* Sparkles (Difference) */}
              {(!isRightSide || isFound('toy-top-sparkles')) ? (
                // Yellow sparkles
                <g>
                  <circle cx="-22" cy="2" r="1.5" fill="#facc15" className="animate-ping" />
                  <polygon points="22,2 24,5 27,2 24,-1" fill="#facc15" />
                  <circle cx="-12" cy="18" r="1" fill="#facc15" />
                  <polygon points="14,18 16,21 19,18 16,15" fill="#fde047" />
                </g>
              ) : (
                // Neon purple sparkles
                <g>
                  <circle cx="-22" cy="2" r="1.5" fill="#e879f9" className="animate-ping" />
                  <polygon points="22,2 24,5 27,2 24,-1" fill="#e879f9" />
                  <circle cx="-12" cy="18" r="1" fill="#e879f9" />
                  <polygon points="14,18 16,21 19,18 16,15" fill="#f472b6" />
                </g>
              )}
            </g>

            {/* Difference 5: Hanging Mobile Shapes (Target X:30, Y:18) */}
            <g transform="translate(120, 55)">
              {/* Ceiling string */}
              <line x1="0" y1="-55" x2="0" y2="-10" stroke="#cbd5e1" strokeWidth="1.5" />
              {/* Wood hanger hanger */}
              <line x1="-35" y1="-10" x2="35" y2="-10" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />

              {/* Dangling strings */}
              <line x1="-25" y1="-10" x2="-25" y2="15" stroke="#94a3b8" strokeWidth="1" />
              <line x1="0" y1="-10" x2="0" y2="22" stroke="#94a3b8" strokeWidth="1" />
              <line x1="25" y1="-10" x2="25" y2="15" stroke="#94a3b8" strokeWidth="1" />

              {/* Dangling items (Difference) */}
              {/* Left & Middle are always gold stars */}
              <g transform="translate(-25, 15)">
                <polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3.5,4.5 0,2 -3.5,4.5 -2,1 -5,-1.5 -1.5,-1.5" fill="#fbbf24" />
              </g>
              <g transform="translate(0, 22)">
                <polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3.5,4.5 0,2 -3.5,4.5 -2,1 -5,-1.5 -1.5,-1.5" fill="#fbbf24" />
              </g>

              {/* Right item */}
              {(!isRightSide || isFound('toy-mobile-danglers')) ? (
                // Gold star on right
                <g transform="translate(25, 15)">
                  <polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3.5,4.5 0,2 -3.5,4.5 -2,1 -5,-1.5 -1.5,-1.5" fill="#fbbf24" />
                </g>
              ) : (
                // Golden Crescent Moon on right
                <g transform="translate(25, 15) rotate(15)">
                  <path d="M -4 -4 A 5 5 0 0 0 4 4 A 4 4 0 0 1 -4 -4" fill="#fbbf24" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 6: WIZARD ATTIC ==================== */}
        {level.theme === 'magic' && (
          <>
            {/* Mystic starry ceiling */}
            <rect x="0" y="0" width="400" height="120" fill="#1e1b4b" opacity="0.4" />
            <circle cx="50" cy="30" r="1" fill="#fff" opacity="0.8" className="animate-pulse" />
            <circle cx="150" cy="20" r="1.5" fill="#fff" opacity="0.6" />
            <circle cx="350" cy="40" r="1" fill="#fff" opacity="0.8" />

            {/* Wooden floor */}
            <rect x="0" y="210" width="400" height="90" fill="#451a03" />
            <line x1="0" y1="240" x2="400" y2="240" stroke="#270b00" strokeWidth="1.5" />

            {/* Wooden shelf on left */}
            <rect x="10" y="60" width="80" height="10" fill="#78350f" rx="1" />
            {/* Shelf supports */}
            <rect x="20" y="70" width="6" height="10" fill="#451a03" />
            <rect x="64" y="70" width="6" height="10" fill="#451a03" />

            {/* Wooden desk on floor */}
            <rect x="150" y="200" width="100" height="15" fill="#854d0e" rx="1" />
            <rect x="165" y="215" width="10" height="25" fill="#713f12" />
            <rect x="225" y="215" width="10" height="25" fill="#713f12" />

            {/* Difference 1: Witch's Hat Stars (Target X:32, Y:48) */}
            <g transform="translate(128, 145)">
              {/* Little wooden stool */}
              <rect x="-15" y="28" width="30" height="6" fill="#a16207" rx="1" />
              <rect x="-10" y="34" width="4" height="18" fill="#713f12" />
              <rect x="6" y="34" width="4" height="18" fill="#713f12" />

              {/* Hat brim */}
              <ellipse cx="0" cy="24" rx="26" ry="6" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1" />

              {/* Hat body pointed cone */}
              <path d="M -16 22 L 0 -18 L 16 22 Z" fill="#1e1b4b" stroke="#0f172a" strokeWidth="1.5" />
              {/* Hat Ribbon */}
              <path d="M -15 18 Q 0 20 15 18 L 15 22 Q 0 24 -15 22 Z" fill="#b91c1c" />

              {/* Hat Pattern (Difference) */}
              {(!isRightSide || isFound('magic-hat-stars')) ? (
                // Golden Stars
                <g>
                  <polygon points="0,-1 1.5,2 4,2 2,4 3,7 0,5 -3,7 -2,4 -4,2 -1.5,2" fill="#fbbf24" />
                  <polygon points="-7,10 -5.5,13 -3,13 -5,15 -4,18 -7,16 -10,18 -9,15 -11,13 -8.5,13" fill="#fbbf24" transform="scale(0.7) translate(-5, 0)" />
                  <polygon points="7,10 8.5,13 11,13 9,15 10,18 7,16 4,18 5,15 3,13 5.5,13" fill="#fbbf24" transform="scale(0.7) translate(5, 0)" />
                </g>
              ) : (
                // Neon Blue Stars
                <g>
                  <polygon points="0,-1 1.5,2 4,2 2,4 3,7 0,5 -3,7 -2,4 -4,2 -1.5,2" fill="#38bdf8" />
                  <polygon points="-7,10 -5.5,13 -3,13 -5,15 -4,18 -7,16 -10,18 -9,15 -11,13 -8.5,13" fill="#38bdf8" transform="scale(0.7) translate(-5, 0)" />
                  <polygon points="7,10 8.5,13 11,13 9,15 10,18 7,16 4,18 5,15 3,13 5.5,13" fill="#38bdf8" transform="scale(0.7) translate(5, 0)" />
                </g>
              )}
            </g>

            {/* Difference 2: Crystal Ball Vision (Target X:76, Y:75) */}
            <g transform="translate(304, 225)">
              {/* Gold pedestal stand */}
              <rect x="-12" y="16" width="24" height="6" fill="#d97706" rx="1" />
              <path d="M -8 16 L -12 6 L 12 6 L 8 16 Z" fill="#f59e0b" />

              {/* Crystal Ball Outer glass */}
              <circle cx="0" cy="-2" r="20" fill="#a78bfa" opacity="0.3" stroke="#e9d5ff" strokeWidth="2" />
              <circle cx="-5" cy="-7" r="4" fill="#fff" opacity="0.5" />

              {/* Inner magic swirls and sign (Difference) */}
              {(!isRightSide || isFound('magic-crystal-vision')) ? (
                // Question Mark Symbol inside mist
                <g>
                  <circle cx="0" cy="-2" r="14" fill="#c084fc" opacity="0.4" />
                  <text x="0" y="3" fill="#fff" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="serif" className="animate-pulse">?</text>
                </g>
              ) : (
                // Banana Mascot Symbol inside mist
                <g>
                  <circle cx="0" cy="-2" r="14" fill="#fbbf24" opacity="0.4" />
                  {/* Miniature banana outline */}
                  <path d="M -4 -6 Q 2 4 8 -2 Q 4 1 -4 -6" fill="#fff" stroke="#f59e0b" strokeWidth="1" />
                </g>
              )}
            </g>

            {/* Difference 3: Open Spellbook Crest (Target X:50, Y:70) */}
            <g transform="translate(200, 210)">
              {/* Stand holding book */}
              <polygon points="-24,10 24,10 18,2 12,2" fill="#78350f" />

              {/* Open Spellbook pages */}
              <path d="M -22 -12 L -2 -10 L -2 5 L -22 3 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              <path d="M 22 -12 L 2 -10 L 2 5 L 22 3 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              {/* Leather cover sticking out */}
              <path d="M -24 -11 L -22 -13 L 0 -11 L 22 -13 L 24 -11 L 24 5 L 0 7 L -24 5 Z" fill="none" stroke="#78350f" strokeWidth="2" />

              {/* Simulated text lines on left page */}
              <line x1="-18" y1="-5" x2="-6" y2="-4" stroke="#ca8a04" strokeWidth="1.5" />
              <line x1="-18" y1="0" x2="-8" y2="1" stroke="#ca8a04" strokeWidth="1.5" />

              {/* Illustration on Right Page (Difference) */}
              {(!isRightSide || isFound('magic-spellbook')) ? (
                // Glowing Sun illustration
                <g transform="translate(12, -2)">
                  <circle cx="0" cy="0" r="4.5" fill="#f97316" />
                  <line x1="-7" y1="0" x2="7" y2="0" stroke="#f97316" strokeWidth="1" />
                  <line x1="0" y1="-7" x2="0" y2="7" stroke="#f97316" strokeWidth="1" />
                </g>
              ) : (
                // Glowing Crescent Moon illustration
                <g transform="translate(12, -2)">
                  <path d="M -3 -3 A 4 4 0 0 0 3 3 A 3 3 0 0 1 -3 -3" fill="#a855f7" />
                </g>
              )}
            </g>

            {/* Difference 4: Guard Owl's Eyes (Target X:18, Y:22) */}
            <g transform="translate(72, 65)">
              {/* Shelf location */}
              {/* Owl Body */}
              <ellipse cx="0" cy="-14" rx="11" ry="14" fill="#9a3412" />
              <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#fed7aa" />

              {/* Owl Ears (Feather tufts) */}
              <polygon points="-9,-26 -6,-28 -3,-24" fill="#9a3412" />
              <polygon points="9,-26 6,-28 3,-24" fill="#9a3412" />

              {/* Beak */}
              <polygon points="-2,-13 2,-13 0,-10" fill="#f97316" />

              {/* Wings */}
              <path d="M -11 -20 Q -15 -10 -11 -2" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />
              <path d="M 11 -20 Q 15 -10 11 -2" fill="none" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round" />

              {/* Little claws */}
              <line x1="-4" y1="0" x2="-4" y2="3" stroke="#000" strokeWidth="1.5" />
              <line x1="4" y1="0" x2="4" y2="3" stroke="#000" strokeWidth="1.5" />

              {/* Eyes (Difference) */}
              {(!isRightSide || isFound('magic-owl-eyes')) ? (
                // Wide awake, cute blinking winking look
                <>
                  {/* Left Eye: Awake */}
                  <circle cx="-5" cy="-18" r="4.5" fill="#facc15" />
                  <circle cx="-5" cy="-18" r="1.5" fill="#000" />
                  {/* Right Eye: Wink */}
                  <path d="M 3 -18 Q 5 -20 7 -18" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                // Sleeping closed eyes (sweet curves)
                <>
                  <path d="M -7 -18 Q -5 -20 -3 -18" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 3 -18 Q 5 -20 7 -18" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}
            </g>

            {/* Difference 5: Bubbling Potion Bottle (Target X:82, Y:25) */}
            <g transform="translate(328, 75)">
              {/* Cozy wooden shelf support */}
              {/* Bottle Neck and Cork */}
              <rect x="-3" y="-18" width="6" height="8" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              <rect x="-4" y="-22" width="8" height="4" fill="#b45309" rx="1" />

              {/* Bottle round flask body */}
              <circle cx="0" cy="-3" r="12" fill="#e2e8f0" opacity="0.3" stroke="#475569" strokeWidth="1.5" />
              <circle cx="-3" cy="-7" r="2.5" fill="#fff" opacity="0.6" />

              {/* Liquid content (Difference) */}
              {(!isRightSide || isFound('magic-potion')) ? (
                // Bubbling Toxic Green Fluid
                <g>
                  <path d="M -10 -1 A 10 10 0 0 0 10 -1 Z" fill="#22c55e" />
                  <circle cx="-4" cy="-3" r="1.5" fill="#fff" opacity="0.6" />
                  <circle cx="2" cy="-2" r="1" fill="#fff" opacity="0.6" />
                  {/* Bubbles floating above */}
                  <circle cx="-3" cy="-12" r="1" fill="#22c55e" className="animate-bounce" />
                  <circle cx="4" cy="-10" r="1.5" fill="#22c55e" />
                </g>
              ) : (
                // Glowing Amethyst Purple Fluid
                <g>
                  <path d="M -10 -1 A 10 10 0 0 0 10 -1 Z" fill="#a855f7" />
                  <circle cx="-4" cy="-3" r="1.5" fill="#fff" opacity="0.6" />
                  <circle cx="2" cy="-2" r="1" fill="#fff" opacity="0.6" />
                  {/* Bubbles floating above */}
                  <circle cx="-3" cy="-12" r="1" fill="#a855f7" className="animate-bounce" />
                  <circle cx="4" cy="-10" r="1.5" fill="#a855f7" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 7: RETRO ARCADE ==================== */}
        {level.theme === 'arcade' && (
          <>
            {/* Dark Synthwave Background Grid */}
            <rect x="0" y="0" width="400" height="300" fill="#0c0a0f" />
            
            {/* Grid lines */}
            <g stroke="#1e152a" strokeWidth="1">
              <line x1="50" y1="0" x2="50" y2="300" />
              <line x1="100" y1="0" x2="100" y2="300" />
              <line x1="150" y1="0" x2="150" y2="300" />
              <line x1="200" y1="0" x2="200" y2="300" stroke="#f43f5e" strokeWidth="1.5" opacity="0.3" />
              <line x1="250" y1="0" x2="250" y2="300" />
              <line x1="300" y1="0" x2="300" y2="300" />
              <line x1="350" y1="0" x2="350" y2="300" />
              
              <line x1="0" y1="50" x2="400" y2="50" />
              <line x1="0" y1="100" x2="400" y2="100" />
              <line x1="0" y1="150" x2="400" y2="150" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#a855f7" strokeWidth="1.5" opacity="0.3" />
              <line x1="0" y1="250" x2="400" y2="250" />
            </g>

            {/* Neon Border glow */}
            <rect x="4" y="4" width="392" height="292" fill="none" stroke="#d946ef" strokeWidth="4" rx="16" opacity="0.6" />

            {/* Difference 3: High Score digits */}
            <g transform="translate(200, 54)">
              {/* Neon Score Header */}
              <text x="0" y="-14" fill="#ec4899" fontSize="10" fontWeight="black" textAnchor="middle" fontFamily="monospace" letterSpacing="2">HIGH SCORE</text>
              {/* Digital bezel */}
              <rect x="-45" y="-6" width="90" height="16" fill="#180828" stroke="#a855f7" strokeWidth="1.5" rx="4" />
              {(!isRightSide || isFound('arcade-highscore')) ? (
                <text x="0" y="6" fill="#22c55e" fontSize="11" fontWeight="black" textAnchor="middle" fontFamily="monospace" letterSpacing="1">99990</text>
              ) : (
                <text x="0" y="6" fill="#22c55e" fontSize="11" fontWeight="black" textAnchor="middle" fontFamily="monospace" letterSpacing="1">99999</text>
              )}
            </g>

            {/* Difference 2: Ghost Eye Direction */}
            <g transform="translate(100, 105)">
              {/* Retro Pixel Ghost Body */}
              <path d="M -16 12 L -16 -6 A 16 16 0 0 1 16 -6 L 16 12 L 10 6 L 4 12 L -2 6 L -8 12 Z" fill="#8b5cf6" />
              {/* White eyes base */}
              <circle cx="-6" cy="-2" r="4.5" fill="#fff" />
              <circle cx="6" cy="-2" r="4.5" fill="#fff" />
              
              {/* Pupils */}
              {(!isRightSide || isFound('arcade-ghost')) ? (
                <>
                  <circle cx="-8" cy="-2" r="2" fill="#2563eb" />
                  <circle cx="4" cy="-2" r="2" fill="#2563eb" />
                </>
              ) : (
                <>
                  <circle cx="-4" cy="-2" r="2" fill="#2563eb" />
                  <circle cx="8" cy="-2" r="2" fill="#2563eb" />
                </>
              )}
            </g>

            {/* Difference 4: Space Invader Arms */}
            <g transform="translate(60, 195)">
              <rect x="-18" y="-12" width="36" height="24" fill="#06b6d4" opacity="0.2" rx="4" />
              {(!isRightSide || isFound('arcade-invader')) ? (
                <path d="M-12,-8 L-6,-8 L-6,-4 L6,-4 L6,-8 L12,-8 L12,0 L6,0 L6,4 L10,8 L6,8 L4,4 L-4,4 L-6,8 L-10,8 L-6,0 L-12,0 Z" fill="#06b6d4" />
              ) : (
                <path d="M-12,8 L-12,0 L-6,-4 L6,-4 L12,0 L12,8 L6,8 L6,0 L4,4 L-4,4 L-6,0 L-6,8 Z" fill="#06b6d4" />
              )}
              <rect x="-4" y="-2" width="2" height="2" fill="#facc15" />
              <rect x="2" y="-2" width="2" height="2" fill="#facc15" />
            </g>

            {/* Difference 1: Joystick Knob Shape */}
            <g transform="translate(200, 216)">
              <ellipse cx="0" cy="24" rx="45" ry="12" fill="#1e1e2e" stroke="#313244" strokeWidth="2" />
              <line x1="0" y1="20" x2="0" y2="-4" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              <line x1="0" y1="20" x2="0" y2="-4" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
              {(!isRightSide || isFound('arcade-joystick')) ? (
                <circle cx="0" cy="-12" r="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
              ) : (
                <rect x="-10" y="-22" width="20" height="20" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" rx="2" />
              )}
              <circle cx="-3" cy="-15" r="3" fill="#fecaca" opacity="0.6" />
            </g>

            {/* Difference 5: Insert Coin Light */}
            <g transform="translate(320, 246)">
              <rect x="-30" y="-20" width="60" height="40" fill="#1e1e2e" stroke="#45475a" strokeWidth="2" rx="6" />
              {(!isRightSide || isFound('arcade-coin-glow')) ? (
                <g>
                  <rect x="-18" y="-10" width="12" height="20" fill="#fda4af" stroke="#f43f5e" strokeWidth="2" rx="2" />
                  <rect x="-14" y="-6" width="4" height="12" fill="#e11d48" />
                </g>
              ) : (
                <g>
                  <rect x="-18" y="-10" width="12" height="20" fill="#313244" stroke="#45475a" strokeWidth="2" rx="2" />
                  <rect x="-14" y="-6" width="4" height="12" fill="#11111b" />
                </g>
              )}
              <g>
                <rect x="6" y="-10" width="12" height="20" fill="#fed7aa" stroke="#f97316" strokeWidth="2" rx="2" />
                <rect x="10" y="-6" width="4" height="12" fill="#ea580c" />
              </g>
              <text x="0" y="16" fill="#a6adc8" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">25¢ TO PLAY</text>
            </g>
          </>
        )}

        {/* ==================== THEME 8: DESERT OASIS ==================== */}
        {level.theme === 'desert' && (
          <>
            {/* Sky gradient background */}
            <rect x="0" y="0" width="400" height="300" fill="#ff7e5f" />
            <ellipse cx="60" cy="60" rx="30" ry="10" fill="#feb47b" opacity="0.6" />
            <ellipse cx="320" cy="80" rx="45" ry="14" fill="#feb47b" opacity="0.4" />

            <path d="M 120 180 L 160 120 L 200 180 Z" fill="#b15050" opacity="0.5" />
            <path d="M 170 180 L 230 100 L 290 180 Z" fill="#b15050" opacity="0.4" />

            {/* Palace Dome on right side background */}
            <g transform="translate(320, 45)">
              <rect x="-30" y="30" width="60" height="60" fill="#d97706" opacity="0.8" />
              <path d="M -20 30 Q 0 -5 20 30 Z" fill="#f59e0b" />
              <rect x="-5" y="-10" width="10" height="40" fill="#b45309" />
              <path d="M -8 -10 Q 0 -22 8 -10 Z" fill="#f59e0b" />
              <line x1="0" y1="-22" x2="0" y2="-40" stroke="#f59e0b" strokeWidth="2" />
              {(!isRightSide || isFound('desert-flag-dir')) ? (
                <polygon points="0,-40 -18,-33 0,-26" fill="#ef4444" />
              ) : (
                <polygon points="0,-40 18,-33 0,-26" fill="#ef4444" />
              )}
            </g>

            {/* Sand dunes foreground */}
            <path d="M 0 200 Q 120 160 240 210 T 400 220 L 400 300 L 0 300 Z" fill="#eab308" />
            <path d="M 0 240 Q 150 200 300 250 T 400 270 L 400 300 L 0 300 Z" fill="#ca9e16" />

            {/* Difference 3: Sunny Face style */}
            <g transform="translate(200, 54)">
              <circle cx="0" cy="0" r="25" fill="#f97316" className="animate-pulse" />
              <circle cx="0" cy="0" r="21" fill="#fbbf24" />
              <path d="M 0 -32 L 0 -24 M 0 24 L 0 32 M -32 0 L -24 0 M 24 0 L 32 0 M -22 -22 L -16 -16 M 16 16 L 22 22 M -22 22 L -16 16 M 16 -16 L 22 -22" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
              {(!isRightSide || isFound('desert-sun-style')) ? (
                <g>
                  <circle cx="-6" cy="-4" r="2.5" fill="#451a03" />
                  <circle cx="6" cy="-4" r="2.5" fill="#451a03" />
                  <path d="M -8 4 Q 0 12 8 4" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ) : (
                <g>
                  <polygon points="-14,-8 -1,-8 -2,-1 1,-1 2,-8 14,-8 12,2 2,2 -2,2 -12,2" fill="#1e293b" />
                  <line x1="-12" y1="-5" x2="12" y2="-5" stroke="#1e293b" strokeWidth="2" />
                  <path d="M -5 8 Q 2 11 5 6" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              )}
            </g>

            {/* Difference 1: Camel Humps */}
            <g transform="translate(80, 225)">
              <line x1="-10" y1="10" x2="-12" y2="30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="-4" y1="10" x2="-4" y2="30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="8" y1="10" x2="6" y2="30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="14" y1="10" x2="16" y2="30" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M -16 6 Q -26 -10 -20 -22 Q -15 -25 -12 -18 Q -10 -10 -10 6 Z" fill="#d97706" stroke="#b45309" strokeWidth="1" />
              <circle cx="-16" cy="-18" r="1.5" fill="#000" />
              {(!isRightSide || isFound('desert-camel')) ? (
                <g>
                  <ellipse cx="2" cy="6" rx="18" ry="11" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                  <circle cx="2" cy="-6" r="10" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                </g>
              ) : (
                <g>
                  <ellipse cx="2" cy="6" rx="18" ry="11" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                  <circle cx="-5" cy="-5" r="8" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                  <circle cx="9" cy="-5" r="8" fill="#d97706" stroke="#b45309" strokeWidth="1" />
                </g>
              )}
              <path d="M 20 6 Q 25 12 22 18" fill="none" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Difference 2: Palm Tree Coconuts */}
            <g transform="translate(328, 126)">
              <path d="M 15 80 Q 5 40 -12 0 Q -8 40 5 80 Z" fill="#78350f" />
              <line x1="10" y1="60" x2="1" y2="61" stroke="#451a03" strokeWidth="2" />
              <line x1="5" y1="40" x2="-4" y2="41" stroke="#451a03" strokeWidth="2" />
              <line x1="-1" y1="20" x2="-10" y2="21" stroke="#451a03" strokeWidth="2" />
              <g transform="translate(-12, 0)">
                <path d="M 0 0 Q -40 -15 -80 -5 Q -40 5 0 0" fill="#15803d" />
                <path d="M 0 0 Q 30 -30 65 -25 Q 30 -5 0 0" fill="#166534" />
                <path d="M 0 0 Q -25 -40 -10 -75 Q -5 -40 0 0" fill="#15803d" />
                <path d="M 0 0 Q -50 20 -70 45 Q -30 15 0 0" fill="#166534" />
                <path d="M 0 0 Q 40 20 75 35 Q 30 10 0 0" fill="#15803d" />
              </g>
              {(!isRightSide || isFound('desert-coconuts')) ? (
                <g transform="translate(-12, 0)">
                  <circle cx="-6" cy="4" r="5" fill="#451a03" />
                  <circle cx="4" cy="5" r="5.5" fill="#451a03" />
                  <circle cx="-1" cy="11" r="5" fill="#451a03" />
                </g>
              ) : (
                <g transform="translate(-12, 0)">
                  <circle cx="-6" cy="4" r="5" fill="#451a03" />
                  <circle cx="4" cy="5" r="5.5" fill="#451a03" />
                </g>
              )}
            </g>

            {/* Difference 4: Magic Genie Lamp Sparkle */}
            <g transform="translate(200, 255)">
              <polygon points="-35,14 35,14 25,6 -25,6" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
              <line x1="-33" y1="14" x2="-35" y2="17" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="-28" y1="14" x2="-29" y2="17" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="33" y1="14" x2="35" y2="17" stroke="#fef08a" strokeWidth="1.5" />
              <line x1="28" y1="14" x2="29" y2="17" stroke="#fef08a" strokeWidth="1.5" />
              <path d="M -12 6 Q -12 -2 12 -2 L 10 6 Z" fill="#f59e0b" />
              <circle cx="0" cy="-2" r="3" fill="#f59e0b" />
              <path d="M 10 1 Q 16 -3 14 -7 Q 10 -9 8 -3" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <path d="M -10 2 Q -22 -4 -18 -8 Q -15 -8 -11 0" fill="#f59e0b" />
              {(!isRightSide || isFound('desert-lamp-smoke')) ? (
                <g transform="translate(-18, -12)">
                  <circle cx="0" cy="0" r="5.5" fill="#fef08a" opacity="0.8" />
                  <circle cx="-5" cy="3" r="4" fill="#fef08a" opacity="0.8" />
                  <circle cx="5" cy="2" r="4.5" fill="#fef08a" opacity="0.8" />
                </g>
              ) : (
                <g transform="translate(-18, -12)">
                  <polygon points="0,-7 2,-2 7,-2 3.5,1 5,6 0,3 -5,6 -3.5,1 -7,-2 -2,-2" fill="#fef08a" opacity="0.9" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 9: FOREST ==================== */}
        {level.theme === 'forest' && (
          <>
            {/* Grassy field & Sun */}
            <rect x="0" y="240" width="400" height="60" fill="#15803d" />
            <path d="M -20 250 Q 100 230 220 245 T 420 240 L 400 300 L 0 300 Z" fill="#166534" />
            <circle cx="50" cy="50" r="20" fill="#fef08a" opacity="0.15" />
            <circle cx="50" cy="50" r="15" fill="#fef08a" opacity="0.3" />

            {/* Trees in Background */}
            <path d="M 120 240 L 140 160 L 160 240 Z" fill="#14532d" />
            <path d="M 180 240 L 200 150 L 220 240 Z" fill="#14532d" opacity="0.8" />
            <path d="M 280 240 L 305 140 L 330 240 Z" fill="#14532d" opacity="0.9" />

            {/* Tree Trunk Left (Squirrel sits here) */}
            <rect x="70" y="210" width="35" height="40" fill="#78350f" rx="3" />
            <ellipse cx="87" cy="210" rx="17.5" ry="6" fill="#92400e" />

            {/* Tree Trunk Right (Owl nesting hollow) */}
            <rect x="310" y="100" width="45" height="150" fill="#78350f" rx="4" />
            <ellipse cx="332" cy="100" rx="22.5" ry="8" fill="#92400e" />
            {/* Hollow Hole */}
            <ellipse cx="332" cy="135" rx="10" ry="14" fill="#451a03" />

            {/* Difference 1: Squirrel's Acorn (Target X:22, Y:72) */}
            <g transform="translate(87, 205)">
              {/* Squirrel Body */}
              <ellipse cx="0" cy="5" rx="10" ry="12" fill="#b45309" />
              <circle cx="4" cy="-8" r="6" fill="#b45309" />
              <path d="M -10 12 Q -22 10 -15 -2 Q -8 -4 -10 12" fill="#92400e" /> {/* Tail */}
              <circle cx="6" cy="-9" r="1" fill="#fff" />
              <circle cx="6" cy="-9" r="0.5" fill="#000" />
              {(!isRightSide || isFound('forest-squirrel-acorn')) ? (
                // Holding Acorn
                <g transform="translate(6, 4)">
                  <ellipse cx="0" cy="0" rx="4" ry="5.5" fill="#d97706" />
                  <path d="M -5 -1 L 5 -1 L 3 -4 L -3 -4 Z" fill="#78350f" />
                </g>
              ) : (
                // Holding Red Apple
                <circle cx="6" cy="4" r="4.5" fill="#ef4444" />
              )}
            </g>

            {/* Difference 2: Tree Hollow Owl (Target X:82, Y:45) */}
            <g transform="translate(332, 135)">
              <ellipse cx="0" cy="2" rx="7" ry="9" fill="#a16207" />
              <path d="M -6 -7 L -2 -4 L 2 -4 L 6 -7" fill="none" stroke="#a16207" strokeWidth="2.5" />
              {(!isRightSide || isFound('forest-owl')) ? (
                // Sleeping eyes
                <>
                  <path d="M -4 -1 Q -2 1 0 -1" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                  <path d="M 0 -1 Q 2 1 4 -1" fill="none" stroke="#fef08a" strokeWidth="1.5" />
                </>
              ) : (
                // Wide Awake Eyes
                <>
                  <circle cx="-3.5" cy="-1" r="3.5" fill="#fff" />
                  <circle cx="-3.5" cy="-1" r="1.5" fill="#000" />
                  <circle cx="3.5" cy="-1" r="3.5" fill="#fff" />
                  <circle cx="3.5" cy="-1" r="1.5" fill="#000" />
                </>
              )}
              {/* Beak */}
              <polygon points="0,1 -2,4 2,4" fill="#ea580c" />
            </g>

            {/* Difference 3: Spotted Mushroom (Target X:50, Y:82) */}
            <g transform="translate(200, 245)">
              {/* Stem */}
              <rect x="-5" y="2" width="10" height="15" fill="#f5f5f5" rx="2" />
              {(!isRightSide || isFound('forest-mushroom')) ? (
                // Red cap with white spots
                <>
                  <path d="M -16 2 A 16 16 0 0 1 16 2 Z" fill="#ef4444" />
                  <circle cx="-6" cy="-4" r="2" fill="#fff" />
                  <circle cx="0" cy="-9" r="2.5" fill="#fff" />
                  <circle cx="7" cy="-3" r="1.8" fill="#fff" />
                </>
              ) : (
                // Yellow cap with red spots
                <>
                  <path d="M -16 2 A 16 16 0 0 1 16 2 Z" fill="#facc15" />
                  <circle cx="-6" cy="-4" r="2" fill="#ef4444" />
                  <circle cx="0" cy="-9" r="2.5" fill="#ef4444" />
                  <circle cx="7" cy="-3" r="1.8" fill="#ef4444" />
                </>
              )}
            </g>

            {/* Difference 4: Butterfly Wings (Target X:48, Y:32) */}
            <g transform="translate(192, 96)">
              {/* Body */}
              <ellipse cx="0" cy="0" rx="1.5" ry="8" fill="#1e293b" />
              <line x1="-1" y1="-8" x2="-4" y2="-13" stroke="#1e293b" strokeWidth="1" />
              <line x1="1" y1="-8" x2="4" y2="-13" stroke="#1e293b" strokeWidth="1" />
              {(!isRightSide || isFound('forest-butterfly')) ? (
                // Purple wings with yellow dots
                <>
                  {/* Left wings */}
                  <path d="M -1.5 -3 Q -15 -18 -8 0 Q -15 15 -1.5 3" fill="#a855f7" />
                  <circle cx="-8" cy="-6" r="2" fill="#facc15" />
                  <circle cx="-7" cy="4" r="1.5" fill="#facc15" />
                  {/* Right wings */}
                  <path d="M 1.5 -3 Q 15 -18 8 0 Q 15 15 1.5 3" fill="#a855f7" />
                  <circle cx="8" cy="-6" r="2" fill="#facc15" />
                  <circle cx="7" cy="4" r="1.5" fill="#facc15" />
                </>
              ) : (
                // Plain solid blue wings
                <>
                  <path d="M -1.5 -3 Q -15 -18 -8 0 Q -15 15 -1.5 3" fill="#3b82f6" />
                  <path d="M 1.5 -3 Q 15 -18 8 0 Q 15 15 1.5 3" fill="#3b82f6" />
                </>
              )}
            </g>

            {/* Difference 5: Wooden Signpost (Target X:78, Y:78) */}
            <g transform="translate(312, 234)">
              {/* Post */}
              <rect x="-3" y="10" width="6" height="25" fill="#78350f" />
              {(!isRightSide || isFound('forest-signpost')) ? (
                // Pointing Right
                <path d="M -22 -6 L 15 -6 L 25 2 L 15 10 L -22 10 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
              ) : (
                // Pointing Left
                <path d="M 22 -6 L -15 -6 L -25 2 L -15 10 L 22 10 Z" fill="#92400e" stroke="#78350f" strokeWidth="1.5" />
              )}
              <line x1="-12" y1="2" x2="8" y2="2" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
            </g>
          </>
        )}

        {/* ==================== THEME 10: SAFARI ==================== */}
        {level.theme === 'safari' && (
          <>
            {/* Savannah Grasslands */}
            <rect x="0" y="230" width="400" height="70" fill="#d97706" />
            <path d="M -20 240 Q 120 220 240 240 T 420 230 L 400 300 L 0 300 Z" fill="#b45309" />
            
            {/* Blazing Sun */}
            <circle cx="320" cy="60" r="30" fill="#f59e0b" opacity="0.2" />
            <circle cx="320" cy="60" r="22" fill="#f59e0b" opacity="0.4" />

            {/* Tree branches background */}
            <path d="M 220 230 L 230 140 L 210 90 L 190 75" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
            <path d="M 230 140 L 260 110" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />

            {/* Acacia foliage on right */}
            <g transform="translate(320, 84)">
              {(!isRightSide || isFound('safari-tree-foliage')) ? (
                // Lush green foliage
                <>
                  <ellipse cx="0" cy="0" rx="60" ry="16" fill="#15803d" />
                  <ellipse cx="-20" cy="-8" rx="45" ry="12" fill="#166534" />
                  <ellipse cx="25" cy="-5" rx="40" ry="12" fill="#15803d" />
                </>
              ) : (
                // Autumn Orange/Brown foliage
                <>
                  <ellipse cx="0" cy="0" rx="60" ry="16" fill="#c2410c" />
                  <ellipse cx="-20" cy="-8" rx="45" ry="12" fill="#9a3412" />
                  <ellipse cx="25" cy="-5" rx="40" ry="12" fill="#c2410c" />
                </>
              )}
            </g>

            {/* Difference 1: Giraffe's Neck Spots (Target X:24, Y:45) */}
            <g transform="translate(96, 135)">
              {/* Legs */}
              <line x1="-8" y1="45" x2="-8" y2="95" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="8" y1="45" x2="8" y2="95" stroke="#f59e0b" strokeWidth="4.5" strokeLinecap="round" />
              {/* Body */}
              <ellipse cx="0" cy="40" rx="20" ry="14" fill="#f59e0b" />
              {/* Neck */}
              <path d="M -12 35 L -12 -55 L 0 -55 L 4 35 Z" fill="#f59e0b" />
              {/* Head */}
              <ellipse cx="-6" cy="-60" rx="14" ry="8" fill="#f59e0b" />
              <circle cx="-12" cy="-61" r="1.5" fill="#000" />
              <line x1="2" y1="-62" x2="6" y2="-72" stroke="#f59e0b" strokeWidth="2.5" />
              <line x1="-4" y1="-64" x2="-4" y2="-74" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="6" cy="-73" r="1.5" fill="#78350f" />
              <circle cx="-4" cy="-75" r="1.5" fill="#78350f" />
              {/* Tail */}
              <line x1="18" y1="42" x2="26" y2="65" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="26" cy="66" r="2" fill="#78350f" />

              {/* Neck Spots */}
              {(!isRightSide || isFound('safari-giraffe-spots')) ? (
                // Spotted neck
                <g opacity="0.75">
                  <rect x="-9" y="-45" width="5" height="5" rx="1.5" fill="#92400e" />
                  <rect x="-5" y="-35" width="6" height="5" rx="1.5" fill="#92400e" />
                  <rect x="-8" y="-20" width="5" height="6" rx="1.5" fill="#92400e" />
                  <rect x="-4" y="-10" width="6" height="5" rx="1.5" fill="#92400e" />
                  <rect x="-10" y="5" width="6" height="5" rx="1.5" fill="#92400e" />
                  <rect x="-6" y="18" width="5" height="5" rx="1.5" fill="#92400e" />
                  {/* Body spots */}
                  <rect x="-10" y="36" width="6" height="6" rx="2" fill="#92400e" />
                  <rect x="2" y="42" width="7" height="6" rx="2" fill="#92400e" />
                  <rect x="-4" y="45" width="5" height="5" rx="1.5" fill="#92400e" />
                </g>
              ) : (
                // Plain neck (Only body has spots)
                <g opacity="0.75">
                  <rect x="-10" y="36" width="6" height="6" rx="2" fill="#92400e" />
                  <rect x="2" y="42" width="7" height="6" rx="2" fill="#92400e" />
                  <rect x="-4" y="45" width="5" height="5" rx="1.5" fill="#92400e" />
                </g>
              )}
            </g>

            {/* Difference 2: Lion's Crown (Target X:52, Y:75) */}
            <g transform="translate(208, 205)">
              {/* Tail */}
              <path d="M -18 10 Q -32 5 -25 -10" fill="none" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="-25" cy="-11" r="3.5" fill="#78350f" />
              {/* Lion Body */}
              <ellipse cx="0" cy="8" rx="22" ry="14" fill="#f59e0b" />
              {/* Paws */}
              <rect x="-14" y="18" width="8" height="6" rx="3" fill="#f59e0b" />
              <rect x="6" y="18" width="8" height="6" rx="3" fill="#f59e0b" />
              {/* Mane */}
              <circle cx="12" cy="-5" r="19" fill="#78350f" />
              {/* Head */}
              <circle cx="12" cy="-5" r="13" fill="#f59e0b" />
              {/* Sleeping eyes */}
              <path d="M 6 -5 Q 8 -3 10 -5" fill="none" stroke="#451a03" strokeWidth="1.5" />
              <path d="M 14 -5 Q 16 -3 18 -5" fill="none" stroke="#451a03" strokeWidth="1.5" />
              <polygon points="12,-1 10,1 14,1" fill="#78350f" />

              {/* Crown */}
              {(!isRightSide || isFound('safari-lion-crown')) ? (
                // Wearing crown
                <polygon points="6,-18 10,-24 12,-20 14,-24 18,-18" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              ) : (
                // No crown
                null
              )}
            </g>

            {/* Difference 3: Zebra's Stripes (Target X:78, Y:72) */}
            <g transform="translate(312, 196)">
              {/* Legs */}
              <rect x="-12" y="15" width="5" height="20" fill="#fff" stroke="#1e293b" strokeWidth="1" />
              <rect x="8" y="15" width="5" height="20" fill="#fff" stroke="#1e293b" strokeWidth="1" />
              {/* Zebra Body */}
              <ellipse cx="0" cy="10" rx="18" ry="12" fill="#fff" stroke="#1e293b" strokeWidth="1" />
              {/* Neck & Head */}
              <path d="M -14 6 L -20 -15 L -10 -15 L -6 6 Z" fill="#fff" stroke="#1e293b" strokeWidth="1" />
              <ellipse cx="-16" cy="-18" rx="10" ry="6" fill="#fff" stroke="#1e293b" strokeWidth="1" />
              <circle cx="-19" cy="-19" r="1.5" fill="#000" />

              {/* Stripes */}
              {(!isRightSide || isFound('safari-zebra-stripes')) ? (
                // zebra stripes
                <g stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round">
                  {/* Body stripes */}
                  <line x1="-10" y1="4" x2="-6" y2="15" />
                  <line x1="-4" y1="2" x2="0" y2="16" />
                  <line x1="2" y1="2" x2="6" y2="16" />
                  <line x1="8" y1="4" x2="11" y2="14" />
                  {/* Neck stripes */}
                  <line x1="-17" y1="-8" x2="-10" y2="-6" />
                  <line x1="-15" y1="-1" x2="-8" y2="1" />
                </g>
              ) : (
                // Plain white pony! (No stripes)
                null
              )}
            </g>

            {/* Difference 4: Bird's Beak (Target X:45, Y:24) */}
            <g transform="translate(180, 72)">
              {/* Body */}
              <ellipse cx="0" cy="0" rx="10" ry="7" fill="#fbbf24" />
              <circle cx="6" cy="-4" r="5" fill="#fbbf24" />
              {/* Eye */}
              <circle cx="8" cy="-5" r="1" fill="#000" />
              {/* Tail */}
              <polygon points="-8,2 -16,6 -14,0" fill="#f59e0b" />
              {/* Wing */}
              <path d="M -2 -2 Q -8 -4 -4 4 Z" fill="#f59e0b" />
              {/* Beak with payload */}
              {(!isRightSide || isFound('safari-bird-beak')) ? (
                // Holding a worm
                <>
                  <polygon points="10,-6 15,-4 10,-2" fill="#ea580c" />
                  <path d="M 12 -4 Q 16 -12 20 -6" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                </>
              ) : (
                // Holding a flower
                <>
                  <polygon points="10,-6 15,-4 10,-2" fill="#ea580c" />
                  <circle cx="15" cy="-4" r="2.5" fill="#ec4899" />
                  <circle cx="17" cy="-2" r="1.5" fill="#facc15" />
                </>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 11: FARM ==================== */}
        {level.theme === 'farm' && (
          <>
            {/* Green Meadow */}
            <rect x="0" y="220" width="400" height="80" fill="#16a34a" />
            <path d="M -20 230 Q 150 210 320 235 T 420 220 L 400 300 L 0 300 Z" fill="#15803d" />

            {/* Red Barn (on the left) */}
            <g transform="translate(80, 110)">
              {/* Base structure */}
              <rect x="-50" y="30" width="100" height="80" fill="#dc2626" rx="4" />
              {/* Roof */}
              <polygon points="-60,30 0,-15 60,30" fill="#991b1b" />
              <polygon points="-50,30 0,-7 50,30" fill="#fff" opacity="0.3" />
              {/* Loft window */}
              <rect x="-15" y="5" width="30" height="25" fill="#fef08a" rx="2" stroke="#78350f" strokeWidth="2" />
              <line x1="0" y1="5" x2="0" y2="30" stroke="#78350f" strokeWidth="1.5" />
              <line x1="-15" y1="17" x2="15" y2="17" stroke="#78350f" strokeWidth="1.5" />
              {/* Large Door */}
              <rect x="-25" y="60" width="50" height="50" fill="#f5f5f5" stroke="#b91c1c" strokeWidth="3" />
              <line x1="-25" y1="60" x2="25" y2="110" stroke="#b91c1c" strokeWidth="2" />
              <line x1="25" y1="60" x2="-25" y2="110" stroke="#b91c1c" strokeWidth="2" />

              {/* Difference 1: Weather Vane Rooster (Target X:35, Y:30) */}
              <g transform="translate(60, -20)">
                {/* Pole */}
                <line x1="0" y1="20" x2="0" y2="-10" stroke="#475569" strokeWidth="2" />
                <line x1="-10" y1="10" x2="10" y2="10" stroke="#475569" strokeWidth="1.5" />
                {(!isRightSide || isFound('farm-weather-rooster')) ? (
                  // Facing Left
                  <g transform="scale(1, 1)">
                    <path d="M -10 -22 Q 0 -12 10 -22 L 5 -12 L -5 -12 Z" fill="#ca8a04" />
                    <circle cx="-10" cy="-22" r="2" fill="#ca8a04" />
                  </g>
                ) : (
                  // Facing Right
                  <g transform="scale(-1, 1)">
                    <path d="M -10 -22 Q 0 -12 10 -22 L 5 -12 L -5 -12 Z" fill="#ca8a04" />
                    <circle cx="-10" cy="-22" r="2" fill="#ca8a04" />
                  </g>
                )}
              </g>
            </g>

            {/* Difference 2: Piggy's Mud Puddle (Target X:20, Y:78) */}
            <g transform="translate(80, 234)">
              {(!isRightSide || isFound('farm-pig-puddle')) ? (
                // Mud Puddle (Brown)
                <ellipse cx="0" cy="18" rx="30" ry="10" fill="#78350f" opacity="0.8" />
              ) : (
                // Flower Puddle (Green / Grass with a yellow flower)
                <g>
                  <ellipse cx="0" cy="18" rx="30" ry="10" fill="#4ade80" opacity="0.8" />
                  <circle cx="5" cy="15" r="4.5" fill="#facc15" />
                  <circle cx="5" cy="15" r="2" fill="#ea580c" />
                </g>
              )}
              {/* Cute Pig */}
              <ellipse cx="0" cy="5" rx="14" ry="10" fill="#f472b6" />
              <circle cx="12" cy="0" r="8" fill="#f472b6" />
              {/* Snout */}
              <rect x="18" y="1" width="4" height="5" rx="1.5" fill="#db2777" />
              <circle cx="11" cy="-3" r="1.2" fill="#000" /> {/* Eye */}
              {/* Ears */}
              <polygon points="6,-7 11,-12 12,-6" fill="#db2777" />
              {/* Legs */}
              <rect x="-8" y="12" width="4" height="6" fill="#f472b6" rx="1" />
              <rect x="4" y="12" width="4" height="6" fill="#f472b6" rx="1" />
            </g>

            {/* Difference 3: Scarecrow Hat (Target X:78, Y:62) */}
            <g transform="translate(312, 186)">
              {/* Wooden pole */}
              <line x1="0" y1="10" x2="0" y2="50" stroke="#78350f" strokeWidth="4.5" />
              <line x1="-25" y1="18" x2="25" y2="18" stroke="#78350f" strokeWidth="3" />
              {/* Straw shirt */}
              <polygon points="-16,18 16,18 12,42 -12,42" fill="#facc15" />
              <circle cx="0" cy="5" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              {/* Face detail */}
              <circle cx="-3" cy="3" r="1" fill="#000" />
              <circle cx="3" cy="3" r="1" fill="#000" />
              <path d="M -4 7 Q 0 10 4 7" fill="none" stroke="#b45309" strokeWidth="1.5" />
              {/* Scarecrow Hat */}
              {(!isRightSide || isFound('farm-scarecrow-hat')) ? (
                // Old Straw/Brown Hat
                <g>
                  <ellipse cx="0" cy="-3" rx="16" ry="3" fill="#92400e" />
                  <rect x="-8" y="-12" width="16" height="10" fill="#92400e" rx="1" />
                </g>
              ) : (
                // Flower Pot (Purple)
                <g>
                  <polygon points="-10,-14 10,-14 7,-4 -7,-4" fill="#a855f7" />
                  <ellipse cx="0" cy="-14" rx="10" ry="2" fill="#c084fc" />
                </g>
              )}
            </g>

            {/* Difference 4: Tractor Wheel (Target X:52, Y:78) */}
            <g transform="translate(208, 234)">
              {/* Tractor Body */}
              <rect x="-24" y="-8" width="40" height="20" fill="#166534" rx="2" />
              <rect x="-10" y="-22" width="22" height="15" fill="#166534" rx="1" />
              {/* Chimney */}
              <line x1="10" y1="-22" x2="10" y2="-32" stroke="#1e293b" strokeWidth="3" />
              {/* Front Wheel (small) */}
              <circle cx="14" cy="14" r="10" fill="#1e293b" />
              <circle cx="14" cy="14" r="4.5" fill="#facc15" />
              {/* Back Wheel (different rim!) */}
              <circle cx="-16" cy="10" r="18" fill="#1e293b" />
              {(!isRightSide || isFound('farm-tractor-wheel')) ? (
                // Yellow Rim
                <circle cx="-16" cy="10" r="9" fill="#facc15" />
              ) : (
                // Bright Red Rim
                <circle cx="-16" cy="10" r="9" fill="#ef4444" />
              )}
              <circle cx="-16" cy="10" r="3.5" fill="#475569" />
            </g>

            {/* Difference 5: Sheep's Wool Coat (Target X:82, Y:80) */}
            <g transform="translate(328, 240)">
              {/* Legs */}
              <rect x="-10" y="8" width="3" height="12" fill="#1e293b" rx="1" />
              <rect x="-2" y="8" width="3" height="12" fill="#1e293b" rx="1" />
              <rect x="6" y="8" width="3" height="12" fill="#1e293b" rx="1" />
              {/* Head (Black face) */}
              <ellipse cx="-16" cy="-2" rx="7" ry="5.5" fill="#1e293b" />
              <ellipse cx="-18" cy="-5" rx="2" ry="4" fill="#1e293b" transform="rotate(30)" /> {/* Ear */}

              {(!isRightSide || isFound('farm-sheep-wool')) ? (
                // Fluffy White Wool
                <g>
                  <circle cx="-6" cy="-4" r="10" fill="#f5f5f5" />
                  <circle cx="6" cy="-3" r="9" fill="#f5f5f5" />
                  <circle cx="0" cy="4" r="9.5" fill="#f5f5f5" />
                  <ellipse cx="0" cy="-2" rx="14" ry="11" fill="#f5f5f5" />
                </g>
              ) : (
                // Black Sheep (Fluffy dark wool)
                <g>
                  <circle cx="-6" cy="-4" r="10" fill="#334155" />
                  <circle cx="6" cy="-3" r="9" fill="#334155" />
                  <circle cx="0" cy="4" r="9.5" fill="#334155" />
                  <ellipse cx="0" cy="-2" rx="14" ry="11" fill="#334155" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 12: WINTER ==================== */}
        {level.theme === 'winter' && (
          <>
            {/* Snowy Floor & Sky */}
            <rect x="0" y="210" width="400" height="90" fill="#f1f5f9" />
            <path d="M -20 220 Q 150 200 320 225 T 420 220 L 400 300 L 0 300 Z" fill="#e2e8f0" />

            {/* Cozy Log Cabin */}
            <g transform="translate(240, 150)">
              {/* Logs base */}
              <rect x="-50" y="10" width="100" height="60" fill="#b45309" rx="3" />
              {/* Horizontal logs styling lines */}
              <line x1="-50" y1="22" x2="50" y2="22" stroke="#78350f" strokeWidth="2.5" />
              <line x1="-50" y1="36" x2="50" y2="36" stroke="#78350f" strokeWidth="2.5" />
              <line x1="-50" y1="50" x2="50" y2="50" stroke="#78350f" strokeWidth="2.5" />
              {/* Door */}
              <rect x="-12" y="32" width="24" height="38" fill="#78350f" />
              <circle cx="6" cy="51" r="2" fill="#fbbf24" />
              {/* Window */}
              <rect x="20" y="22" width="20" height="20" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
              {/* Triangular Roof with thick snow top */}
              <polygon points="-60,10 0,-30 60,10" fill="#92400e" />
              <polygon points="-58,8 0,-25 58,8" fill="#fff" />
              {/* Chimney */}
              <rect x="26" y="-18" width="12" height="24" fill="#475569" />

              {/* Difference 2: Fire Cabin Smoke (Target X:68, Y:35) */}
              <g transform="translate(32, -45)">
                {(!isRightSide || isFound('winter-cabin-smoke')) ? (
                  // Round cloud puffs
                  <g opacity="0.85" className="animate-pulse">
                    <circle cx="0" cy="4" r="5" fill="#f1f5f9" />
                    <circle cx="-6" cy="-4" r="7" fill="#f1f5f9" />
                    <circle cx="6" cy="-12" r="9" fill="#f1f5f9" />
                  </g>
                ) : (
                  // Heart shaped smoke
                  <g opacity="0.9" transform="scale(0.85)">
                    <path d="M0,0 C-6,-10 -15,-5 -10,5 L0,15 L10,5 C15,-5 6,-10 0,0 Z" fill="#fca5a5" />
                  </g>
                )}
              </g>

              {/* Difference 4: Hanging Icicles (Target X:55, Y:52) */}
              {(!isRightSide || isFound('winter-icicles')) ? (
                // 3 Shiny long icicles
                <g fill="#93c5fd" opacity="0.9">
                  <polygon points="-24,10 -22,25 -20,10" />
                  <polygon points="0,10 3,30 6,10" />
                  <polygon points="28,10 31,24 34,10" />
                </g>
              ) : (
                // Empty (No icicles)
                null
              )}
            </g>

            {/* Snowman (on the bottom-left) */}
            <g transform="translate(100, 215)">
              {/* Snowball bottom */}
              <circle cx="0" cy="22" r="22" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
              {/* Snowball middle */}
              <circle cx="0" cy="-4" r="15" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
              {/* Snowball head */}
              <circle cx="0" cy="-24" r="10.5" fill="#fff" stroke="#cbd5e1" strokeWidth="1" />
              {/* Eyes & Coal buttons */}
              <circle cx="-3.5" cy="-26" r="1.5" fill="#000" />
              <circle cx="3.5" cy="-26" r="1.5" fill="#000" />
              <circle cx="0" cy="-9" r="1.8" fill="#1e293b" />
              <circle cx="0" cy="-1.5" r="1.8" fill="#1e293b" />
              <circle cx="0" cy="15" r="2" fill="#1e293b" />
              {/* Sticks arms */}
              <line x1="-14" y1="-7" x2="-28" y2="-15" stroke="#78350f" strokeWidth="2" />
              <line x1="14" y1="-7" x2="28" y2="-12" stroke="#78350f" strokeWidth="2" />
              {/* Top Hat */}
              <ellipse cx="0" cy="-33" rx="12" ry="2.5" fill="#1e293b" />
              <rect x="-7.5" y="-45" width="15" height="12.5" fill="#1e293b" />
              <rect x="-7.5" y="-36" width="15" height="3.5" fill="#ef4444" /> {/* red band */}

              {/* Difference 1: Snowman Carrot Nose (Target X:25, Y:72) */}
              {(!isRightSide || isFound('winter-snowman-nose')) ? (
                // Orange Carrot Nose
                <polygon points="0,-24 14,-22 0,-20" fill="#ea580c" />
              ) : (
                // Round Red Cherry Nose
                <circle cx="3" cy="-22" r="3.2" fill="#e11d48" />
              )}
            </g>

            {/* Pine Tree Right */}
            <g transform="translate(328, 96)">
              {/* Trunk */}
              <rect x="-6" y="70" width="12" height="50" fill="#78350f" />
              {/* Tree layers with snow covers */}
              <polygon points="-35,70 0,25 35,70" fill="#166534" />
              <polygon points="-30,68 0,45 30,68" fill="#f1f5f9" opacity="0.85" />
              <polygon points="-28,45 0,5 28,45" fill="#166534" />
              <polygon points="-22,43 0,22 22,43" fill="#f1f5f9" opacity="0.85" />
              <polygon points="-20,20 0,-15 20,20" fill="#166534" />
              <polygon points="-14,18 0,0 14,18" fill="#f1f5f9" opacity="0.85" />

              {/* Difference 3: Pine Tree Star (Target X:82, Y:32) */}
              {(!isRightSide || isFound('winter-tree-star')) ? (
                // Shining Gold Star
                <polygon points="0,-24 3,-16 11,-16 5,-11 8,-3 0,-8 -8,-3 -5,-11 -11,-16 -3,-16" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
              ) : (
                // Big Red Ribbon/Bow
                <g transform="translate(0, -18)">
                  <circle cx="0" cy="0" r="4" fill="#ef4444" />
                  <ellipse cx="-6" cy="-2" rx="5" ry="3" fill="#ef4444" transform="rotate(-15)" />
                  <ellipse cx="6" cy="-2" rx="5" ry="3" fill="#ef4444" transform="rotate(15)" />
                  <path d="M -3 3 L -8 11" stroke="#ef4444" strokeWidth="2.5" />
                  <path d="M 3 3 L 8 11" stroke="#ef4444" strokeWidth="2.5" />
                </g>
              )}
            </g>

            {/* Difference 5: Sled's Red Runner (Target X:48, Y:82) */}
            <g transform="translate(192, 246)">
              {/* Sled Wood seat */}
              <rect x="-20" y="-1" width="40" height="4.5" fill="#d97706" rx="1.5" />
              {(!isRightSide || isFound('winter-sled-runner')) ? (
                // Red metal runner
                <g stroke="#ef4444" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <path d="M -18 3 L 18 3 C 24 3 24 -4 20 -4" />
                  <line x1="-12" y1="3" x2="-12" y2="0" />
                  <line x1="12" y1="3" x2="12" y2="0" />
                </g>
              ) : (
                // Blue metal runner
                <g stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <path d="M -18 3 L 18 3 C 24 3 24 -4 20 -4" />
                  <line x1="-12" y1="3" x2="-12" y2="0" />
                  <line x1="12" y1="3" x2="12" y2="0" />
                </g>
              )}
            </g>
          </>
        )}

        {/* ==================== THEME 13: SKY ==================== */}
        {level.theme === 'sky' && (
          <>
            {/* Fluffy Blue Sky Background with rolling clouds */}
            <path d="M -20 180 Q 80 150 180 170 T 420 170 L 400 300 L 0 300 Z" fill="#38bdf8" opacity="0.25" />
            <path d="M -20 220 Q 120 200 260 215 T 420 220 L 400 300 L 0 300 Z" fill="#ffffff" opacity="0.4" />

            {/* Difference 3: Airplane Banner (Target X:50, Y:18) */}
            <g transform="translate(170, 54)">
              {/* Red Biplane */}
              <ellipse cx="0" cy="0" rx="18" ry="8" fill="#ef4444" />
              <polygon points="12,0 18,-8 18,8" fill="#dc2626" />
              {/* Propeller */}
              <ellipse cx="-18" cy="0" rx="2" ry="10" fill="#475569" className="animate-spin" />
              {/* Wings */}
              <rect x="-8" y="-14" width="6" height="28" fill="#ef4444" rx="1.5" />

              {/* Banner line & Banner text */}
              <line x1="18" y1="0" x2="35" y2="0" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
              {(!isRightSide || isFound('sky-airplane-banner')) ? (
                // NANO BANANA Banner
                <g transform="translate(35, -10)">
                  <rect x="0" y="0" width="85" height="20" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" rx="2" />
                  <text x="42.5" y="14" fill="#713f12" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    NANO BANANA 🍌
                  </text>
                </g>
              ) : (
                // HI DETECTIVE Banner
                <g transform="translate(35, -10)">
                  <rect x="0" y="0" width="85" height="20" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" rx="2" />
                  <text x="42.5" y="14" fill="#064e3b" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    HI DETECTIVE 🔍
                  </text>
                </g>
              )}
            </g>

            {/* Difference 4: Sun's Sunglasses (Target X:85, Y:15) */}
            <g transform="translate(340, 45)">
              <circle cx="0" cy="0" r="22" fill="#facc15" />
              <circle cx="0" cy="0" r="26" fill="#facc15" opacity="0.3" />
              {(!isRightSide || isFound('sky-sun-glasses')) ? (
                // Wearing sunglasses
                <g fill="#1e293b">
                  <rect x="-12" y="-5" width="9" height="7" rx="2.5" />
                  <rect x="3" y="-5" width="9" height="7" rx="2.5" />
                  <line x1="-3" y1="-2" x2="3" y2="-2" stroke="#1e293b" strokeWidth="2.5" />
                  {/* Smile under glasses */}
                  <path d="M -6 6 Q 0 12 6 6" fill="none" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round" />
                </g>
              ) : (
                // Winking Smiling Sun (No glasses)
                <g fill="none" stroke="#713f12" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M -8 -3 Q -4 -5 0 -3" /> {/* Left sleepy/wink eye */}
                  <circle cx="6" cy="-3" r="2" fill="#713f12" stroke="none" /> {/* Right eye open */}
                  <path d="M -6 6 Q 0 12 6 6" fill="none" strokeWidth="2.5" />
                </g>
              )}
            </g>

            {/* Difference 1: Hot Air Balloon (Target X:25, Y:38) */}
            <g transform="translate(100, 114)">
              {/* Balloon Envelope */}
              {(!isRightSide || isFound('sky-balloon-stripes')) ? (
                // Rainbow Stripes
                <g>
                  {/* Outer base envelope */}
                  <path d="M -30 -15 C -30 -42 30 -42 30 -15 C 30 -2 14 12 12 20 L -12 20 C -14 12 -30 -2 -30 -15 Z" fill="#db2777" />
                  {/* Inlay stripes */}
                  <path d="M -20 -15 C -20 -38 20 -38 20 -15 C 20 -2 11 12 10 20 L -10 20 C -11 12 -20 -2 -20 -15 Z" fill="#3b82f6" />
                  <path d="M -10 -15 C -10 -35 10 -35 10 -15 C 10 -2 8 12 7 20 L -7 20 C -8 12 -10 -2 -10 -15 Z" fill="#facc15" />
                </g>
              ) : (
                // Checkers (Black and White checks)
                <g>
                  <path d="M -30 -15 C -30 -42 30 -42 30 -15 C 30 -2 14 12 12 20 L -12 20 C -14 12 -30 -2 -30 -15 Z" fill="#1e293b" />
                  <path d="M -20 -15 C -20 -38 20 -38 20 -15 C 20 -2 11 12 10 20 L -10 20 C -11 12 -20 -2 -20 -15 Z" fill="#fff" />
                  <path d="M -10 -15 C -10 -35 10 -35 10 -15 C 10 -2 8 12 7 20 L -7 20 C -8 12 -10 -2 -10 -15 Z" fill="#1e293b" />
                </g>
              )}

              {/* Rigging ropes */}
              <line x1="-10" y1="20" x2="-8" y2="35" stroke="#475569" strokeWidth="1.5" />
              <line x1="10" y1="20" x2="8" y2="35" stroke="#475569" strokeWidth="1.5" />

              {/* Basket */}
              <rect x="-8" y="35" width="16" height="14" fill="#b45309" rx="1.5" />
              <line x1="-8" y1="42" x2="8" y2="42" stroke="#78350f" strokeWidth="1.5" />

              {/* Difference 5: Floating Basket Cap (Target X:25, Y:68) */}
              <g transform="translate(0, 32)">
                {/* Little Passenger boy */}
                <circle cx="0" cy="-2" r="5" fill="#fed7aa" />
                {(!isRightSide || isFound('sky-basket-cap')) ? (
                  // Red propeller cap
                  <g>
                    <path d="M -5 -4 Q 0 -8 5 -4 Z" fill="#ef4444" />
                    <line x1="0" y1="-6" x2="0" y2="-10" stroke="#facc15" strokeWidth="1.5" />
                    <line x1="-4" y1="-10" x2="4" y2="-10" stroke="#10b981" strokeWidth="1" />
                  </g>
                ) : (
                  // Blue wizard hat
                  <g>
                    <polygon points="-5,-4 0,-14 5,-4" fill="#3b82f6" />
                    <circle cx="0" cy="-7" r="1.5" fill="#facc15" />
                  </g>
                )}
              </g>
            </g>

            {/* Difference 2: Kite's Long Tail (Target X:75, Y:42) */}
            <g transform="translate(300, 126)">
              {/* Diamond Kite */}
              <polygon points="0,-18 12,0 0,18 -12,0" fill="#a855f7" stroke="#7e22ce" strokeWidth="1.5" />
              <line x1="0" y1="-18" x2="0" y2="18" stroke="#7e22ce" strokeWidth="1" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke="#7e22ce" strokeWidth="1" />

              {/* Kite Tail */}
              {(!isRightSide || isFound('sky-kite-tail')) ? (
                // Long Tail with colorful bows
                <g fill="none" stroke="#7e22ce" strokeWidth="1.5">
                  <path d="M 0 18 Q 15 35 5 52 T 20 80" />
                  {/* Bows */}
                  <g fill="#ef4444" stroke="none" transform="translate(6, 28)">
                    <circle cx="-2" cy="0" r="2.5" />
                    <circle cx="2" cy="0" r="2.5" />
                  </g>
                  <g fill="#facc15" stroke="none" transform="translate(8, 48)">
                    <circle cx="-2" cy="0" r="2.5" />
                    <circle cx="2" cy="0" r="2.5" />
                  </g>
                  <g fill="#3b82f6" stroke="none" transform="translate(12, 68)">
                    <circle cx="-2" cy="0" r="2.5" />
                    <circle cx="2" cy="0" r="2.5" />
                  </g>
                </g>
              ) : (
                // Short plain single string tail
                <path d="M 0 18 Q 8 28 4 38" fill="none" stroke="#7e22ce" strokeWidth="1.5" />
              )}
            </g>
          </>
        )}
      </svg>

      {/* Floating success ripple animation overlay (Green rings) */}
      {showSuccessRipple.map((rip, idx) => (
        <div
          key={`success-rip-${rip.id}-${idx}-${isRightSide ? 'r' : 'l'}`}
          className="absolute rounded-full border-4 border-emerald-400 bg-emerald-400/20 pointer-events-none animate-ping"
          style={{
            left: `${rip.x}%`,
            top: `${rip.y}%`,
            width: '40px',
            height: '40px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Floating mistake/error ripple overlay (Red X) */}
      {showErrorRipple.map((err, idx) => (
        <div
          key={`error-rip-${err.id}-${idx}-${isRightSide ? 'r' : 'l'}`}
          className="absolute font-bold text-red-500 text-3xl pointer-events-none animate-bounce"
          style={{
            left: `${err.x}%`,
            top: `${err.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ❌
        </div>
      ))}

      {/* Highlights for found differences & active hints */}
      {renderFoundHighlights()}
    </div>
  );
}
