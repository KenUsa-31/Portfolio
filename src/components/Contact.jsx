import { useMagnetic } from '../hooks/useInteractiveEffects'
import './Contact.css'

const EMAIL = 'kusa_230000002006@uic.edu.ph'

const socials = [
  ['fa-facebook',  'https://www.facebook.com/kenandrei.duran',        'Facebook'],
  ['fa-linkedin',  'https://www.linkedin.com/in/ken-d-usa-9a4561327/', 'LinkedIn'],
  ['fa-github',    'https://github.com/eclipse31-dev',                 'GitHub'],
  ['fa-instagram', 'https://www.instagram.com/si_kenusa/',             'Instagram'],
]

export default function Contact() {
  const magneticResume = useMagnetic(0.2)

  return (
    <section id="contact" className="contact-section">
      <div className="contact-wrapper">
        <div className="contact-info">
          <div className="contact-info-header">
            <h3>Let's Connect</h3>
            <p>Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox is always open.</p>
          </div>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-detail-icon"><i className="fa-solid fa-envelope" /></div>
              <a href={`mailto:${EMAIL}`} className="contact-detail-link">{EMAIL}</a>
            </div>
            <div className="contact-detail-item">
              <div className="contact-detail-icon"><i className="fa-solid fa-location-dot" /></div>
              <span>Davao City, Philippines</span>
            </div>
          </div>

          <div className="social-links">
            {socials.map(([icon, href, label]) => (
              <a key={icon} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                <i className={`fa-brands ${icon}`} />
              </a>
            ))}
          </div>

          <a ref={magneticResume} href="/resume/Usa_Resume.pdf" className="btn ripple-btn" download style={{ display: 'inline-flex', marginTop: '1rem' }}>
            <i className="fa-solid fa-file-pdf" /> Download Resume
          </a>
        </div>
      </div>
    </section>
  )
}
