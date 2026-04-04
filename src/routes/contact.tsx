import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/contact')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Contact — Porfo',
      description: 'Get in touch — let\'s build something great together.',
      path: '/contact',
    }),
    links: [createCanonicalLink('/contact')],
  }),
  component: ContactPage,
})

const ease = [0.22, 1, 0.36, 1] as const

function ContactPage() {
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
            className="mt-8"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
              Contact
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Let&apos;s work together
            </h1>
            <p className="mt-6 text-lg text-text-muted leading-relaxed max-w-xl">
              Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-12 rounded-xl bg-bg-card border border-border p-8 sm:p-10 text-center"
          >
            <p className="text-text-muted">
              Contact form coming soon. In the meantime, reach out via email or social media.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5"
            >
              Send an email
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </main>
    </>
  )
}
