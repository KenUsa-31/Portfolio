import { useEffect, useRef } from 'react'
import './Experience.css'

const items = [
  {
    date: '2023 – Present',
    title: 'Esports Technical Director',
    org: 'PSITS Region 11 — Philippine Society of IT Students',
    desc: 'Overseeing technical operations of competitive tournaments across Dota 2, Valorant, CS2, Mobile Legends, and Call of Duty Mobile. Managing live stream production using OBS Studio.',
  },
  {
    date: '2023 – 2025',
    title: 'Committee Member',
    org: 'PSITS Region 11 — Philippine Society of IT Students',
    desc: 'Contributed to the planning and execution of regional IT student events, activities, and initiatives.',
  },
  {
    date: '2023 – Present',
    title: 'Technical Committee',
    org: 'VIBE — Virtual Initiative for Building Engagement Club',
    desc: 'Handling technical operations, equipment setup, and digital support for club events and activities.',
  },
  {
    date: '2024 – 2025',
    title: 'Former Technical Committee',
    org: 'GDGOC — Google Developer Group on Campus',
    desc: 'Supported technical workshops, developer events, and community-driven tech initiatives.',
  },
  {
    date: 'Ongoing',
    title: 'Technical Event Support (Volunteer)',
    org: 'University Events & Workshops',
    desc: 'Setting up projectors, microphones, audio-visual equipment, and troubleshooting on-site technical issues for university events.',
  },
]

export default function Experience() {
  const timelineRef = useRef(null)

  useEffect(() => {
    const items = timelineRef.current?.querySelectorAll('.timeline-item')
    if (!items) return
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' })
    items.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience" className="experience-section">
      <div className="section-title">
        <h2>Experience &amp; <span>Background</span></h2>
        <p className="section-sub">My journey so far</p>
      </div>

      <div className="timeline" ref={timelineRef}>
        {items.map((item, i) => (
          <div className="timeline-item" key={i} style={{ transitionDelay: `${i * 120}ms` }}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <h3>{item.title}</h3>
                  <h4>{item.org}</h4>
                </div>
                <span className="timeline-date">{item.date}</span>
              </div>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
