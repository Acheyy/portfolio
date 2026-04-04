import { motion } from 'framer-motion'
import { skills } from '~/data/skills'

const categories = ['Frontend', 'Backend', 'Tools'] as const

export function Skills() {
  return (
    <section id="skills" className="snap-section relative flex flex-col justify-center overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-accent-dark -bottom-20 left-1/4 animate-pulse-glow" />

      <div className="mx-auto max-w-6xl w-full px-6 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
            Expertise
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
            Skills &amp; Technologies
          </h2>
          <p className="mt-4 max-w-lg text-text-muted leading-relaxed">
            The tools and technologies I work with to bring ideas to life.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-6xl w-full px-6">
        <div className="overflow-x-auto overflow-y-hidden horizontal-scroll snap-x snap-mandatory md:snap-none md:overflow-visible">
          <div className="flex gap-6 py-2 md:grid md:grid-cols-3">
            {categories.map((category, catIdx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.6,
                  delay: catIdx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="shrink-0 w-[calc(100vw-3rem)] snap-center md:w-auto md:snap-align-none"
              >
                <h3 className="font-display text-lg font-semibold text-text-heading mb-3 md:mb-5 flex items-center gap-2">
                  <span className="w-8 h-0.5 bg-accent rounded-full" />
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill, i) => (
                      <motion.span
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false }}
                        transition={{
                          duration: 0.4,
                          delay: catIdx * 0.1 + i * 0.04,
                        }}
                        className="rounded-lg bg-bg-card border border-border px-3 py-1.5 sm:px-4 sm:py-2.5 text-sm font-medium text-text hover:border-accent/50 hover:text-accent-light hover:bg-bg-card-hover transition-all duration-300 cursor-default"
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
