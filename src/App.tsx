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

      {/* Main layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Identity Card */}
        <div className="lg:w-[40%] xl:w-[35%] flex items-start justify-center px-4 lg:px-8 xl:px-10 py-8 lg:py-12 pb-12">
          <div
            className={`card-glow bg-card rounded-2xl p-8 lg:p-12 w-full max-w-md ${mounted ? 'animate-scale-in delay-200' : 'opacity-0'
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
        <div className="lg:w-[60%] xl:w-[65%] flex flex-col justify-start px-4 lg:px-8 xl:px-10 pt-12 lg:pt-16 pb-10">
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
              className={`font-body text-stone text-lg lg:text-xl max-w-xl leading-relaxed mb-12 ${mounted ? 'animate-slide-up delay-500' : 'opacity-0'
                }`}
            >
              Crafting elegant solutions at the intersection of{' '}
              <span className="text-cream">systems programming</span>,{' '}
              <span className="text-cream">cloud infrastructure</span>, and{' '}
              <span className="text-cream">full-stack development</span>.
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
