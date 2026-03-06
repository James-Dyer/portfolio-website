import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  status?: string | null
  features: string[]
  tech: string[]
  links: {
    github: string
    live?: string
    liveLabel?: string
    liveNote?: string
  }
  architecture: string
  challenges: string[]
  results?: string | null
}

const projects: Project[] = [
  {
    id: 'macrotracker',
    number: '01',
    title: 'macroTracker',
    subtitle: 'AI Nutrition Tracking PWA',
    description:
      'An AI-powered Progressive Web App that turns a single food photo into complete macro data in seconds. No manual entry, no database searching — snap a photo, review the results, log your meal.',
    status: 'Closed Beta',
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
      liveNote: 'closed beta',
    },
    architecture:
      'Supabase Edge Functions handle all AI inference at the edge. Images are compressed client-side before a dual-upload (full image ~1MB, thumbnail ~100KB). JWT is validated manually inside each edge function using a custom auth pattern. A PostgreSQL stored procedure handles invite redemption atomically to prevent race conditions on concurrent requests.',
    challenges: [
      'Multi-provider AI fallback without adding latency on the happy path — Gemini calls run with a tight timeout; GPT-4o Mini activates only on failure, not as a slow sequential retry.',
      'Atomic invite code redemption via a Postgres RPC to prevent double-redemption under concurrent requests — a plain UPDATE would have a race window.',
      'PWA service worker strategy: NetworkFirst for Supabase API routes to stay fresh, CacheFirst for meal photo thumbnails to support offline viewing without burning bandwidth.',
      'Signed URL caching in React state to avoid redundant Supabase Storage round-trips — URLs are cached per session with 1-hour expiry aligned to Supabase\'s signing window.',
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
    status: null,
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
      "A precise reimplementation of Edward de Bono's 1967 strategy game, paired with an AI agent that plays optimally using Minimax with Alpha-Beta Pruning. Built for UC Merced's AI course, then extended with a standardized I/O API for cross-implementation competition.",
    status: null,
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
      "Designing an effective positional heuristic for L-Game — empirically, available-move count (mobility) proved more predictive of winning positions than geometric metrics like center proximity.",
      'Alpha-beta pruning with move ordering: sorting candidate moves by a quick heuristic before recursing significantly improves pruning efficiency, reducing the effective branching factor at higher depths.',
      'Standardized I/O wire format for cross-project competition required careful spec alignment with peer implementations without breaking the human-facing terminal interface.',
    ],
    results:
      'Agent plays optimally at all practical search depths. Performance validated via debug mode node-count statistics. Cross-project competition API confirmed compatible with peer implementations during course evaluation.',
  },
]

function VideoPlaceholder() {
  return (
    <div className="relative aspect-video bg-card/50 rounded-xl overflow-hidden border border-line flex items-center justify-center group">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%)' }} />
      <div className="text-center relative z-10">
        <div className="w-12 h-12 rounded-full border border-stone/20 flex items-center justify-center mx-auto mb-3">
          <svg className="w-4 h-4 ml-0.5" style={{ color: 'rgba(138,138,138,0.4)' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(138,138,138,0.35)' }}>
          Demo Video
        </p>
      </div>
    </div>
  )
}

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="relative aspect-[16/10] bg-card/30 rounded-lg overflow-hidden border border-line/50 flex items-center justify-center">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.01) 0%, transparent 60%)' }} />
      <p className="font-sans text-xs tracking-widest uppercase relative z-10" style={{ color: 'rgba(138,138,138,0.25)' }}>
        {label}
      </p>
    </div>
  )
}

function ProjectSection({ project, isLast }: { project: Project; isLast: boolean }) {
  return (
    <section id={project.id} className="relative pt-16 pb-4 scroll-mt-24">
      {/* Large decorative number watermark */}
      <div
        className="absolute top-10 right-0 font-display font-medium select-none pointer-events-none leading-none"
        style={{ fontSize: '14rem', color: 'rgba(250,248,245,0.025)' }}
        aria-hidden
      >
        {project.number}
      </div>

      {/* ── Header ── */}
      <div className="relative mb-8">
        <div className="flex items-center gap-4 mb-3">
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(138,138,138,0.5)' }}>
            {project.number} / 03
          </span>
          {project.status && (
            <span
              className="font-sans text-xs tracking-wider uppercase px-2.5 py-0.5 rounded-full border"
              style={{
                background: 'rgba(232,85,62,0.1)',
                color: 'var(--color-salmon)',
                borderColor: 'rgba(232,85,62,0.25)',
              }}
            >
              {project.status}
            </span>
          )}
        </div>

        <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl text-cream font-medium tracking-tight leading-[1.0] mb-2">
          {project.title}
        </h2>
        <p className="font-sans text-sm tracking-wide mb-5" style={{ color: 'rgba(201,168,108,0.7)' }}>
          {project.subtitle}
        </p>
        <p className="font-body text-base lg:text-lg text-stone leading-relaxed max-w-2xl">
          {project.description}
        </p>
      </div>

      {/* ── Features + Demo grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Features */}
        <div className="lg:col-span-2">
          <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(201,168,108,0.5)' }}>
            Key Features
          </p>
          <ul className="space-y-3">
            {project.features.map((feature, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span
                  className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(201,168,108,0.5)' }}
                />
                <span className="font-body text-sm text-stone leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Demo / Screenshots */}
        <div className="lg:col-span-3 space-y-3">
          <VideoPlaceholder />
          <div className="grid grid-cols-2 gap-3">
            <ScreenshotPlaceholder label="Screenshot" />
            <ScreenshotPlaceholder label="Screenshot" />
          </div>
        </div>
      </div>

      {/* ── Tech + Links row ── */}
      <div className="flex flex-wrap items-start gap-8 pb-8 mb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(201,168,108,0.5)' }}>
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-sans text-xs px-2.5 py-1 rounded-md"
                style={{
                  background: 'rgba(201,168,108,0.07)',
                  color: 'rgba(201,168,108,0.75)',
                  border: '1px solid rgba(201,168,108,0.12)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(201,168,108,0.5)' }}>
            Links
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group transition-colors duration-200"
              style={{ color: 'rgba(138,138,138,0.8)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.682-.218.682-.484 0-.237-.009-.868-.014-1.703-2.775.603-3.36-1.337-3.36-1.337-.454-1.152-1.11-1.46-1.11-1.46-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.092-.647.35-1.087.637-1.338-2.216-.252-4.547-1.108-4.547-4.934 0-1.09.39-1.983 1.029-2.681-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.393.1 2.646.64.698 1.028 1.59 1.028 2.68 0 3.836-2.335 4.678-4.558 4.925.359.31.679.921.679 1.856 0 1.339-.012 2.419-.012 2.749 0 .268.18.58.688.482A10 10 0 0 0 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-sans text-xs border-b border-transparent group-hover:border-current transition-colors duration-200">
                GitHub
              </span>
            </a>

            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group transition-colors duration-200"
                style={{ color: 'var(--color-salmon)' }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                <span className="font-sans text-xs border-b border-transparent group-hover:border-current transition-colors duration-200">
                  {project.links.liveLabel || 'Live'}
                </span>
                {project.links.liveNote && (
                  <span className="font-sans text-xs" style={{ color: 'rgba(138,138,138,0.5)' }}>
                    ({project.links.liveNote})
                  </span>
                )}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Technical sections ── */}
      <div className="space-y-8 pb-8">
        {/* Architecture */}
        <div>
          <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(201,168,108,0.5)' }}>
            Architecture
          </p>
          <p className="font-body text-sm text-stone leading-relaxed max-w-3xl">
            {project.architecture}
          </p>
        </div>

        {/* Key Challenges */}
        <div>
          <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(232,85,62,0.55)' }}>
            Key Technical Challenges
          </p>
          <ol className="space-y-4">
            {project.challenges.map((challenge, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span
                  className="font-sans text-xs font-medium pt-0.5 w-5 flex-shrink-0 tabular-nums"
                  style={{ color: 'rgba(232,85,62,0.45)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-body text-sm text-stone leading-relaxed">{challenge}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Results */}
        {project.results && (
          <div>
            <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: 'rgba(250,248,245,0.3)' }}>
              Results
            </p>
            <p className="font-body text-sm text-stone leading-relaxed max-w-3xl">{project.results}</p>
          </div>
        )}
      </div>

      {/* Section divider */}
      {!isLast && (
        <div className="mt-8 mb-0">
          <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }} />
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
      // Small delay to let the component fully render before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  }, [location.hash])

  return (
    <div className="min-h-screen bg-ink relative">
      <div className="noise-overlay" />

      {/* Top nav */}
      <nav className="sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between border-b" style={{ background: 'rgba(12,12,12,0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.05)' }}>
        <Link
          to="/"
          className="flex items-center gap-2 font-sans text-sm transition-colors duration-200 group"
          style={{ color: 'rgba(138,138,138,0.7)' }}
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="group-hover:text-cream transition-colors duration-200">James Dyer</span>
        </Link>

        {/* Jump links */}
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
              {p.number} {p.title.split(' ')[0]}
            </a>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pb-32">
        {/* Page header */}
        <div className="pt-14 pb-4">
          <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(138,138,138,0.45)' }}>
            Selected Work
          </p>
          <h1 className="font-display font-medium tracking-tight leading-none text-cream" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}>
            Projects
          </h1>
          <div className="mt-4 w-16 h-px" style={{ background: 'linear-gradient(90deg, var(--color-gold), transparent)' }} />
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
