import { useState, useEffect, useCallback, useRef } from 'react'
import './Header.css'

const navItems = ['home','about','skills','experience','time','projects','certificates','contact']

export default function Header({ theme, setTheme, color, setColor }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [animKey, setAnimKey] = useState(0)
  const navRef = useRef(null)
  const previousFocus = useRef(null)

  const openMenu = useCallback(() => {
    previousFocus.current = document.activeElement
    setMenuOpen(true)
    setAnimKey(k => k + 1)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    previousFocus.current?.focus()
  }, [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id)
      })
    }, { rootMargin: '-20% 0px -70% 0px' })
    sections.forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      const nav = navRef.current
      if (nav) {
        const closeBtn = nav.querySelector('.close-btn')
        closeBtn?.focus()
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const nav = navRef.current
    if (!nav) return

    const focusable = () => nav.querySelectorAll('a[href], button:not([disabled])')
    const handleKey = (e) => {
      if (e.key !== 'Tab') return
      const els = focusable()
      if (els.length === 0) return
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    nav.addEventListener('keydown', handleKey)
    return () => nav.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  return (
    <header className={theme === 'light' ? 'light' : ''}>
      <a href="#home" className="logo">Ken<span>.</span></a>
      <nav ref={navRef} className={menuOpen ? 'active' : ''}>
        <div className="nav-header">
          <span className="nav-brand">Ken Usa</span>
          <button className="close-btn" onClick={closeMenu} aria-label="Close menu">
            <span /><span />
          </button>
        </div>
        <div className="nav-links" key={animKey}>
          {navItems.map((id, i) => (
            <a key={id} href={`#${id}`}
              className={`nav-item ${active === id ? 'active' : ''}`}
              style={{ '--i': i }}
              onClick={closeMenu}>
              <span className="nav-num">0{i + 1}</span>
              <span className="nav-label">{id}</span>
            </a>
          ))}
        </div>
        <div className="nav-footer">
          <div className="nav-theme-row">
            <div className="color-picker">
              {['cyan','pink'].map(c => (
                <button key={c} className={`color-dot ${c} ${color === c ? 'active' : ''}`}
                  onClick={() => setColor(c)} aria-label={`${c} theme`} />
              ))}
            </div>
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
            </button>
          </div>
        </div>
      </nav>
      <div className="menu-overlay" onClick={closeMenu} />
      <div className="header-right">
        <div className="color-picker">
          {['cyan','pink'].map(c => (
            <button key={c} className={`color-dot ${c} ${color === c ? 'active' : ''}`}
              onClick={() => setColor(c)} aria-label={`${c} theme`} />
          ))}
        </div>
        <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
          <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} />
        </button>
        <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={openMenu} role="button" aria-label="Open menu" aria-expanded={menuOpen} tabIndex={0}>
          <span className="bar" /><span className="bar" /><span className="bar" />
        </div>
      </div>
    </header>
  )
}
