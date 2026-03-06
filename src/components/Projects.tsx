import ProjectCard from './ProjectCard'

const projects = [
  {
    id: 'macrotracker',
    title: 'macroTracker',
    subtitle: 'Full-stack nutrition tracking PWA — logs meals from a single photo using computer vision and LLM analysis',
    techStack: 'React / TypeScript / Supabase / Gemini API / OpenAI',
  },
  {
    id: 'ai-tutor',
    title: 'AI-Assisted Software Engineering Tutor',
    subtitle: 'LLM workflow that turns assignment prompts into learning goals, structured plans, and stepwise guidance — without revealing solutions',
    techStack: 'React / Flask / PostgreSQL',
  },
  {
    id: 'lgame',
    title: 'L-Game with Optimal Game-Playing Agent',
    subtitle: "Reimplementation of Edward de Bono's L-Game with a deterministic agent that selects optimal moves via state evaluation and search",
    techStack: 'Python',
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
            key={project.id}
            title={project.title}
            subtitle={project.subtitle}
            techStack={project.techStack}
            link={`/projects#${project.id}`}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
