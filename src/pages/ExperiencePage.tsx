import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DetailPageLayout from '../components/DetailPageLayout'

interface Experience {
  id: string
  company: string
  role: string
  duration: string
  location: string
  summary: string
  highlights: string[]
  tech: string[]
  website?: string
}

const experiences: Experience[] = [
  {
    id: 'gallo',
    company: 'E. & J. Gallo Winery',
    role: 'Capstone Team Lead',
    duration: 'Aug 2025 – Dec 2025',
    location: 'Merced, CA',
    summary:
      'Led a five-person industry-sponsored capstone team delivering a computer vision system for measuring factory part wear.',
    highlights: [
      'Owned technical direction across camera calibration, desktop UI, infrastructure, and sponsor delivery.',
      'Designed an OpenCV calibration pipeline that converted image-space observations into real-world measurements.',
      'Built the React and Electron operator interface for camera controls, visualization, and inspection-record queries.',
      'Established CI and 29 automated tests to improve reliability across a multi-contributor codebase.',
    ],
    tech: ['React', 'Electron', 'OpenCV', 'Python', 'AWS', 'CI/CD'],
  },
  {
    id: 'mimic',
    company: 'Mimic Ransomware Defense',
    role: 'Software Engineering Intern',
    duration: 'May 2025 – Aug 2025',
    location: 'Remote',
    summary:
      'Worked across test infrastructure, WebAssembly execution tooling, and production services for a cybersecurity platform.',
    highlights: [
      'Built a Python CLI that provisions GCP VMs, runs end-to-end integration scenarios, and reports results.',
      'Developed a WebAssembly execution engine and migrated three cybersecurity engines to Rust-compiled WASM.',
      'Fixed cross-goroutine logging issues in production Go services, improving runtime observability.',
    ],
    tech: ['Python', 'Go', 'Rust', 'WebAssembly', 'GCP', 'CLI tooling'],
    website: 'https://mimic.com',
  },
  {
    id: 'sigmachi',
    company: 'Sigma Chi Fraternity, Lambda Delta Chapter',
    role: 'Web Developer',
    duration: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    summary:
      'Built and maintained the chapter’s public website for recruitment, events, and philanthropy engagement.',
    highlights: [
      'Translated executive committee requirements into a maintainable React-based public site.',
      'Built a real-time event leaderboard backed by spreadsheet data.',
      'Supported more than 150 active users during a high-traffic philanthropy event.',
    ],
    tech: ['React', 'JavaScript', 'GitHub Pages', 'Spreadsheet integration'],
  },
]

function ExperienceSection({ experience }: { experience: Experience }) {
  return (
    <section id={experience.id} className="scroll-mt-24 border-b border-white/[0.08] py-12 last:border-0 sm:py-16">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8">
        <div>
          <h2 className="font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl">
            {experience.company}
          </h2>
          <p className="mt-1 font-sans text-sm font-medium text-gold">{experience.role}</p>
        </div>
        <div className="font-sans text-sm leading-relaxed text-stone sm:text-right">
          <p>{experience.duration}</p>
          <p>{experience.location}</p>
        </div>
      </div>

      <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-stone">
        {experience.summary}
      </p>

      <ul className="mt-6 max-w-3xl space-y-3">
        {experience.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3 font-body text-sm leading-relaxed text-cream/75">
            <span className="mt-2 h-1 w-1 flex-none rounded-full bg-gold" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        {experience.tech.map((technology) => (
          <span key={technology} className="font-sans text-xs text-stone">
            {technology}
          </span>
        ))}
        {experience.website && (
          <a
            href={experience.website}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-medium text-gold transition-colors hover:text-cream"
          >
            Live site ↗
          </a>
        )}
      </div>
    </section>
  )
}

export default function ExperiencePage() {
  const location = useLocation()

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

  return (
    <DetailPageLayout
      eyebrow="Professional history"
      title="Experience"
      introduction="Roles where I have led teams, built production systems, and improved the infrastructure behind reliable software."
    >
      {experiences.map((experience) => (
        <ExperienceSection key={experience.id} experience={experience} />
      ))}
    </DetailPageLayout>
  )
}
