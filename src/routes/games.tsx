import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Navbar } from '~/components/Navbar'
import { Footer } from '~/components/Footer'

export const Route = createFileRoute('/games')({
  head: () => ({
    meta: [
      { title: 'Mini Games — Portfolio' },
      {
        name: 'description',
        content: 'A collection of fun mini games. Take a break and play.',
      },
    ],
  }),
  component: GamesPage,
})

const ease = [0.22, 1, 0.36, 1] as const

const games = [
  {
    slug: 'snake',
    title: 'Neon Snake',
    description: 'The classic arcade game with a neon twist. Eat, grow, survive.',
    color: '#38bdf8',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'memory',
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
    slug: 'reaction',
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
    slug: 'untitled',
    title: 'Untitled',
    description: 'Navigate a square through obstacle courses. Arrow keys to move, Space to jump.',
    color: '#f59e0b',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    available: true,
  },
  {
    slug: 'mind-hacker',
    title: 'Mind Hacker',
    description: 'Enter a mind. Uncover secrets. A branching narrative with multiple endings.',
    color: '#34d399',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    available: true,
  },
]

function GamesPage() {
  return (
    <>
      <Navbar />
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
      <Footer />
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

      {game.available ? (
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
