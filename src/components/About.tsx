import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

export function About() {
  return (
    <section id="about" className="snap-section relative flex items-center px-6 py-20 sm:py-0 overflow-hidden">
      <div className="orb w-[350px] h-[350px] bg-indigo top-0 right-0 animate-pulse-glow" />

      <div className="mx-auto max-w-6xl w-full min-w-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-2 sm:mb-3">
            About
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-text-heading">
            A bit about me
          </h2>
        </motion.div>

        <div className="mt-4 sm:mt-10 grid gap-5 sm:gap-12 lg:grid-cols-5 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 space-y-2 sm:space-y-4 text-sm sm:text-base text-text-muted leading-relaxed"
          >
            <p>
              With over a decade of experience in software development, I&apos;ve
              built everything from small business sites to complex full-stack
              platforms. I know how to ship fast and ship well.
            </p>
            <p>
              What sets me apart is how I work. I leverage AI tools like Cursor
              and Copilot to accelerate development &mdash; but I never ship
              blindly. Every line gets reviewed, tested, and validated by hand.
              AI speeds up the writing; I make sure the thinking is right.
            </p>
            <p className="hidden sm:block">
              My approach blends deep technical knowledge with thoughtful design.
              I believe great software isn&apos;t just functional &mdash; it should
              feel effortless to use and delightful to interact with.
            </p>
            <Link
              to="/about"
              className="mt-1 sm:mt-2 inline-flex items-center gap-2 text-sm font-medium text-accent-light hover:text-accent transition-colors"
            >
              Learn more about what I do
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 min-w-0 relative"
          >
            <div className="overflow-x-auto overflow-y-hidden horizontal-scroll lg:overflow-visible">
              <div className="flex gap-3 pt-3 pb-2 sm:gap-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:pt-0 lg:pb-0">
                {[
                  { label: 'Years Experience', value: '10+' },
                  { label: 'Projects Built', value: '30+' },
                  { label: 'Technologies', value: '20+' },
                  { label: 'Human Verified', value: '100%' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="shrink-0 w-[110px] sm:w-[130px] lg:w-auto rounded-xl bg-bg-card border border-border p-2.5 sm:p-5 text-center"
                  >
                    <div className="font-display text-xl sm:text-3xl font-bold text-accent-light">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-[10px] sm:text-xs text-text-muted uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
