import { motion } from 'framer-motion'
import { projects } from '~/data/projects'
import { ProjectCard } from './ProjectCard'

export function Projects() {
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

        <div className="overflow-x-auto px-6 horizontal-scroll">
          <div className="flex gap-6 py-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i} />
            ))}
            <motion.div
              className="shrink-0 w-[calc(100vw-3rem)] sm:w-[400px]"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: projects.length * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
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
    </section>
  )
}
