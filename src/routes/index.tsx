import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '~/components/Navbar'
import { Hero } from '~/components/Hero'
import { Projects } from '~/components/Projects'
import { About } from '~/components/About'
import { Skills } from '~/components/Skills'
import { Footer } from '~/components/Footer'
import { SectionNav } from '~/components/SectionNav'
import { createSeoMeta, createCanonicalLink } from '~/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: createSeoMeta({
      title: 'Porfo — Developer & Creator',
      description:
        'Porfo — showcasing projects, skills, and experience in web development.',
      path: '/',
    }),
    links: [createCanonicalLink('/')],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              name: 'Porfo',
              url: 'https://porfo.io',
            },
            {
              '@type': 'Person',
              name: 'Barbu Bogdan',
              url: 'https://porfo.io',
              jobTitle: 'Full-Stack Developer',
              knowsAbout: [
                'React',
                'TypeScript',
                'Node.js',
                'TanStack',
                'Tailwind CSS',
                'PostgreSQL',
                'MongoDB',
                'Docker',
              ],
            },
          ],
        }),
      },
    ],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Navbar />
      <SectionNav />
      <div className="snap-scroll-container">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Footer />
      </div>
    </>
  )
}
