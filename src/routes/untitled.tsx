import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '~/components/Navbar'
import { Footer } from '~/components/Footer'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'
import { LEVELS } from '~/data/untitled-levels'
import type { Platform } from '~/data/untitled-levels'
import type { DialogueState } from '~/data/untitled-dialogue'
import {
  checkTriggers,
  startDialogue,
  tickDialogue,
  isDialogueFinished,
  isBlocking,
  createDialogueState,
  recordDeath,
} from '~/data/untitled-dialogue'

export const Route = createFileRoute('/untitled')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Untitled — Porfo',
      description: 'A platformer game. Navigate a square through obstacle courses.',
      path: '/untitled',
    }),
    links: [createCanonicalLink('/untitled')],
  }),
  component: UntitledPage,
})

const ease = [0.22, 1, 0.36, 1] as const

type GameState = 'ready' | 'playing' | 'won'

const PLAYER_SIZE = 28
const GRAVITY = 0.28
const JUMP_FORCE = -7.5
const MOVE_SPEED = 2.0
const FRICTION = 0.88
const CANVAS_W = 960
const CANVAS_H = 540

const COLORS = {
  bg: '#0b0d11',
  grid: '#13151b',
  platform: '#161922',
  platformBorder: '#38bdf8',
  platformGlow: 'rgba(56, 189, 248, 0.12)',
  player: '#f59e0b',
  playerGlow: 'rgba(245, 158, 11, 0.5)',
  goal: '#818cf8',
  goalGlow: 'rgba(129, 140, 248, 0.35)',
  trail: 'rgba(245, 158, 11, 0.15)',
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

function UntitledPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-light transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              Back to games
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-8 mb-8"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-amber-400 mb-3">
              Mini Game
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              <span className="gradient-text">Untitled</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <UntitledGame />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

type GameStats = {
  completedLevels: number[]
  deaths: number
  totalTime: number
}

const STORAGE_KEY = 'untitled-stats'

function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { completedLevels: [], deaths: 0, totalTime: 0 }
}

function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function UntitledGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(CANVAS_W)
  const [canvasHeight, setCanvasHeight] = useState(CANVAS_H)
  const [gameState, setGameState] = useState<GameState>('ready')
  const [levelIdx, setLevelIdx] = useState(0)
  const [stats, setStats] = useState<GameStats>(loadStats)
  const [dialogueLog, setDialogueLog] = useState<string[]>([])
  const dialogueLogRef = useRef<string[]>([])

  const gameStateRef = useRef<GameState>('ready')
  const levelIdxRef = useRef(0)
  const keysRef = useRef<Set<string>>(new Set())
  const rafRef = useRef(0)
  const lastTimeRef = useRef(0)
  const statsRef = useRef(stats)
  const levelTimerRef = useRef(0)
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const playerRef = useRef({
    x: LEVELS[0].start.x,
    y: LEVELS[0].start.y,
    vx: 0,
    vy: 0,
    onGround: false,
    squash: 1,
    wasOnGround: false,
  })

  const cameraRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const goalPulseRef = useRef(0)

  const dialogueStateRef = useRef<DialogueState>(createDialogueState())
  const dialogueStartFlagRef = useRef(false)

  const controlsHintRef = useRef({ show: false, alpha: 0, dismissed: false })
  const doorAnimRef = useRef({ progress: 0, active: false })
  const movingPlatformsRef = useRef<Platform[]>([])
  const gameTickRef = useRef(0)

  useEffect(() => {
    statsRef.current = stats
  }, [stats])

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    function measure() {
      if (containerRef.current?.parentElement) {
        const w = containerRef.current.parentElement.clientWidth
        const capped = Math.min(w, CANVAS_W)
        setCanvasWidth(capped)
        setCanvasHeight(Math.round(capped * (CANVAS_H / CANVAS_W)))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    levelTimerRef.current = 0
    timerIntervalRef.current = setInterval(() => {
      levelTimerRef.current += 1
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }
  }, [])

  const addDeath = useCallback(() => {
    const s = { ...statsRef.current, deaths: statsRef.current.deaths + 1 }
    statsRef.current = s
    setStats(s)
    saveStats(s)
  }, [])

  const completeLevel = useCallback((idx: number) => {
    const prev = statsRef.current
    const completed = prev.completedLevels.includes(idx)
      ? prev.completedLevels
      : [...prev.completedLevels, idx]
    const s = {
      ...prev,
      completedLevels: completed,
      totalTime: prev.totalTime + levelTimerRef.current,
    }
    statsRef.current = s
    setStats(s)
    saveStats(s)
  }, [])

  const resetPlayer = useCallback(() => {
    const level = LEVELS[levelIdxRef.current]
    const p = playerRef.current
    p.x = level.start.x
    p.y = level.start.y
    p.vx = 0
    p.vy = 0
    p.onGround = false
    p.squash = 1
    p.wasOnGround = false
    cameraRef.current.x = 0
    cameraRef.current.y = 0
    particlesRef.current = []
    dialogueStateRef.current = createDialogueState()
    dialogueStartFlagRef.current = true
    dialogueLogRef.current = []
    setDialogueLog([])
    controlsHintRef.current = { show: false, alpha: 0, dismissed: false }
    doorAnimRef.current = { progress: 0, active: false }
    gameTickRef.current = 0
    const mp = LEVELS[levelIdxRef.current].movingPlatforms
    movingPlatformsRef.current = mp
      ? mp.map((m) => ({ x: m.x, y: m.y, w: m.w, h: m.h }))
      : []
  }, [])

  const goToLevel = useCallback(
    (idx: number) => {
      stopTimer()
      levelIdxRef.current = idx
      setLevelIdx(idx)
      resetPlayer()
      gameStateRef.current = 'playing'
      setGameState('playing')
      startTimer()
    },
    [resetPlayer, startTimer, stopTimer],
  )

  const startGame = useCallback(() => {
    goToLevel(0)
  }, [goToLevel])

  const handleInput = useCallback(() => {
    if (isBlocking(dialogueStateRef.current)) {
      const p = playerRef.current
      p.vx = 0
      p.vy = 0
      return
    }

    if (doorAnimRef.current.active) return

    const keys = keysRef.current
    const p = playerRef.current

    if (controlsHintRef.current.show && controlsHintRef.current.alpha > 0.3) {
      if (keys.size > 0) controlsHintRef.current.dismissed = true
    }

    const level = LEVELS[levelIdxRef.current]
    const goal = level.goal
    const nearDoor =
      p.x + PLAYER_SIZE > goal.x - 10 &&
      p.x < goal.x + goal.w + 10 &&
      p.y + PLAYER_SIZE > goal.y &&
      p.y < goal.y + goal.h

    if (
      nearDoor &&
      (keys.has('ArrowUp') || keys.has('w') || keys.has('W'))
    ) {
      doorAnimRef.current.active = true
      doorAnimRef.current.progress = 0
      p.vx = 0
      p.vy = 0
      return
    }

    let ax = 0
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) ax -= 1
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) ax += 1

    p.vx += ax * MOVE_SPEED * 0.3
    p.vx *= FRICTION

    if (Math.abs(p.vx) < 0.1) p.vx = 0

    if (keys.has(' ') && p.onGround) {
      p.vy = JUMP_FORCE
      p.onGround = false
      p.squash = 0.7
    }
  }, [])

  const updatePhysics = useCallback(() => {
    const p = playerRef.current
    const level = LEVELS[levelIdxRef.current]

    p.vy += GRAVITY
    if (p.vy > 7) p.vy = 7

    p.wasOnGround = p.onGround

    gameTickRef.current += 1
    const mpDefs = level.movingPlatforms
    const mpRects = movingPlatformsRef.current
    const mpDeltas: { dx: number; dy: number }[] = []
    if (mpDefs) {
      for (let i = 0; i < mpDefs.length; i++) {
        const def = mpDefs[i]
        const prevX = mpRects[i].x
        const prevY = mpRects[i].y
        const t = Math.sin(gameTickRef.current * def.speed)
        mpRects[i].x = def.x + def.dx * t * def.range
        mpRects[i].y = def.y + def.dy * t * def.range
        mpDeltas.push({
          dx: mpRects[i].x - prevX,
          dy: mpRects[i].y - prevY,
        })
      }
    }

    p.x += p.vx
    p.y += p.vy
    p.onGround = false

    const allPlatforms: Platform[] = mpRects.length > 0
      ? [...level.platforms, ...mpRects]
      : level.platforms

    for (const plat of allPlatforms) {
      const px = p.x
      const py = p.y
      const pw = PLAYER_SIZE
      const ph = PLAYER_SIZE

      if (
        px + pw > plat.x &&
        px < plat.x + plat.w &&
        py + ph > plat.y &&
        py < plat.y + plat.h
      ) {
        const overlapTop = py + ph - plat.y
        const overlapBottom = plat.y + plat.h - py
        const overlapLeft = px + pw - plat.x
        const overlapRight = plat.x + plat.w - px

        const minOverlap = Math.min(
          overlapTop,
          overlapBottom,
          overlapLeft,
          overlapRight,
        )

        if (minOverlap === overlapTop && p.vy >= 0) {
          p.y = plat.y - ph
          p.vy = 0
          if (!p.onGround && !p.wasOnGround) {
            p.squash = 0.75
          }
          p.onGround = true
        } else if (minOverlap === overlapBottom && p.vy < 0) {
          p.y = plat.y + plat.h
          p.vy = 0
        } else if (minOverlap === overlapLeft) {
          p.x = plat.x - pw
          p.vx = 0
        } else if (minOverlap === overlapRight) {
          p.x = plat.x + plat.w
          p.vx = 0
        }
      }
    }

    if (p.onGround && mpDeltas.length > 0) {
      for (let i = 0; i < mpRects.length; i++) {
        const mp = mpRects[i]
        if (
          p.x + PLAYER_SIZE > mp.x &&
          p.x < mp.x + mp.w &&
          Math.abs(p.y + PLAYER_SIZE - mp.y) < 2
        ) {
          p.x += mpDeltas[i].dx
          p.y += mpDeltas[i].dy
          break
        }
      }
    }

    p.squash += (1 - p.squash) * 0.15

    if (p.x < 0) {
      p.x = 0
      p.vx = 0
    }

    if (p.y > level.height + 100) {
      const deathX = p.x
      const prevState = {
        deaths: dialogueStateRef.current.levelDeaths,
        lastDeathX: deathX,
      }
      addDeath()
      resetPlayer()
      dialogueStateRef.current.levelDeaths = prevState.deaths
      recordDeath(dialogueStateRef.current, prevState.lastDeathX, levelIdxRef.current)
    }

    if (doorAnimRef.current.active) {
      const door = doorAnimRef.current
      door.progress += 1
      if (door.progress >= 60) {
        stopTimer()
        completeLevel(levelIdxRef.current)
        gameStateRef.current = 'won'
        setGameState('won')
        door.active = false
      }
    }
  }, [resetPlayer, addDeath, stopTimer, completeLevel])

  const updateCamera = useCallback(() => {
    const p = playerRef.current
    const targetX = p.x - canvasWidth * 0.35
    const level = LEVELS[levelIdxRef.current]

    cameraRef.current.x += (targetX - cameraRef.current.x) * 0.08
    if (cameraRef.current.x < 0) cameraRef.current.x = 0
    if (cameraRef.current.x > level.width - canvasWidth)
      cameraRef.current.x = level.width - canvasWidth
  }, [canvasWidth])

  const updateParticles = useCallback(() => {
    const p = playerRef.current
    const particles = particlesRef.current

    if (
      gameStateRef.current === 'playing' &&
      (Math.abs(p.vx) > 0.5 || Math.abs(p.vy) > 1)
    ) {
      particles.push({
        x: p.x + PLAYER_SIZE / 2,
        y: p.y + PLAYER_SIZE / 2,
        vx: -p.vx * 0.1 + (Math.random() - 0.5) * 0.5,
        vy: -p.vy * 0.05 + (Math.random() - 0.5) * 0.5,
        life: 1,
        maxLife: 20 + Math.random() * 15,
        size: 3 + Math.random() * 4,
      })
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i]
      pt.x += pt.vx
      pt.y += pt.vy
      pt.life += 1
      if (pt.life > pt.maxLife) {
        particles.splice(i, 1)
      }
    }
  }, [])

  const updateDialogue = useCallback(() => {
    const ds = dialogueStateRef.current

    if (ds.active) {
      const finishingId = ds.active.id
      ds.active = tickDialogue(ds.active)
      if (isDialogueFinished(ds.active)) {
        ds.active = null
        if (finishingId === 'l1-wake2' && !controlsHintRef.current.dismissed) {
          controlsHintRef.current.show = true
        }
      }
      return
    }

    if (ds.pendingLine) {
      ds.pendingDelay -= 1
      if (ds.pendingDelay <= 0) {
        ds.shownIds.add(ds.pendingLine.id)
        ds.active = startDialogue(ds.pendingLine)
        const newLog = [...dialogueLogRef.current, ds.pendingLine.text]
        dialogueLogRef.current = newLog
        setDialogueLog(newLog)
        ds.pendingLine = null
      }
      return
    }

    const p = playerRef.current

    if (p.onGround && Math.abs(p.vx) < 0.2) {
      ds.idleFrames += 1
    } else {
      ds.idleFrames = 0
    }

    const level = LEVELS[levelIdxRef.current]
    const triggered = checkTriggers(
      levelIdxRef.current,
      p.x,
      level.goal.x,
      ds,
      dialogueStartFlagRef.current,
      p.onGround,
    )
    dialogueStartFlagRef.current = false

    if (triggered) {
      if (triggered.trigger.type === 'after') {
        ds.pendingLine = triggered
        ds.pendingDelay = triggered.trigger.delay
      } else {
        ds.shownIds.add(triggered.id)
        ds.active = startDialogue(triggered)
        const newLog = [...dialogueLogRef.current, triggered.text]
        dialogueLogRef.current = newLog
        setDialogueLog(newLog)
      }
    }
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = 2
    const w = canvas.width / dpr
    const h = canvas.height / dpr

    ctx.save()
    ctx.scale(dpr, dpr)

    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, w, h)

    const cam = cameraRef.current
    const level = LEVELS[levelIdxRef.current]

    const gridSize = 50
    const parallax = 0.3
    const gridOffsetX = -(cam.x * parallax) % gridSize
    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5
    for (let gx = gridOffsetX; gx < w; gx += gridSize) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, h)
      ctx.stroke()
    }
    for (let gy = 0; gy < h; gy += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(w, gy)
      ctx.stroke()
    }

    ctx.save()
    ctx.translate(-cam.x, -cam.y)

    const particles = particlesRef.current
    for (const pt of particles) {
      const alpha = 1 - pt.life / pt.maxLife
      ctx.globalAlpha = alpha * 0.4
      ctx.fillStyle = COLORS.player
      ctx.beginPath()
      ctx.arc(pt.x, pt.y, pt.size * (1 - pt.life / pt.maxLife), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    for (const plat of level.platforms) {
      ctx.save()
      ctx.shadowColor = COLORS.platformBorder
      ctx.shadowBlur = 8
      ctx.fillStyle = COLORS.platform
      roundRect(ctx, plat.x, plat.y, plat.w, plat.h, 4)
      ctx.fill()
      ctx.restore()

      ctx.strokeStyle = COLORS.platformBorder + '40'
      ctx.lineWidth = 1
      roundRect(ctx, plat.x, plat.y, plat.w, plat.h, 4)
      ctx.stroke()

      ctx.fillStyle = COLORS.platformGlow
      ctx.fillRect(plat.x + 2, plat.y, plat.w - 4, 2)
    }

    for (const mp of movingPlatformsRef.current) {
      ctx.save()
      ctx.shadowColor = '#f59e0b'
      ctx.shadowBlur = 10
      ctx.fillStyle = '#1a1720'
      roundRect(ctx, mp.x, mp.y, mp.w, mp.h, 4)
      ctx.fill()
      ctx.restore()

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)'
      ctx.lineWidth = 1
      roundRect(ctx, mp.x, mp.y, mp.w, mp.h, 4)
      ctx.stroke()

      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)'
      ctx.fillRect(mp.x + 2, mp.y, mp.w - 4, 2)
    }

    goalPulseRef.current += 0.04
    const goal = level.goal
    const pulseAlpha = 0.5 + Math.sin(goalPulseRef.current) * 0.3
    const doorOpen = doorAnimRef.current.active
      ? Math.min(1, doorAnimRef.current.progress / 30)
      : 0

    ctx.save()
    ctx.shadowColor = COLORS.goal
    ctx.shadowBlur = doorOpen > 0 ? 25 + doorOpen * 30 : 25
    ctx.globalAlpha = pulseAlpha + doorOpen * 0.5
    ctx.fillStyle = doorOpen > 0
      ? `rgba(129, 140, 248, ${0.35 + doorOpen * 0.6})`
      : COLORS.goalGlow
    ctx.fillRect(goal.x, goal.y, goal.w, goal.h)
    ctx.restore()

    if (doorOpen > 0) {
      ctx.save()
      const innerW = (goal.w - 8) * doorOpen
      const innerX = goal.x + goal.w / 2 - innerW / 2
      ctx.fillStyle = `rgba(255, 255, 255, ${doorOpen * 0.6})`
      ctx.shadowColor = '#fff'
      ctx.shadowBlur = 20 * doorOpen
      ctx.fillRect(innerX, goal.y + 4, innerW, goal.h - 8)
      ctx.restore()
    }

    ctx.strokeStyle = COLORS.goal
    ctx.lineWidth = 2
    ctx.globalAlpha = 0.8
    roundRect(ctx, goal.x, goal.y, goal.w, goal.h, 3)
    ctx.stroke()
    ctx.globalAlpha = 1

    if (doorOpen <= 0) {
      ctx.fillStyle = COLORS.goal + '30'
      ctx.fillRect(goal.x + 4, goal.y + 4, goal.w - 8, goal.h - 8)

      const flagSize = 12
      ctx.fillStyle = COLORS.goal
      ctx.globalAlpha = pulseAlpha
      ctx.beginPath()
      ctx.moveTo(goal.x + goal.w / 2, goal.y + 8)
      ctx.lineTo(goal.x + goal.w / 2 + flagSize, goal.y + 8 + flagSize / 2)
      ctx.lineTo(goal.x + goal.w / 2, goal.y + 8 + flagSize)
      ctx.closePath()
      ctx.fill()
      ctx.globalAlpha = 1
    }

    const p = playerRef.current
    const squashW = PLAYER_SIZE * (1 / p.squash)
    const squashH = PLAYER_SIZE * p.squash
    const drawX = p.x + (PLAYER_SIZE - squashW) / 2
    const drawY = p.y + (PLAYER_SIZE - squashH)

    ctx.save()
    ctx.shadowColor = COLORS.playerGlow
    ctx.shadowBlur = 18
    ctx.fillStyle = COLORS.player
    roundRect(ctx, drawX, drawY, squashW, squashH, 4)
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1.5
    roundRect(ctx, drawX, drawY, squashW, squashH, 4)
    ctx.stroke()

    const eyeSize = 3
    const eyeY = drawY + squashH * 0.35
    const eyeSpacing = squashW * 0.2
    ctx.fillStyle = '#0b0d11'
    ctx.beginPath()
    ctx.arc(drawX + squashW / 2 - eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(drawX + squashW / 2 + eyeSpacing, eyeY, eyeSize, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()

    const dialogue = dialogueStateRef.current.active
    if (dialogue && dialogue.charsRevealed > 0) {
      const visibleText = dialogue.text.slice(0, dialogue.charsRevealed)
      const fadeIn = Math.min(1, dialogue.elapsed / 12)
      const fadeOut =
        dialogue.elapsed > dialogue.duration - 30
          ? Math.max(0, (dialogue.duration - dialogue.elapsed) / 30)
          : 1
      const alpha = fadeIn * fadeOut

      const screenPlayerX = p.x - cam.x
      const screenPlayerY = drawY - cam.y

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.font = "13px 'Inter', sans-serif"
      const metrics = ctx.measureText(visibleText)
      const textW = metrics.width
      const padX = 12
      const bubbleW = textW + padX * 2
      const bubbleH = 28
      const tailSize = 6
      const margin = 8

      let bubbleX = screenPlayerX + PLAYER_SIZE / 2 - bubbleW / 2
      let bubbleY = screenPlayerY - bubbleH - 14

      bubbleX = Math.max(margin, Math.min(w - bubbleW - margin, bubbleX))
      bubbleY = Math.max(margin, bubbleY)

      const tailX = Math.max(
        bubbleX + tailSize + 4,
        Math.min(
          bubbleX + bubbleW - tailSize - 4,
          screenPlayerX + PLAYER_SIZE / 2,
        ),
      )

      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
      ctx.shadowBlur = 12
      ctx.fillStyle = '#1a1d26'
      roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 8)
      ctx.fill()
      ctx.shadowBlur = 0

      ctx.strokeStyle = '#2a2f3a'
      ctx.lineWidth = 1
      roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 8)
      ctx.stroke()

      ctx.fillStyle = '#1a1d26'
      ctx.beginPath()
      ctx.moveTo(tailX - tailSize, bubbleY + bubbleH)
      ctx.lineTo(tailX, bubbleY + bubbleH + tailSize)
      ctx.lineTo(tailX + tailSize, bubbleY + bubbleH)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#2a2f3a'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(tailX - tailSize, bubbleY + bubbleH)
      ctx.lineTo(tailX, bubbleY + bubbleH + tailSize)
      ctx.lineTo(tailX + tailSize, bubbleY + bubbleH)
      ctx.stroke()

      ctx.fillStyle = '#1a1d26'
      ctx.fillRect(tailX - tailSize + 1, bubbleY + bubbleH - 1, tailSize * 2 - 2, 2)

      ctx.fillStyle = '#d4d4dc'
      ctx.textBaseline = 'middle'
      ctx.fillText(visibleText, bubbleX + padX, bubbleY + bubbleH / 2 + 1)
      ctx.restore()
    }

    ctx.fillStyle = '#f1f5f9'
    ctx.font = "bold 13px 'Sora', sans-serif"
    ctx.textBaseline = 'top'
    ctx.fillText(`Level ${levelIdxRef.current + 1}`, 14, 14)

    const progressWidth = 120
    const progressX = w - progressWidth - 14
    const progressY = 16
    const progressH = 6
    const progress = Math.min(
      1,
      Math.max(0, p.x / (level.goal.x + level.goal.w)),
    )

    ctx.fillStyle = '#1f2330'
    roundRect(ctx, progressX, progressY, progressWidth, progressH, 3)
    ctx.fill()

    ctx.fillStyle = COLORS.player
    roundRect(
      ctx,
      progressX,
      progressY,
      progressWidth * progress,
      progressH,
      3,
    )
    ctx.fill()

    const hint = controlsHintRef.current
    if (hint.show && !hint.dismissed) {
      hint.alpha = Math.min(1, hint.alpha + 0.02)
    } else if (hint.dismissed) {
      hint.alpha = Math.max(0, hint.alpha - 0.04)
      if (hint.alpha <= 0) hint.show = false
    }
    if (hint.alpha > 0) {
      ctx.save()
      ctx.globalAlpha = hint.alpha * 0.5
      const hintCx = w / 2
      const hintCy = h * 0.45
      const keySize = 36
      const keyGap = 6
      const keyR = 6

      const drawKey = (kx: number, ky: number, label: string, sub?: string) => {
        ctx.fillStyle = '#1a1d26'
        ctx.strokeStyle = '#2a2f3a'
        ctx.lineWidth = 1.5
        roundRect(ctx, kx, ky, keySize, keySize, keyR)
        ctx.fill()
        roundRect(ctx, kx, ky, keySize, keySize, keyR)
        ctx.stroke()

        ctx.fillStyle = '#d4d4dc'
        ctx.font = sub
          ? "bold 11px 'Inter', sans-serif"
          : "bold 14px 'Inter', sans-serif"
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, kx + keySize / 2, ky + keySize / 2 + (sub ? -4 : 0))

        if (sub) {
          ctx.font = "9px 'Inter', sans-serif"
          ctx.fillStyle = '#6b7280'
          ctx.fillText(sub, kx + keySize / 2, ky + keySize / 2 + 10)
        }
      }

      const groupOffset = 100
      const arrowStartX = hintCx - groupOffset - keySize * 1.5 - keyGap
      const arrowStartY = hintCy - keySize / 2

      drawKey(arrowStartX + keySize + keyGap, arrowStartY - keySize - keyGap, '\u2191')
      drawKey(arrowStartX, arrowStartY, '\u2190')
      drawKey(arrowStartX + keySize + keyGap, arrowStartY, '\u2193')
      drawKey(arrowStartX + (keySize + keyGap) * 2, arrowStartY, '\u2192')

      ctx.fillStyle = '#6b7280'
      ctx.font = "12px 'Inter', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillText('or', hintCx, hintCy)

      const wasdStartX = hintCx + groupOffset - keySize * 1.5 - keyGap
      const wasdStartY = hintCy - keySize / 2

      drawKey(wasdStartX + keySize + keyGap, wasdStartY - keySize - keyGap, 'W')
      drawKey(wasdStartX, wasdStartY, 'A')
      drawKey(wasdStartX + keySize + keyGap, wasdStartY, 'S')
      drawKey(wasdStartX + (keySize + keyGap) * 2, wasdStartY, 'D')

      const spaceY = hintCy + keySize / 2 + keyGap + 16
      const spaceW = 120
      const spaceH = 32
      const spaceX = hintCx - spaceW / 2
      ctx.fillStyle = '#1a1d26'
      ctx.strokeStyle = '#2a2f3a'
      ctx.lineWidth = 1.5
      roundRect(ctx, spaceX, spaceY, spaceW, spaceH, keyR)
      ctx.fill()
      roundRect(ctx, spaceX, spaceY, spaceW, spaceH, keyR)
      ctx.stroke()

      ctx.fillStyle = '#d4d4dc'
      ctx.font = "bold 11px 'Inter', sans-serif"
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('SPACE', hintCx, spaceY + spaceH / 2 - 3)

      ctx.font = "9px 'Inter', sans-serif"
      ctx.fillStyle = '#6b7280'
      ctx.fillText('jump', hintCx, spaceY + spaceH / 2 + 9)

      ctx.textAlign = 'left'
      ctx.restore()
    }

    const door = doorAnimRef.current
    if (door.active) {
      const doorProgress = Math.min(1, door.progress / 40)
      ctx.save()
      ctx.globalAlpha = doorProgress * 0.8
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, w, h)
      ctx.restore()
    }

    const level2 = LEVELS[levelIdxRef.current]
    const goal2 = level2.goal
    const screenGoalX = goal2.x - cam.x
    const screenGoalY = goal2.y - cam.y
    const nearDoorNow =
      p.x + PLAYER_SIZE > goal2.x - 10 &&
      p.x < goal2.x + goal2.w + 10 &&
      p.y + PLAYER_SIZE > goal2.y &&
      p.y < goal2.y + goal2.h

    if (
      nearDoorNow &&
      !door.active &&
      gameStateRef.current === 'playing' &&
      !isBlocking(dialogueStateRef.current)
    ) {
      goalPulseRef.current += 0.02
      const promptAlpha = 0.6 + Math.sin(goalPulseRef.current * 3) * 0.3

      ctx.save()
      ctx.globalAlpha = promptAlpha
      ctx.font = "bold 11px 'Inter', sans-serif"
      ctx.textAlign = 'center'
      ctx.fillStyle = '#d4d4dc'

      const promptY = screenGoalY - 60
      ctx.fillText('Press', screenGoalX + goal2.w / 2, promptY)

      const kw = 24
      const kh = 20
      const kx = screenGoalX + goal2.w / 2 - kw / 2
      const ky = promptY + 14
      ctx.fillStyle = '#1a1d26'
      ctx.strokeStyle = COLORS.goal
      ctx.lineWidth = 1
      roundRect(ctx, kx, ky, kw, kh, 4)
      ctx.fill()
      roundRect(ctx, kx, ky, kw, kh, 4)
      ctx.stroke()

      ctx.fillStyle = COLORS.goal
      ctx.font = "bold 10px 'Inter', sans-serif"
      ctx.textBaseline = 'middle'
      ctx.fillText('W', screenGoalX + goal2.w / 2, ky + kh / 2 + 1)

      ctx.textAlign = 'left'
      ctx.restore()
    }

    ctx.restore()
  }, [])

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const _dt = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      if (gameStateRef.current === 'playing') {
        handleInput()
        updatePhysics()
        updateParticles()
        updateDialogue()
      }
      updateCamera()
      draw()

      rafRef.current = requestAnimationFrame(gameLoop)
    },
    [handleInput, updatePhysics, updateCamera, updateParticles, updateDialogue, draw],
  )

  useEffect(() => {
    rafRef.current = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [gameLoop])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(
          e.key,
        )
      ) {
        e.preventDefault()
      }

      keysRef.current.add(e.key)

      if (e.key === ' ' || e.key === 'Enter') {
        if (gameStateRef.current === 'ready') {
          startGame()
        } else if (gameStateRef.current === 'won') {
          const next = levelIdxRef.current + 1
          if (next < LEVELS.length) {
            goToLevel(next)
          } else {
            goToLevel(0)
          }
        }
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [startGame, goToLevel])

  const highestUnlocked = (() => {
    let max = 0
    for (const c of stats.completedLevels) {
      if (c + 1 > max) max = c + 1
    }
    return Math.min(max, LEVELS.length - 1)
  })()

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex items-center gap-6 flex-wrap">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Completed</p>
          <p className="font-display text-lg font-bold text-text-heading">
            {stats.completedLevels.length}
            <span className="text-sm font-normal text-text-muted">/{LEVELS.length}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Deaths</p>
          <p className="font-display text-lg font-bold text-text-heading">{stats.deaths}</p>
        </div>
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Total Time</p>
          <p className="font-display text-lg font-bold text-text-heading">
            {formatTime(stats.totalTime)}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted ml-auto">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px]">
            WASD
          </kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px]">
            Arrows
          </kbd>
          <span>to move,</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px]">
            Space
          </kbd>
          <span>to jump</span>
        </div>
      </div>

      {/* Level selector */}
      <div className="flex items-center gap-2 flex-wrap">
        {LEVELS.map((_, i) => {
          const isCompleted = stats.completedLevels.includes(i)
          const isUnlocked = i <= highestUnlocked
          const isActive = i === levelIdx
          return (
            <button
              key={i}
              disabled={!isUnlocked}
              onClick={() => {
                if (isUnlocked) goToLevel(i)
              }}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                  : isUnlocked
                    ? 'bg-bg-card border border-border text-text-muted hover:border-accent/40 hover:text-text-heading'
                    : 'bg-bg-card/50 border border-border/40 text-text-muted/30 cursor-not-allowed'
              }`}
            >
              {isCompleted && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-bg flex items-center justify-center">
                  <svg className="w-1.5 h-1.5 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              {!isUnlocked && (
                <svg className="inline w-3 h-3 mr-1 -mt-px opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
              Level {i + 1}
            </button>
          )
        })}
      </div>

      {/* Game canvas */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-border game-canvas-glow overflow-hidden mx-auto"
        style={{ width: canvasWidth, height: canvasHeight }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth * 2}
          height={canvasHeight * 2}
          style={{ width: canvasWidth, height: canvasHeight }}
          className="block"
        />

        <AnimatePresence>
          {gameState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-bg/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, ease }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
                    />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-text-heading mb-2">
                  Ready to play?
                </p>
                <p className="text-sm text-text-muted mb-1">
                  Get from{' '}
                  <span className="text-amber-400 font-medium">left</span> to{' '}
                  <span className="text-indigo font-medium">right</span>
                </p>
                <p className="text-sm text-text-muted">
                  Press{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px] text-amber-300">
                    Space
                  </kbd>{' '}
                  to start
                </p>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'won' && (
            <motion.div
              key="won"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-bg/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ease }}
                className="text-center"
              >
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo mb-2">
                  Level Complete
                </p>
                <p className="font-display text-4xl font-bold text-text-heading mb-1">
                  Level {levelIdx + 1}
                </p>
                <p className="text-sm text-text-muted mb-6">
                  {levelIdx + 1 < LEVELS.length
                    ? 'Ready for the next challenge?'
                    : 'You beat all levels!'}
                </p>
                {levelIdx + 1 < LEVELS.length ? (
                  <button
                    onClick={() => goToLevel(levelIdxRef.current + 1)}
                    className="inline-flex items-center gap-2 rounded-full bg-indigo px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo/25 transition-all hover:brightness-110 hover:shadow-indigo/40 hover:-translate-y-0.5"
                  >
                    Next Level
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => goToLevel(0)}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-400 hover:shadow-amber-500/40 hover:-translate-y-0.5"
                  >
                    Play Again
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                      />
                    </svg>
                  </button>
                )}
                <p className="mt-4 text-xs text-text-muted">
                  or press{' '}
                  <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px] text-accent-light">
                    Space
                  </kbd>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="sm:hidden px-1">
        <p className="text-xs text-text-muted">
          Use arrow keys or WASD to move, Space to jump
        </p>
      </div>

      {dialogueLog.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-bg-card/50 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-muted/50 mb-3 font-medium">
            Dialogue
          </p>
          <div className="space-y-2">
            {dialogueLog.map((text, i) => (
              <motion.div
                key={`${levelIdx}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
                <p className="text-sm text-text-muted/80 leading-relaxed italic">
                  &ldquo;{text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}
