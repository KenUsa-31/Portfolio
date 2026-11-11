import { useEffect, useRef, useState } from 'react'
import Particles from './Particles'
import { useMagnetic, useTilt } from '../hooks/useInteractiveEffects'
import './Hero.css'

const texts = ['Web Developer', 'UI-UX Designer', 'IT Student', 'Tech Enthusiast']

export default function Hero() {
  const spanRef = useRef(null)
  const state = useRef({ index: 0, charIndex: 0, isDeleting: false })
  const magneticBtn = useMagnetic(0.25)
  const photoRef = useTilt(12)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const davaoTime = now.toLocaleTimeString('en-PH', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Manila',
  })

  useEffect(() => {
    let timeout
    function type() {
      const { index, charIndex, isDeleting } = state.current
      const current = texts[index]
      if (spanRef.current) {
        spanRef.current.textContent = isDeleting ? current.slice(0, charIndex - 1) : current.slice(0, charIndex + 1)
      }
      if (!isDeleting && charIndex + 1 === current.length) {
        state.current = { index, charIndex: charIndex + 1, isDeleting: true }
        timeout = setTimeout(type, 1500)
        return
      }
      if (isDeleting && charIndex - 1 === 0) {
        state.current = { index: (index + 1) % texts.length, charIndex: 0, isDeleting: false }
      } else {
        state.current = { index, charIndex: isDeleting ? charIndex - 1 : charIndex + 1, isDeleting }
      }
      timeout = setTimeout(type, isDeleting ? 80 : 150)
    }
    timeout = setTimeout(type, 150)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section id="home" className="home">
      <Particles />
      <div className="home-grid">
        <div className="home-photo-wrap">
          <div className="home-photo" ref={photoRef}>
            <picture>
              <img src="/ken.png" alt="Ken Andrei Usa" className="photo-img" width="220" height="220" fetchPriority="high" />
            </picture>
            <div className="photo-glow" />
          </div>
        </div>
        <div className="home-content">
          <p className="greeting">Hello, I'm</p>
          <h1>Ken Andrei <span>Usa</span></h1>
          <div className="home-tags">
            <span className="tag">Web Developer</span>
            <span className="tag">UI-UX Designer</span>
            <span className="tag">IT Student</span>
            <span className="tag">Zorin Linux</span>
          </div>
          <p className="hero-desc">
            I build things for the web — from responsive interfaces to full-stack systems —
            and I'm always looking for ways to push what I can do. Based in Davao City, Philippines.
          </p>
          <div className="home-divider" />
          <div className="home-actions">
            <a ref={magneticBtn} href="/resume/Usa_Resume.pdf" className="btn resume-btn" download>
              VIEW RÉSUMÉ <span className="btn-arrow">→</span>
            </a>
            <a href="#contact" className="btn contact-btn ripple-btn">
              <i className="fa-solid fa-envelope" /> Let's Talk
            </a>
          </div>
          <div className="home-social">
            <a href="https://github.com/eclipse31-dev" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github" />
            </a>
            <a href="https://www.linkedin.com/in/ken-d-usa-9a4561327/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a href="https://www.instagram.com/si_kenusa/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
          </div>
        </div>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-number">03+</div>
          <div className="stat-label">Projects Shipped</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">04+</div>
          <div className="stat-label">Certifications</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{davaoTime}</div>
          <div className="stat-label">Davao City · GMT+8</div>
        </div>
      </div>
    </section>
  )
}
