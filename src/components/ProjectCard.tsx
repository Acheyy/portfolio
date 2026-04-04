import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { porfoMessages, type Project } from '~/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      className="snap-card shrink-0 w-[calc(100vw-3rem)] sm:w-[400px]"
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, margin: '-40px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="glow-card flex flex-col p-4 sm:p-6 group cursor-pointer"
      >
        <div className="relative mb-3 sm:mb-5 aspect-video overflow-hidden rounded-lg bg-border/30">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : project.slug === 'porfo' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
              <span className="text-2xl">👀</span>
              <p className="text-xs font-medium text-text-muted/60">You're already looking at it</p>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted/30">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="font-display text-lg sm:text-xl font-semibold text-text-heading group-hover:text-accent-light transition-colors truncate">
          {project.title}
        </h3>

        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-relaxed text-text-muted line-clamp-2 sm:line-clamp-3 min-h-0 sm:min-h-[3.75rem]">
          {project.description}
        </p>

        <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2 min-h-0 sm:min-h-[3.5rem]">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-light border border-accent/20 h-fit"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-light">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.preventDefault()}
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (project.slug === 'porfo') {
                toast(porfoMessages[Math.floor(Math.random() * porfoMessages.length)], {
                  icon: null,
                  duration: 3000,
                })
              } else {
                window.open(project.url, '_blank', 'noopener,noreferrer')
              }
            }}
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-accent/15 border border-accent/30 px-4 py-1.5 text-xs font-semibold text-accent-light hover:bg-accent/25 hover:border-accent/50 transition-all"
          >
            Live Site
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </Link>
    </motion.div>
  )
}
