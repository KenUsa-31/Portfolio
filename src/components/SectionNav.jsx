import { useState, useEffect, useCallback } from 'react'
import './SectionNav.css'

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'time', label: 'Time' },
  { id: 'projects', label: 'Projects' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
]

export default function SectionNav() {
  const [active, setActive] = useState('home')
  const [hovered, setHovered] = useState(null)
  const [tapped, setTapped] = useState(null)

  useEffect(() => {
    const sectionEls = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id)
      })
    }, { rootMargin: '-30% 0px -60% 0px' })
    sectionEls.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const handleTouch = useCallback((id) => {
    setTapped(prev => prev === id ? null : id)
  }, [])

  useEffect(() => {
    if (tapped) {
      const timer = setTimeout(() => setTapped(null), 2000)
      return () => clearTimeout(timer)
    }
  }, [tapped])

  return (
    <nav className="section-nav" aria-label="Section navigation">
      {sections.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`section-nav-dot ${active === s.id ? 'active' : ''}`}
          aria-label={s.label}
          onMouseEnter={() => setHovered(s.id)}
          onMouseLeave={() => setHovered(null)}
          onTouchStart={() => handleTouch(s.id)}
        >
          <span className="dot" />
          {(hovered === s.id || tapped === s.id) && <span className="dot-label">{s.label}</span>}
        </a>
      ))}
    </nav>
  )
}
