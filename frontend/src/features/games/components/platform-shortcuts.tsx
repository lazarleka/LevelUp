import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { genreLabels, genres, platformLabels, platforms } from '../types'

// Quick ways into the catalog: one tile per platform and a row of genre links.
export function PlatformShortcuts() {
  return (
    <section aria-label="Shop by platform" className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {platforms.map((platform) => (
          <li key={platform}>
            <Link
              to={`/games?platform=${platform}`}
              className="group flex h-full items-center justify-between rounded-lg bg-brand px-4 py-6 text-brand-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:py-8"
            >
              <span className="font-heading text-xl font-bold md:text-2xl">{platformLabels[platform]}</span>
              <ChevronRight className="size-5 text-primary transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </li>
        ))}
      </ul>
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        {genres.map((genre) => (
          <li key={genre} className="shrink-0">
            <Link
              to={`/games?genre=${genre}`}
              className="inline-block rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {genreLabels[genre]}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
