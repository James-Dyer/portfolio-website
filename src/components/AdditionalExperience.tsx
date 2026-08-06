import { additionalExperiences } from '../data/portfolio'
import ExperienceCard from './ExperienceCard'

export default function AdditionalExperience() {
  return (
    <section className="relative z-10 w-full max-w-2xl lg:max-w-3xl xl:max-w-3xl mr-auto px-4 lg:px-8 xl:px-10 pb-24 lg:pb-32">
      <div className="mb-4 lg:mb-6">
        <h2 className="font-display text-6xl lg:text-7xl text-cream font-medium tracking-tight animate-slide-up delay-700"><span className="italic text-gold">Additional Experience</span></h2>
      </div>
      <div className="space-y-1.5 lg:space-y-2">
        {additionalExperiences.map((experience, index) => <ExperienceCard key={experience.id} experience={experience} index={index} basePath="/additional-experience" />)}
      </div>
    </section>
  )
}
