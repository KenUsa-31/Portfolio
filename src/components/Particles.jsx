import { useRef, useEffect } from 'react'

export default function Particles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []
    let accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || '#171717'
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const themeObserver = new MutationObserver(() => {
      accent = getComputedStyle(document.body).getPropertyValue('--accent').trim() || accent
    })
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] })

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const count = isTouch ? Math.min(50, Math.floor(canvas.offsetWidth / 30)) : Math.min(100, Math.floor(canvas.offsetWidth / 15))
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2.2 + 0.6,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const mouse = { x: -1000, y: -1000 }
    const handleMouse = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleTouch = (e) => {
      const rect = canvas.getBoundingClientRect()
      const t = e.touches[0]
      if (t) {
        mouse.x = t.clientX - rect.left
        mouse.y = t.clientY - rect.top
      }
    }
    const handleTouchEnd = () => { mouse.x = -1000; mouse.y = -1000 }

    canvas.addEventListener('mousemove', handleMouse)
    if (isTouch) {
      canvas.addEventListener('touchmove', handleTouch, { passive: true })
      canvas.addEventListener('touchend', handleTouchEnd)
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particles.forEach((p) => {
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120
          p.vx -= (dx / dist) * force * 0.04
          p.vy -= (dy / dist) * force * 0.04
        }

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        if (p.x < 0) { p.x = canvas.offsetWidth; }
        if (p.x > canvas.offsetWidth) { p.x = 0; }
        if (p.y < 0) { p.y = canvas.offsetHeight; }
        if (p.y > canvas.offsetHeight) { p.y = 0; }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = accent
        ctx.fill()
      })
      ctx.globalAlpha = 1

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = accent
            ctx.globalAlpha = 0.12 * (1 - dist / 100)
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      themeObserver.disconnect()
      canvas.removeEventListener('mousemove', handleMouse)
      canvas.removeEventListener('touchmove', handleTouch)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 0,
      }}
    />
  )
}
