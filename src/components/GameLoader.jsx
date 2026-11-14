import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import './GameLoader.css'

const STATUS_MESSAGES = [
  'Mounting portfolio profile…',
  'Indexing selected projects…',
  'Loading security notes…',
  'Starting shell…',
]

const BOOT_LOG = [
  ['[profile]', 'Developer profile ready'],
  ['[projects]', 'Project index ready'],
  ['[security]', 'Security lab ready'],
]

export default function GameLoader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0])
  const [done, setDone] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const doneRef = useRef(false)
  const intervalRef = useRef(null)
  const completionTimeoutRef = useRef(null)

  const finish = useCallback(() => {
    if (doneRef.current) return

    doneRef.current = true
    window.clearInterval(intervalRef.current)
    setProgress(100)
    setStatusText('Boot sequence complete')
    setDone(true)
    setFadeOut(true)
    completionTimeoutRef.current = window.setTimeout(onComplete, 500)
  }, [onComplete])

  useEffect(() => {
    let elapsed = 0
    const totalDuration = 2400
    const tick = 50

    intervalRef.current = window.setInterval(() => {
      elapsed += tick
      setProgress(Math.min(Math.round((elapsed / totalDuration) * 96), 96))

      const messageIndex = Math.min(
        Math.floor(elapsed / (totalDuration / STATUS_MESSAGES.length)),
        STATUS_MESSAGES.length - 1,
      )
      setStatusText(STATUS_MESSAGES[messageIndex])

      if (elapsed >= totalDuration) finish()
    }, tick)

    return () => {
      window.clearInterval(intervalRef.current)
      window.clearTimeout(completionTimeoutRef.current)
    }
  }, [finish])

  return (
    <div className={`loader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-titlebar" aria-hidden="true">
        <div className="loader-window-controls"><i /><i /><i /></div>
        <span>ken@portfolio:~ — bash</span>
        <span className="loader-tty">TTY1</span>
      </div>

      <main className="loader-content" aria-label="Portfolio loading">
        <div className="loader-terminal-body">
          <p className="loader-invocation"><span>ken@portfolio:~$</span> ./portfolio --boot</p>
          <h1>Web development <span>·</span><br />Cybersecurity exploration</h1>
          <p className="loader-description">Building useful things for the web while learning how to secure them.</p>

          <div className="loader-boot-log" aria-hidden="true">
            {BOOT_LOG.map(([label, message], index) => (
              <p key={label} style={{ '--boot-delay': `${0.2 + index * 0.34}s` }}>
                <span>{label}</span>
                <span className="loader-log-message">{message}</span>
                <b>OK</b>
              </p>
            ))}
          </div>

          <div className="loader-progress-block">
            <div className="loader-progress-caption">
              <span className="loader-status"><i aria-hidden="true" /> {statusText}</span>
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

          <div className="loader-actions">
            <p className={`loader-footnote ${done ? 'is-ready' : ''}`} aria-live="polite">
              <span>ken@portfolio:~$</span> {done ? 'ready' : 'loading'}<i aria-hidden="true" />
            </p>
            <button className="loader-skip" type="button" onClick={finish}>
              {done ? 'Entering' : 'Skip intro'} <ArrowRight size={15} aria-hidden="true" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
