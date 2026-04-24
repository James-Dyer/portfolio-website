import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Contribution {
  title: string
  what: string
  why: string
  result: string
}

interface Experience {
  id: string
  number: string
  company: string
  role: string
  duration: string
  location: string
  teamArea: string
  summary: string
  tech: string[]
  contributions: Contribution[]
  impact: string[]
  learned: string[]
}

const S = 'var(--color-salmon)'
const SD = (o: number) => `rgba(232,85,62,${o})`

const experiences: Experience[] = [
  {
    id: 'gallo',
    number: '01',
    company: 'E. & J. Gallo Winery',
    role: 'Capstone Team Lead',
    duration: 'Aug 2025 – Dec 2025',
    location: 'Merced, CA',
    teamArea: 'Industry-Sponsored Senior Capstone · UC Merced',
    summary:
      'Led an industry-sponsored team of 5 delivering a computer vision-based factory part wear measurement system for E. & J. Gallo Winery. Owned the technical direction across calibration, UI, and delivery workflows while keeping the team aligned on milestones through the full capstone timeline.',
    tech: ['React', 'Electron', 'OpenCV', 'Python', 'CI/CD', 'Automated Testing'],
    contributions: [
      {
        title: 'Team leadership and industry delivery',
        what: 'Led a 5-person capstone team through planning, implementation, and sponsor reviews for a factory inspection system designed to measure physical part wear from captured images.',
        why: 'The project had to satisfy both academic deadlines and real sponsor expectations, so technical execution and team coordination had to move in lockstep.',
        result: 'Delivered a complete end-to-end system to the sponsor by the end of the semester with clear ownership across UI, measurement accuracy, and reliability.',
      },
      {
        title: 'Camera calibration and measurement pipeline',
        what: 'Designed and implemented an OpenCV-based camera calibration pipeline that converts image-space observations into accurate real-world measurements for wear analysis.',
        why: 'Without robust calibration, the system could display images but not produce inspection data that mapped cleanly to physical part dimensions.',
        result: 'Enabled accurate real-world measurement from camera data, making the inspection workflow usable for quantitative wear evaluation rather than visual-only review.',
      },
      {
        title: 'Desktop UI and quality infrastructure',
        what: 'Built the desktop application front end, including camera controls and an inspection-record query interface, and owned the CI setup with 29 automated tests.',
        why: 'Operators needed a usable interface for capture and review, and the team needed guardrails to keep the capstone stable as multiple contributors shipped changes.',
        result: 'Improved reliability and regression protection with CI-backed automated coverage while shipping a desktop workflow that supported both image capture and record lookup.',
      },
    ],
    impact: [
      'Led a 5-person team from sponsor requirements through final delivery on a 5-month timeline.',
      'Shipped a computer vision measurement workflow with calibrated real-world output instead of image-only inspection.',
      'Implemented CI pipelines and 29 automated tests to reduce regressions and improve delivery reliability.',
    ],
    learned: [
      'Industry-sponsored work raises the bar on clarity: requirements, demos, and technical tradeoffs all need to be communicated at a level the sponsor can trust.',
      'Computer vision systems are only as useful as their calibration layer; measurement accuracy depends more on setup discipline than on flashy model output.',
      'Leading peers effectively meant creating structure and momentum, not just assigning work.',
    ],
  },
  {
    id: 'mimic',
    number: '02',
    company: 'Mimic Ransomware Defense',
    role: 'Software Engineering Intern',
    duration: 'May 2025 – Aug 2025',
    location: 'Remote',
    teamArea: 'Core Engineering · Cybersecurity Platform',
    summary:
      'Worked across Mimic\'s cybersecurity platform as a software engineering intern, building test infrastructure, WebAssembly execution tooling, and production service fixes. The role spanned Python, Go, Rust, GCP, and low-level runtime work tied directly to how security engines were executed and validated.',
    tech: ['Python', 'Go', 'Rust', 'WebAssembly (WASM)', 'GCP', 'CLI Tooling'],
    contributions: [
      {
        title: 'Integration testing CLI on GCP',
        what: 'Built a Python CLI that provisions GCP VMs, runs end-to-end integration scenarios, and automatically reports results for the engineering team.',
        why: 'Security products need repeatable environment setup and reliable scenario validation; manual orchestration slows iteration and makes failures harder to compare.',
        result: 'Created a repeatable integration workflow that reduced manual setup overhead and made end-to-end test reporting much easier to run and share.',
      },
      {
        title: 'WASM engine development and migration',
        what: 'Developed a WebAssembly execution engine and migrated 3 cybersecurity engines from native code to Rust-compiled WASM.',
        why: 'Portable sandboxed execution matters for security tooling, especially when engines need to run consistently across environments without native dependency drift.',
        result: 'Expanded the platform\'s portable execution path by moving 3 engines onto a Rust-to-WASM runtime model.',
      },
      {
        title: 'Production logging fixes in Go services',
        what: 'Fixed cross-thread logging issues in production Go services that were dropping or obscuring runtime visibility.',
        why: 'When security systems misbehave in production, missing logs directly slow debugging and can hide important failure context.',
        result: 'Improved log coverage in runtime environments, giving the team more reliable observability during production debugging.',
      },
    ],
    impact: [
      'Built the integration tooling used to provision GCP test environments and execute end-to-end scenarios.',
      'Migrated 3 cybersecurity engines from native execution to Rust-compiled WASM.',
      'Improved production observability by fixing cross-thread logging issues in Go services.',
    ],
    learned: [
      'Runtime and infrastructure tooling often matter as much as product-facing features; if execution and validation are weak, the rest of the platform is harder to trust.',
      'Cross-language systems work forces sharper interfaces: Python orchestration, Go services, and Rust/WASM components only scale when boundaries stay explicit.',
      'Production debugging quality depends heavily on observability details that are easy to underestimate until logs fail under concurrency.',
    ],
  },
  {
    id: 'sigmachi',
    number: '03',
    company: 'Sigma Chi Fraternity, Lambda Delta Chapter',
    role: 'Web Developer',
    duration: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    teamArea: 'Chapter Website · Recruitment and Event Operations',
    summary:
      'Built and deployed the chapter website as a React-based product for recruitment, event visibility, and philanthropy engagement. The site included a real-time leaderboard backed by spreadsheet data and supported 150+ active users during a high-traffic philanthropy event.',
    tech: ['React', 'JavaScript', 'GitHub Pages', 'Spreadsheet Data Integration'],
    contributions: [
      {
        title: 'Site build and deployment',
        what: 'Built and deployed a React-based chapter site that centralized recruitment-facing content, chapter information, and event-specific functionality.',
        why: 'The executive committee needed a maintainable public-facing product rather than scattered docs and ad hoc updates during busy semesters.',
        result: 'Delivered a stable web presence the chapter could use across recruitment and philanthropy events without needing constant rewrites.',
      },
      {
        title: 'Real-time event leaderboard',
        what: 'Implemented a leaderboard that updated from spreadsheet data in real time during a competitive philanthropy event.',
        why: 'The event needed live standings visible to participants and supporters, and manual updates would have broken the pace and energy of the competition.',
        result: 'Supported 150+ active users during the event while giving the chapter a live, user-facing experience tied directly to operational data.',
      },
    ],
    impact: [
      'Supported 150+ active users during a philanthropy event with live leaderboard updates.',
      'Translated executive committee requirements into a maintainable user-facing React product.',
      'Gave the chapter a more professional and current digital presence for recruitment and public events.',
    ],
    learned: [
      'Even smaller community products need clear ownership and maintainability if they are going to survive beyond the initial launch.',
      'Live event features change the reliability bar; once people are refreshing a leaderboard in real time, small data flow issues become immediately visible.',
    ],
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

function ExperienceSection({ experience, isLast }: { experience: Experience; isLast: boolean }) {
  return (
    <section id={experience.id} className="scroll-mt-20">
      {/* ── Header ── */}
      <div className="pt-14 pb-0">
        <div className="flex items-start gap-5 mb-3">
          <span
            className="font-display font-medium leading-none flex-shrink-0 select-none"
            style={{ fontSize: 'clamp(4rem, 8vw, 6.5rem)', color: S, opacity: 0.75, marginTop: '-0.1em' }}
          >
            {experience.number}
          </span>
          <div className="flex-1 min-w-0 pt-2">
            <h2
              className="font-display font-medium text-cream tracking-tight leading-[0.95] mb-1"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
            >
              {experience.company}
            </h2>
            <p className="font-sans text-sm mb-0.5" style={{ color: SD(0.75) }}>
              {experience.role}
            </p>
            <p
              className="font-sans text-[10px] tracking-[0.15em] uppercase"
              style={{ color: 'rgba(138,138,138,0.5)' }}
            >
              {experience.duration} · {experience.location}
            </p>
          </div>
        </div>
        <div className="w-full h-px mb-6" style={{ background: `linear-gradient(90deg, ${SD(0.5)}, ${SD(0.08)})` }} />
      </div>

      {/* ── Role Overview ── */}
      <div className="mb-10">
        <SectionLabel>Role Overview</SectionLabel>
        <p className="font-sans text-xs tracking-wide mb-3" style={{ color: SD(0.5) }}>
          {experience.teamArea}
        </p>
        <p className="font-body text-base text-cream/70 leading-relaxed max-w-2xl">
          {experience.summary}
        </p>
      </div>

      {/* ── Tech Stack ── */}
      <div className="mb-10">
        <SectionLabel>Tech Stack</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {experience.tech.map((t) => (
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

      {/* ── Key Contributions ── */}
      <div className="mb-10">
        <SectionLabel>Key Contributions</SectionLabel>
        <div className="space-y-9">
          {experience.contributions.map((c, i) => (
            <div key={i} className="flex gap-5 items-start">
              <span
                className="font-display font-medium leading-none flex-shrink-0 w-10 text-right"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: SD(0.3), marginTop: '-0.05em' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-sans text-sm font-medium text-cream mb-3">{c.title}</h4>
                <div className="space-y-2">
                  <p className="font-body text-sm text-cream/70 leading-relaxed">
                    <span
                      className="font-sans text-[9px] tracking-[0.18em] uppercase inline-block w-10 mr-1 flex-shrink-0"
                      style={{ color: SD(0.5) }}
                    >
                      What
                    </span>
                    {c.what}
                  </p>
                  <p className="font-body text-sm text-cream/70 leading-relaxed">
                    <span
                      className="font-sans text-[9px] tracking-[0.18em] uppercase inline-block w-10 mr-1 flex-shrink-0"
                      style={{ color: SD(0.5) }}
                    >
                      Why
                    </span>
                    {c.why}
                  </p>
                  <p className="font-body text-sm text-cream/70 leading-relaxed">
                    <span
                      className="font-sans text-[9px] tracking-[0.18em] uppercase inline-block w-10 mr-1 flex-shrink-0"
                      style={{ color: SD(0.5) }}
                    >
                      Result
                    </span>
                    {c.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Impact & Results ── */}
      <div className="mb-10">
        <SectionLabel>Impact &amp; Results</SectionLabel>
        <ul className="space-y-3">
          {experience.impact.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="font-sans text-sm flex-shrink-0 mt-px" style={{ color: S }}>
                —
              </span>
              <span className="font-body text-sm text-cream/70 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── What I Learned ── */}
      <div className="mb-10">
        <SectionLabel>What I Learned</SectionLabel>
        <ol className="space-y-6">
          {experience.learned.map((item, i) => (
            <li key={i} className="flex gap-5 items-start">
              <span
                className="font-display font-medium leading-none flex-shrink-0 w-10 text-right"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: SD(0.22), marginTop: '-0.05em' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="font-body text-sm text-cream/70 leading-relaxed pt-2 flex-1">{item}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Section divider ── */}
      {!isLast && (
        <div className="mt-8 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: SD(0.12) }} />
          <span className="font-sans text-xs" style={{ color: SD(0.25) }}>
            ✦
          </span>
          <div className="flex-1 h-px" style={{ background: SD(0.12) }} />
        </div>
      )}
    </section>
  )
}

export default function ExperiencePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 80)
      return () => clearTimeout(timer)
    } else {
      window.scrollTo(0, 0)
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
          {experiences.map((e) => (
            <a
              key={e.id}
              href={`#${e.id}`}
              onClick={(ev) => {
                ev.preventDefault()
                document.getElementById(e.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="font-sans text-xs tracking-wide transition-colors duration-200 hover:text-cream"
              style={{ color: 'rgba(138,138,138,0.5)' }}
            >
              <span style={{ color: SD(0.6) }}>{e.number}</span>{' '}
              {e.company.split(/[\s.]/)[0]}
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
            Professional History
          </p>
          <h1
            className="font-display font-medium text-cream tracking-tight"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: 0.88 }}
          >
            Experience
          </h1>
          <div className="mt-5 h-0.5 w-20" style={{ background: S }} />
        </div>

        {/* Experience sections */}
        <div>
          {experiences.map((exp, i) => (
            <ExperienceSection
              key={exp.id}
              experience={exp}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
