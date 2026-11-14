import { useMagnetic } from '../hooks/useInteractiveEffects'
import './Footer.css'

export default function Footer() {
  const magneticTop = useMagnetic(0.3)

  return (
    <footer>
      <div className="footer-left">
        <span className="footer-logo">ken@portfolio<span>:~$</span></span>
        <span className="footer-copy">&copy; {new Date().getFullYear()} Ken Andrei Usa</span>
      </div>
      <div className="footer-right">
        <a ref={magneticTop} href="#home" className="back-to-top" aria-label="Open Home section">
          <i className="fa-solid fa-chevron-up" />
        </a>
      </div>
    </footer>
  )
}
