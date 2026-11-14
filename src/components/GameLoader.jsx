import { useState, useEffect, useRef } from 'react'
import { Code2, ShieldCheck } from 'lucide-react'
import './GameLoader.css'

const STATUS_MESSAGES = [
  'Starting up…',
  'Loading projects…',
  'Preparing the portfolio…',
  'Almost ready…',
]

export default function GameLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0])
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const doneRef = useRef(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    let elapsed = 0
    const totalDuration = 3000
    const tick = 40

    intervalRef.current = setInterval(() => {
      elapsed += tick
      const base = Math.min((elapsed / totalDuration) * 90, 90)
      setProgress(Math.min(base + Math.random() * 5, 97))

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
      <div className="loader-backdrop" aria-hidden="true">
        <div className="loader-grid" />
        <div className="loader-glow" />
        <span className="loader-code loader-code--left">{'{ }'}</span>
        <span className="loader-code loader-code--right">{'</>'}</span>
      </div>

      <main className="loader-content">
        <p className="loader-brand">KEN ANDREI USA <span>·</span> PORTFOLIO</p>

        <div className="loader-emblem" aria-hidden="true">
          <div className="loader-orbit" />
          <div className="loader-emblem-core"><ShieldCheck size={38} strokeWidth={1.6} /></div>
          <span className="loader-code-chip"><Code2 size={15} strokeWidth={2} /></span>
        </div>

        <h1>Web developer.<br /><span>Cybersecurity explorer.</span></h1>
        <p className="loader-description">Building useful things for the web while learning how to secure them.</p>

        <div className="loader-progress-block">
          <div className="loader-progress-caption">
            <span className="loader-status"><i /> {statusText}</span>
            <span className="loader-percent">{Math.floor(progress).toString().padStart(2, '0')}%</span>
          </div>
          <div
            className="loader-progress"
            role="progressbar"
            aria-label="Portfolio loading progress"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.floor(progress)}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <p className={`loader-footnote ${done ? 'is-ready' : ''}`}>
          {done ? 'READY TO EXPLORE' : 'WEB DEVELOPMENT  /  CYBERSECURITY'}
        </p>
      </main>
    </div>
  )
}
