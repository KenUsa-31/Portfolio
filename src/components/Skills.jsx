import { useEffect, useRef } from 'react'
import { useTilt, useStaggerReveal } from '../hooks/useInteractiveEffects'
import TechStackScroller from './TechStackScroller'
import './Skills.css'

const developmentFocus = [
  'Full-Stack Web Apps','AI Integration','Responsive Interfaces',
  'Real-Time Features','Document Processing','REST API Development',
  'Database Design','Role-Based Access','Cybersecurity Exploration',
]

const software = [
  'VS Code','NetBeans','Adobe Premiere','OBS Studio',
  'Microsoft Office','Google Workspace','Figma (Basic)','GitHub Desktop','Obsidian',
]

const services = [
  { icon: 'fa-globe',              title: 'Web Development',          desc: 'Responsive websites using HTML, CSS & JavaScript' },
  { icon: 'fa-screwdriver-wrench', title: 'IT Support & Troubleshooting', desc: 'Hardware/software diagnosis and repair' },
  { icon: 'fa-video',              title: 'Video Editing',            desc: 'Basic video production using Adobe Premiere & OBS' },
  { icon: 'fa-database',           title: 'Data Entry & Management',  desc: 'Organized spreadsheets and data documentation' },
]

function ServicesTiltCard({ children }) {
  const tiltRef = useTilt(4)
  return (
    <div ref={tiltRef} className="skill-category services-card tilt-card">
      <div className="glow" />
      {children}
    </div>
  )
}

export default function Skills() {
  const ref = useRef(null)
  const focusRef = useStaggerReveal(60)
  const swRef = useStaggerReveal(60)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.3 })
    ref.current?.querySelectorAll('.skill-category').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" className="skills-section">
      <div className="section-title skills-intro">
        <h2>What I work with.</h2>
        <p className="section-sub">The tools and systems behind my work.</p>
      </div>

      <div className="skills-grid" ref={ref}>
        <TechStackScroller />

        <div className="skill-category">
          <h3><i className="fa-solid fa-code-branch" /> Development Focus</h3>
          <div className="soft-skills-list" ref={focusRef}>
            {developmentFocus.map(s => <span className="tag" key={s}>{s}</span>)}
          </div>
        </div>

        <div className="skill-category">
          <h3><i className="fa-solid fa-laptop-code" /> Software Proficiencies</h3>
          <div className="soft-skills-list" ref={swRef}>
            {software.map(s => <span className="tag" key={s}>{s}</span>)}
          </div>
        </div>

        <ServicesTiltCard>
          <h3><i className="fa-solid fa-briefcase" /> Services I Offer</h3>
          <div className="services-list">
            {services.map(s => (
              <div className="service-item" key={s.title}>
                <div className="service-icon-wrap">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ServicesTiltCard>
      </div>
    </section>
  )
}
