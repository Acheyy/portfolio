import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { projects } from '~/data/projects'
import { ProjectCard } from './ProjectCard'

const totalCards = projects.length + 1

function useIsMobile(breakpoint = 640) {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return mobile
}

export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / totalCards
    const idx = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(idx, totalCards - 1))
  }, [])

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / totalCards
    el.scrollTo({ left: cardWidth * idx, behavior: 'smooth' })
  }, [])

  return (
    <section id="projects" className="snap-section relative flex flex-col justify-center overflow-hidden">
      <div className="mx-auto max-w-6xl w-full px-6 pb-3 sm:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
            Portfolio
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-text-heading">
            Featured Projects
          </h2>
          <p className="mt-3 sm:mt-4 max-w-lg text-text-muted leading-relaxed text-sm sm:text-base">
            A selection of things I&apos;ve built. Each one taught me something
            new and pushed my skills further.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl w-full">
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-x-auto px-6 horizontal-scroll"
        >
          <div className="flex gap-6 py-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} isMobile={isMobile} />
            ))}
            <motion.div
              className="snap-card shrink-0 w-[calc(100vw-3rem)] sm:w-[400px]"
              initial={isMobile ? false : { opacity: 0, x: 60 }}
              animate={isMobile ? { opacity: 1, x: 0 } : undefined}
              {...(!isMobile && {
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: false, margin: '-40px' as string },
                transition: {
                  duration: 0.6,
                  delay: projects.length * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                },
              })}
            >
              <div className="glow-card flex flex-col items-center justify-center p-4 sm:p-6 h-full min-h-0 sm:min-h-[420px] select-none">
                <span className="text-4xl mb-4">🚧</span>
                <h3 className="font-display text-xl font-semibold text-text-heading">
                  More coming soon
                </h3>
                <p className="mt-2 text-sm text-text-muted text-center max-w-[250px]">
                  New projects are in the works. Stay tuned!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dot indicators — mobile only */}
      <div className="flex sm:hidden justify-center gap-2 pt-3">
        {Array.from({ length: totalCards }, (_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to card ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              activeIndex === i
                ? 'w-6 h-2 bg-accent'
                : 'w-2 h-2 bg-border hover:bg-text-muted'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
