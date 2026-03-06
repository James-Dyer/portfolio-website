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
    location: 'Modesto, CA',
    teamArea: 'Industry-Sponsored Senior Capstone · UC Merced',
    summary:
      'Led a team of [TK] computer science students on a semester-long software project sponsored by E. & J. Gallo Winery. Served as the primary technical and organizational lead — managing sprint planning, client communication, architecture decisions, and final delivery to the Gallo engineering team.',
    tech: ['[TK]'],
    contributions: [
      {
        title: 'Team coordination & sprint planning',
        what: 'Established weekly sprint cycles with structured standups, task assignments, and retrospectives for a team of [TK] engineers.',
        why: 'The capstone had no formal project management structure — creating one early was critical to meeting semester milestones and preventing last-minute scrambles.',
        result: 'Delivered all project phases on schedule across [TK] sprints with consistent velocity.',
      },
      {
        title: 'Stakeholder communication with Gallo',
        what: 'Led bi-weekly check-ins with the Gallo engineering team, translating sponsor requirements into actionable technical tasks and presenting progress demos.',
        why: 'Industry partners need clear communication to stay aligned — ambiguity late in the project is far more costly than frequent early check-ins.',
        result: 'Maintained continuous sponsor alignment with no major scope surprises at final delivery.',
      },
      {
        title: 'Technical architecture & code review',
        what: 'Designed the overall system architecture and conducted code reviews across the team\'s pull requests throughout the semester.',
        why: 'As team lead, ensuring architectural consistency and code quality was as important as individual feature contributions.',
        result: '[TK — final codebase quality metric or Gallo feedback on technical delivery].',
      },
    ],
    impact: [
      'Delivered a complete software solution to an industry partner across a 5-month timeline',
      '[TK] — specific measurable outcome for Gallo (performance, coverage, feature set)',
      'Led a team of [TK] through the full project lifecycle from requirements to production handoff',
    ],
    learned: [
      'End-to-end project ownership — from requirements gathering through delivery — requires constant re-prioritization, not just heads-down execution.',
      'Translating between business stakeholders and a technical team is its own discipline: precision in requirements prevents costly rework three sprints later.',
      'Leading peers in a collaborative academic setting demands a different kind of influence than top-down authority — clarity and trust matter more than title.',
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
      'Joined the core engineering team at Mimic, an early-stage cybersecurity startup building ransomware detection and defense tooling. Contributed to feature development across the platform while participating in the full professional engineering workflow — daily standups, pull request review cycles, and close collaboration with senior engineers.',
    tech: ['[TK — Python?]', '[TK — framework or service]', '[TK]'],
    contributions: [
      {
        title: '[TK — Primary feature or system you built]',
        what: '[TK — Describe what you built or improved specifically]',
        why: '[TK — Why did this matter to the product, team, or customers?]',
        result: '[TK — Measurable or qualitative outcome: latency, coverage, reliability, etc.]',
      },
      {
        title: 'Pull request review participation',
        what: 'Actively participated in the team\'s PR review cycle — reviewing peers\' code and receiving structured feedback on my own contributions from senior engineers.',
        why: 'At an early-stage startup, code review is the primary mechanism for knowledge transfer, quality enforcement, and onboarding acceleration.',
        result: 'Developed faster feedback loops on code quality habits; shipped contributions with fewer revision cycles as the internship progressed.',
      },
      {
        title: '[TK — Second feature, bug, or improvement]',
        what: '[TK — What you built or fixed]',
        why: '[TK — Why it mattered]',
        result: '[TK — Outcome]',
      },
    ],
    impact: [
      '[TK] — specific feature shipped or metric improved (e.g. detection coverage, API latency, test coverage %)',
      'Contributed to a production codebase serving [TK] customers at a funded cybersecurity startup',
      'Embedded in a professional engineering team: [TK] standups, [TK] PRs reviewed, full remote workflow',
    ],
    learned: [
      'Working on a production codebase under real engineering discipline — daily standups, PR review cycles, and collaborative debugging — is qualitatively different from academic projects in ways that are hard to anticipate until you\'re in it.',
      'Cybersecurity tooling demands extreme precision: subtle edge cases can mean the difference between catching and missing an attack in production.',
      '[TK — Something specific to Mimic\'s domain, tech stack, or engineering culture that surprised or challenged you]',
    ],
  },
  {
    id: 'sigmachi',
    number: '03',
    company: 'Sigma Chi Fraternity',
    role: 'Website Chairman',
    duration: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    teamArea: 'Delta Rho Chapter · Digital Presence',
    summary:
      'Owned the design, development, and maintenance of the Delta Rho chapter\'s website — the chapter\'s primary digital touchpoint for prospective members, current brothers, and alumni. Responsible for keeping the site current with chapter events, membership information, and recruitment content.',
    tech: ['[TK — stack used]'],
    contributions: [
      {
        title: '[TK — Site build / redesign / migration]',
        what: '[TK — Built from scratch / redesigned / migrated the site using [tech]]',
        why: 'The chapter needed a reliable, professional web presence for recruitment season — first impressions online matter for rushes evaluating chapters.',
        result: '[TK — traffic, aesthetic improvement, or specific recruitment/engagement outcome]',
      },
      {
        title: 'Content management & event coverage',
        what: 'Maintained site content across [TK] events per semester — updating news, photos, and recruitment information on a rolling basis throughout the year.',
        why: 'A stale website signals organizational inactivity to prospective members; staying current is itself a form of recruitment.',
        result: '[TK — visitor count, rush engagement metric, or positive feedback from chapter leadership]',
      },
    ],
    impact: [
      '[TK] — visitor count or recruitment metric tied to the site',
      'Delivered a professional digital presence serving [TK] active members and chapter alumni',
      '[TK] — improvement over previous site (load time, design quality, content freshness)',
    ],
    learned: [
      'Owning a real product end-to-end — even a smaller-scale one — develops judgment about prioritization that coursework rarely does: you feel the consequence of shipping late or shipping something rough.',
      '[TK — Specific technical or organizational insight from this role]',
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
