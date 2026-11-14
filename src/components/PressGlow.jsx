import { useEffect, useRef } from 'react'
import './PressGlow.css'

const MAX_GLOWS = 20

function getAccentRgb() {
  const value = getComputedStyle(document.body).getPropertyValue('--accent').trim()
  const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1]
  if (hex) {
    const full = hex.length === 3 ? [...hex].map(char => char + char).join('') : hex
    return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16)).join(', ')
  }
  const channels = value.match(/[\d.]+/g)
  return channels?.slice(0, 3).join(', ') || '101, 237, 145'
}

export default function PressGlow() {
  const canvasRef = useRef(null)
  const glowsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let accentRgb = getAccentRgb()

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const addGlow = (x, y) => {
      glowsRef.current.push({
        x, y,
        radius: 0,
        maxRadius: 120 + Math.random() * 60,
        alpha: 0.5,
        speed: 1.5 + Math.random() * 1,
        born: performance.now(),
      })
      if (glowsRef.current.length > MAX_GLOWS) glowsRef.current.shift()
    }

    const onMouseDown = (e) => addGlow(e.clientX, e.clientY)
    const onTouchStart = (e) => {
      for (const t of e.changedTouches) addGlow(t.clientX, t.clientY)
    }
    const themeObserver = new MutationObserver(() => { accentRgb = getAccentRgb() })
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })

    const draw = (now) => {
      glowsRef.current = glowsRef.current.filter(g => g.alpha > 0.01)

      if (glowsRef.current.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        raf = requestAnimationFrame(draw)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const g of glowsRef.current) {
        const age = (now - g.born) / 1000
        g.radius = Math.min(g.radius + g.speed * 2, g.maxRadius)
        g.alpha = 0.5 * Math.max(0, 1 - age / 1.5)

        const gradient = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius)
        gradient.addColorStop(0, `rgba(${accentRgb},${g.alpha * 0.6})`)
        gradient.addColorStop(0.4, `rgba(${accentRgb},${g.alpha * 0.3})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('touchstart', onTouchStart)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="press-glow-canvas"
      aria-hidden="true"
    />
  )
}
