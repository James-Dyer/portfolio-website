import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Experience } from '../data/portfolio'
import { useTiltCard } from '../hooks/useTiltCard'

export default function ExperienceCard({ experience, index, basePath = '/experience' }: { experience: Experience; index: number; basePath?: string }) {
  const [hovered, setHovered] = useState(false)
  const card = useRef<HTMLDivElement>(null)
  const glow = useRef<HTMLDivElement>(null)

  useTiltCard(card, glow)

  return (
    <div ref={card} className="group relative block rounded-xl overflow-hidden transition-all duration-500 animate-slide-up" style={{ animationDelay: `${700 + index * 100}ms`, perspective: 1000, transformStyle: 'preserve-3d' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link
        to={`${basePath}#${experience.id}`}
        aria-label={`View details for ${experience.company}`}
        className="z-10"
        style={{ position: 'absolute', inset: 0 }}
      />
      <div className="absolute inset-0 rounded-xl transition-all duration-500" style={{ background: hovered ? 'linear-gradient(135deg,rgba(201,168,108,.08),rgba(22,22,22,.95) 55%,rgba(22,22,22,.98))' : 'transparent', border: hovered ? '1px solid rgba(201,168,108,.3)' : '1px solid transparent', boxShadow: hovered ? '0 20px 40px -15px rgba(0,0,0,.5)' : 'none' }} />
      <div ref={glow} className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500" style={{ opacity: hovered ? 1 : 0 }} />
      <div className="pointer-events-none relative flex items-stretch p-4 lg:p-5 gap-5">
        <div className="relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border border-white/[.08] bg-white/[.03] flex items-center justify-center p-2 lg:p-3">
          <img src={experience.logoSrc} alt={`${experience.company} logo`} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-6">
          <h3 className="font-sans text-lg lg:text-xl text-cream font-medium tracking-tight mb-1 truncate">{experience.company}</h3>
          <p className="font-sans text-sm text-stone mb-1.5">{experience.role}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><span className="font-sans text-xs tracking-wide text-gold/70">{experience.duration}</span><span className="font-sans text-xs text-stone/60">{experience.location}</span>{experience.website && <a href={experience.website} target="_blank" rel="noopener noreferrer" className="pointer-events-auto relative z-20 font-sans text-xs font-medium text-gold transition-colors hover:text-cream">{experience.websiteLabel ?? 'Live site'} ↗</a>}</div>
        </div>
        <div className="absolute top-4 right-4 text-stone transition-all duration-300" style={{ transform: hovered ? 'translate(2px,-2px)' : 'none', color: hovered ? '#c9a86c' : undefined }}>↗</div>
      </div>
      <div className="absolute bottom-0 left-0 h-px transition-all duration-300" style={{ width: hovered ? '100%' : 0, background: 'linear-gradient(90deg,transparent,rgba(201,168,108,.5),transparent)' }} />
    </div>
  )
}
