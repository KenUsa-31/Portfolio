import { useState, useEffect, useRef } from 'react'
import './GameLoader.css'

const STATUS_MESSAGES = [
  'Initializing portfolio…',
  'Loading assets…',
  'Preparing interface…',
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
        setStatusText('Complete')
        setDone(true)
        setTimeout(() => setFadeOut(true), 300)
        setTimeout(() => onComplete(), 800)
      }
    }, tick)

    return () => clearInterval(intervalRef.current)
  }, [onComplete])

  return (
    <div className={`loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-bg" />
      <div className="loader-content">
        <div className="loader-brand">
          <div className="logo-mark">K</div>
          <div className="loader-name">Ken Andrei Usa</div>
          <div className="loader-tag">Web Developer · Exploring Cybersecurity</div>
        </div>

        <div className="loader-progress-wrap">
          <div className="loader-ring">
            <svg className="ring-svg" viewBox="0 0 100 100">
              <circle className="ring-track" cx="50" cy="50" r="45" />
              <circle
                className="ring-fill"
                cx="50"
                cy="50"
                r="45"
                style={{
                  strokeDasharray: 283,
                  strokeDashoffset: 283 - (283 * progress) / 100,
                }}
              />
            </svg>
            <div className="ring-center">
              <span className="ring-percent">{Math.floor(progress)}%</span>
            </div>
          </div>
          <div className="loader-status">{statusText}</div>
          <div className="loader-clock">{davaoTime}</div>
        </div>

        {done && <div className="loader-ready">Ready</div>}
      </div>

      <div className="loader-hint">
        <span className="hint-dot" /> Loading portfolio…
      </div>
    </div>
  )
}
