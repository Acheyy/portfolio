import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/games')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Mini Games — Porfo',
      description: 'A collection of fun mini games. Take a break and play.',
      path: '/games',
    }),
    links: [createCanonicalLink('/games')],
  }),
  component: GamesPage,
})

const ease = [0.22, 1, 0.36, 1] as const

const games = [
  {
    slug: 'untitled' as const,
    title: 'Untitled',
    description: 'Navigate a square through obstacle courses. Arrow keys to move, Space to jump.',
    color: '#f59e0b',
    wip: true,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="9.5" cy="10" r="2" fill="#0b0d11" />
        <circle cx="14.5" cy="10" r="2" fill="#0b0d11" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'snake' as const,
    title: 'Neon Snake',
    description: 'The classic arcade game with a neon twist. Eat, grow, survive.',
    color: '#38bdf8',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect x="14" y="4" width="6" height="6" rx="1.5" fill="#7dd3fc" />
        <circle cx="16" cy="6.5" r="1" fill="#0b0d11" />
        <circle cx="18.5" cy="6.5" r="1" fill="#0b0d11" />
        <rect x="8" y="4" width="6" height="6" rx="1.5" fill="#38bdf8" />
        <rect x="8" y="10" width="6" height="6" rx="1.5" fill="#38bdf8" />
        <rect x="14" y="10" width="6" height="6" rx="1.5" fill="#38bdf8" />
        <rect x="14" y="16" width="6" height="6" rx="1.5" fill="#38bdf8" opacity="0.6" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'memory' as const,
    title: 'Memory Cards',
    description: 'Flip and match pairs before time runs out. Train your memory.',
    color: '#818cf8',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'reaction' as const,
    title: 'Reaction Time',
    description: 'How fast are your reflexes? Click the moment the screen changes.',
    color: '#f472b6',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'mind-hacker' as const,
    title: 'Mind Hacker',
    description: 'Enter a mind. Uncover secrets. A branching narrative with multiple endings.',
    color: '#34d399',
    wip: true,
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 5.5V17a2 2 0 002 2h4a2 2 0 002-2v-2.5c1.5-1 3-3 3-5.5a7 7 0 00-7-7z" />
        <path d="M9 21h6" />
        <path d="M12 2v5" />
        <path d="M8.5 8.5L12 7l3.5 1.5" />
      </svg>
    ),
    available: true,
  },
]

function GamesPage() {
  return (
    <>
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-8 mb-12"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
              Take a Break
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Mini <span className="gradient-text">Games</span>
            </h1>
            <p className="mt-4 text-text-muted text-lg max-w-xl">
              A small collection of browser games built for fun. No installs, no
              sign-ups &mdash; just play.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game, i) => (
              <motion.div
                key={game.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease }}
              >
                {game.available && game.slug ? (
                  <Link
                    to={`/${game.slug}`}
                    className="group block h-full"
                  >
                    <GameCard game={game} />
                  </Link>
                ) : (
                  <div className="h-full">
                    <GameCard game={game} />
                  </div>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + games.length * 0.1, ease }}
            >
              <div className="h-full rounded-xl border border-dashed border-border/60 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
                <p className="text-2xl">👀</p>
                <p className="font-display text-lg font-semibold text-text-muted/60">
                  More coming soon...
                </p>
                <p className="text-sm text-text-muted/40 italic">
                  maybe
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}

function GameCard({ game }: { game: (typeof games)[number] }) {
  return (
    <div
      className={`relative h-full rounded-xl border p-6 transition-all duration-300 ${
        game.available
          ? 'bg-bg-card border-border group-hover:bg-bg-card-hover group-hover:border-transparent group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/20 cursor-pointer'
          : 'bg-bg-card/50 border-border/50 opacity-60'
      }`}
    >
      {game.available && (
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${game.color}08, transparent 40%)`,
          }}
        />
      )}

      {game.wip && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
          <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Unfinished</span>
        </div>
      )}

      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors duration-300"
        style={{
          backgroundColor: `${game.color}10`,
          borderColor: `${game.color}30`,
          color: game.color,
        }}
      >
        {game.icon}
      </div>

      <h3 className="font-display text-xl font-semibold text-text-heading mb-2">
        {game.title}
      </h3>
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        {game.description}
      </p>

      {game.wip ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-400/70 group-hover:text-amber-400 group-hover:gap-2.5 transition-all">
          Try anyway
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      ) : game.available ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-light group-hover:gap-2.5 transition-all">
          Play now
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
          Coming soon
        </span>
      )}
    </div>
  )
}
