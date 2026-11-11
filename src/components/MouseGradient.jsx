import { useEffect, useRef } from 'react'
import './MouseGradient.css'

export default function MouseGradient() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMove = (e) => {
      let x, y
      if (e.touches && e.touches[0]) {
        x = (e.touches[0].clientX / window.innerWidth) * 100
        y = (e.touches[0].clientY / window.innerHeight) * 100
      } else {
        x = (e.clientX / window.innerWidth) * 100
        y = (e.clientY / window.innerHeight) * 100
      }
      el.style.setProperty('--mx', `${x}%`)
      el.style.setProperty('--my', `${y}%`)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('touchmove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  return <div ref={ref} className="mouse-gradient" />
}
