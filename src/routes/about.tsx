import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Navbar } from '~/components/Navbar'
import { Footer } from '~/components/Footer'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Me — Portfolio' },
      {
        name: 'description',
        content:
          'Full-stack developer with 10+ years of experience. I build, deploy, and maintain production-ready web applications end to end.',
      },
    ],
  }),
  component: AboutPage,
})

const ease = [0.22, 1, 0.36, 1] as const

function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Back */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <Link
              to="/"
              hash="about"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to home
            </Link>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="mt-8"
          >
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent-light mb-3">
              About Me
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              Building for the web, end to end
            </h1>
          </motion.div>

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="mt-10 space-y-5 text-text-muted leading-relaxed text-lg"
          >
            <p>
              With over 10 years of experience in software development, I&apos;ve
              built everything from small business websites to complex full-stack
              platforms handling real users and real money. I don&apos;t just write
              code &mdash; I deliver complete, working products.
            </p>
            <p>
              I leverage AI tools like Cursor and Copilot to accelerate
              development, but I never ship blindly. Every line gets reviewed,
              tested, and validated by hand. AI speeds up the writing; I make sure
              the thinking is right.
            </p>
          </motion.div>

          {/* What I do */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl font-semibold text-text-heading mb-8">
              What I deliver
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                {
                  title: 'Full-Stack Development',
                  description:
                    'Frontend and backend under one roof. I build complete web applications from the database layer to the UI, using any modern framework — React, Angular, TanStack Start, Next.js, and more.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  ),
                },
                {
                  title: 'Server & Deployment',
                  description:
                    'I set up and configure VPS servers, Nginx reverse proxies, SSL certificates, domains, and CI/CD pipelines. Your app goes from code to production, fully operational.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008V17.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0-3.375a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  ),
                },
                {
                  title: 'SEO & Performance',
                  description:
                    'Server-side rendering, meta tags, structured data, Core Web Vitals optimization, sitemap generation &mdash; I make sure search engines find and rank your site.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  ),
                },
                {
                  title: 'Maintenance & Monitoring',
                  description:
                    'I don&apos;t disappear after launch. I make sure everything works properly, handle updates, fix issues, and keep the server running smoothly.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.33-5.329a1.768 1.768 0 010-2.5 1.769 1.769 0 012.5 0l2.83 2.83 2.83-2.83a1.768 1.768 0 012.5 0 1.769 1.769 0 010 2.5l-5.33 5.329a1.768 1.768 0 01-2.5 0z" />
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-bg-card border border-border p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {item.icon}
                    </svg>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-text-heading mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease }}
            className="mt-16"
          >
            <h2 className="font-display text-2xl font-semibold text-text-heading mb-8">
              How I work
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Understand the problem',
                  description:
                    'I start by understanding what you actually need — not just what tech to use, but what problem to solve and who it\'s for.',
                },
                {
                  step: '02',
                  title: 'Build fast, build right',
                  description:
                    'I use AI-assisted development to move fast without cutting corners. Clean code, proper architecture, no tech debt left behind.',
                },
                {
                  step: '03',
                  title: 'Deploy & configure',
                  description:
                    'I handle the full deployment pipeline — server setup, Nginx configuration, SSL, domain pointing, environment variables, the works.',
                },
                {
                  step: '04',
                  title: 'Test, optimize, launch',
                  description:
                    'Thorough testing, performance optimization, SEO setup, and monitoring. Your site launches fast, ranks well, and stays up.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-5 items-start"
                >
                  <div className="font-display text-2xl font-bold text-accent/30 shrink-0 w-10">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-text-heading">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease }}
            className="mt-16 rounded-xl bg-bg-card border border-border p-8 sm:p-10 text-center"
          >
            <h2 className="font-display text-2xl font-semibold text-text-heading">
              Have a project in mind?
            </h2>
            <p className="mt-3 text-text-muted max-w-lg mx-auto">
              I&apos;m always open to discussing new projects and ideas. Let&apos;s
              build something great together.
            </p>
            <a
              href="mailto:hello@example.com"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5"
            >
              Get in touch
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
