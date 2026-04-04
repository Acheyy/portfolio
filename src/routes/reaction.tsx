import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '~/components/Navbar'
import { Footer } from '~/components/Footer'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/reaction')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Reaction Time — Porfo',
      description: 'Test your reflexes. Click the moment the screen changes color.',
      path: '/reaction',
    }),
    links: [createCanonicalLink('/reaction')],
  }),
  component: ReactionPage,
})

const ease = [0.22, 1, 0.36, 1] as const
const TOTAL_ROUNDS = 5

type Phase = 'ready' | 'waiting' | 'go' | 'too-early' | 'result' | 'done'

function ReactionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-2xl">
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
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-pink-400 mb-3">
              Mini Game
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Reaction <span className="gradient-text">Time</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <ReactionGame />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function ReactionGame() {
  const [phase, setPhase] = useState<Phase>('ready')
  const [round, setRound] = useState(0)
  const [times, setTimes] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [bestAvg, setBestAvg] = useState<number | null>(null)

  const goTimestampRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('reaction-best-avg')
    if (stored) setBestAvg(parseFloat(stored))
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const startWaiting = useCallback(() => {
    setPhase('waiting')
    const delay = 1500 + Math.random() * 3500
    timeoutRef.current = setTimeout(() => {
      goTimestampRef.current = performance.now()
      setPhase('go')
    }, delay)
  }, [])

  function handleClick() {
    if (phase === 'ready') {
      setRound(1)
      setTimes([])
      startWaiting()
      return
    }

    if (phase === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setPhase('too-early')
      return
    }

    if (phase === 'go') {
      const elapsed = Math.round(performance.now() - goTimestampRef.current)
      setCurrentTime(elapsed)
      const newTimes = [...times, elapsed]
      setTimes(newTimes)

      if (newTimes.length >= TOTAL_ROUNDS) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / newTimes.length)
        const stored = localStorage.getItem('reaction-best-avg')
        const prev = stored ? parseFloat(stored) : null
        if (prev === null || avg < prev) {
          localStorage.setItem('reaction-best-avg', String(avg))
          setBestAvg(avg)
        }
        setPhase('done')
      } else {
        setPhase('result')
      }
      return
    }

    if (phase === 'too-early') {
      startWaiting()
      return
    }

    if (phase === 'result') {
      setRound((r) => r + 1)
      startWaiting()
      return
    }

    if (phase === 'done') {
      setRound(1)
      setTimes([])
      setCurrentTime(0)
      startWaiting()
    }
  }

  const average = times.length > 0
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0

  function getRating(ms: number): string {
    if (ms < 200) return 'Superhuman'
    if (ms < 250) return 'Incredible'
    if (ms < 300) return 'Great'
    if (ms < 350) return 'Good'
    if (ms < 400) return 'Average'
    return 'Keep practicing'
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {phase !== 'ready' && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Round</p>
              <p className="font-display text-2xl font-bold text-text-heading">
                {Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
              </p>
            </div>
          )}
          {times.length > 0 && phase !== 'done' && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Avg</p>
              <p className="font-display text-2xl font-bold text-text-heading">{average}ms</p>
            </div>
          )}
          {bestAvg !== null && (
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">Your Best</p>
              <p className="font-display text-2xl font-bold text-pink-400">{bestAvg}ms</p>
            </div>
          )}
        </div>
      </div>

      <div
        onClick={handleClick}
        className={`relative rounded-xl border overflow-hidden select-none cursor-pointer transition-colors duration-200 ${
          phase === 'go'
            ? 'border-pink-400/50'
            : phase === 'too-early'
              ? 'border-red-500/50'
              : 'border-border'
        }`}
        style={{ minHeight: 420 }}
      >
          {phase === 'ready' && (
            <PhasePanel key="ready" className="bg-bg-card" animate>
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-pink-400/10 border border-pink-400/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-display text-xl font-semibold text-text-heading mb-2">
                Test your reflexes
              </p>
              <p className="text-sm text-text-muted max-w-xs mx-auto mb-6">
                Click when the screen turns <span className="text-pink-400 font-medium">pink</span>. Don&apos;t click too early!
              </p>
              <p className="text-sm text-text-muted">
                Click anywhere to start
              </p>
            </PhasePanel>
          )}

          {phase === 'waiting' && (
            <PhasePanel key="waiting" className="bg-bg-card" animate>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-amber-500/40 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="font-display text-2xl font-bold text-amber-400">
                Wait for it...
              </p>
              <p className="text-sm text-text-muted mt-2">
                Don&apos;t click yet
              </p>
            </PhasePanel>
          )}

          {phase === 'go' && (
            <PhasePanel key="go" className="bg-pink-500/15">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pink-400/20 border-2 border-pink-400 flex items-center justify-center shadow-lg shadow-pink-400/20">
                  <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                  </svg>
                </div>
                <p className="font-display text-3xl font-bold text-pink-400">
                  CLICK NOW!
                </p>
              </div>
            </PhasePanel>
          )}

          {phase === 'too-early' && (
            <PhasePanel key="early" className="bg-red-500/10" animate>
              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="font-display text-2xl font-bold text-red-400 mb-2">
                Too early!
              </p>
              <p className="text-sm text-text-muted">
                Click to try this round again
              </p>
            </PhasePanel>
          )}

          {phase === 'result' && (
            <PhasePanel key="result" className="bg-bg-card" animate>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-pink-400 mb-1">
                Round {round}
              </p>
              <p className="font-display text-5xl font-bold text-text-heading mb-1">
                {currentTime}<span className="text-2xl text-text-muted ml-1">ms</span>
              </p>
              <p className="text-sm text-text-muted mb-6">
                {getRating(currentTime)}
              </p>
              <p className="text-sm text-text-muted">
                Click for next round
              </p>
            </PhasePanel>
          )}

          {phase === 'done' && (
            <PhasePanel key="done" className="bg-bg-card" animate>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-pink-400 mb-2">
                Results
              </p>
              <p className="font-display text-5xl font-bold text-text-heading mb-1">
                {average}<span className="text-2xl text-text-muted ml-1">ms</span>
              </p>
              <p className="text-base text-text-muted mb-2">
                {getRating(average)}
              </p>
              {bestAvg !== null && average <= bestAvg && (
                <p className="text-sm font-medium text-pink-400 mb-2">New best!</p>
              )}

              <div className="flex items-center justify-center gap-3 mt-4 mb-6">
                {times.map((t, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[10px] text-text-muted uppercase">R{i + 1}</p>
                    <p className="font-mono text-sm text-text-heading">{t}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-text-muted">
                Click to play again
              </p>
            </PhasePanel>
          )}
      </div>
    </div>
  )
}

function PhasePanel({
  children,
  className,
  animate: shouldAnimate,
}: {
  children: React.ReactNode
  className: string
  animate?: boolean
}) {
  const base = `flex flex-col items-center justify-center text-center px-6 min-h-[420px] ${className}`

  if (shouldAnimate) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={base}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={base}>
      {children}
    </div>
  )
}
