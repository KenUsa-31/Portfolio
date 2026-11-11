import { useEffect, useRef } from 'react'
import './GradientOrbs.css'

const ORBS = [
  { size: 700, x: 8, y: 12, speed: 0.12, opacity: 0.12 },
  { size: 600, x: 78, y: 82, speed: 0.1, opacity: 0.1 },
  { size: 550, x: 42, y: 48, speed: 0.18, opacity: 0.09 },
  { size: 500, x: 88, y: 18, speed: 0.24, opacity: 0.11 },
  { size: 420, x: 18, y: 72, speed: 0.16, opacity: 0.1 },
  { size: 360, x: 62, y: 92, speed: 0.22, opacity: 0.09 },
  { size: 520, x: 32, y: 38, speed: 0.14, opacity: 0.08 },
  { size: 320, x: 92, y: 55, speed: 0.3, opacity: 0.1 },
]

function getTextRgb() {
  const c = getComputedStyle(document.body).color
  const m = c.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  return m ? `${m[1]}, ${m[2]}, ${m[3]}` : '250, 250, 250'
}

export default function GradientOrbs() {
  const containerRef = useRef(null)
  const orbRefs = useRef([])
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const tiltRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef(0)
  const rafRef = useRef(null)
  const timeRef = useRef(0)
  const colorRef = useRef(getTextRgb())

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const updateColors = () => {
      colorRef.current = getTextRgb()
      orbRefs.current.forEach((el, i) => {
        if (!el) return
        const orb = ORBS[i]
        el.style.background = `radial-gradient(circle, rgba(${colorRef.current}, ${orb.opacity}), transparent 70%)`
      })
    }
    updateColors()

    const observer = new MutationObserver(updateColors)
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const handleTouch = (e) => {
      if (e.touches[0]) {
        mouseRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        }
      }
    }

    const handleOrientation = (e) => {
      if (e.gamma === null || e.beta === null) return
      tiltRef.current = {
        x: Math.max(-1, Math.min(1, e.gamma / 30)),
        y: Math.max(-1, Math.min(1, (e.beta - 45) / 30)),
      }
    }

    const handleScroll = () => {
      scrollRef.current = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)
    }

    const requestGyro = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const perm = await DeviceOrientationEvent.requestPermission()
          if (perm === 'granted') window.addEventListener('deviceorientation', handleOrientation)
        } catch { /* denied */ }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    if (isTouch) {
      window.addEventListener('touchmove', handleTouch, { passive: true })
      requestGyro()
    } else {
      window.addEventListener('mousemove', handleMouseMove)
    }

    const animate = (timestamp) => {
      timeRef.current = timestamp * 0.001
      const t = timeRef.current
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const tx = tiltRef.current.x
      const ty = tiltRef.current.y
      const scroll = scrollRef.current

      orbRefs.current.forEach((el, i) => {
        if (!el) return
        const orb = ORBS[i]

        const driftX = Math.sin(t * orb.speed + i * 2.3) * 18
        const driftY = Math.cos(t * orb.speed * 0.7 + i * 1.7) * 16
        const pulse = 1 + Math.sin(t * 0.3 + i * 1.2) * 0.08

        const baseX = orb.x + driftX
        const baseY = orb.y + driftY

        const mouseInfluenceX = isTouch ? tx * 14 : (mx - 0.5) * 20
        const mouseInfluenceY = isTouch ? ty * 14 : (my - 0.5) * 15

        const scrollOffset = scroll * 35 * (i + 1) * 0.3

        const finalX = baseX + mouseInfluenceX
        const finalY = baseY + mouseInfluenceY - scrollOffset

        const scale = pulse * (1 + Math.sin(t * 0.5 + i) * 0.08)

        el.style.transform = `translate(${finalX}vw, ${finalY}vh) scale(${scale})`
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  return (
    <div ref={containerRef} className="gradient-orbs" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          ref={el => {
            orbRefs.current[i] = el
            if (el && !el._bgSet) {
              el._bgSet = true
              el.style.background = `radial-gradient(circle, rgba(${getTextRgb()}, ${orb.opacity}), transparent 70%)`
            }
          }}
          className="gradient-orb"
          style={{
            width: orb.size,
            height: orb.size,
          }}
        />
      ))}
    </div>
  )
}
