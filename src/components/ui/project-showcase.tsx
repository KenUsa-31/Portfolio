"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

interface Project {
  title: string
  description: string
  year: string
  link: string
  image: string
  webp?: string
}

const projects: Project[] = [
  {
    title: "PSITS Festival of Talents 2025",
    description: "Certificate of Appreciation as Esports Technical Director — hosted by PSITS Region XI, University of Immaculate Conception.",
    year: "2025",
    link: "/certificate/PSITS_ESPORTS TECHNICAL DERICTOR.png",
    image: "/certificate/optimized/psits_esports-technical-derictor.jpg",
    webp: "/certificate/optimized/psits_esports-technical-derictor.webp",
  },
  {
    title: "Git and Github Workshop",
    description: "Certificate of Participation — Version Control 101 hosted by GDG On Campus, University of Immaculate Conception.",
    year: "2024",
    link: "/certificate/Certificate_Ken Andrei Usa.png",
    image: "/certificate/optimized/certificate_ken-andrei-usa.jpg",
    webp: "/certificate/optimized/certificate_ken-andrei-usa.webp",
  },
  {
    title: "E-Toolkit: Emerging Educational Technology Tools",
    description: "Certificate of Participation — hosted by University of Southeastern Philippines, held via Microsoft Teams.",
    year: "2026",
    link: "/certificate/Certificate of E-Toolkit_ Emerging Educational Technology Tools_page-0001.jpg",
    image: "/certificate/optimized/certificate-of-e-toolkit_-emerging-educational-technology-tools_page-0001.jpg",
    webp: "/certificate/optimized/certificate-of-e-toolkit_-emerging-educational-technology-tools_page-0001.webp",
  },
  {
    title: "VIBE Workshop for Basic Video Editing",
    description: "Certificate of Appreciation for the Adobe Premiere Pro workshop — hosted by the VIBE Club, UIC Father Selga Campus.",
    year: "2024",
    link: "/certificate/Certificate of Participation.png",
    image: "/certificate/optimized/certificate-of-participation.jpg",
    webp: "/certificate/optimized/certificate-of-participation.webp",
  },
]

export function ProjectShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor
    }

    const animate = () => {
      setSmoothPosition((prev) => ({
        x: lerp(prev.x, mousePosition.x, 0.15),
        y: lerp(prev.y, mousePosition.y, 0.15),
      }))
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [mousePosition])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index)
    setIsVisible(true)
  }

  const handleMouseLeave = () => {
    setHoveredIndex(null)
    setIsVisible(false)
  }

  return (
    <section
      id="certificates"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full"
    >
      <div className="section-title">
        <h2>My <span>Certifications</span></h2>
        <p className="section-sub">Hover a row to preview the certificate</p>
      </div>

      <div
        className="pointer-events-none fixed z-50 overflow-hidden rounded-xl shadow-2xl"
        style={{
          left: containerRef.current?.getBoundingClientRect().left ?? 0,
          top: containerRef.current?.getBoundingClientRect().top ?? 0,
          transform: `translate3d(${smoothPosition.x + 40}px, ${smoothPosition.y - 140}px, 0)`,
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
          transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), scale 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div className="relative w-[48vw] max-w-[480px] h-[32vw] max-h-[320px] min-w-[220px] min-h-[150px] bg-secondary rounded-xl overflow-hidden">
          {projects.map((project, index) => (
            <picture key={project.title}>
              {project.webp && <source srcSet={project.webp} type="image/webp" sizes="(min-width: 768px) 480px, (min-width: 480px) 320px, 240px" />}
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out"
                style={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  scale: hoveredIndex === index ? 1 : 1.1,
                  filter: hoveredIndex === index ? "none" : "blur(10px)",
                }}
              />
            </picture>
          ))}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        </div>
      </div>

      <div className="space-y-0">
        {projects.map((project, index) => (
          <a
            key={project.title}
            href={project.link}
            className="group block"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative py-6 border-t border-border transition-all duration-300 ease-out">
              {/* Background highlight on hover */}
              <div
                className={`
                  absolute inset-0 -mx-4 px-4 bg-secondary/50 rounded-lg
                  transition-all duration-300 ease-out
                  ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                `}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title with animated underline */}
                  <div className="inline-flex items-center gap-2">
                    <h3 className="text-foreground font-medium text-xl sm:text-2xl tracking-tight">
                      <span className="relative">
                        {project.title}
                        {/* Animated underline */}
                        <span
                          className={`
                            absolute left-0 -bottom-0.5 h-px bg-foreground
                            transition-all duration-300 ease-out
                            ${hoveredIndex === index ? "w-full" : "w-0"}
                          `}
                        />
                      </span>
                    </h3>

                    {/* Arrow that slides in */}
                    <ArrowUpRight
                      className={`
                        w-5 h-5 text-muted-foreground
                        transition-all duration-300 ease-out
                        ${
                          hoveredIndex === index
                            ? "opacity-100 translate-x-0 translate-y-0"
                            : "opacity-0 -translate-x-2 translate-y-2"
                        }
                      `}
                    />
                  </div>

                  {/* Description with fade effect */}
                  <p
                    className={`
                      text-muted-foreground text-lg mt-1 leading-relaxed
                      transition-all duration-300 ease-out
                      ${hoveredIndex === index ? "text-foreground/70" : "text-muted-foreground"}
                    `}
                  >
                    {project.description}
                  </p>
                </div>

                {/* Year badge */}
                <span
                  className={`
                    text-sm font-mono text-muted-foreground tabular-nums
                    transition-all duration-300 ease-out
                    ${hoveredIndex === index ? "text-foreground/60" : ""}
                  `}
                >
                  {project.year}
                </span>
              </div>
            </div>
          </a>
        ))}

        {/* Bottom border for last item */}
        <div className="border-t border-border" />
      </div>
    </section>
  )
}