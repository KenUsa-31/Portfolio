import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useMagnetic } from '../hooks/useInteractiveEffects'
import './Hero.css'

const roles = ['Web Developer', 'Cybersecurity Explorer', 'UI/UX Designer']

export default function Hero() {
  const roleRef = useRef(null)
  const magneticBtn = useMagnetic(0.18)
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
    const roleElement = roleRef.current
    if (!roleElement) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      roleElement.textContent = roles[0]
      return
    }

    let roleIndex = 0
    let characterIndex = 0
    let deleting = false
    let timeout

    const type = () => {
      const role = roles[roleIndex]
      characterIndex += deleting ? -1 : 1
      roleElement.textContent = role.slice(0, characterIndex)

      if (!deleting && characterIndex === role.length) {
        deleting = true
        timeout = setTimeout(type, 1300)
        return
      }
      if (deleting && characterIndex === 0) {
        deleting = false
        roleIndex = (roleIndex + 1) % roles.length
        timeout = setTimeout(type, 220)
        return
      }
      timeout = setTimeout(type, deleting ? 42 : 82)
    }

    timeout = setTimeout(type, 450)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section id="home" className="home">
      <div className="home-atmosphere" aria-hidden="true">
        <div className="home-grid-lines" />
        <div className="home-glow" />
      </div>

      <div className="home-main">
        <div className="home-content">
          <p className="home-eyebrow"><span className="home-live-dot" /> Web development <i>·</i> cybersecurity</p>
          <h1 className="home-title">Ken Andrei<br /><span>Usa.</span></h1>
          <p className="home-role-line">
            <span className="role-prefix">I’m a </span>
            <span className="role-text" ref={roleRef} aria-label="Web Developer, Cybersecurity Explorer, UI/UX Designer" />
            <span className="role-cursor" aria-hidden="true" />
          </p>
          <p className="hero-desc">
            I build responsive web experiences and full-stack systems while exploring how to secure them.
            Based in Davao City, Philippines.
          </p>

          <div className="home-actions">
            <a ref={magneticBtn} href="/resume/Usa_Resume.pdf" className="btn resume-btn" download>
              View résumé <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn contact-btn">
              Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="home-stats" role="group" aria-label="Portfolio summary">
            <div className="stat-card">
              <div className="stat-number">07+</div>
              <div className="stat-label">Projects shipped</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">04+</div>
              <div className="stat-label">Certifications</div>
            </div>
            <div className="stat-card stat-card--time">
              <div className="stat-number">{davaoTime}</div>
              <div className="stat-label">Davao City · GMT+8</div>
            </div>
          </div>

          <div className="home-social" aria-label="Social profiles">
            <a href="https://github.com/eclipse31-dev" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="fa-brands fa-github" /><span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/ken-d-usa-9a4561327/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in" /><span>LinkedIn</span>
            </a>
            <a href="https://www.instagram.com/si_kenusa/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="fa-brands fa-instagram" /><span>Instagram</span>
            </a>
          </div>
        </div>

        <div className="home-visual">
          <div className="hero-portrait">
            <div className="portrait-image-wrap">
              <img src="/ken.png" alt="Ken Andrei Usa." className="photo-img" width="420" height="420" fetchPriority="high" />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
