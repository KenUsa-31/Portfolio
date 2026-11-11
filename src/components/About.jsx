import { useEffect, useRef, useState, Component } from 'react'
import { useTilt } from '../hooks/useInteractiveEffects'
import { isLowPowerDevice } from '../lib/deviceCapability'
import './About.css'

class LanyardBoundary extends Component {
  constructor(props) { super(props); this.state = { err: false } }
  static getDerivedStateFromError() { return { err: true } }
  render() { return this.state.err ? null : this.props.children }
}

function LazyLanyard() {
  const [Comp, setComp] = useState(null)
  useEffect(() => {
    let off = false
    import('./Lanyard').then(m => { if (!off) setComp(() => m.default) }).catch(() => {})
    return () => { off = true }
  }, [])
  if (!Comp) return null
  return <LanyardBoundary><Comp gravity={1} cardColor="#000000" strapColor="#000000" finish="matte" /></LanyardBoundary>
}

function TiltCard({ children, className = '' }) {
    const tiltRef = useTilt(6)
    return (
      <div ref={tiltRef} className={`about-card tilt-card ${className}`}>
        <div className="glow" />
        {children}
      </div>
    )
  }

export default function About() {
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    ref.current?.querySelectorAll('.about-card').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" className="about-section">
      <div className="section-title">
        <h2>About <span>Me</span></h2>
        <p className="section-sub">Get to know me better</p>
      </div>

      <div className="about-wrapper" ref={ref}>
        <div className="about-row about-row--hero">
          <div className="about-lanyard">
            {!isLowPowerDevice() && <LazyLanyard />}
          </div>
        </div>

        <div className="about-row">
          <TiltCard>
            <div className="about-card-header">
              <div className="about-card-icon"><i className="fa-solid fa-user" /></div>
              <h3>Background</h3>
            </div>
            <p>
            I'm Ken Andrei Usa, born and raised in Davao City, Philippines. I completed my basic education at the University of the Immaculate Conception (UIC), where I studied from preschool through senior high school at the Basic Education Department, Bajada Campus. I am currently pursuing a Bachelor of Science in Information Technology (BSIT) at the University of the Immaculate Conception (UIC) Main Campus in Bankerohan, Davao City.
            </p>
            <p>
              I build things for the web — from responsive interfaces to full-stack systems —
              and I'm currently exploring cybersecurity, learning the fundamentals of system
              and application security. I enjoy working across
              the stack, picking up new tools fast, and turning ideas into something real and
              usable. Whether it's a class project, a club event, or a personal build, I show
              up ready to figure it out.
            </p>
            <p>
              I'm willing to take on challenges I haven't faced before, collaborate with people
              I can learn from, and put in the work even when the path isn't clear. I don't
              wait for perfect conditions — I start, adapt, and improve as I go.
            </p>
            <p>
              I see a lot of possibility ahead — in the problems worth solving, the systems
              worth building, and the impact that good tech can have on real people. I'm here
              to grow into all of it.
            </p>
          </TiltCard>

          <TiltCard>
            <div className="about-card-header">
              <div className="about-card-icon"><i className="fa-solid fa-graduation-cap" /></div>
              <h3>Educational Background</h3>
            </div>
            <ul className="edu-list">
              <li>
                <span className="edu-year">2023 – Ongoing</span>
                <strong>BS Information Technology</strong>
                <em>UIC Main Campus, Bankerohan, Davao City</em>
              </li>
             <li>
                <span className="edu-year">2021 – 2023</span>
                <strong>Senior High School (Grade 11–12)</strong>
           <em>University of the Immaculate Conception (UIC) – Basic Education Department,Bajada Campus, Davao City</em>
                <p>Accountancy, Business, and Management (ABM) Strand</p>
             </li>
              <li>
                <span className="edu-year">2017 – 2021</span>
                <strong>Junior High School (Grade 7–10)</strong>
                <em>UIC Basic Education Dept., Bajada Campus, Davao City</em>
              </li>
              <li>
                <span className="edu-year">2009 – 2016</span>
                <strong>Pre School – Elementary (Kinder – Grade 6)</strong>
                <em>UIC Basic Education Dept., Bajada Campus, Davao City</em>
              </li>
            </ul>
          </TiltCard>
        </div>

        <div className="about-row">
          <TiltCard>
            <div className="about-card-header">
              <div className="about-card-icon"><i className="fa-solid fa-bullseye" /></div>
              <h3>Mission &amp; Vision</h3>
            </div>
            <div className="mv-block">
              <div className="mv-item">
                <span className="mv-label">Mission</span>
                <p>Use technology to solve real-world problems and keep growing as a developer who creates value for clients and communities.</p>
              </div>
              <div className="mv-item">
                <span className="mv-label">Vision</span>
                <p>Become a well-rounded full-stack developer who bridges solid technical skills with great user experience.</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="about-card-header">
              <div className="about-card-icon"><i className="fa-solid fa-rocket" /></div>
              <h3>Goals &amp; Motivation</h3>
            </div>
            <div className="goals-list">
              {[
                { icon: 'fa-flag',         text: 'Finish my BSIT degree and land a tech internship' },
                { icon: 'fa-layer-group',  text: 'Build my own software products from the ground up' },
                { icon: 'fa-code-branch',  text: 'Contribute to open-source and give back to the community' },
              ].map((g, i) => (
                <div className="goal-item" key={i}>
                  <i className={`fa-solid ${g.icon}`} />
                  <p>{g.text}</p>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>

        <div className="about-row">
          <TiltCard className="about-card--full">
            <div className="about-card-header">
              <div className="about-card-icon"><i className="fa-solid fa-trophy" /></div>
              <h3>Key Achievements</h3>
            </div>
            <div className="achievements-grid">
              {[
                { icon: 'fa-code',     text: 'Completed multiple web development projects as part of coursework' },
                { icon: 'fa-gamepad',  text: 'Serving as Esports Technical Director of PSITS Region 11 since 2023' },
                { icon: 'fa-database', text: 'Built full-stack applications integrating AI services, APIs, and database-backed workflows' },
              ].map((item, i) => (
                <div className="achievement-item" key={i}>
                  <div className="achievement-icon"><i className={`fa-solid ${item.icon}`} /></div>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
