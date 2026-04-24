import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import lGameCliImage from '../assets/projects/l-game-cli.jpg'
import realLGameLayoutImage from '../assets/projects/real-l-game-layout.png'
import LGameDemo from '../components/LGameDemo'

interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  features: string[]
  tech: string[]
  links: {
    github: string
    live?: string
    liveLabel?: string
  }
  architecture: string
  challenges: string[]
  results?: string | null
  media?: {
    demoLabel?: string
    screenshots?: {
      src: string
      alt: string
      caption: string
      objectFit?: 'contain' | 'cover'
    }[]
  }
}

const S = 'var(--color-salmon)'
const SD = (o: number) => `rgba(232,85,62,${o})`

const projects: Project[] = [
  {
    id: 'macrotracker',
    number: '01',
    title: 'macroTracker',
    subtitle: 'AI Nutrition Tracking Web App',
    description:
      'An AI-powered nutrition tracking PWA that converts meal photos into structured macro data for real-time dietary tracking. Built as a full-stack product with a secure image pipeline, serverless APIs, and storage tuned for fast mobile use.',
    features: [
      'Meal photo to structured macro extraction for real-time dietary logging',
      'Full-stack React + TypeScript app with serverless APIs and a database layer for stored nutrition history',
      'Secure client-side image compression pipeline reducing upload sizes by 80–98%',
      'Installable PWA experience optimized for mobile capture and repeat use',
      '3-5 monthly users',
    ],
    tech: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Gemini API', 'OpenAI API', 'Vite PWA', 'Tailwind CSS v4'],
    links: {
      github: 'https://github.com/James-Dyer/macro-tracker',
      live: 'https://james-dyer.github.io/macro-tracker/',
      liveLabel: 'Landing Page',
    },
    architecture:
      'The app uses a React + TypeScript frontend with Supabase-backed storage, auth, and Postgres persistence. Images are compressed on the client before upload, then passed through serverless edge functions that call multimodal AI APIs and store structured nutrition results for later querying. The pipeline is designed to keep uploads light on mobile while preserving enough fidelity for reliable macro extraction.',
    challenges: [
      'Compressing user images aggressively enough to save bandwidth without destroying the visual detail needed for nutrition inference — solved with a client-side pipeline that cuts upload sizes by 80–98%.',
      'Designing the storage and API layer so meal photos, thumbnails, and structured macro data could be saved and queried cleanly across repeat sessions.',
      'Balancing mobile UX with AI-backed analysis latency by keeping the capture and upload flow lightweight enough for habitual everyday use.',
      'Building the app as a real PWA instead of a demo shell, including installability and repeat-visit ergonomics for tracking workflows.',
    ],
    results:
      'Built and launched as a working full-stack PWA with an image pipeline that reduces upload sizes by 80–98% while keeping the meal logging flow fast enough for real-world use.',
  },
  {
    id: 'ai-tutor',
    number: '02',
    title: 'AI-Assisted Software Engineering Tutor',
    subtitle: 'Guided Full-Stack SWE Learning Platform',
    description:
      'A full-stack platform that guides students through software engineering assignments without revealing solutions. The system turns prompts into learning goals, structured plans, and contextual hints while keeping the student in control of the implementation work.',
    features: [
      'LLM workflow that transforms assignment prompts into learning goals, structured plans, and stepwise guidance',
      'In-browser Python IDE with dynamic hints tied to current code state and assignment constraints',
      'Full-stack React + Flask + PostgreSQL architecture for assignment and progress management',
      'Guidance-first feedback flow designed to help students reason through solutions instead of receiving answers',
      'Browser-based execution experience for iterative coding and feedback loops',
    ],
    tech: ['React', 'Flask', 'PostgreSQL', 'Pyodide (WASM)', 'Monaco Editor', 'OpenAI API'],
    links: {
      github: 'https://github.com/James-Dyer/cse108-final',
    },
    architecture:
      'The Flask backend orchestrates the tutoring workflow, turning raw assignment prompts into structured plans and guided feedback artifacts that the React frontend can render cleanly. In the browser, a Python IDE experience supports code execution and hint generation tied to the student\'s current work, while PostgreSQL persists the application state needed for multi-session usage.',
    challenges: [
      'Designing an LLM workflow that stays useful without leaking solutions — the prompts had to scaffold learning while preserving the student\'s responsibility for the final implementation.',
      'Generating hints from both assignment constraints and live code state so feedback stayed specific instead of devolving into generic tutoring text.',
      'Embedding a browser-based Python IDE into the tutoring flow so students could iterate without context switching away from the platform.',
    ],
    results: null,
  },
  {
    id: 'lgame',
    number: '03',
    title: 'L-Game with Optimal Game-Playing Agent',
    subtitle: "Search-Based CLI Reimplementation of Edward de Bono's L-Game",
    description:
      "A Python reimplementation of Edward de Bono's L-Game with support for human, agent-based, and agent-vs-agent play. The project centers on a deterministic agent that uses search and state evaluation to select optimal moves while keeping turn times fast.",
    features: [
      'Human vs CPU, Human vs Human, and CPU vs CPU gameplay modes',
      'Deterministic game-playing agent driven by search-based move selection',
      'Optimization techniques to preserve fast decision-making while maintaining optimal play',
      'Browser terminal demo powered by Pyodide with typed move entry and guided controls',
      'State evaluation logic tuned for reliable move quality across gameplay modes',
      'Support for agent-vs-agent runs to validate play behavior and debugging',
    ],
    tech: ['Python 3'],
    links: {
      github: 'https://github.com/James-Dyer/L-game',
    },
    architecture:
      'The game engine models board state, legal move generation, and turn progression in Python, with the agent layered on top as a deterministic search-based decision system. Evaluation and move selection are kept separate from the CLI flow so the same logic can support human play, agent play, and repeated automated matchups.',
    challenges: [
      'Representing L-Game state cleanly enough to support both legal-move generation and reliable search without subtle board-transition bugs.',
      'Designing a state evaluation strategy that produced strong play while still keeping agent decisions fast enough for an interactive CLI experience.',
      'Applying optimization techniques so deeper search remained practical without sacrificing the deterministic behavior needed for repeatable testing.',
    ],
    results:
      'Delivered a fast deterministic CLI implementation with optimal-play behavior across human, agent-based, and agent-vs-agent modes.',
    media: {
      screenshots: [
        {
          src: realLGameLayoutImage,
          alt: 'Original L-Game board layout from Wikipedia',
          caption: 'Original L-Game layout',
          objectFit: 'contain',
        },
        {
          src: lGameCliImage,
          alt: 'CLI screenshot of the Python L-Game recreation',
          caption: 'Python CLI recreation',
          objectFit: 'contain',
        },
      ],
    },
  },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span
        className="font-sans text-[10px] tracking-[0.2em] uppercase font-medium flex-shrink-0"
        style={{ color: S }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: SD(0.18) }} />
    </div>
  )
}

function DemoPlaceholder({ label = 'Demo Video' }: { label?: string }) {
  return (
    <div
      className="relative aspect-video rounded-lg overflow-hidden flex items-center justify-center"
      style={{ background: SD(0.04), border: `1px solid ${SD(0.2)}` }}
    >
      <div className="text-center">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3"
          style={{ border: `1px solid ${SD(0.3)}` }}
        >
          <svg className="w-4 h-4 ml-0.5" style={{ color: SD(0.55) }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="font-sans text-[10px] tracking-widest uppercase" style={{ color: SD(0.35) }}>
          {label}
        </p>
      </div>
    </div>
  )
}

function ScreenshotPlaceholder() {
  return (
    <div
      className="relative aspect-[16/10] rounded-md overflow-hidden flex items-center justify-center"
      style={{ background: SD(0.03), border: `1px solid ${SD(0.12)}` }}
    >
      <p className="font-sans text-[9px] tracking-widest uppercase" style={{ color: SD(0.22) }}>
        Screenshot
      </p>
    </div>
  )
}

function ProjectScreenshot({
  src,
  alt,
  caption,
  objectFit = 'cover',
}: {
  src: string
  alt: string
  caption: string
  objectFit?: 'contain' | 'cover'
}) {
  return (
    <figure
      className="relative aspect-[16/10] rounded-md overflow-hidden"
      style={{ background: SD(0.03), border: `1px solid ${SD(0.12)}` }}
    >
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full"
        style={{ objectFit }}
      />
      <figcaption
        className="absolute inset-x-0 bottom-0 px-3 py-2 font-sans text-[9px] tracking-[0.18em] uppercase"
        style={{
          color: 'rgba(250,248,245,0.8)',
          background: 'linear-gradient(180deg, rgba(12,12,12,0) 0%, rgba(12,12,12,0.88) 100%)',
        }}
      >
        {caption}
      </figcaption>
    </figure>
  )
}

function ProjectSection({ project, isLast }: { project: Project; isLast: boolean }) {
  return (
    <section id={project.id} className="scroll-mt-20">
      {/* ── Project header ── */}
      <div className="pt-14 pb-0">
        <div className="flex items-start gap-5 mb-3">
          {/* Large salmon number */}
          <span
            className="font-display font-medium leading-none flex-shrink-0 select-none"
            style={{ fontSize: 'clamp(4rem, 8vw, 6.5rem)', color: S, opacity: 0.75, marginTop: '-0.1em' }}
          >
            {project.number}
          </span>

          <div className="flex-1 min-w-0 pt-2">
            <h2
              className="font-display font-medium text-cream tracking-tight leading-[0.95] mb-2"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              {project.title}
            </h2>
            <p
              className="font-sans text-[10px] tracking-[0.18em] uppercase"
              style={{ color: SD(0.65) }}
            >
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Salmon rule under header */}
        <div className="w-full h-px mb-6" style={{ background: `linear-gradient(90deg, ${SD(0.5)}, ${SD(0.08)})` }} />

        {/* Description */}
        <p className="font-body text-base text-cream/70 leading-relaxed max-w-2xl mb-8">
          {project.description}
        </p>
      </div>

      {/* ── Features + Demo ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        <div className="lg:col-span-2">
          <SectionLabel>Key Features</SectionLabel>
          <ul className="space-y-3.5">
            {project.features.map((f, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="font-sans text-sm flex-shrink-0 mt-px" style={{ color: S }}>—</span>
                <span className="font-body text-sm text-cream/70 leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {project.id === 'lgame' ? <LGameDemo /> : <DemoPlaceholder label={project.media?.demoLabel} />}
          <div className="grid grid-cols-2 gap-3">
            {project.media?.screenshots?.length ? (
              project.media.screenshots.map((screenshot) => (
                <ProjectScreenshot
                  key={screenshot.src}
                  src={screenshot.src}
                  alt={screenshot.alt}
                  caption={screenshot.caption}
                  objectFit={screenshot.objectFit}
                />
              ))
            ) : (
              <>
                <ScreenshotPlaceholder />
                <ScreenshotPlaceholder />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Tech stack + Links ── */}
      <div className="mb-10">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex-1 min-w-0">
            <SectionLabel>Tech Stack</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-sans text-xs px-2.5 py-1 rounded"
                  style={{
                    color: SD(0.8),
                    background: SD(0.06),
                    border: `1px solid ${SD(0.18)}`,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <SectionLabel>Links</SectionLabel>
            <div className="flex flex-wrap gap-5">
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
              >
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: S }} fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.682-.218.682-.484 0-.237-.009-.868-.014-1.703-2.775.603-3.36-1.337-3.36-1.337-.454-1.152-1.11-1.46-1.11-1.46-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.092-.647.35-1.087.637-1.338-2.216-.252-4.547-1.108-4.547-4.934 0-1.09.39-1.983 1.029-2.681-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.393.1 2.646.64.698 1.028 1.59 1.028 2.68 0 3.836-2.335 4.678-4.558 4.925.359.31.679.921.679 1.856 0 1.339-.012 2.419-.012 2.749 0 .268.18.58.688.482A10 10 0 0 0 12 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-sans text-xs" style={{ color: S }}>GitHub</span>
              </a>
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
                >
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: S }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  <span className="font-sans text-xs" style={{ color: S }}>{project.links.liveLabel || 'Live'}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Architecture ── */}
      <div className="mb-10">
        <SectionLabel>Architecture</SectionLabel>
        <p className="font-body text-sm text-cream/70 leading-relaxed max-w-3xl">
          {project.architecture}
        </p>
      </div>

      {/* ── Key Challenges ── */}
      <div className="mb-10">
        <SectionLabel>Key Technical Challenges</SectionLabel>
        <ol className="space-y-7">
          {project.challenges.map((challenge, i) => (
            <li key={i} className="flex gap-5 items-start">
              <span
                className="font-display font-medium leading-none flex-shrink-0 w-12 text-right"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: SD(0.35), marginTop: '-0.05em' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-body text-sm text-cream/70 leading-relaxed pt-2 flex-1">{challenge}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Results ── */}
      {project.results && (
        <div className="mb-10">
          <SectionLabel>Results</SectionLabel>
          <p className="font-body text-sm text-cream/70 leading-relaxed max-w-3xl">{project.results}</p>
        </div>
      )}

      {/* ── Section divider ── */}
      {!isLast && (
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: SD(0.12) }} />
          <span className="font-sans text-xs" style={{ color: SD(0.25) }}>✦</span>
          <div className="flex-1 h-px" style={{ background: SD(0.12) }} />
        </div>
      )}
    </section>
  )
}

export default function ProjectsPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.hash])

  return (
    <div className="min-h-screen bg-ink relative">
      <div className="noise-overlay" />

      {/* ── Sticky nav ── */}
      <nav
        className="sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(12,12,12,0.9)',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${SD(0.1)}`,
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 font-sans text-sm group transition-colors duration-200"
          style={{ color: 'rgba(138,138,138,0.7)' }}
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            style={{ color: S }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="group-hover:text-cream transition-colors duration-200">James Dyer</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {projects.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(p.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="font-sans text-xs tracking-wide transition-colors duration-200 hover:text-cream"
              style={{ color: 'rgba(138,138,138,0.5)' }}
            >
              <span style={{ color: SD(0.6) }}>{p.number}</span>{' '}
              {p.title.split(' ')[0]}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-32">
        {/* Page header */}
        <div className="pt-14 pb-6">
          <p
            className="font-sans text-[10px] tracking-[0.2em] uppercase mb-5"
            style={{ color: SD(0.55) }}
          >
            Selected Work
          </p>
          <h1
            className="font-display font-medium text-cream tracking-tight"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 0.88 }}
          >
            Projects
          </h1>
          <div className="mt-5 h-0.5 w-20" style={{ background: S }} />
        </div>

        {/* Project sections */}
        {projects.map((project, index) => (
          <ProjectSection
            key={project.id}
            project={project}
            isLast={index === projects.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
