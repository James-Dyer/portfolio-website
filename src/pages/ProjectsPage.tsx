import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DetailPageLayout from '../components/DetailPageLayout'
import LGameDemo from '../components/LGameDemo'
import macrotrackerDemoVideo from '../assets/projects/macrotracker/demo-2x.mp4'
import tutorDashboard from '../assets/projects/ai-tutor/dashboard.png'
import tutorPlanning from '../assets/projects/ai-tutor/planning-workflow.png'
import tutorEditor from '../assets/projects/ai-tutor/editor-and-hints.png'
import tutorIntegrated from '../assets/projects/ai-tutor/integrated-tutor-view.png'

interface Screenshot {
  src: string
  alt: string
  caption: string
}

interface Project {
  id: string
  title: string
  subtitle: string
  summary: string
  highlights: string[]
  tech: string[]
  links: {
    github: string
    live?: string
    liveLabel?: string
  }
  media: 'video' | 'screenshots' | 'demo'
  screenshots?: Screenshot[]
}

const projects: Project[] = [
  {
    id: 'macrotracker',
    title: 'macroTracker',
    subtitle: 'AI nutrition tracking PWA',
    summary:
      'A mobile-first nutrition tracker that turns meal photos into structured macro data and saves the results for repeat tracking.',
    highlights: [
      'Built a full-stack React and TypeScript PWA with Supabase-backed storage and PostgreSQL persistence.',
      'Reduced image upload sizes by 80–98% with a client-side compression pipeline.',
      'Integrated multimodal AI analysis through serverless edge functions with a fallback provider.',
    ],
    tech: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini API', 'OpenAI API'],
    links: {
      github: 'https://github.com/James-Dyer/macro-tracker',
      live: 'https://james-dyer.github.io/macro-tracker/',
      liveLabel: 'Landing page',
    },
    media: 'video',
  },
  {
    id: 'ai-tutor',
    title: 'Software Engineering Tutor',
    subtitle: 'Guided full-stack learning platform',
    summary:
      'A tutoring platform that turns assignments into structured plans and contextual hints without revealing complete solutions.',
    highlights: [
      'Designed an LLM workflow that creates learning goals, plans, and stepwise guidance from assignment prompts.',
      'Built an in-browser Python IDE with hints informed by the student’s current code and assignment constraints.',
      'Delivered one of three A+ final projects in UC Merced’s full-stack web development course.',
    ],
    tech: ['React', 'Flask', 'PostgreSQL', 'Pyodide', 'Monaco Editor', 'OpenAI API'],
    links: {
      github: 'https://github.com/James-Dyer/cse108-final',
    },
    media: 'screenshots',
    screenshots: [
      { src: tutorDashboard, alt: 'Assignment dashboard', caption: 'Assignment dashboard' },
      { src: tutorPlanning, alt: 'Planning workflow', caption: 'Planning workflow' },
      { src: tutorEditor, alt: 'Code editor and hints', caption: 'Editor and hints' },
      { src: tutorIntegrated, alt: 'Integrated tutor view', caption: 'Integrated tutor view' },
    ],
  },
  {
    id: 'lgame',
    title: 'L-Game',
    subtitle: 'Search-based Python game agent',
    summary:
      'A Python reimplementation of Edward de Bono’s L-Game supporting human and agent-based play through a deterministic search system.',
    highlights: [
      'Implemented legal move generation, board-state transitions, and multiple gameplay modes.',
      'Designed a deterministic search-based agent that selects optimal moves.',
      'Optimized state evaluation to keep agent turns fast enough for interactive play.',
    ],
    tech: ['Python 3', 'Game-tree search', 'State evaluation'],
    links: {
      github: 'https://github.com/James-Dyer/L-game',
    },
    media: 'demo',
  },
]

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-4">
      <a
        href={project.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-sm font-medium text-gold transition-colors hover:text-cream"
      >
        GitHub ↗
      </a>
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm font-medium text-gold transition-colors hover:text-cream"
        >
          {project.links.liveLabel ?? 'Live site'} ↗
        </a>
      )}
    </div>
  )
}

function ProjectMedia({
  project,
  onOpenScreenshot,
}: {
  project: Project
  onOpenScreenshot: (screenshot: Screenshot) => void
}) {
  if (project.media === 'video') {
    return (
      <div className="flex max-h-[34rem] justify-center overflow-hidden rounded-lg border border-white/[0.08] bg-card">
        <video
          src={macrotrackerDemoVideo}
          className="max-h-[34rem] max-w-full"
          autoPlay
          muted
          loop
          playsInline
          controls
          aria-label="macroTracker product walkthrough"
        />
      </div>
    )
  }

  if (project.media === 'demo') {
    return (
      <div className="overflow-hidden rounded-lg border border-white/[0.08]">
        <LGameDemo />
      </div>
    )
  }

  const [primary, ...secondary] = project.screenshots ?? []
  if (!primary) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpenScreenshot(primary)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-white/[0.08] bg-card text-left transition-opacity hover:opacity-90"
        aria-label={`Open fullscreen image: ${primary.caption}`}
      >
        <img src={primary.src} alt={primary.alt} className="aspect-[16/10] w-full object-cover" />
      </button>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {secondary.map((screenshot) => (
          <button
            key={screenshot.src}
            type="button"
            onClick={() => onOpenScreenshot(screenshot)}
            className="cursor-zoom-in overflow-hidden rounded-md border border-white/[0.08] bg-card transition-opacity hover:opacity-90"
            aria-label={`Open fullscreen image: ${screenshot.caption}`}
          >
            <img
              src={screenshot.src}
              alt={screenshot.alt}
              className="aspect-[16/10] w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function ProjectSection({
  project,
  onOpenScreenshot,
}: {
  project: Project
  onOpenScreenshot: (screenshot: Screenshot) => void
}) {
  return (
    <section id={project.id} className="scroll-mt-24 border-b border-white/[0.08] py-14 last:border-0 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
        <div>
          <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.14em] text-gold">
            {project.subtitle}
          </p>
          <h2 className="font-display text-4xl font-medium tracking-tight text-cream sm:text-5xl">
            {project.title}
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-stone">{project.summary}</p>

          <ul className="mt-7 space-y-3">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 font-body text-sm leading-relaxed text-cream/75">
                <span className="mt-2 h-1 w-1 flex-none rounded-full bg-gold" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap gap-x-3 gap-y-2">
            {project.tech.map((technology) => (
              <span key={technology} className="font-sans text-xs text-stone">
                {technology}
              </span>
            ))}
          </div>

          <div className="mt-7">
            <ProjectLinks project={project} />
          </div>
        </div>

        <ProjectMedia project={project} onOpenScreenshot={onOpenScreenshot} />
      </div>
    </section>
  )
}

export default function ProjectsPage() {
  const location = useLocation()
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1)
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => window.clearTimeout(timer)
    }

    window.scrollTo(0, 0)
  }, [location.hash])

  useEffect(() => {
    if (!selectedScreenshot) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedScreenshot(null)
    }
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedScreenshot])

  return (
    <DetailPageLayout
      eyebrow="Selected work"
      title="Projects"
      introduction="A focused selection of products and technical systems, with an emphasis on the decisions made and the outcomes delivered."
    >
      {projects.map((project) => (
        <ProjectSection
          key={project.id}
          project={project}
          onOpenScreenshot={setSelectedScreenshot}
        />
      ))}

      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 sm:p-8"
          onClick={() => setSelectedScreenshot(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedScreenshot(null)}
            className="absolute right-5 top-5 font-sans text-2xl text-cream transition-colors hover:text-gold"
            aria-label="Close fullscreen image"
          >
            ×
          </button>
          <figure className="max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={selectedScreenshot.src}
              alt={selectedScreenshot.alt}
              className="max-h-[84vh] w-full rounded-md object-contain"
            />
            <figcaption className="mt-3 text-center font-sans text-xs text-stone">
              {selectedScreenshot.caption}
            </figcaption>
          </figure>
        </div>
      )}
    </DetailPageLayout>
  )
}
