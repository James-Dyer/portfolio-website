import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Experience } from '../data/portfolio'
import { gsap, useGSAP } from '../lib/gsap'

export default function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const [hovered, setHovered] = useState(false)
  const card = useRef<HTMLAnchorElement>(null)
  const glow = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!card.current || window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
    const xTo = gsap.quickTo(card.current, 'rotationY', { duration: 0.2, ease: 'power2.out' })
    const yTo = gsap.quickTo(card.current, 'rotationX', { duration: 0.2, ease: 'power2.out' })
    const onMove = (event: PointerEvent) => {
      const rect = card.current!.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      xTo(x * 6); yTo(y * -6)
      glow.current?.style.setProperty('background', `radial-gradient(circle at ${(x + .5) * 100}% ${(y + .5) * 100}%, rgba(201,168,108,.12), transparent 50%)`)
    }
    const onLeave = () => { xTo(0); yTo(0) }
    card.current.addEventListener('pointermove', onMove)
    card.current.addEventListener('pointerleave', onLeave)
    return () => {
      card.current?.removeEventListener('pointermove', onMove)
      card.current?.removeEventListener('pointerleave', onLeave)
    }
  }, { scope: card })

  return (
    <Link ref={card} to={`/experience#${experience.id}`} className="group relative block rounded-xl overflow-hidden transition-all duration-500 animate-slide-up" style={{ animationDelay: `${700 + index * 100}ms`, perspective: 1000, transformStyle: 'preserve-3d' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="absolute inset-0 rounded-xl transition-all duration-500" style={{ background: hovered ? 'linear-gradient(135deg,rgba(201,168,108,.08),rgba(22,22,22,.95) 55%,rgba(22,22,22,.98))' : 'transparent', border: hovered ? '1px solid rgba(201,168,108,.3)' : '1px solid transparent', boxShadow: hovered ? '0 20px 40px -15px rgba(0,0,0,.5)' : 'none' }} />
      <div ref={glow} className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500" style={{ opacity: hovered ? 1 : 0 }} />
      <div className="relative flex items-stretch p-4 lg:p-5 gap-5">
        <div className="relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border border-white/[.08] bg-white/[.03] flex items-center justify-center p-2 lg:p-3">
          <img src={experience.logoSrc} alt={`${experience.company} logo`} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-6">
          <h3 className="font-sans text-lg lg:text-xl text-cream font-medium tracking-tight mb-1 truncate">{experience.company}</h3>
          <p className="font-sans text-sm text-stone mb-1.5">{experience.role}</p>
          <div className="flex items-center gap-3"><span className="font-sans text-xs tracking-wide text-gold/70">{experience.duration}</span><span className="font-sans text-xs text-stone/60">{experience.location}</span></div>
        </div>
        <div className="absolute top-4 right-4 text-stone transition-all duration-300" style={{ transform: hovered ? 'translate(2px,-2px)' : 'none', color: hovered ? '#c9a86c' : undefined }}>↗</div>
      </div>
      <div className="absolute bottom-0 left-0 h-px transition-all duration-300" style={{ width: hovered ? '100%' : 0, background: 'linear-gradient(90deg,transparent,rgba(201,168,108,.5),transparent)' }} />
    </Link>
  )
}
