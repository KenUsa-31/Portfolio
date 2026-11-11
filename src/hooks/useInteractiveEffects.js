import { useEffect, useRef, useCallback } from 'react'

const isTouch = () => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return

    if (isTouch()) {
      const handleTap = () => {
        el.style.transition = 'transform 0.15s ease'
        el.style.transform = `scale(0.92)`
        setTimeout(() => {
          el.style.transform = 'scale(1)'
          setTimeout(() => { el.style.transition = '' }, 150)
        }, 150)
      }
      el.addEventListener('touchstart', handleTap, { passive: true })
      return () => el.removeEventListener('touchstart', handleTap)
    }

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }

    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)'
      el.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
      setTimeout(() => { el.style.transition = '' }, 400)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}

export function useTilt(maxTilt = 10) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced()) return

    if (isTouch()) {
      let hasGyro = false

      const handleOrientation = (e) => {
        const { beta, gamma } = e
        if (beta === null || gamma === null) return
        hasGyro = true
        const tiltX = Math.max(-maxTilt, Math.min(maxTilt, (beta - 45) * 0.3))
        const tiltY = Math.max(-maxTilt, Math.min(maxTilt, gamma * 0.3))
        el.style.setProperty('--mouse-x', `${50 + tiltY}%`)
        el.style.setProperty('--mouse-y', `${50 - tiltX}%`)
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
      }

      const handleTouchMove = (e) => {
        if (hasGyro) return
        if (!e.touches[0]) return
        const rect = el.getBoundingClientRect()
        const x = (e.touches[0].clientX - rect.left) / rect.width
        const y = (e.touches[0].clientY - rect.top) / rect.height
        const tiltX = (0.5 - y) * maxTilt * 0.6
        const tiltY = (x - 0.5) * maxTilt * 0.6
        el.style.setProperty('--mouse-x', `${x * 100}%`)
        el.style.setProperty('--mouse-y', `${y * 100}%`)
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
      }

      const handleTouchEnd = () => {
        if (hasGyro) return
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        setTimeout(() => { el.style.transition = '' }, 500)
      }

      const requestPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          try {
            const perm = await DeviceOrientationEvent.requestPermission()
            if (perm === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation)
            }
          } catch { /* denied */ }
        } else {
          window.addEventListener('deviceorientation', handleOrientation)
        }
      }

      const requestOnInteraction = () => {
        requestPermission()
        window.removeEventListener('touchstart', requestOnInteraction)
      }
      window.addEventListener('touchstart', requestOnInteraction, { once: true })

      el.addEventListener('touchmove', handleTouchMove, { passive: true })
      el.addEventListener('touchend', handleTouchEnd, { passive: true })
      return () => {
        window.removeEventListener('touchstart', requestOnInteraction)
        window.removeEventListener('deviceorientation', handleOrientation)
        el.removeEventListener('touchmove', handleTouchMove)
        el.removeEventListener('touchend', handleTouchEnd)
      }
    }

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const tiltX = (0.5 - y) * maxTilt
      const tiltY = (x - 0.5) * maxTilt
      el.style.setProperty('--mouse-x', `${x * 100}%`)
      el.style.setProperty('--mouse-y', `${y * 100}%`)
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    }

    const handleLeave = () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
      setTimeout(() => { el.style.transition = '' }, 500)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [maxTilt])

  return ref
}

export function useRipple() {
  const ref = useRef(null)

  const createRipple = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const ripple = document.createElement('span')
    const size = Math.max(rect.width, rect.height) * 2
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${clientX - rect.left - size / 2}px;
      top: ${clientY - rect.top - size / 2}px;
      background: currentColor;
      border-radius: 50%;
      opacity: 0.15;
      transform: scale(0);
      animation: ripple-expand 0.6s ease-out forwards;
      pointer-events: none;
    `
    el.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)
  }, [])

  return { ref, createRipple }
}

export function useStaggerReveal(staggerDelay = 80) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced()) {
      Array.from(el.children).forEach(child => {
        child.style.opacity = '1'
        child.style.transform = 'none'
      })
      return
    }

    const children = el.children
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(children).forEach((child, i) => {
              child.style.opacity = '0'
              child.style.transform = 'translateY(24px)'
              child.style.transition = `opacity 0.5s ease ${i * staggerDelay}ms, transform 0.5s ease ${i * staggerDelay}ms`
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  child.style.opacity = '1'
                  child.style.transform = 'translateY(0)'
                })
              })
            })
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [staggerDelay])

  return ref
}
