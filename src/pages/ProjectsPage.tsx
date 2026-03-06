import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
}

const S = 'var(--color-salmon)'
const SD = (o: number) => `rgba(232,85,62,${o})`

const projects: Project[] = [
  {
    id: 'macrotracker',
    number: '01',
    title: 'macroTracker',
    subtitle: 'AI Nutrition Tracking PWA',
    description:
      'An AI-powered Progressive Web App that turns a single food photo into complete macro data in seconds. No manual entry, no database searching — snap a photo, review the results, log your meal.',
    features: [
      'One-photo meal logging with Google Gemini 2.5 Flash Lite vision analysis',
      'Automatic fallback to OpenAI GPT-4o Mini if primary AI call fails',
      'Installable PWA with offline capability — works on iOS, Android, and desktop',
      'Tiered invite-only access with atomic invite code redemption via Postgres RPC',
      'Dual-image upload strategy: full-res ~1MB + compressed thumbnail ~100KB with signed URLs',
    ],
    tech: ['React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Gemini API', 'OpenAI API', 'Vite PWA', 'Tailwind CSS v4'],
    links: {
      github: 'https://github.com/James-Dyer/macro-tracker',
      live: 'https://james-dyer.github.io/macro-tracker/',
      liveLabel: 'Landing Page',
    },
    architecture:
      'Supabase Edge Functions handle all AI inference at the edge. Images are compressed client-side before a dual-upload (full image ~1MB, thumbnail ~100KB). JWT is validated manually inside each edge function using a custom auth pattern. A PostgreSQL stored procedure handles invite redemption atomically to prevent race conditions on concurrent requests.',
    challenges: [
      'Multi-provider AI fallback without adding latency on the happy path — Gemini calls run with a tight timeout; GPT-4o Mini activates only on failure, not as a slow sequential retry.',
      'Atomic invite code redemption via a Postgres RPC to prevent double-redemption under concurrent requests — a plain UPDATE would have a race window.',
      'PWA service worker strategy: NetworkFirst for Supabase API routes to stay fresh, CacheFirst for meal photo thumbnails to support offline viewing without burning bandwidth.',
      "Signed URL caching in React state to avoid redundant Supabase Storage round-trips — URLs are cached per session with 1-hour expiry aligned to Supabase's signing window.",
    ],
    results:
      'Fully deployed and live in closed beta. Complete onboarding flow with BMR/TDEE calculator, multi-step invite system, and full meal logging pipeline operational end-to-end.',
  },
  {
    id: 'ai-tutor',
    number: '02',
    title: 'AI Software Engineering Tutor',
    subtitle: 'LLM-Powered Guided Coding Platform',
    description:
      'A full-stack platform that transforms any CS assignment into a structured learning experience — using a multi-stage LLM pipeline to break down problems, teach relevant concepts, and critique student code without ever revealing the solution.',
    features: [
      'LLM pipeline: raw assignment text → structured summary → concept extraction → ordered step plan',
      'In-browser Python execution via Pyodide (WebAssembly) — zero server-side code runner',
      'Monaco editor with integrated stdout console for a real IDE experience',
      'Hint generation and code critique calibrated to guide students, not solve for them',
      'Multi-assignment dashboard with per-assignment progress tracking and history',
    ],
    tech: ['React', 'Flask', 'PostgreSQL', 'Pyodide (WASM)', 'Monaco Editor', 'Claude API'],
    links: {
      github: 'https://github.com/James-Dyer/cse108-final',
    },
    architecture:
      'Flask backend orchestrates the LLM pipeline with structured prompts designed for deterministic JSON output — enabling reliable parsing of step plans and concept tags without fine-tuning. The React frontend loads Pyodide asynchronously and executes student Python in a browser WebAssembly sandbox, capturing stdout and streaming it to a custom terminal component below the Monaco editor.',
    challenges: [
      'Prompt engineering for structured, parseable LLM output (JSON step plans with consistent title/label fields) — solved with explicit schema instructions and few-shot examples in the system prompt.',
      "Managing Pyodide's WASM cold-start delay (~3–5s) while keeping the editor interaction fast — solved with eager background initialization on page load before the student has started writing.",
      'Designing a critique prompt that gives substantive, actionable feedback without completing the assignment — the model receives the full rubric but is explicitly instructed to ask leading questions rather than provide answers.',
    ],
    results: null,
  },
  {
    id: 'lgame',
    number: '03',
    title: 'L-Game with Optimal Agent',
    subtitle: "Minimax AI for Edward de Bono's Strategy Game",
    description:
      "A precise reimplementation of Edward de Bono's 1967 strategy game, paired with an AI agent that plays optimally using Minimax with Alpha-Beta Pruning. Built for UC Merced's AI course, extended with a standardized I/O API for cross-implementation competition.",
    features: [
      'Human vs CPU, Human vs Human, and CPU vs CPU gameplay modes',
      'Minimax with Alpha-Beta Pruning to user-configurable search depth',
      'Custom heuristic evaluation function scoring mobility and positional advantage',
      'Standardized inter-project I/O API for cross-implementation competition',
      'Debug mode with per-turn stats: nodes evaluated, execution time, alpha-beta cutoff counts',
    ],
    tech: ['Python 3'],
    links: {
      github: 'https://github.com/James-Dyer/L-game',
    },
    architecture:
      'Game state is encoded as a 4×4 board array with explicit L-piece orientation tracking (corner position + cardinal facing direction). The Minimax agent recurses to a configurable depth with alpha-beta cutoffs pruning branches that cannot affect the result. A position cache avoids redundant evaluation of symmetric states. Input/output follows a standardized wire format enabling compatible implementations to play each other directly via piped I/O.',
    challenges: [
      'Designing an effective positional heuristic for L-Game — empirically, available-move count (mobility) proved more predictive of winning positions than geometric metrics like center proximity.',
      'Alpha-beta pruning with move ordering: sorting candidate moves by a quick heuristic before recursing significantly improves pruning efficiency, reducing the effective branching factor at higher depths.',
      'Standardized I/O wire format for cross-project competition required careful spec alignment with peer implementations without breaking the human-facing terminal interface.',
    ],
    results:
      'Agent plays optimally at all practical search depths. Performance validated via debug mode node-count statistics. Cross-project competition API confirmed compatible with peer implementations during course evaluation.',
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

function VideoPlaceholder() {
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
          Demo Video
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
          <VideoPlaceholder />
          <div className="grid grid-cols-2 gap-3">
            <ScreenshotPlaceholder />
            <ScreenshotPlaceholder />
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
