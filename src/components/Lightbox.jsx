import { useEffect, useRef, useCallback } from 'react'
import './Lightbox.css'

export default function Lightbox({ src, caption, onClose }) {
  const containerRef = useRef(null)
  const touchStart = useRef({ x: 0, y: 0 })

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'Tab' && containerRef.current) {
      const focusable = containerRef.current.querySelectorAll('button, [tabindex]')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
  }, [onClose])

  const handleTouchStart = useCallback((e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x)
    if (dy > 80 && dy > dx * 1.5) onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    const closeBtn = containerRef.current?.querySelector('.lightbox-close')
    closeBtn?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div
      ref={containerRef}
      className="lightbox active"
      role="dialog"
      aria-modal="true"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className="lightbox-close" onClick={onClose} aria-label="Close">&times;</span>
      <img src={src} alt={(caption && caption.title) || 'Project Preview'} />
      {caption && (
        <div className="lightbox-caption">
          <h3>{caption.title}</h3>
          {caption.date && <span>{caption.date}</span>}
        </div>
      )}
    </div>
  )
}
