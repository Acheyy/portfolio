import { useState, useEffect, useRef, useCallback } from 'react'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Connect' },
]

const HIDE_DELAY = 2500

export function SectionNav() {
  const [active, setActive] = useState('home')
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const scheduleHide = useCallback(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY)
  }, [])

  const flash = useCallback(() => {
    setVisible(true)
    scheduleHide()
  }, [scheduleHide])

  useEffect(() => {
    scheduleHide()
    return () => clearTimeout(timerRef.current)
  }, [scheduleHide])

  useEffect(() => {
    const container = document.querySelector('.snap-scroll-container') as HTMLElement | null
    if (!container) return

    let prev = ''

    const getActive = () => {
      const { scrollTop, clientHeight, scrollHeight } = container
      if (scrollTop + clientHeight >= scrollHeight - 50) return 'contact'

      const mid = scrollTop + clientHeight / 2
      let closest = sections[0].id
      let closestDist = Infinity

      for (const s of sections) {
        if (s.id === 'contact') continue
        const el = document.getElementById(s.id)
        if (!el) continue
        const dist = Math.abs(el.offsetTop - mid)
        if (dist < closestDist) {
          closestDist = dist
          closest = s.id
        }
      }
      return closest
    }

    const onScroll = () => {
      const next = getActive()
      if (next !== prev) {
        prev = next
        setActive(next)
        flash()
      }
    }

    container.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => container.removeEventListener('scroll', onScroll)
  }, [flash])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-4 md:drop-shadow-none drop-shadow-[0_0_6px_rgba(0,0,0,0.6)] transition-opacity duration-500 md:opacity-100 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onMouseEnter={() => { setVisible(true); clearTimeout(timerRef.current) }}
      onMouseLeave={scheduleHide}
      onTouchStart={() => { setVisible(true); clearTimeout(timerRef.current) }}
      onTouchEnd={scheduleHide}
    >
      {sections.map((section) => {
        const isActive = active === section.id
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group flex items-center gap-3 cursor-pointer"
          >
            <span
              className={`text-xs font-medium tracking-wide transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-accent-light translate-x-0'
                  : 'opacity-0 group-hover:opacity-100 text-text-muted translate-x-2 group-hover:translate-x-0'
              }`}
            >
              {section.label}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-3 h-3 bg-accent shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                  : 'w-2 h-2 bg-border group-hover:bg-text-muted'
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}
