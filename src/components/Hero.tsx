import { motion, type Variants } from 'framer-motion'

const ease3d = [0.22, 1, 0.36, 1] as const
const vp = { once: false, amount: 0.3 as const }
const instant = { duration: 0 }

const orb1: Variants = {
  hidden: { scale: 0, rotate: -90, transition: instant },
  visible: { scale: 1, rotate: 0, transition: { duration: 1.4, delay: 0.2, ease: ease3d } },
}
const orb2: Variants = {
  hidden: { scale: 0, rotate: 90, transition: instant },
  visible: { scale: 1, rotate: 0, transition: { duration: 1.4, delay: 0.4, ease: ease3d } },
}
const orb3: Variants = {
  hidden: { scale: 0, transition: instant },
  visible: { scale: 1, transition: { duration: 1.4, delay: 0.6, ease: ease3d } },
}
const container: Variants = {
  hidden: { rotateX: 25, rotateY: -8, opacity: 0, scale: 0.92, transition: instant },
  visible: { rotateX: 0, rotateY: 0, opacity: 1, scale: 1, transition: { duration: 1.4, ease: ease3d } },
}
const subtitle: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 50, transition: instant },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay: 0.35, ease: ease3d } },
}
const heading: Variants = {
  hidden: { opacity: 0, y: 50, rotateX: 55, z: -120, transition: instant },
  visible: { opacity: 1, y: 0, rotateX: 0, z: 0, transition: { duration: 1.1, delay: 0.5, ease: ease3d } },
}
const paragraph: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 40, transition: instant },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, delay: 0.65, ease: ease3d } },
}
const buttons: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: 35, z: -60, transition: instant },
  visible: { opacity: 1, y: 0, rotateX: 0, z: 0, transition: { duration: 0.9, delay: 0.8, ease: ease3d } },
}

export function Hero() {
  return (
    <section
      id="home"
      className="snap-section relative flex items-center justify-center overflow-hidden"
      style={{ perspective: 1200 }}
    >
      {/* Background orbs */}
      <motion.div
        className="orb w-[500px] h-[500px] bg-accent -top-40 -right-40 animate-pulse-glow"
        variants={orb1}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      />
      <motion.div
        className="orb w-[400px] h-[400px] bg-indigo -bottom-32 -left-32 animate-pulse-glow [animation-delay:2s]"
        variants={orb2}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      />
      <motion.div
        className="orb w-[300px] h-[300px] bg-accent-dark top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow [animation-delay:1s]"
        variants={orb3}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={vp}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          variants={subtitle}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <p className="mb-4 sm:mb-6 text-sm font-medium uppercase tracking-[0.3em] text-accent-light">
            Welcome to my portfolio
          </p>
        </motion.div>

        <motion.h1
          variants={heading}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <span className="text-text-heading">I build</span>
          <br />
          <span className="gradient-text">things for</span>
          <br />
          <span className="text-text-heading">the web</span>
        </motion.h1>

        <motion.p
          variants={paragraph}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mx-auto mt-5 sm:mt-8 max-w-xl text-lg text-text-muted leading-relaxed"
          style={{ transformStyle: 'preserve-3d' }}
        >
          A developer passionate about crafting beautiful, performant digital
          experiences.
        </motion.p>

        <motion.div
          variants={buttons}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
          className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5"
          >
            View Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3 text-sm font-semibold text-text-heading transition-all hover:border-accent hover:text-accent-light hover:-translate-y-0.5"
          >
            About Me
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  )
}
