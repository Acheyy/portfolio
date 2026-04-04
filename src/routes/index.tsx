import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '~/components/Navbar'
import { Hero } from '~/components/Hero'
import { Projects } from '~/components/Projects'
import { About } from '~/components/About'
import { Skills } from '~/components/Skills'
import { Footer } from '~/components/Footer'
import { SectionNav } from '~/components/SectionNav'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Portfolio — Developer & Creator' },
      {
        name: 'description',
        content:
          'Personal portfolio showcasing projects, skills, and experience in web development.',
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
