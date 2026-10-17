import type { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'

import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'Games' },
]

type AppLayoutProps = {
  /** Right side of the header (e.g. the cart button); passed in by the router so layout stays feature-free */
  actions?: ReactNode
}

export function AppLayout({ actions }: AppLayoutProps) {
  return (
    <div className="min-h-dvh">
      <header className="bg-brand text-brand-foreground">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 md:px-6">
          <Link to="/" className="font-heading text-2xl font-bold tracking-wide">
            LevelUp
          </Link>
          <ul className="hidden gap-6 text-sm md:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    cn('text-brand-foreground/80 hover:text-brand-foreground', isActive && 'font-semibold text-brand-foreground')
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/games"
              aria-label="Search games"
              className="flex size-10 items-center justify-center rounded-md hover:bg-brand-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Search className="size-5" />
            </Link>
            {actions}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <Outlet />
      </main>
    </div>
  )
}
