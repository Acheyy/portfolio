export type Platform = { x: number; y: number; w: number; h: number }

export type MovingPlatform = {
  x: number
  y: number
  w: number
  h: number
  dx: number
  dy: number
  range: number
  speed: number
}

export type Level = {
  platforms: Platform[]
  movingPlatforms?: MovingPlatform[]
  start: { x: number; y: number }
  goal: { x: number; y: number; w: number; h: number }
  width: number
  height: number
}

export const LEVELS: Level[] = [
  // Level 1 — simple intro, just walk and one small jump
  {
    width: 1800,
    height: 540,
    start: { x: 60, y: 420 },
    goal: { x: 1650, y: 368, w: 40, h: 80 },
    platforms: [
      { x: 0, y: 460, w: 500, h: 30 },
      { x: 500, y: 460, w: 400, h: 30 },
      { x: 900, y: 460, w: 350, h: 30 },
      // small gap — one easy jump
      { x: 1310, y: 448, w: 120, h: 30 },
      // goal platform
      { x: 1490, y: 448, w: 260, h: 30 },
    ],
  },

  // Level 2 — platforming with gaps and elevation
  {
    width: 3200,
    height: 540,
    start: { x: 60, y: 390 },
    goal: { x: 3050, y: 338, w: 40, h: 80 },
    platforms: [
      { x: 0, y: 460, w: 300, h: 30 },
      { x: 350, y: 460, w: 180, h: 30 },
      { x: 590, y: 480, w: 160, h: 30 },
      { x: 810, y: 440, w: 100, h: 20 },
      { x: 960, y: 400, w: 100, h: 20 },
      { x: 1110, y: 370, w: 120, h: 20 },
      { x: 1280, y: 390, w: 280, h: 20 },
      { x: 1620, y: 460, w: 140, h: 30 },
      { x: 1810, y: 430, w: 80, h: 18 },
      { x: 1940, y: 400, w: 80, h: 18 },
      { x: 2060, y: 430, w: 80, h: 18 },
      { x: 2190, y: 460, w: 120, h: 30 },
      { x: 2370, y: 430, w: 100, h: 20 },
      { x: 2510, y: 390, w: 100, h: 20 },
      { x: 2650, y: 350, w: 100, h: 20 },
      { x: 2800, y: 380, w: 160, h: 20 },
      { x: 3000, y: 418, w: 160, h: 22 },
    ],
  },

  // Level 3 — mirrors Level 2 at first, then diverges. Something is off.
  {
    width: 4000,
    height: 540,
    start: { x: 60, y: 390 },
    goal: { x: 3850, y: 308, w: 40, h: 80 },
    platforms: [
      // --- familiar section (mirrors L2, but subtly wrong) ---
      { x: 0, y: 460, w: 280, h: 30 },
      { x: 340, y: 460, w: 190, h: 30 },
      { x: 600, y: 478, w: 150, h: 30 },
      { x: 820, y: 438, w: 90, h: 20 },
      { x: 975, y: 400, w: 90, h: 20 },
      { x: 1120, y: 368, w: 110, h: 20 },
      { x: 1290, y: 388, w: 260, h: 20 },
      // --- the bridge ends differently ---
      { x: 1610, y: 450, w: 120, h: 30 },
      // --- now it diverges ---
      { x: 1790, y: 420, w: 70, h: 18 },
      { x: 1920, y: 390, w: 70, h: 18 },
      { x: 2050, y: 420, w: 70, h: 18 },
      { x: 2170, y: 450, w: 100, h: 20 },
      // staircase down then up
      { x: 2330, y: 470, w: 80, h: 20 },
      { x: 2470, y: 440, w: 65, h: 18 },
      { x: 2590, y: 410, w: 65, h: 18 },
      { x: 2710, y: 380, w: 65, h: 18 },
      // narrow high bridge
      { x: 2830, y: 370, w: 160, h: 16 },
      // static platform before moving section
      { x: 3030, y: 400, w: 80, h: 18 },
      // final approach
      { x: 3530, y: 380, w: 100, h: 20 },
      { x: 3670, y: 370, w: 100, h: 20 },
      // goal platform
      { x: 3800, y: 388, w: 180, h: 22 },
    ],
    movingPlatforms: [
      { x: 3150, y: 420, w: 70, h: 16, dx: 0, dy: 1, range: 50, speed: 0.02 },
      { x: 3300, y: 380, w: 70, h: 16, dx: 1, dy: 0, range: 60, speed: 0.015 },
      { x: 3440, y: 410, w: 70, h: 16, dx: 0, dy: 1, range: 40, speed: 0.025 },
    ],
  },
]
