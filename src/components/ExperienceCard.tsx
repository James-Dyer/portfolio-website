import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'

interface ExperienceCardProps {
  company: string
  role: string
  date: string
  location: string
  logoSrc?: string
  logoAlt?: string
  index: number
  link?: string
}

export default function ExperienceCard({
  company,
  role,
  date,
  location,
  logoSrc,
  logoAlt,
  index,
  link,
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
    setMousePosition({ x, y })
  }, [])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setMousePosition({ x: 0, y: 0 })
  }

  const cardStyle = {
    animationDelay: `${700 + index * 100}ms`,
    transform: isHovered
      ? `perspective(1000px) rotateX(${-mousePosition.y * 0.3}deg) rotateY(${mousePosition.x * 0.3}deg) translateY(-4px)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
    transition: isHovered
      ? 'transform 0.1s ease-out'
      : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }

  const cardContent = (
    <>
      {/* Card background with border */}
      <div
        className="absolute inset-0 rounded-xl transition-all duration-500"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(201, 168, 108, 0.08) 0%, rgba(22, 22, 22, 0.95) 50%, rgba(22, 22, 22, 0.98) 100%)'
            : 'transparent',
          border: isHovered ? '1px solid rgba(201, 168, 108, 0.3)' : '1px solid transparent',
          boxShadow: isHovered
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 60px -20px rgba(201, 168, 108, 0.15)'
            : 'none',
        }}
      />

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 2}% ${50 + mousePosition.y * 2}%, rgba(201, 168, 108, 0.1) 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Content container */}
      <div className="relative flex items-stretch p-4 lg:p-5 gap-5">
        {/* Icon area */}
        <div
          className="relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.02)' : 'scale(1)' }}
        >
          <div
            className="absolute inset-0 transition-all duration-500"
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(201, 168, 108, 0.2) 0%, rgba(22, 22, 22, 0.9) 100%)'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(22, 22, 22, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
          {logoSrc ? (
            <div className="absolute inset-0 flex items-center justify-center p-2 lg:p-3">
              <img
                src={logoSrc}
                alt={logoAlt ?? `${company} logo`}
                className="max-h-full max-w-full"
                style={{ objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-7 h-7 lg:w-8 lg:h-8 transition-all duration-500"
                style={{
                  opacity: isHovered ? 0.6 : 0.3,
                  color: isHovered ? '#c9a86c' : '#8a8a8a',
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <path d="M12 12v.01" />
                  <path d="M2 12h20" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-6">
          <h3
            className="font-sans text-lg lg:text-xl font-medium tracking-tight mb-1 truncate transition-colors duration-300"
            style={{ color: isHovered ? '#faf8f5' : 'rgba(250, 248, 245, 0.9)' }}
          >
            {company}
          </h3>
          <p
            className="font-sans text-sm leading-relaxed mb-1.5 transition-colors duration-300"
            style={{
              color: isHovered ? 'rgba(160, 160, 160, 1)' : 'rgba(138, 138, 138, 0.85)',
              fontWeight: 400,
            }}
          >
            {role}
          </p>
          <div className="flex items-center gap-3">
            <span
              className="font-sans text-xs tracking-wide transition-colors duration-300"
              style={{
                color: isHovered ? 'rgba(201, 168, 108, 0.9)' : 'rgba(201, 168, 108, 0.6)',
                fontWeight: 500,
              }}
            >
              {date}
            </span>
            <span
              className="font-sans text-xs transition-colors duration-300"
              style={{ color: isHovered ? 'rgba(138, 138, 138, 0.8)' : 'rgba(138, 138, 138, 0.5)' }}
            >
              {location}
            </span>
          </div>
        </div>

        {/* Diagonal arrow — shown only when card is a link */}
        {link && (
          <div
            className="absolute top-4 right-4 transition-transform duration-300"
            style={{ transform: isHovered ? 'translate(2px, -2px)' : 'translate(0, 0)' }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ color: isHovered ? '#c9a86c' : 'rgba(138, 138, 138, 0.6)' }}
            >
              <path
                d="M1 13L13 1M13 1H5M13 1V9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-[1px] transition-all duration-300"
        style={{
          width: isHovered ? '100%' : '0%',
          background: 'linear-gradient(90deg, transparent, rgba(201, 168, 108, 0.5), transparent)',
        }}
      />
    </>
  )

  const sharedClassName = `group relative block rounded-xl overflow-hidden transition-all duration-500 animate-slide-up`

  if (link) {
    return (
      <Link
        ref={cardRef as React.RefObject<HTMLAnchorElement>}
        to={link}
        className={sharedClassName}
        style={cardStyle}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {cardContent}
      </Link>
    )
  }

  return (
    <div
      ref={cardRef as React.RefObject<HTMLDivElement>}
      className={sharedClassName}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cardContent}
    </div>
  )
}
