import { useState, useEffect, useRef } from 'react'
import './LocalTime.css'

export default function LocalTime() {
  const [time, setTime] = useState(new Date())
  const ref = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.1 })
    ref.current?.querySelectorAll('.time-card').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const DAVAO_TIMEZONE = 'Asia/Manila'

  const formatTime = (date) => {
    const options = { timeZone: DAVAO_TIMEZONE, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }
    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date)
    const get = (type) => parts.find(p => p.type === type)?.value || ''
    const hours = get('hour').padStart(2, '0')
    const minutes = get('minute').padStart(2, '0')
    const seconds = get('second').padStart(2, '0')
    const ampm = get('dayPeriod').toUpperCase()
    return { hours, minutes, seconds, ampm }
  }

  const getDavaoDate = (date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: DAVAO_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDavaoHours = (date) => {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: DAVAO_TIMEZONE, hour: 'numeric', hour12: false }).formatToParts(date)
    return parseInt(parts.find(p => p.type === 'hour')?.value || '0')
  }

  const getDayProgress = (date) => {
    const hours = getDavaoHours(date)
    const minutes = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: DAVAO_TIMEZONE, minute: 'numeric' }).format(date))
    const totalMinutes = hours * 60 + minutes
    return Math.round((totalMinutes / 1440) * 100)
  }

  const getGreeting = (hours) => {
    if (hours >= 5 && hours < 12) return 'Good Morning'
    if (hours >= 12 && hours < 17) return 'Good Afternoon'
    if (hours >= 17 && hours < 21) return 'Good Evening'
    return 'Good Night'
  }

  const { hours, minutes, seconds, ampm } = formatTime(time)
  const dayProgress = getDayProgress(time)
  const greeting = getGreeting(getDavaoHours(time))
  const remaining = 1440 - Math.round(getDavaoHours(time) * 60 + parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', minute: 'numeric' }).format(time)))

  const circumference = 2 * Math.PI * 50
  const offset = circumference * (1 - dayProgress / 100)

  return (
    <section id="time" className="time-section" ref={ref}>
      <div className="section-title">
        <h2>Local <span>Time</span></h2>
        <p className="section-sub">Current time in Davao City, Philippines</p>
      </div>

      <div className="time-grid">
        <div className="time-card clock-card">
          <div className="clock-digital">
            <span className="clock-hours">{hours}</span>
            <span className="clock-separator">:</span>
            <span className="clock-minutes">{minutes}</span>
            <span className="clock-seconds">:{seconds}</span>
            <span className="clock-ampm">{ampm}</span>
          </div>
          <p className="clock-greeting">{greeting}</p>
        </div>

        <div className="time-card info-card">
          <div className="info-item">
            <i className="fa-solid fa-calendar-day" />
            <div>
              <p className="info-label">Today&apos;s Date</p>
              <p className="info-value">{getDavaoDate(time)}</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-location-dot" />
            <div>
              <p className="info-label">Location</p>
              <p className="info-value">Davao City, Philippines</p>
            </div>
          </div>
          <div className="info-item">
            <i className="fa-solid fa-clock" />
            <div>
              <p className="info-label">UTC Offset</p>
              <p className="info-value">UTC+8 (PHT)</p>
            </div>
          </div>
        </div>

        <div className="time-card progress-card">
          <p className="progress-label">Day Progress</p>
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 120 120">
              <circle className="progress-ring-bg" cx="60" cy="60" r="50" />
              <circle
                className="progress-ring-fill"
                cx="60" cy="60" r="50"
                style={{
                  strokeDasharray: `${circumference}`,
                  strokeDashoffset: `${offset}`
                }}
              />
            </svg>
            <span className="progress-value">{dayProgress}%</span>
          </div>
          <p className="progress-sub">{remaining} minutes remaining</p>
        </div>
      </div>
    </section>
  )
}
