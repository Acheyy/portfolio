import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'
import {
  dialogueTree,
  INITIAL_VARIABLES,
  ENDINGS,
  type Variables,
  type Condition,
  type DialogueNode,
} from '~/data/mind-hacker'

export const Route = createFileRoute('/mind-hacker')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Mind Hacker — Porfo',
      description: 'A dialogue-driven narrative game. Enter minds. Uncover truths.',
      path: '/mind-hacker',
    }),
    links: [createCanonicalLink('/mind-hacker')],
  }),
  component: MindHackerPage,
})

const ease = [0.22, 1, 0.36, 1] as const
const TYPE_SPEED = 30

function getAct(nodeId: string): number {
  if (nodeId.startsWith('act1') || nodeId === '') return 1
  if (nodeId.startsWith('act2')) return 2
  if (nodeId.startsWith('act3')) return 3
  return 4
}

function isInsideMind(nodeId: string): boolean {
  return nodeId.startsWith('act3') || nodeId.startsWith('act4') || nodeId.startsWith('ending')
}

function checkCondition(condition: Condition, vars: Variables): boolean {
  const val = vars[condition.variable]
  switch (condition.op) {
    case '>=': return val >= condition.value
    case '<=': return val <= condition.value
    case '==': return val === condition.value
  }
}

function MindHackerPage() {
  return (
    <>
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
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400 mb-3">
              Narrative Game
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Mind <span className="gradient-text">Hacker</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <MindHackerGame />
          </motion.div>
        </div>
      </main>
    </>
  )
}

function MindHackerGame() {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'ended'>('title')
  const [currentNodeId, setCurrentNodeId] = useState('act1-start')
  const [variables, setVariables] = useState<Variables>({ ...INITIAL_VARIABLES })
  const [ending, setEnding] = useState<keyof typeof ENDINGS | null>(null)

  function startGame() {
    setCurrentNodeId('act1-start')
    setVariables({ ...INITIAL_VARIABLES })
    setEnding(null)
    setGameState('playing')
  }

  function applyEffects(effects?: Partial<Variables>) {
    if (!effects) return
    setVariables((prev) => ({
      trust: Math.max(0, Math.min(100, prev.trust + (effects.trust ?? 0))),
      insight: Math.max(0, Math.min(100, prev.insight + (effects.insight ?? 0))),
      approach: Math.max(-50, Math.min(50, prev.approach + (effects.approach ?? 0))),
    }))
  }

  function advanceToNode(nodeId: string) {
    const node = dialogueTree[nodeId]
    if (!node) return
    applyEffects(node.effects)
    setCurrentNodeId(nodeId)
    if (node.ending) {
      setEnding(node.ending)
    }
  }

  function handleChoice(nextId: string, effects?: Partial<Variables>) {
    applyEffects(effects)
    advanceToNode(nextId)
  }

  if (gameState === 'title') {
    return <TitleScreen onStart={startGame} />
  }

  if (gameState === 'ended' || ending) {
    return (
      <EndingScreen
        ending={ending!}
        variables={variables}
        onRestart={() => {
          setGameState('title')
          setEnding(null)
        }}
      />
    )
  }

  const node = dialogueTree[currentNodeId]
  if (!node) return null

  return (
    <div className="space-y-5">
      <GameHeader
        act={getAct(currentNodeId)}
        variables={variables}
        insideMind={isInsideMind(currentNodeId)}
      />
      <DialogueBox
        key={currentNodeId}
        node={node}
        variables={variables}
        insideMind={isInsideMind(currentNodeId)}
        onAdvance={() => {
          if (node.next) advanceToNode(node.next)
        }}
        onChoice={handleChoice}
      />
    </div>
  )
}

function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
      <div className="flex flex-col items-center justify-center text-center px-8 py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-text-heading mb-3">
          Enter the Mind
        </h2>
        <p className="text-sm text-text-muted max-w-sm mx-auto mb-2">
          Dr. Elara Voss is hiding something. Your job: interface with her consciousness
          and find the truth.
        </p>
        <p className="text-xs text-text-muted/60 max-w-xs mx-auto mb-8">
          Your choices shape the story. There are multiple endings.
        </p>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
        >
          Begin Investigation
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  )
}

function GameHeader({
  act,
  variables,
  insideMind,
}: {
  act: number
  variables: Variables
  insideMind: boolean
}) {
  const actLabels = ['', 'Briefing', 'First Contact', 'The Mind', 'The Core']

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            insideMind ? 'text-emerald-400' : 'text-text-muted'
          }`}
        >
          Act {act}
        </span>
        <span className="text-text-muted/30">—</span>
        <span className="text-xs text-text-muted">{actLabels[act]}</span>
      </div>
      <div className="flex items-center gap-3">
        <VarBar label="Trust" value={variables.trust} max={100} color="#34d399" />
        <VarBar label="Insight" value={variables.insight} max={100} color="#38bdf8" />
        <ApproachBar value={variables.approach} />
      </div>
    </div>
  )
}

function VarBar({
  label,
  value,
  max,
  color,
}: {
  label: string
  value: number
  max: number
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-text-muted uppercase tracking-wide hidden sm:inline">
        {label}
      </span>
      <div className="w-14 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.5, ease }}
        />
      </div>
    </div>
  )
}

function ApproachBar({ value }: { value: number }) {
  const percent = ((value + 50) / 100) * 100

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-text-muted uppercase tracking-wide hidden sm:inline">
        Approach
      </span>
      <div className="relative w-14 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          className="absolute top-0 h-full w-1.5 rounded-full"
          style={{
            backgroundColor: value >= 0 ? '#34d399' : '#f87171',
            left: `calc(${percent}% - 3px)`,
          }}
          initial={false}
          animate={{ left: `calc(${percent}% - 3px)` }}
          transition={{ duration: 0.5, ease }}
        />
        <div className="absolute top-0 left-1/2 w-px h-full bg-text-muted/30" />
      </div>
    </div>
  )
}

function DialogueBox({
  node,
  variables,
  insideMind,
  onAdvance,
  onChoice,
}: {
  node: DialogueNode
  variables: Variables
  insideMind: boolean
  onAdvance: () => void
  onChoice: (nextId: string, effects?: Partial<Variables>) => void
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const indexRef = useRef(0)

  const fullText = node.text

  useEffect(() => {
    setDisplayedText('')
    setIsTyping(true)
    indexRef.current = 0

    intervalRef.current = setInterval(() => {
      indexRef.current += 1
      if (indexRef.current >= fullText.length) {
        setDisplayedText(fullText)
        setIsTyping(false)
        if (intervalRef.current) clearInterval(intervalRef.current)
      } else {
        setDisplayedText(fullText.slice(0, indexRef.current))
      }
    }, TYPE_SPEED)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [fullText])

  const skipTyping = useCallback(() => {
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayedText(fullText)
      setIsTyping(false)
    }
  }, [isTyping, fullText])

  function handleBoxClick() {
    if (isTyping) {
      skipTyping()
      return
    }
    if (node.next && !node.choices) {
      onAdvance()
    }
  }

  const speakerConfig = {
    narrator: { name: 'Narrator', color: 'text-text-muted', italic: true },
    elara: { name: 'Dr. Voss', color: 'text-emerald-400', italic: false },
    player: { name: 'You', color: 'text-accent-light', italic: false },
    thought: { name: 'Hidden Thought', color: 'text-purple-400', italic: true },
  }

  const speaker = speakerConfig[node.speaker]
  const hasChoices = node.choices && node.choices.length > 0
  const availableChoices = hasChoices
    ? node.choices!.filter((c) => !c.condition || checkCondition(c.condition, variables))
    : []

  return (
    <div className="space-y-3">
      <div
        onClick={handleBoxClick}
        className={`rounded-xl border p-5 sm:p-6 transition-all duration-500 cursor-pointer min-h-[180px] flex flex-col justify-between ${
          insideMind
            ? 'bg-bg-card border-emerald-400/20 shadow-lg shadow-emerald-400/5'
            : 'bg-bg-card border-border'
        } ${node.speaker === 'thought' ? 'border-purple-400/20 shadow-purple-400/5' : ''}`}
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${speaker.color}`}>
              {speaker.name}
            </span>
            {node.emotion && (
              <span className="text-[10px] text-text-muted/50 italic">
                ({node.emotion})
              </span>
            )}
          </div>

          <p
            className={`text-base sm:text-lg leading-relaxed text-text ${
              speaker.italic ? 'italic' : ''
            } ${node.speaker === 'thought' ? 'text-purple-300/80' : ''}`}
          >
            {node.speaker === 'thought' ? displayedText : `"${displayedText}${isTyping ? '' : '"'}`}
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-text-muted ml-0.5 animate-pulse align-middle" />
            )}
          </p>
        </div>

        {!isTyping && node.next && !hasChoices && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-text-muted/40 mt-4 text-right"
          >
            click to continue
          </motion.p>
        )}
      </div>

      <AnimatePresence>
        {!isTyping && availableChoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease }}
            className="space-y-2"
          >
            {availableChoices.map((choice, i) => (
              <motion.button
                key={choice.next}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1, ease }}
                onClick={() => onChoice(choice.next, choice.effects)}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                  choice.style === 'empathetic'
                    ? 'border-l-2 border-l-emerald-400/60 border-border bg-bg-card hover:bg-emerald-400/5 hover:border-emerald-400/30 text-text'
                    : choice.style === 'aggressive'
                      ? 'border-l-2 border-l-red-400/60 border-border bg-bg-card hover:bg-red-400/5 hover:border-red-400/30 text-text'
                      : 'border-border bg-bg-card hover:bg-bg-card-hover text-text'
                }`}
              >
                {choice.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EndingScreen({
  ending,
  variables,
  onRestart,
}: {
  ending: keyof typeof ENDINGS
  variables: Variables
  onRestart: () => void
}) {
  const info = ENDINGS[ending]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="rounded-xl border border-border bg-bg-card overflow-hidden"
    >
      <div className="flex flex-col items-center justify-center text-center px-8 py-16">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-text-muted mb-4">
            Investigation Complete
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold mb-2"
            style={{ color: info.color }}
          >
            {info.title}
          </h2>
          <p className="text-sm text-text-muted max-w-sm mx-auto mb-8">
            {info.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease }}
          className="flex items-center gap-6 mb-8"
        >
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Trust</p>
            <p className="font-display text-xl font-bold text-emerald-400">{variables.trust}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Insight</p>
            <p className="font-display text-xl font-bold text-accent">{variables.insight}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Approach</p>
            <p className={`font-display text-xl font-bold ${variables.approach >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {variables.approach > 0 ? '+' : ''}{variables.approach}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
          >
            Play Again
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
          <p className="text-xs text-text-muted/50">
            There are {Object.keys(ENDINGS).length} endings to discover
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
