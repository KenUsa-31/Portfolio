import './Certificates.css'

const certificates = [
  {
    img: '/certificate/optimized/psits_esports-technical-derictor.jpg',
    full: '/certificate/PSITS_ESPORTS TECHNICAL DERICTOR.png',
    title: 'PSITS Festival of Talents 2025',
    issuer: 'PSITS Region XI – University of Immaculate Conception',
    date: 'March 16, 2025',
    description: 'Certificate of Appreciation as Esports Technical Director at “Festival of Talents 2025.”',
  },
  {
    img: '/certificate/optimized/certificate-of-e-toolkit_-emerging-educational-technology-tools_page-0001.jpg',
    full: '/certificate/Certificate of E-Toolkit_ Emerging Educational Technology Tools_page-0001.jpg',
    title: 'E-Toolkit: Emerging Educational Technology Tools',
    issuer: 'University of Southeastern Philippines',
    date: 'February 26, 2026',
    description: 'Certificate of Participation for the online event “E-Toolkit: Emerging Educational Technology Tools,” held via Microsoft Teams.',
  },
  {
    img: '/certificate/optimized/certificate-of-participation.jpg',
    full: '/certificate/Certificate of Participation.png',
    title: 'VIBE Workshop for Basic Video Editing',
    issuer: 'VIBE Club – UIC Father Selga Campus',
    date: 'April 20, 2024',
    description: 'Certificate of Appreciation as a VIBE Officer for the “Workshop/Seminar for Basic Video Editing using Adobe Premiere Pro.”',
  },
  {
    img: '/certificate/optimized/certificate_ken-andrei-usa.jpg',
    full: '/certificate/Certificate_Ken Andrei Usa.png',
    title: 'Git and GitHub Workshop',
    issuer: 'Google Developer Groups on Campus – UIC',
    date: 'October 23, 2024',
    description: 'Certificate of Participation for the “Git and GitHub Workshop: Version Control 101.”',
  },
]

export default function Certificates({ onImageClick }) {
  return (
    <section id="certificates" className="certificates-section">
      <div className="section-title">
        <h2>Certificates</h2>
        <p className="section-sub">Selected training and recognition</p>
      </div>

      <div className="certificates-grid">
        {certificates.map(certificate => (
          <article className="certificate-card" key={certificate.title}>
            <button
              className="certificate-preview"
              type="button"
              onClick={() => onImageClick(certificate.full)}
              aria-label={`View ${certificate.title}`}
            >
              <img src={certificate.img} alt={certificate.title} loading="lazy" decoding="async" />
              <span>View certificate <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /></span>
            </button>
            <div className="certificate-details">
              <h3>{certificate.title}</h3>
              <p>{certificate.issuer}</p>
              <p className="certificate-description">{certificate.description}</p>
              <time>{certificate.date}</time>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
