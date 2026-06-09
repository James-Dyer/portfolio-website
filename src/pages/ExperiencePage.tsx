import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DetailPageLayout from '../components/DetailPageLayout'
import { experiences, type Experience } from '../data/portfolio'

function ExperienceSection({ experience }: { experience: Experience }) {
  return (
    <section id={experience.id} className="scroll-mt-24 border-b border-white/[0.08] py-12 last:border-0 sm:py-16">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
        <div><h2 className="font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl">{experience.company}</h2><p className="mt-1 font-sans text-sm font-medium text-gold">{experience.role}</p></div>
        <div className="font-sans text-sm leading-relaxed text-stone sm:text-right"><p>{experience.duration}</p><p>{experience.location}</p></div>
      </div>
      <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-stone">{experience.summary}</p>
      <ul className="mt-6 max-w-3xl space-y-3">{experience.highlights.map((item) => <li key={item} className="flex gap-3 font-body text-sm leading-relaxed text-cream/75"><span className="mt-2 h-1 w-1 flex-none rounded-full bg-gold" /><span>{item}</span></li>)}</ul>
      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">{experience.tech.map((item) => <span key={item} className="font-sans text-xs text-stone">{item}</span>)}{experience.website && <a href={experience.website} target="_blank" rel="noopener noreferrer" className="font-sans text-xs font-medium text-gold transition-colors hover:text-cream">Live site ↗</a>}</div>
    </section>
  )
}

export default function ExperiencePage() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) { window.scrollTo(0, 0); return }
    const timer = window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    return () => window.clearTimeout(timer)
  }, [location.hash])
  return <DetailPageLayout title="Experience">{experiences.map((experience) => <ExperienceSection key={experience.id} experience={experience} />)}</DetailPageLayout>
}
