import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/snake')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Snake — Porfo',
      description: 'A neon-themed Snake game. How high can you score?',
      path: '/snake',
    }),
    links: [createCanonicalLink('/snake')],
  }),
  component: SnakePage,
})

type Point = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameState = 'ready' | 'playing' | 'over'

const GRID_SIZE = 20
const INITIAL_SPEED = 150
const MIN_SPEED = 80
const SPEED_INCREMENT = 5

const COLORS = {
  bg: '#0b0d11',
  grid: '#1a1d25',
  snake: '#38bdf8',
  snakeGlow: '#38bdf8',
  snakeHead: '#7dd3fc',
  food: '#818cf8',
  foodGlow: '#818cf8',
}

const ease = [0.22, 1, 0.36, 1] as const

function getInitialSnake(): Point[] {
  const mid = Math.floor(GRID_SIZE / 2)
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

function spawnFood(snake: Point[]): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`))
  const available: Point[] = []
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) available.push({ x, y })
    }
  }
  return available[Math.floor(Math.random() * available.length)]
}

function SnakePage() {
  return (
    <>
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link
              to="/games"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
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
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
              Mini Game
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Neon <span className="gradient-text">Snake</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <SnakeGame />
          </motion.div>
        </div>
      </main>
    </>
  )
}

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [canvasSize, setCanvasSize] = useState(400)

  const [gameState, setGameState] = useState<GameState>('ready')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)

  const snakeRef = useRef<Point[]>(getInitialSnake())
  const foodRef = useRef<Point>(spawnFood(getInitialSnake()))
  const dirRef = useRef<Direction>('RIGHT')
  const nextDirRef = useRef<Direction>('RIGHT')
  const scoreRef = useRef(0)
  const gameStateRef = useRef<GameState>('ready')
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number>(0)
  const foodPulseRef = useRef(0)

  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('snake-highscore')
    if (stored) setHighScore(parseInt(stored, 10))
  }, [])

  useEffect(() => {
    function measure() {
      if (containerRef.current?.parentElement) {
        const w = containerRef.current.parentElement.clientWidth
        setCanvasSize(Math.min(w, 640))
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = canvas.width
    const cell = size / GRID_SIZE

    ctx.clearRect(0, 0, size, size)

    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, size, size)

    ctx.strokeStyle = COLORS.grid
    ctx.lineWidth = 0.5
    for (let i = 1; i < GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cell, 0)
      ctx.lineTo(i * cell, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cell)
      ctx.lineTo(size, i * cell)
      ctx.stroke()
    }

    const snake = snakeRef.current
    const food = foodRef.current

    foodPulseRef.current += 0.05
    const pulseScale = 0.8 + Math.sin(foodPulseRef.current) * 0.2
    const foodRadius = (cell * 0.4) * pulseScale

    ctx.save()
    ctx.shadowColor = COLORS.foodGlow
    ctx.shadowBlur = 15
    ctx.fillStyle = COLORS.food
    ctx.beginPath()
    ctx.arc(
      food.x * cell + cell / 2,
      food.y * cell + cell / 2,
      foodRadius,
      0,
      Math.PI * 2,
    )
    ctx.fill()
    ctx.restore()

    snake.forEach((seg, i) => {
      const isHead = i === 0
      const radius = cell * (isHead ? 0.45 : 0.4)
      const alpha = 1 - (i / snake.length) * 0.5

      ctx.save()
      ctx.shadowColor = COLORS.snakeGlow
      ctx.shadowBlur = isHead ? 20 : 10
      ctx.globalAlpha = alpha
      ctx.fillStyle = isHead ? COLORS.snakeHead : COLORS.snake
      ctx.beginPath()
      ctx.arc(
        seg.x * cell + cell / 2,
        seg.y * cell + cell / 2,
        radius,
        0,
        Math.PI * 2,
      )
      ctx.fill()
      ctx.restore()
    })

    rafRef.current = requestAnimationFrame(draw)
  }, [])

  const getSpeed = useCallback((currentScore: number) => {
    return Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(currentScore / 5) * SPEED_INCREMENT)
  }, [])

  const endGame = useCallback(() => {
    gameStateRef.current = 'over'
    setGameState('over')
    if (tickRef.current) clearTimeout(tickRef.current)

    const final = scoreRef.current
    const stored = parseInt(localStorage.getItem('snake-highscore') || '0', 10)
    if (final > stored) {
      localStorage.setItem('snake-highscore', String(final))
      setHighScore(final)
    }
  }, [])

  const tick = useCallback(() => {
    if (gameStateRef.current !== 'playing') return

    dirRef.current = nextDirRef.current
    const snake = snakeRef.current
    const head = snake[0]
    const dir = dirRef.current

    const next: Point = {
      x: head.x + (dir === 'LEFT' ? -1 : dir === 'RIGHT' ? 1 : 0),
      y: head.y + (dir === 'UP' ? -1 : dir === 'DOWN' ? 1 : 0),
    }

    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      endGame()
      return
    }

    if (snake.some((s) => s.x === next.x && s.y === next.y)) {
      endGame()
      return
    }

    const ate = next.x === foodRef.current.x && next.y === foodRef.current.y
    const newSnake = [next, ...snake]
    if (!ate) {
      newSnake.pop()
    } else {
      scoreRef.current += 1
      setScore(scoreRef.current)
      foodRef.current = spawnFood(newSnake)
    }
    snakeRef.current = newSnake

    if (tickRef.current) clearTimeout(tickRef.current)
    tickRef.current = setTimeout(tick, getSpeed(scoreRef.current))
  }, [endGame, getSpeed])

  const startGame = useCallback(() => {
    if (tickRef.current) {
      clearTimeout(tickRef.current)
      tickRef.current = null
    }
    snakeRef.current = getInitialSnake()
    foodRef.current = spawnFood(snakeRef.current)
    dirRef.current = 'RIGHT'
    nextDirRef.current = 'RIGHT'
    scoreRef.current = 0
    setScore(0)
    gameStateRef.current = 'playing'
    setGameState('playing')
    tickRef.current = setTimeout(tick, INITIAL_SPEED)
  }, [tick])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (tickRef.current) clearTimeout(tickRef.current)
    }
  }, [draw])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (gameStateRef.current === 'ready' || gameStateRef.current === 'over') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          startGame()
        }
        return
      }

      const dir = dirRef.current
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          if (dir !== 'DOWN') nextDirRef.current = 'UP'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          if (dir !== 'UP') nextDirRef.current = 'DOWN'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          if (dir !== 'RIGHT') nextDirRef.current = 'LEFT'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          if (dir !== 'LEFT') nextDirRef.current = 'RIGHT'
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [startGame])

  const changeDirection = useCallback((newDir: Direction) => {
    if (gameStateRef.current !== 'playing') return
    const dir = dirRef.current
    if (newDir === 'UP' && dir !== 'DOWN') nextDirRef.current = 'UP'
    else if (newDir === 'DOWN' && dir !== 'UP') nextDirRef.current = 'DOWN'
    else if (newDir === 'LEFT' && dir !== 'RIGHT') nextDirRef.current = 'LEFT'
    else if (newDir === 'RIGHT' && dir !== 'LEFT') nextDirRef.current = 'RIGHT'
  }, [])

  function handleTouchStart(e: React.TouchEvent) {
    if (gameStateRef.current === 'playing') e.preventDefault()
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (gameStateRef.current === 'playing') e.preventDefault()
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (gameStateRef.current === 'playing') e.preventDefault()
    if (!touchStartRef.current) return
    const touch = e.changedTouches[0]
    const dx = touch.clientX - touchStartRef.current.x
    const dy = touch.clientY - touchStartRef.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (Math.max(absDx, absDy) < 20) {
      if (gameStateRef.current !== 'playing') startGame()
      return
    }

    if (absDx > absDy) {
      changeDirection(dx > 0 ? 'RIGHT' : 'LEFT')
    } else {
      changeDirection(dy > 0 ? 'DOWN' : 'UP')
    }
    touchStartRef.current = null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Score</p>
            <p className="font-display text-2xl font-bold text-text-heading">{score}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Your Best</p>
            <p className="font-display text-2xl font-bold text-accent">{highScore}</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px]">WASD</kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px]">Arrows</kbd>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative rounded-xl border border-border game-canvas-glow overflow-hidden mx-auto"
        style={{ width: canvasSize, height: canvasSize, touchAction: gameState === 'playing' ? 'none' : 'auto' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize * 2}
          height={canvasSize * 2}
          style={{ width: canvasSize, height: canvasSize }}
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
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-text-heading mb-2">
                  Ready to play?
                </p>
                <p className="text-sm text-text-muted">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px] text-accent-light">Space</kbd> or tap to start
                </p>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'over' && (
            <motion.div
              key="over"
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
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-red-400 mb-2">
                  Game Over
                </p>
                <p className="font-display text-5xl font-bold text-text-heading mb-1">
                  {score}
                </p>
                <p className="text-sm text-text-muted mb-6">
                  {score >= highScore && score > 0 ? 'New high score!' : `Best: ${highScore}`}
                </p>
                <button
                  onClick={() => { if (gameStateRef.current !== 'playing') startGame() }}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5"
                >
                  Play Again
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                </button>
                <p className="mt-4 text-xs text-text-muted">
                  or press <kbd className="px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono text-[10px] text-accent-light">Space</kbd>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileControls
        onDirection={changeDirection}
        onCenter={() => {
          if (gameStateRef.current !== 'playing') startGame()
        }}
      />
    </div>
  )
}

function MobileControls({
  onDirection,
  onCenter,
}: {
  onDirection: (d: Direction) => void
  onCenter: () => void
}) {
  const [showDPad, setShowDPad] = useState(false)

  return (
    <div className="sm:hidden space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-text-muted">
          Swipe on the canvas to move, tap to start
        </p>
        <button
          type="button"
          onClick={() => setShowDPad((v) => !v)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent-light transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
          {showDPad ? 'Hide' : 'Show'} controls
        </button>
      </div>

      <AnimatePresence>
        {showDPad && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="flex justify-center overflow-hidden"
          >
            <DPad onDirection={onDirection} onCenter={onCenter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DPad({
  onDirection,
  onCenter,
}: {
  onDirection: (d: Direction) => void
  onCenter: () => void
}) {
  const btnBase =
    'w-14 h-14 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-muted active:bg-accent/20 active:border-accent/40 active:text-accent-light transition-colors touch-manipulation select-none'

  return (
    <div className="grid grid-cols-3 gap-1.5 w-[186px] pb-2">
      <div />
      <button
        type="button"
        className={btnBase}
        onTouchStart={(e) => { e.preventDefault(); onDirection('UP') }}
        onMouseDown={() => onDirection('UP')}
        aria-label="Up"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
      <div />

      <button
        type="button"
        className={btnBase}
        onTouchStart={(e) => { e.preventDefault(); onDirection('LEFT') }}
        onMouseDown={() => onDirection('LEFT')}
        aria-label="Left"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        type="button"
        className={`${btnBase} !bg-accent/10 !border-accent/20`}
        onTouchStart={(e) => { e.preventDefault(); onCenter() }}
        onMouseDown={onCenter}
        aria-label="Start"
      >
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
        </svg>
      </button>
      <button
        type="button"
        className={btnBase}
        onTouchStart={(e) => { e.preventDefault(); onDirection('RIGHT') }}
        onMouseDown={() => onDirection('RIGHT')}
        aria-label="Right"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div />
      <button
        type="button"
        className={btnBase}
        onTouchStart={(e) => { e.preventDefault(); onDirection('DOWN') }}
        onMouseDown={() => onDirection('DOWN')}
        aria-label="Down"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div />
    </div>
  )
}
