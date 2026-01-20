import ProjectCard from './ProjectCard'

const projects = [
  {
    title: 'AI-Assisted Software Engineering Tutor',
    subtitle: 'LLM-powered software tutoring platform',
    techStack: 'React / Flask / PostgreSQL',
    link: '#',
  },
  {
    title: 'L-Game with Optimal Agent',
    subtitle: 'Optimal agent for L-Game',
    techStack: 'Python',
    link: '#',
  },
  {
    title: 'Course Requirement Optimizer',
    subtitle: 'Course requirement optimizer algorithm',
    techStack: 'C++',
    link: '#',
  },
]

interface ProjectsProps {
  mounted: boolean
}

export default function Projects({ mounted }: ProjectsProps) {
  return (
    <section className="relative z-10 w-full max-w-2xl lg:max-w-3xl xl:max-w-3xl mr-auto px-4 lg:px-8 xl:px-10 pb-24 lg:pb-32">
      {/* Section header */}
      <div className="mb-4 lg:mb-6">
        <h2
          className={`font-display text-6xl lg:text-7xl text-cream font-medium tracking-tight ${mounted ? 'animate-slide-up delay-600' : 'opacity-0'}`}
        >
          Recent <span className="italic text-gold">Projects</span>
        </h2>
      </div>

      {/* Projects list */}
      <div className="space-y-1.5 lg:space-y-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            title={project.title}
            subtitle={project.subtitle}
            techStack={project.techStack}
            link={project.link}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
