import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/memory')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Memory Cards — Porfo',
      description: 'Flip and match pairs. How few moves can you do it in?',
      path: '/memory',
    }),
    links: [createCanonicalLink('/memory')],
  }),
  component: MemoryPage,
})

const ease = [0.22, 1, 0.36, 1] as const

const SYMBOLS = ['🚀', '⚡', '🎮', '💎', '🔮', '🎯', '🌊', '🔥']

type Card = {
  id: number
  symbol: string
  flipped: boolean
  matched: boolean
}

type GameState = 'ready' | 'playing' | 'won'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS]
  return shuffle(pairs).map((symbol, i) => ({
    id: i,
    symbol,
    flipped: false,
    matched: false,
  }))
}

function MemoryPage() {
  return (
    <>
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-xl">
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
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo mb-3">
              Mini Game
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Memory <span className="gradient-text">Cards</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <MemoryGame />
          </motion.div>
        </div>
      </main>
    </>
  )
}

function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(createDeck)
  const [flippedIds, setFlippedIds] = useState<number[]>([])
  const [gameState, setGameState] = useState<GameState>('ready')
  const [moves, setMoves] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [bestMoves, setBestMoves] = useState<number | null>(null)

  const lockRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef(0)

  useEffect(() => {
    const stored = localStorage.getItem('memory-best-moves')
    if (stored) setBestMoves(parseInt(stored, 10))
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 200)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleWin = useCallback((totalMoves: number) => {
    stopTimer()
    setGameState('won')
    const stored = localStorage.getItem('memory-best-moves')
    const prev = stored ? parseInt(stored, 10) : null
    if (prev === null || totalMoves < prev) {
      localStorage.setItem('memory-best-moves', String(totalMoves))
      setBestMoves(totalMoves)
    }
  }, [stopTimer])

  function handleCardClick(id: number) {
    if (lockRef.current) return
    if (gameState === 'won') return

    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    if (gameState === 'ready') {
      setGameState('playing')
      startTimer()
    }

    const newFlipped = [...flippedIds, id]
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)))
    setFlippedIds(newFlipped)

    if (newFlipped.length === 2) {
      const newMoves = moves + 1
      setMoves(newMoves)
      lockRef.current = true

      const [first, second] = newFlipped
      const cardA = cards.find((c) => c.id === first)!
      const cardB = cards.find((c) => c.id === second)!

      if (cardA.symbol === cardB.symbol) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c) =>
              c.id === first || c.id === second ? { ...c, matched: true } : c,
            )
            if (updated.every((c) => c.matched)) {
              handleWin(newMoves)
            }
            return updated
          })
          setFlippedIds([])
          lockRef.current = false
        }, 400)
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c,
            ),
          )
          setFlippedIds([])
          lockRef.current = false
        }, 800)
      }
    }
  }

  function resetGame() {
    stopTimer()
    lockRef.current = false
    setCards(createDeck())
    setFlippedIds([])
    setMoves(0)
    setElapsed(0)
    setGameState('ready')
  }

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Moves</p>
            <p className="font-display text-2xl font-bold text-text-heading">{moves}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider">Time</p>
            <p className="font-display text-2xl font-bold text-text-heading">{timeStr}</p>
          </div>
          {bestMoves !== null && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Your Best</p>
              <p className="font-display text-2xl font-bold text-indigo">{bestMoves} moves</p>
            </div>
          )}
        </div>
        {gameState === 'playing' && (
          <button
            onClick={resetGame}
            className="text-xs font-medium text-text-muted hover:text-accent-light transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <div className="relative">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
        </div>

        <AnimatePresence>
          {gameState === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-bg/40 pointer-events-none"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, ease }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo/10 border border-indigo/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-indigo" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
                <p className="font-display text-lg font-semibold text-text-heading mb-2">
                  Match all pairs
                </p>
                <p className="text-sm text-text-muted">
                  Flip any card to begin
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
              className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-bg/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ease }}
                className="text-center"
              >
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo mb-2">
                  You Win
                </p>
                <p className="font-display text-4xl font-bold text-text-heading mb-1">
                  {moves} moves
                </p>
                <p className="text-sm text-text-muted mb-1">
                  in {timeStr}
                </p>
                <p className="text-sm text-text-muted mb-6">
                  {bestMoves !== null && moves <= bestMoves ? 'New best!' : bestMoves !== null ? `Your best: ${bestMoves} moves` : ''}
                </p>
                <button
                  onClick={resetGame}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo/25 transition-all hover:brightness-110 hover:shadow-indigo/40 hover:-translate-y-0.5"
                >
                  Play Again
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MemoryCard({ card, onClick }: { card: Card; onClick: () => void }) {
  const isRevealed = card.flipped || card.matched

  return (
    <div
      className="aspect-square cursor-pointer [perspective:600px]"
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isRevealed ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Back (face-down) */}
        <div className="absolute inset-0 rounded-xl bg-bg-card border border-border flex items-center justify-center [backface-visibility:hidden] hover:bg-bg-card-hover hover:border-indigo/30 transition-colors">
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Front (face-up) */}
        <div
          className={`absolute inset-0 rounded-xl border flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-300 ${
            card.matched
              ? 'bg-indigo/10 border-indigo/40 shadow-lg shadow-indigo/10'
              : 'bg-bg-card-hover border-border'
          }`}
        >
          <span className="text-3xl sm:text-4xl select-none">{card.symbol}</span>
        </div>
      </div>
    </div>
  )
}
