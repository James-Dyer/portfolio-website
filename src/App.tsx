import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import MagneticShapes from './components/MagneticShapes'
import Projects from './components/Projects'
import Experience from './components/Experience'
import ProjectsPage from './pages/ProjectsPage'

function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative bg-ink">
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Magnetic shapes - subtle background */}
      <MagneticShapes />

      {/* Darkening scrim behind hero text for readability */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background:
            'radial-gradient(circle at 65% 40%, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.8) 18%, rgba(0, 0, 0, 0.65) 30%, transparent 40%)',
        }}
      />

      {/* Subtle ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--color-accent-dim) 0%, transparent 70%)',
            top: '-20%',
            right: '-10%',
            filter: 'blur(100px)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:pl-16 xl:pl-28">
        {/* Left side - Identity Card (sticky) */}
        <div className="lg:w-[40%] xl:w-[35%] lg:sticky lg:top-0 lg:h-screen flex items-start justify-center px-4 lg:px-8 xl:px-10 py-8 lg:py-12 pb-12">
          <div
            className={`card-glow bg-cream rounded-2xl p-8 pb-20 lg:p-12 lg:pb-24 w-full max-w-md relative overflow-hidden ${mounted ? 'animate-scale-in delay-200' : 'opacity-0'
              }`}
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-0.5 bg-gold/40" />
              <div className="absolute top-4 left-4 w-0.5 h-8 bg-gold/40" />
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-4 right-4 w-8 h-0.5 bg-gold/40" />
              <div className="absolute top-4 right-4 w-0.5 h-8 bg-gold/40" />
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-4 left-4 w-8 h-0.5 bg-gold/40" />
              <div className="absolute bottom-4 left-4 w-0.5 h-8 bg-gold/40" />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute bottom-4 right-4 w-8 h-0.5 bg-gold/40" />
              <div className="absolute bottom-4 right-4 w-0.5 h-8 bg-gold/40" />
            </div>

            {/* Subtle diagonal line accent */}
            <div
              className="absolute -right-12 top-1/3 w-40 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent rotate-45 pointer-events-none"
            />

            {/* Portrait */}
            <div className="relative mb-8">
              <div className="aspect-[4/5] bg-ink rounded-xl overflow-hidden">
                <picture>
                  <source srcSet="/DSC03663_480.avif" type="image/avif" />
                  <img
                    src="/DSC03663.JPG"
                    alt="Portrait of James Dyer"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border border-gold/30 rounded-xl" />
              {/* Diamond accent */}
              <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-gold/60 rotate-45" />
            </div>

            {/* Name */}
            <h2 className="font-display text-4xl lg:text-5xl text-ink font-medium tracking-tight mb-2">
              James Dyer
            </h2>

            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-2">
              <p className="font-body text-sm lg:text-base text-ink/70 tracking-wide">
                New Graduate Software Engineer
              </p>
            </div>

            {/* Social icons pinned to bottom */}
            <div className="absolute inset-x-0 bottom-6 lg:bottom-8 flex justify-center gap-8">
              <a
                href="https://github.com/James-Dyer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:bg-ink/10 rounded-lg p-2 -m-2 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 fill-ink">
                  <path fillRule="evenodd" d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.682-.218.682-.484 0-.237-.009-.868-.014-1.703-2.775.603-3.36-1.337-3.36-1.337-.454-1.152-1.11-1.46-1.11-1.46-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.528 2.341 1.087 2.91.832.092-.647.35-1.087.637-1.338-2.216-.252-4.547-1.108-4.547-4.934 0-1.09.39-1.983 1.029-2.681-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844a9.56 9.56 0 0 1 2.504.337c1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.393.1 2.646.64.698 1.028 1.59 1.028 2.68 0 3.836-2.335 4.678-4.558 4.925.359.31.679.921.679 1.856 0 1.339-.012 2.419-.012 2.749 0 .268.18.58.688.482A10 10 0 0 0 12 2Z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/jamesthedyer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:bg-ink/10 rounded-lg p-2 -m-2 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 fill-ink">
                  <path d="M20.452 20.452h-3.555v-5.569c0-1.328-.027-3.036-1.85-3.036-1.851 0-2.135 1.445-2.135 2.939v5.666H9.357V9h3.413v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.604 0 4.27 2.372 4.27 5.455v6.286ZM5.337 7.433a2.064 2.064 0 1 1 .001-4.128 2.064 2.064 0 0 1-.001 4.128Zm1.779 13.019H3.556V9h3.56v11.452Z" />
                </svg>
              </a>
              <a
                href="mailto:james.dyer.dyer@gmail.com"
                className="text-ink hover:bg-ink/10 rounded-lg p-2 -m-2 transition-all duration-300"
                aria-label="Email"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-7 w-7 fill-ink">
                  <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25Zm2.75-1.25a1.25 1.25 0 0 0-1.25 1.25v.394l7.084 3.798a.75.75 0 0 0 .732 0L19.4 7.144v-.394a1.25 1.25 0 0 0-1.25-1.25Zm13 3.178-5.932 3.183a2.25 2.25 0 0 1-2.136 0L4.75 8.678v8.572a1.25 1.25 0 0 0 1.25 1.25h12.5a1.25 1.25 0 0 0 1.25-1.25Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right side - Scrollable Content */}
        <div className="lg:w-[60%] xl:w-[65%] flex flex-col">
          {/* Hero Section */}
          <div className="min-h-screen flex flex-col justify-start px-4 lg:px-8 xl:px-10 pt-12 lg:pt-16 pb-10">
            {/* Top nav area */}
            <nav
              className={`mb-4 pt-0 flex justify-end ${mounted ? 'animate-fade delay-300' : 'opacity-0'
                }`}
            >
              <a
                href="mailto:james.dyer.dyer@gmail.com"
                className="group flex items-center gap-2 text-stone hover:text-cream text-sm font-body transition-colors duration-300"
              >
              </a>
            </nav>

            {/* Main headline */}
            <div className="mt-0">
              <h1
                className={`font-display text-cream leading-[0.85] tracking-tight mb-10 ${mounted ? 'animate-slide-up delay-400' : 'opacity-0'
                  }`}
              >
                <span className="block text-[clamp(4rem,9vw,8.5rem)] font-medium">
                  Software <br className="hidden sm:block" /> <span className="italic text-gold">Engineer</span>
                </span>
              </h1>

              <p
                className={`font-body text-stone text-lg lg:text-xl max-w-xl leading-relaxed ${mounted ? 'animate-slide-up delay-500' : 'opacity-0'
                  }`}
              >
                Crafting elegant solutions at the intersection of{' '}
                <span className="text-cream">systems programming</span>,{' '}
                <span className="text-cream">cloud infrastructure</span>, and{' '}
                <span className="text-cream">full-stack development</span>.
              </p>
            </div>
          </div>

          {/* Projects Section */}
          <Projects mounted={mounted} />

          {/* Experience Section */}
          <Experience mounted={mounted} />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects" element={<ProjectsPage />} />
    </Routes>
  )
}
