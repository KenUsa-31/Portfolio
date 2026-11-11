import { useState, useEffect, useRef, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import LocalTime from './components/LocalTime'
import Projects from './components/Projects'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Lightbox from './components/Lightbox'
import GameLoader from './components/GameLoader'
import SectionNav from './components/SectionNav'
import MouseGradient from './components/MouseGradient'
import GradientOrbs from './components/GradientOrbs'
import PressGlow from './components/PressGlow'
import { isLowPowerDevice } from './lib/deviceCapability'
import './App.css'

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

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

function Portfolio() {
  const [lightbox, setLightbox] = useState(null)
  const lowPower = isLowPowerDevice()

  return (
    <>
      <MouseGradient />
      {!lowPower && <GradientOrbs />}
      {!lowPower && <PressGlow />}
      <SectionNav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <LocalTime />
      <Projects onImageClick={src => setLightbox({ src })} />
      <Certificates onImageClick={src => setLightbox({ src })} />
      <Contact />
      <Footer />
      {lightbox && <Lightbox src={lightbox.src} caption={lightbox.caption} onClose={() => setLightbox(null)} />}
    </>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [color, setColor] = useState(() => localStorage.getItem('colorTheme') || 'cyan')
  const [showConfetti, setShowConfetti] = useState(false)
  const [konamiShow, setKonamiShow] = useState(false)
  const [showFab, setShowFab] = useState(false)
  const cursorRef = useRef(null)
  const dotRef = useRef(null)
  const scrollRef = useRef(null)
  const konamiIndex = useRef(0)
  const isTouch = useRef('ontouchstart' in window || navigator.maxTouchPoints > 0)

  useEffect(() => {
    document.body.className = [
      theme === 'light' ? 'light-mode' : '',
      color === 'pink' ? 'pink-theme' : ''
    ].join(' ').trim()
    localStorage.setItem('theme', theme)
    localStorage.setItem('colorTheme', color)
  }, [theme, color])

  const handleMouseMove = useCallback((e) => {
    if (cursorRef.current) {
      cursorRef.current.style.left = e.clientX + 'px'
      cursorRef.current.style.top = e.clientY + 'px'
    }
    if (dotRef.current) {
      dotRef.current.style.left = e.clientX + 'px'
      dotRef.current.style.top = e.clientY + 'px'
    }
  }, [])

  useEffect(() => {
    if (isTouch.current) return
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      const scrollTop = document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      scrollRef.current.style.width = progress + '%'
      setShowFab(scrollTop > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isTouch.current) return
    const handleHover = (e) => {
      const target = e.target.closest('a, button, .tilt-card, .social-icons a, .project-card, .cert-card')
      if (cursorRef.current) {
        cursorRef.current.classList.toggle('hover', !!target)
      }
    }
    document.addEventListener('mouseover', handleHover)
    document.addEventListener('mouseout', handleHover)
    return () => {
      document.removeEventListener('mouseover', handleHover)
      document.removeEventListener('mouseout', handleHover)
    }
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
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={scrollRef} className="scroll-progress" />

      {showConfetti && <Confetti />}
      {konamiShow && (
        <div className="konami-overlay">
          <div className="konami-text">Code Unlocked!</div>
          <div className="konami-sub">You found the secret</div>
        </div>
      )}

      <Header theme={theme} setTheme={setTheme} color={color} setColor={setColor} />
      <Routes>
        <Route path="/" element={<Portfolio />} />
      </Routes>
      <button className={`fab-back-top ${showFab ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
        <i className="fa-solid fa-chevron-up" />
      </button>
    </>
  )
}

export default App
