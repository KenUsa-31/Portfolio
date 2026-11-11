import { useEffect, useState } from 'react'
import kaliIcon from '../assets/lanyard/logos/kali.svg'
import './TechStackScroller.css'

const CUSTOM_ICONS = {
  reactrouter: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg',
  kali: kaliIcon,
  zorin: 'https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/zorin-linux.svg',
}

const COLUMNS = [
  {
    label: 'Frontend',
    icon: 'fa-solid fa-code',
    speed: '26s',
    items: [
      { id: 'react', name: 'React' },
      { id: 'ts', name: 'TypeScript' },
      { id: 'tailwind', name: 'Tailwind CSS' },
      { id: 'vite', name: 'Vite' },
      { id: 'vue', name: 'Vue' },
      { id: 'reactrouter', name: 'React Router' },
      { id: 'bootstrap', name: 'Bootstrap' },
    ],
  },
  {
    label: 'Backend',
    icon: 'fa-solid fa-server',
    speed: '34s',
    items: [
      { id: 'nodejs', name: 'Node.js' },
      { id: 'php', name: 'PHP' },
      { id: 'laravel', name: 'Laravel' },
      { id: 'python', name: 'Python' },
      { id: 'js', name: 'JavaScript' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'firebase', name: 'Firebase' },
      { id: 'supabase', name: 'Supabase' },
      { id: 'mongodb', name: 'MongoDB' },
    ],
  },
  {
    label: 'OS & Tools',
    icon: 'fa-brands fa-linux',
    speed: '42s',
    items: [
      { id: 'linux', name: 'Linux' },
      { id: 'kali', name: 'Kali Linux' },
      { id: 'ubuntu', name: 'Ubuntu' },
      { id: 'zorin', name: 'Zorin' },
      { id: 'apple', name: 'iOS' },
      { id: 'windows', name: 'Windows' },
      { id: 'vscode', name: 'VS Code' },
      { id: 'git', name: 'Git' },
      { id: 'docker', name: 'Docker' },
      { id: 'figma', name: 'Figma' },
      { id: 'github', name: 'GitHub' },
    ],
  },
]

function iconSrc(id, theme) {
  return CUSTOM_ICONS[id] || `https://skillicons.dev/icons?i=${id}&theme=${theme}`
}

export default function TechStackScroller() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const update = () => {
      setTheme(document.body.classList.contains('light-mode') ? 'light' : 'dark')
    }
    update()
    const obs = new MutationObserver(update)
    obs.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])

  return (
    <div className="tech-scroller skill-category">
      <div className="tech-lanes">
        {COLUMNS.map(col => (
          <div className="tech-lane" key={col.label}>
            <h3 className="tech-lane-heading">
              <i className={col.icon} /> {col.label}
            </h3>
            <div className="tech-lane-window" role="group" aria-label={`${col.label} technologies`}>
              <div className="tech-lane-track" style={{ '--speed': col.speed }}>
                {[0, 1].map(duplicate => (
                  <div className="tech-lane-icons" key={duplicate} aria-hidden={duplicate === 1}>
                    {col.items.map(item => (
                      <div className="tech-icon" key={item.id} title={item.name}>
                        <img src={iconSrc(item.id, theme)} alt={duplicate === 0 ? item.name : ''} loading="lazy" decoding="async" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
