import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DetailPageLayout from '../components/DetailPageLayout'
import ExperienceSection from '../components/ExperienceSection'
import { additionalExperiences } from '../data/portfolio'

export default function AdditionalExperiencePage() {
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) { window.scrollTo(0, 0); return }
    const timer = window.setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    return () => window.clearTimeout(timer)
  }, [location.hash])
  return <DetailPageLayout title="Additional Experience">{additionalExperiences.map((experience) => <ExperienceSection key={experience.id} experience={experience} />)}</DetailPageLayout>
}
