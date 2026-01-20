import { useEffect, useState } from 'react'
import MagneticShapes from './components/MagneticShapes'

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/James-Dyer',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jamesthedyer',
  },
  {
    label: 'Email',
    href: 'mailto:james.dyer.dyer@gmail.com',
  },
]

export default function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-ink overflow-hidden">
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Magnetic shapes - subtle background */}
      <MagneticShapes />

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

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Identity Card */}
        <div className="lg:w-[45%] xl:w-[40%] flex items-center justify-center p-8 lg:p-16">
          <div
            className={`card-glow bg-card rounded-2xl p-8 lg:p-12 w-full max-w-md ${
              mounted ? 'animate-scale-in delay-200' : 'opacity-0'
            }`}
          >
            {/* Portrait placeholder */}
            <div className="relative mb-8">
              <div className="aspect-[4/5] bg-ink rounded-xl overflow-hidden border border-line">
                {/* Placeholder portrait - stylized initials */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-ink">
                  <span className="font-display text-[120px] lg:text-[140px] text-cream/10 font-medium select-none">
                    JD
                  </span>
                </div>
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-3 -right-3 w-24 h-24 border border-gold/30 rounded-xl" />
            </div>

            {/* Name */}
            <h2 className="font-display text-4xl lg:text-5xl text-cream font-medium tracking-tight mb-2">
              James Dyer
            </h2>

            {/* Role badge */}
            <div className="flex items-center gap-3 mb-6">
              <div className="accent-line" />
              <span className="text-gold text-sm font-body font-medium tracking-widest uppercase">
                Software Engineer
              </span>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="border-l border-line pl-4">
                <div className="text-stone text-xs font-body uppercase tracking-wider mb-1">Location</div>
                <div className="text-cream text-sm font-body">California</div>
              </div>
              <div className="border-l border-line pl-4">
                <div className="text-stone text-xs font-body uppercase tracking-wider mb-1">Focus</div>
                <div className="text-cream text-sm font-body">Full Stack</div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="link-hover text-stone hover:text-gold text-sm font-body transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Hero Content */}
        <div className="lg:w-[55%] xl:w-[60%] flex flex-col justify-center p-8 lg:p-16 xl:p-24">
          {/* Top nav area */}
          <nav
            className={`mb-auto pt-4 flex justify-end ${
              mounted ? 'animate-fade delay-300' : 'opacity-0'
            }`}
          >
            <a
              href="mailto:james.dyer.dyer@gmail.com"
              className="group flex items-center gap-2 text-stone hover:text-cream text-sm font-body transition-colors duration-300"
            >
              <span className="link-hover">Available for opportunities</span>
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            </a>
          </nav>

          {/* Main headline */}
          <div className="my-auto">
            <h1
              className={`font-display text-cream leading-[1.1] tracking-tight mb-8 ${
                mounted ? 'animate-slide-up delay-400' : 'opacity-0'
              }`}
            >
              <span className="block text-[clamp(2.5rem,6vw,5.5rem)] font-medium">
                Software engineer
              </span>
              <span className="block text-[clamp(2.5rem,6vw,5.5rem)] font-medium">
                crafting <span className="italic text-gold">elegant</span>
              </span>
              <span className="block text-[clamp(2.5rem,6vw,5.5rem)] font-medium">
                solutions.
              </span>
            </h1>

            <p
              className={`font-body text-stone text-lg lg:text-xl max-w-xl leading-relaxed mb-12 ${
                mounted ? 'animate-slide-up delay-500' : 'opacity-0'
              }`}
            >
              At the intersection of{' '}
              <span className="text-cream">systems programming</span>,{' '}
              <span className="text-cream">cloud infrastructure</span>, and{' '}
              <span className="text-cream">full-stack development</span>.
            </p>

            {/* Status / Currently */}
            <div
              className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-12 ${
                mounted ? 'animate-slide-up delay-600' : 'opacity-0'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-line" />
                <div>
                  <div className="text-stone text-xs font-body uppercase tracking-wider">Education</div>
                  <div className="text-cream text-sm font-body">UC Merced — CS '26</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-px h-8 bg-line" />
                <div>
                  <div className="text-stone text-xs font-body uppercase tracking-wider">Currently</div>
                  <div className="text-cream text-sm font-body">E. & J. Gallo Winery</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`flex flex-wrap items-center gap-6 ${
                mounted ? 'animate-slide-up delay-700' : 'opacity-0'
              }`}
            >
              <a
                href="mailto:james.dyer.dyer@gmail.com"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-ink font-body font-semibold text-sm tracking-wide rounded-full hover:bg-cream transition-colors duration-300"
              >
                Get in touch
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="https://github.com/James-Dyer"
                target="_blank"
                rel="noopener noreferrer"
                className="link-hover text-stone hover:text-cream text-sm font-body transition-colors duration-300"
              >
                View my work
              </a>
            </div>
          </div>

          {/* Footer hint */}
          <div
            className={`mt-auto pb-4 ${
              mounted ? 'animate-fade delay-1000' : 'opacity-0'
            }`}
          >
            <p className="text-stone/40 text-xs font-body tracking-wide">
              Move your cursor — the shapes respond to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
