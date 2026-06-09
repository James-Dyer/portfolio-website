import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface DetailPageLayoutProps {
  title: string
  children: ReactNode
}

const navItems = [
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
]

export default function DetailPageLayout({
  title,
  children,
}: DetailPageLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink">
      <nav
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink/95 px-5 py-4 backdrop-blur-md sm:px-8"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            to="/"
            className="font-sans text-sm font-medium text-cream transition-colors hover:text-gold"
          >
            James Dyer
          </Link>
          <div className="flex items-center gap-5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`font-sans text-sm transition-colors ${isActive ? 'text-cream' : 'text-stone hover:text-cream'
                    }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 pb-24 sm:px-8 lg:pb-32">
        <header className="max-w-3xl border-b border-white/[0.08] pb-10 pt-14 sm:pb-14 sm:pt-20">
          <h1 className="font-display text-5xl font-medium tracking-tight text-cream sm:text-7xl">
            {title}
          </h1>
        </header>

        {children}
      </main>
    </div>
  )
}
