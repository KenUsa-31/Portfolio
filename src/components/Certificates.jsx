import CircularTestimonials from './ui/circular-testimonials'

const certs = [
  {
    img: '/certificate/optimized/psits_esports-technical-derictor.jpg',
    full: '/certificate/PSITS_ESPORTS TECHNICAL DERICTOR.png',
    title: 'PSITS Festival of Talents 2025',
    issuer: 'PSITS Region XI – University of Immaculate Conception',
    date: 'March 16, 2025',
    desc: 'Certificate of Appreciation as Esports Technical Director at "Festival of Talents 2025."',
  },
  {
    img: '/certificate/optimized/certificate-of-e-toolkit_-emerging-educational-technology-tools_page-0001.jpg',
    full: '/certificate/Certificate of E-Toolkit_ Emerging Educational Technology Tools_page-0001.jpg',
    title: 'E-Toolkit: Emerging Educational Technology Tools',
    issuer: 'University of Southeastern Philippines',
    date: 'February 26, 2026',
    desc: 'Certificate of Participation for the online event "E-Toolkit: Emerging Educational Technology Tools," held via Microsoft Teams.',
  },
  {
    img: '/certificate/optimized/certificate-of-participation.jpg',
    full: '/certificate/Certificate of Participation.png',
    title: 'VIBE Workshop for Basic Video Editing',
    issuer: 'VIBE Club – UIC Father Selga Campus',
    date: 'April 20, 2024',
    desc: 'Certificate of Appreciation as a VIBE Officer for the "Workshop/Seminar for Basic Video Editing using Adobe Premiere Pro."',
  },
  {
    img: '/certificate/optimized/certificate_ken-andrei-usa.jpg',
    full: '/certificate/Certificate_Ken Andrei Usa.png',
    title: 'Git and GitHub Workshop',
    issuer: 'Google Developer Groups (GDG) On Campus – UIC',
    date: 'October 23, 2024',
    desc: 'Certificate of Participation for the "Git and GitHub Workshop: Version Control 101."',
  },
]

const testimonials = certs.map(cert => ({
  name: cert.title,
  designation: `${cert.issuer} • ${cert.date}`,
  quote: cert.desc,
  src: cert.img,
  full: cert.full,
}))

const colors = {
  name: 'var(--text)',
  designation: 'var(--text-muted)',
  testimony: 'var(--text-muted)',
  arrowBackground: 'var(--bg3)',
  arrowForeground: 'var(--text)',
  arrowHoverBackground: '#00a6fb',
}

const fontSizes = {
  name: '1.5rem',
  designation: '1.1rem',
  quote: '1.25rem',
}

export default function Certificates({ onImageClick }) {
  return (
    <section id="certificates" className="certificates-section">
      <div className="section-title">
        <h2>My <span>Certificates</span></h2>
        <p className="section-sub">Click a certificate to view it in full</p>
      </div>

      <CircularTestimonials
        testimonials={testimonials}
        autoplay={true}
        colors={colors}
        fontSizes={fontSizes}
        onActiveClick={src => {
          const cert = testimonials.find(t => t.src === src)
          onImageClick(cert?.full || src)
        }}
      />
    </section>
  )
}
