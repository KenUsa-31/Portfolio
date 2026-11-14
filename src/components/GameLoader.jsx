import { useState, useEffect, useRef } from 'react'
import { Code2, LockKeyhole, ShieldCheck, Terminal } from 'lucide-react'
import './GameLoader.css'

const STATUS_MESSAGES = [
  'Initializing portfolio…',
  'Loading projects and skills…',
  'Preparing the interface…',
  'Almost ready…',
]

export default function GameLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0])
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const [now, setNow] = useState(new Date())
  const doneRef = useRef(false)
  const intervalRef = useRef(null)

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
    let elapsed = 0
    const totalDuration = 3000
    const tick = 40

    intervalRef.current = setInterval(() => {
      elapsed += tick
      const base = Math.min((elapsed / totalDuration) * 90, 90)
      const jitter = Math.random() * 5
      const next = Math.min(base + jitter, 97)
      setProgress(next)

      const msgIndex = Math.min(Math.floor(elapsed / 600), STATUS_MESSAGES.length - 1)
      setStatusText(STATUS_MESSAGES[msgIndex])

      if (elapsed >= totalDuration && !doneRef.current) {
        doneRef.current = true
        clearInterval(intervalRef.current)
        setProgress(100)
        setStatusText('Ready to explore')
        setDone(true)
        setTimeout(() => setFadeOut(true), 300)
        setTimeout(() => onComplete(), 800)
      }
    }, tick)

    return () => clearInterval(intervalRef.current)
  }, [onComplete])

  return (
    <div className={`loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-atmosphere" aria-hidden="true">
        <div className="loader-grid" />
        <div className="loader-glow loader-glow--one" />
        <div className="loader-glow loader-glow--two" />
        <div className="loader-scanline" />
      </div>

      <main className="loader-shell">
        <header className="loader-header">
          <div className="loader-brand">
            <div className="loader-logo"><Code2 size={22} strokeWidth={2.2} aria-hidden="true" /></div>
            <div className="loader-brand-copy">
              <span className="loader-name">Ken Andrei Usa</span>
              <span className="loader-brand-caption">Developer Portfolio</span>
            </div>
          </div>
          <div className="loader-session">
            <span className="session-dot" />
            <span>Portfolio boot sequence</span>
          </div>
        </header>

        <div className="loader-rule" />

        <section className="loader-main">
          <div className="loader-intro">
            <p className="loader-eyebrow"><span /> Web development / cybersecurity</p>
            <h1>Build the web.<br /><em>Explore security.</em></h1>
            <p className="loader-description">
              Full-stack projects, thoughtful interfaces, and a growing interest in cybersecurity.
            </p>

            <div className="loader-focus-list">
              <div className="loader-focus-item">
                <span className="focus-icon"><Code2 size={17} aria-hidden="true" /></span>
                <span><small>BUILD</small><strong>Web experiences</strong></span>
              </div>
              <div className="loader-focus-item">
                <span className="focus-icon"><ShieldCheck size={17} aria-hidden="true" /></span>
                <span><small>EXPLORE</small><strong>Cybersecurity</strong></span>
              </div>
            </div>
          </div>

          <div className="loader-terminal">
            <div className="terminal-titlebar">
              <div className="terminal-controls" aria-hidden="true"><i /><i /><i /></div>
              <span className="terminal-title"><Terminal size={14} aria-hidden="true" /> ken@portfolio</span>
              <span className="terminal-state"><span /> INIT</span>
            </div>

            <div className="terminal-content">
              <p className="terminal-command"><span>ken@portfolio</span>:<b>~</b>$ <strong>whoami</strong></p>
              <div className="terminal-data">
                <div><span>ROLE</span><strong>Full-stack web developer</strong></div>
                <div><span>CURRENT FOCUS</span><strong>Cybersecurity exploration</strong></div>
              </div>
              <div className="terminal-divider" />
              <p className="terminal-command"><span>ken@portfolio</span>:<b>~</b>$ <strong>load --site</strong></p>
              <p className="terminal-status"><i /> {statusText}<span className="terminal-cursor">_</span></p>

              <div className="terminal-progress-label">
                <span>PORTFOLIO</span><span>{Math.floor(progress).toString().padStart(2, '0')}%</span>
              </div>
              <div
                className="terminal-progress"
                role="progressbar"
                aria-label="Portfolio loading progress"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={Math.floor(progress)}
              >
                <span style={{ width: `${progress}%` }} />
              </div>

              {done && <p className="terminal-ready"><LockKeyhole size={13} aria-hidden="true" /> {statusText}</p>}
            </div>

            <div className="terminal-footer">
              <span><i /> DEV MODE</span>
              <span>DAVAO CITY</span>
              <time>{davaoTime}</time>
            </div>
          </div>
        </section>

        <footer className="loader-footer">
          <span>WEB DEVELOPMENT <i>·</i> CYBERSECURITY</span>
          <span>LEARNING IN PROGRESS</span>
        </footer>
      </main>
    </div>
  )
}
