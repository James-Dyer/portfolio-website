import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DetailPageLayout from '../components/DetailPageLayout'
import LGameDemo from '../components/LGameDemo'
import { projects, type Project, type Screenshot } from '../data/portfolio'

function ProjectMedia({ project, onOpen }: { project: Project; onOpen: (screenshot: Screenshot) => void }) {
  if (project.media === 'video') {
    return <div className="flex max-h-[34rem] justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-card"><video src={project.heroMedia} className="max-h-[34rem] max-w-full" autoPlay muted loop playsInline controls aria-label={`${project.title} product walkthrough`} /></div>
  }
  if (project.media === 'demo') return <div className="overflow-hidden rounded-lg border border-white/[0.08]"><LGameDemo /></div>
  const [primary, ...secondary] = project.screenshots ?? []
  if (!primary) return null
  return (
    <div>
      <button type="button" onClick={() => onOpen(primary)} className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/[0.08] bg-card text-left transition-opacity hover:opacity-90" aria-label={`Open fullscreen image: ${primary.caption}`}><img src={primary.src} alt={primary.alt} className="aspect-[16/10] w-full object-cover" /></button>
      <div className="mt-3 grid grid-cols-3 gap-3">{secondary.map((screenshot) => <button key={screenshot.src} type="button" onClick={() => onOpen(screenshot)} className="cursor-zoom-in overflow-hidden rounded-md border border-white/[0.08] bg-card transition-opacity hover:opacity-90" aria-label={`Open fullscreen image: ${screenshot.caption}`}><img src={screenshot.src} alt={screenshot.alt} className="aspect-[16/10] w-full object-cover" /></button>)}</div>
    </div>
  )
}

function ProjectSection({ project, onOpen }: { project: Project; onOpen: (screenshot: Screenshot) => void }) {
  return (
    <section id={project.id} className="scroll-mt-24 border-b border-white/[0.08] py-14 last:border-0 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <h2 className="font-display text-4xl font-medium tracking-tight text-cream sm:text-5xl">{project.title}</h2>
          <p className="mt-4 font-body text-base leading-relaxed text-stone">{project.summary}</p>
          <div className="mt-5 border-y border-white/[0.08] py-3"><span className="font-sans text-[10px] uppercase tracking-[0.14em] text-stone">Signal outcome</span><strong className="mt-1 block font-sans text-sm font-medium text-gold">{project.outcome}</strong></div>
          <ul className="mt-7 space-y-3">{project.highlights.map((item) => <li key={item} className="flex gap-3 font-body text-sm leading-relaxed text-cream/75"><span className="mt-2 h-1 w-1 flex-none rounded-full bg-gold" /><span>{item}</span></li>)}</ul>
          <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2">{project.tech.map((item) => <span key={item} className="font-sans text-xs text-stone">{item}</span>)}</div>
          <div className="mt-7 flex flex-wrap gap-4"><a href={project.links.github} target="_blank" rel="noopener noreferrer" className="font-sans text-sm font-medium text-gold transition-colors hover:text-cream">GitHub ↗</a>{project.links.live && <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="font-sans text-sm font-medium text-gold transition-colors hover:text-cream">{project.links.liveLabel ?? 'Live site'} ↗</a>}</div>
        </div>
        <ProjectMedia project={project} onOpen={onOpen} />
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  const location = useLocation()
  const [selected, setSelected] = useState<Screenshot | null>(null)
  useEffect(() => {
    if (!location.hash) { window.scrollTo(0, 0); return }
    const timer = window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    return () => window.clearTimeout(timer)
  }, [location.hash])
  useEffect(() => {
    if (!selected) return
    const previous = document.body.style.overflow
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null) }
    document.body.style.overflow = 'hidden'; window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey) }
  }, [selected])
  return (
    <DetailPageLayout title="Projects">
      {projects.map((project) => <ProjectSection key={project.id} project={project} onOpen={setSelected} />)}
      {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-8" onClick={() => setSelected(null)}><button type="button" onClick={() => setSelected(null)} className="absolute right-5 top-5 font-sans text-2xl text-cream transition-colors hover:text-gold" aria-label="Close fullscreen image">×</button><figure className="max-w-6xl" onClick={(event) => event.stopPropagation()}><img src={selected.src} alt={selected.alt} className="max-h-[84vh] w-full rounded-md object-contain" /><figcaption className="mt-3 text-center font-sans text-xs text-stone">{selected.caption}</figcaption></figure></div>}
    </DetailPageLayout>
  )
}
