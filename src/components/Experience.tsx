import ExperienceCard from './ExperienceCard'
import galloLogo from '../assets/experience-logos/gallo.svg'
import lambdaDeltaLogo from '../assets/experience-logos/lambda-delta.svg'
import mimicLogo from '../assets/experience-logos/mimic.svg'

const experiences = [
  {
    id: 'gallo',
    company: 'E. & J. Gallo Winery',
    role: 'Capstone Team Lead',
    date: 'Aug 2025 – Dec 2025',
    location: 'Merced, CA',
    logoSrc: galloLogo,
    logoAlt: 'Gallo logo',
  },
  {
    id: 'mimic',
    company: 'Mimic Ransomware Defense',
    role: 'Software Engineering Intern',
    date: 'May 2025 – Aug 2025',
    location: 'Remote',
    logoSrc: mimicLogo,
    logoAlt: 'Mimic logo',
  },
  {
    id: 'sigmachi',
    company: 'Sigma Chi Fraternity, Lambda Delta Chapter',
    role: 'Web Developer',
    date: 'Dec 2024 – Jun 2025',
    location: 'Merced, CA',
    logoSrc: lambdaDeltaLogo,
    logoAlt: 'Lambda Delta chapter logo',
  },
]

interface ExperienceProps {
  mounted: boolean
}

export default function Experience({ mounted }: ExperienceProps) {
  return (
    <section className="relative z-10 w-full max-w-2xl lg:max-w-3xl xl:max-w-3xl mr-auto px-4 lg:px-8 xl:px-10 pb-24 lg:pb-32">
      {/* Section header */}
      <div className="mb-4 lg:mb-6">
        <h2
          className={`font-display text-6xl lg:text-7xl text-cream font-medium tracking-tight ${mounted ? 'animate-slide-up delay-700' : 'opacity-0'}`}
        >
          <span className="italic text-gold">Experience</span>
        </h2>
      </div>

      {/* Experience list */}
      <div className="space-y-1.5 lg:space-y-2">
        {experiences.map((exp, index) => (
          <ExperienceCard
            key={exp.company}
            company={exp.company}
            role={exp.role}
            date={exp.date}
            location={exp.location}
            logoSrc={exp.logoSrc}
            logoAlt={exp.logoAlt}
            index={index}
            link={`/experience#${exp.id}`}
          />
        ))}
      </div>
    </section>
  )
}
