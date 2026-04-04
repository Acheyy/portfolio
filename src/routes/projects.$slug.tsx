import { useState } from 'react'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { projects } from '~/data/projects'
import { Navbar } from '~/components/Navbar'
import { Footer } from '~/components/Footer'
import { Lightbox } from '~/components/Lightbox'

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.title} — Portfolio` },
      { name: 'description', content: loaderData.description },
    ],
  }),
  component: ProjectDetail,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-text-heading">
          Project not found
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block text-accent-light hover:text-accent transition-colors"
        >
          &larr; Back to home
        </Link>
      </div>
    </div>
  ),
})

function ProjectDetail() {
  const project = Route.useLoaderData()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const openImage = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/"
              hash="projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent-light transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to projects
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-text-heading">
              {project.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-light border border-accent/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent-light hover:shadow-accent/40 hover:-translate-y-0.5"
            >
              Visit Live Site
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </motion.div>

          {/* Hero image */}
          {project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 overflow-hidden rounded-xl border border-border cursor-pointer group"
              onClick={() => openImage(0)}
            >
              <div className="relative">
                <img
                  src={project.images[0]}
                  alt={`${project.title} screenshot`}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                  <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                  </svg>
                </div>
              </div>
            </motion.div>
          )}

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <h2 className="font-display text-2xl font-semibold text-text-heading mb-5">
              About this project
            </h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              {project.longDescription.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          {/* All screenshots */}
          {project.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12"
            >
              <h2 className="font-display text-2xl font-semibold text-text-heading mb-5">
                Screenshots
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {project.images.map((img, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border cursor-pointer group"
                    onClick={() => openImage(i)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      <Lightbox
        images={project.images}
        alt={project.title}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
