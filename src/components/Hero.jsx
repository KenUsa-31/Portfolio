import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Code2, ShieldCheck } from 'lucide-react'
import Particles from './Particles'
import { useMagnetic } from '../hooks/useInteractiveEffects'
import './Hero.css'

const roles = ['Web Developer', 'Cybersecurity Explorer', 'UI/UX Designer']

export default function Hero() {
  const roleRef = useRef(null)
  const photoRef = useRef(null)
  const tapTimeoutRef = useRef(null)
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

  useEffect(() => () => clearTimeout(tapTimeoutRef.current), [])

  const updatePhotoInteraction = event => {
    const photo = photoRef.current
    if (!photo) return
    const bounds = photo.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))

    photo.style.setProperty('--spot-x', `${x * 100}%`)
    photo.style.setProperty('--spot-y', `${y * 100}%`)

    if (event.pointerType !== 'touch' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      photo.style.setProperty('--tilt-x', `${(0.5 - y) * 10}deg`)
      photo.style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`)
    }
  }

  const handlePhotoPointerDown = event => {
    updatePhotoInteraction(event)
    if (event.pointerType === 'touch') {
      const photo = photoRef.current
      if (!photo) return
      photo.style.setProperty('--press-scale', '0.975')
      clearTimeout(tapTimeoutRef.current)
      tapTimeoutRef.current = setTimeout(() => photo.style.setProperty('--press-scale', '1'), 180)
    }
  }

  const resetPhotoInteraction = () => {
    const photo = photoRef.current
    if (!photo) return
    photo.style.setProperty('--spot-x', '50%')
    photo.style.setProperty('--spot-y', '50%')
    photo.style.setProperty('--tilt-x', '0deg')
    photo.style.setProperty('--tilt-y', '0deg')
    photo.style.setProperty('--press-scale', '1')
  }

  return (
    <section id="home" className="home">
      <Particles />
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

          <div className="home-focus-tags">
            <span><Code2 size={14} aria-hidden="true" /> Full-stack development</span>
            <span><ShieldCheck size={14} aria-hidden="true" /> Cybersecurity learner</span>
          </div>

          <div className="home-actions">
            <a ref={magneticBtn} href="/resume/Usa_Resume.pdf" className="btn resume-btn" download>
              View résumé <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#contact" className="btn contact-btn">
              Let’s talk <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="home-social" aria-label="Social profiles">
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

        <div className="home-visual">
          <div className="portrait-orbit portrait-orbit--outer" aria-hidden="true" />
          <div className="portrait-orbit portrait-orbit--inner" aria-hidden="true" />
          <div
            className="hero-portrait"
            ref={photoRef}
            onPointerMove={updatePhotoInteraction}
            onPointerDown={handlePhotoPointerDown}
            onPointerLeave={resetPhotoInteraction}
            onPointerUp={event => { if (event.pointerType === 'touch') resetPhotoInteraction() }}
          >
            <div className="portrait-image-wrap">
              <img src="/ken.png" alt="Ken Andrei Usa" className="photo-img" width="420" height="420" fetchPriority="high" />
              <div className="portrait-shine" />
            </div>
            <div className="portrait-caption">
              <span>KEN ANDREI USA</span>
              <span>WEB / SECURITY</span>
            </div>
          </div>
          <div className="portrait-float portrait-float--code" aria-hidden="true"><Code2 size={15} /> &lt;/&gt;</div>
          <div className="portrait-float portrait-float--shield" aria-hidden="true"><ShieldCheck size={15} /> LEARNING</div>
          <p className="visual-caption">Curiosity drives the build.</p>
        </div>
      </div>

      <div className="home-bottom">
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-number">03+</div>
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
        <a className="home-scroll-cue" href="#about" aria-label="Scroll to About Me">
          <span>Scroll to explore</span><ArrowDown size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
