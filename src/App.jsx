import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Lightbox from './components/Lightbox'
import GameLoader from './components/GameLoader'
import { navigateToSection, SECTION_IDS } from './lib/sectionNavigation'
import './App.css'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
const SECTION_COMMANDS = {
  home: './portfolio --profile',
  about: 'cd ~/about',
  skills: 'cd ~/skills',
  experience: 'cd ~/experience',
  projects: 'cd ~/projects',
  certificates: 'cd ~/certificates',
  contact: 'cd ~/contact',
}

const CONFETTI_COLORS = ['#ffd700','#ff6b6b','#4ecdc4','#45b7d1','#f9ca24','#6c5ce7','#a29bfe','#fd79a8']
const CONFETTI_PIECES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: (i * 37 + 13) % 100,
  bg: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  dur: 1.5 + (i % 5) * 0.4,
  delay: (i % 10) * 0.05,
  round: i % 3 === 0,
  size: 6 + (i % 4) * 1.5,
}))

const getSectionFromHash = () => {
  const id = window.location.hash.slice(1)
  return SECTION_IDS.includes(id) ? id : 'home'
}

function Confetti() {
  return (
    <div className="confetti-container">
      {CONFETTI_PIECES.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: `${p.left}%`,
          background: p.bg,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          borderRadius: p.round ? '50%' : '2px',
          width: `${p.size}px`,
          height: `${p.size}px`,
        }} />
      ))}
    </div>
  )
}

function Portfolio({ activeSection }) {
  const [lightbox, setLightbox] = useState(null)
  const stageRef = useRef(null)

  useLayoutEffect(() => {
    if (stageRef.current) stageRef.current.scrollTop = 0
  }, [activeSection])

  let sectionContent
  switch (activeSection) {
    case 'about': sectionContent = <About />; break
    case 'skills': sectionContent = <Skills />; break
    case 'experience': sectionContent = <Experience />; break
    case 'projects': sectionContent = <Projects onImageClick={src => setLightbox({ src })} />; break
    case 'certificates': sectionContent = <Certificates onImageClick={src => setLightbox({ src })} />; break
    case 'contact': sectionContent = <Contact />; break
    default: sectionContent = <Hero />
  }

  return (
    <>
      <main className="section-stage" ref={stageRef} tabIndex={0} aria-label="Portfolio section content">
        <div className="section-screen" key={activeSection}>
          {sectionContent}
        </div>
      </main>
      <Footer />
      {lightbox && <Lightbox src={lightbox.src} caption={lightbox.caption} onClose={() => setLightbox(null)} />}
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') === 'dark' ? 'dark' : 'light')
  const [themeCommand, setThemeCommand] = useState('')
  const [activeSection, setActiveSection] = useState(getSectionFromHash)
  const [showConfetti, setShowConfetti] = useState(false)
  const [konamiShow, setKonamiShow] = useState(false)
  const konamiIndex = useRef(0)
  const previousSectionRef = useRef(activeSection)
  const previousThemeRef = useRef(theme)
  const terminalCommand = themeCommand || SECTION_COMMANDS[activeSection] || SECTION_COMMANDS.home

  useLayoutEffect(() => {
    const changed = previousThemeRef.current !== theme
    previousThemeRef.current = theme
    document.body.className = [
      theme === 'light' ? 'light-mode' : '',
      theme === 'dark' ? 'dark-mode' : '',
      'portfolio-view'
    ].join(' ').trim()
    localStorage.setItem('theme', theme)

    if (!changed) return

    document.body.classList.add('theme-transitioning')
    setThemeCommand(`theme --set ${theme}`)
    const timer = window.setTimeout(() => {
      document.body.classList.remove('theme-transitioning')
      setThemeCommand('')
    }, 1200)

    return () => {
      window.clearTimeout(timer)
      document.body.classList.remove('theme-transitioning')
    }
  }, [theme])

  useEffect(() => {
    const handleNavigate = event => {
      if (SECTION_IDS.includes(event.detail)) setActiveSection(event.detail)
    }
    const syncFromHistory = () => setActiveSection(getSectionFromHash())

    window.addEventListener('portfolio:navigate-section', handleNavigate)
    window.addEventListener('popstate', syncFromHistory)
    return () => {
      window.removeEventListener('portfolio:navigate-section', handleNavigate)
      window.removeEventListener('popstate', syncFromHistory)
    }
  }, [])

  useEffect(() => {
    if (previousSectionRef.current === activeSection) return
    previousSectionRef.current = activeSection

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const shell = document.querySelector('.portfolio-terminal')
    if (!shell) return

    shell.classList.remove('navigation-transition')
    void shell.offsetWidth
    shell.classList.add('navigation-transition')
    const timer = window.setTimeout(() => shell.classList.remove('navigation-transition'), 620)
    return () => window.clearTimeout(timer)
  }, [activeSection])

  useEffect(() => {
    const handleSectionLink = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return

      const id = decodeURIComponent(link.hash.slice(1))
      if (!SECTION_IDS.includes(id)) return

      event.preventDefault()
      navigateToSection(id)
    }

    document.addEventListener('click', handleSectionLink)
    return () => document.removeEventListener('click', handleSectionLink)
  }, [])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === KONAMI[konamiIndex.current]) {
        konamiIndex.current++
        if (konamiIndex.current === KONAMI.length) {
          konamiIndex.current = 0
          setShowConfetti(true)
          setKonamiShow(true)
          setTimeout(() => { setShowConfetti(false); setKonamiShow(false) }, 4000)
        }
      } else {
        konamiIndex.current = 0
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (loading) {
    return <GameLoader onComplete={() => setLoading(false)} />
  }

  return (
    <div className="portfolio-terminal">
      <div className="portfolio-terminal-titlebar">
        <div className="terminal-window-controls" aria-hidden="true"><i /><i /><i /></div>
        <span
          className="terminal-command-line"
          role="status"
          aria-live="polite"
        >
          <span className="terminal-prompt">ken@portfolio:~$</span>
          <span
            className="terminal-typed-command"
            key={`${activeSection}-${themeCommand || 'section'}`}
            style={{ '--command-length': terminalCommand.length }}
          >
            {terminalCommand}
          </span>
          <i className="terminal-command-cursor" aria-hidden="true" />
        </span>
        <span className="terminal-window-meta" aria-hidden="true">{String(SECTION_IDS.indexOf(activeSection) + 1).padStart(2, '0')} / {String(SECTION_IDS.length).padStart(2, '0')} · BASH</span>
      </div>
      {showConfetti && <Confetti />}
      {konamiShow && (
        <div className="konami-overlay">
          <div className="konami-text">Code Unlocked!</div>
          <div className="konami-sub">You found the secret</div>
        </div>
      )}

      <Header theme={theme} setTheme={setTheme} activeSection={activeSection} />
      <Routes>
        <Route path="/" element={<Portfolio activeSection={activeSection} />} />
      </Routes>
    </div>
  )
}

export default App
