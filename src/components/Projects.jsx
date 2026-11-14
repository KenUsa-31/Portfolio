import './Projects.css'

const projects = [
  {
    webp: '/projects/optimized/trilingua.webp',
    img: '/projects/optimized/trilingua.jpg',
    full: '/projects/TriLingua.png',
    width: 1200,
    height: 599,
    title: 'TriLingua',
    desc: 'A capstone web-based AI translation system bridging English, Cebuano, and Filipino. Supports real-time text and full document translation (DOCX, PDF, TXT, CSV, RTF, ODT), preserving original file format. Powered by Meta\'s NLLB-200 multilingual AI model.',
    tags: ['Laravel 12', 'Python', 'NLLB-200', 'FastAPI', 'Supabase', 'HuggingFace'],
    link: 'https://github.com/KenUsa-31/Trilingua',
  },
  {
    webp: '/projects/optimized/comprog2.webp',
    img: '/projects/optimized/comprog2.jpg',
    full: '/projects/comprog2.png',
    width: 1001,
    height: 533,
    title: 'Barangay Information System',
    desc: 'A Barangay Information System for all voters built in Java using NetBeans. Features voter records management, information processing, and report generation.',
    tags: ['Java', 'NetBeans', 'OOP'],
    link: 'https://github.com/eclipse31-dev/ComputerProgramming2',
  },
  {
    webp: '/projects/optimized/tinylearn.webp',
    img: '/projects/optimized/tinylearn.jpg',
    full: '/projects/TinyLearn.png',
    width: 1200,
    height: 633,
    title: 'TinyLearn',
    desc: 'A full-stack Learning Management System built with Laravel and React. Features real-time notifications via WebSockets, assignment submissions, grading, and role-based dashboards.',
    tags: ['Laravel', 'React', 'WebSockets', 'SQLite'],
    link: 'https://github.com/eclipse31-dev/TinyLearn',
  },
  {
    webp: '/projects/optimized/orbit.webp',
    img: '/projects/optimized/orbit.jpg',
    full: '/projects/Orbit.png',
    width: 1200,
    height: 633,
    title: 'ORBIT',
    desc: 'A facility booking system developed and deployed at the UIC Library LRSC. Allows students and staff to reserve library facilities online.',
    tags: ['Booking System', 'Deployed', 'UIC Library'],
    link: 'https://github.com/james-hub21/ORBIT',
  },
  {
    img: '/projects/LifeLine.png',
    full: '/projects/LifeLine.png',
    width: 1309,
    height: 686,
    title: 'Lifeline',
    desc: 'A dialysis education chatbot using a reviewed knowledge base, TF-IDF retrieval, and generated replies through Gemini or local Ollama. It’s a prototype, not a substitute for professional care.',
    tags: ['Python', 'Flask', 'Gemini', 'TF-IDF', 'Ollama', 'Vercel'],
    link: 'https://github.com/KenUsa-31/LifeLine',
  },
  {
    webp: '/projects/NurtureNest.png',
    img: '/projects/NurtureNest.png',
    full: '/projects/NurtureNest.png',
    width: 1313,
    height: 718,
    title: 'NurtureNest',
    desc: 'AI-powered web companion offering conversational guidance on prenatal checkups, childbirth, and postnatal care using trusted health sources. It does not provide medical diagnoses or treatment plans and directs users to seek immediate medical attention for emergencies.',
    tags: ['Python', 'Flask', 'Gemini', 'TF-IDF', 'Vercel'],
    link: 'https://github.com/KenUsa-31/NutureNest',
  },
  {
    webp: '/projects/Rehabify.png',
    img: '/projects/Rehabify.png',
    full: '/projects/Rehabify.png',
    width: 1313,
    height: 718,
    title: 'Rehabify Health',
    desc: 'AI-powered web companion built with Flask, TF-IDF search, and Gemini that provides cited rehabilitation and recovery guidance with built-in medical safety protocols.',
    tags: ['Python', 'Flask', 'Gemini', 'TF-IDF', 'Ollama', 'Vercel'],
    link: 'https://github.com/KenUsa-31/Rehabify',
  },
]

function ProjectCard({ project, onImageClick }) {
  return (
    <article className="project-card">
      <div className="project-img">
        <button
          className="project-image-button"
          type="button"
          onClick={() => onImageClick(project.full)}
          aria-label={`View ${project.title} image`}
        >
          <picture>
            {project.webp && <source srcSet={project.webp} type="image/webp" />}
            <img
              src={project.img}
              alt=""
              className="lightbox-trigger"
              loading="lazy"
              decoding="async"
              width={project.width}
              height={project.height}
            />
          </picture>
        </button>
      </div>
      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <div className="project-tags">
          {project.tags.map(t => <span className="tag" key={t}>{t}</span>)}
        </div>
      </div>
      {project.link && (
        <div className="project-footer">
          <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
            View Repo <i className="fa-solid fa-arrow-right" />
          </a>
        </div>
      )}
    </article>
  )
}

export default function Projects({ onImageClick }) {
  return (
    <section id="projects" className="projects-section">
      <div className="section-title">
        <h2>My <span>Projects</span></h2>
        <p className="section-sub">Things I've built</p>
      </div>

      <div className="projects-grid">
        {projects.map(p => (
          <ProjectCard key={p.title} project={p} onImageClick={onImageClick} />
        ))}
      </div>
    </section>
  )
}
