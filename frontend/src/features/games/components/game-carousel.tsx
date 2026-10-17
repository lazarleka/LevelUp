import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGames } from '../api/use-games'
import type { GameFilters } from '../types'
import { GameBox } from './game-box'

type GameCarouselProps = {
  title: string
  filters: GameFilters
  /** Catalog link with the matching filter or sort, e.g. `/games?onSale=true` */
  seeAllTo: string
  limit?: number
}

// 2 boxes (plus a peek of the third) on phone, up to 6 on desktop.
const itemClass = 'w-[42%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[calc((100%-5*1rem)/6)]'

// A shelf of game boxes that scrolls sideways with the arrow buttons or a swipe.
export function GameCarousel({ title, filters, seeAllTo, limit = 10 }: GameCarouselProps) {
  const { data: games, isLoading, error, refetch } = useGames(filters)
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 4)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateArrows()
    window.addEventListener('resize', updateArrows)
    return () => window.removeEventListener('resize', updateArrows)
  }, [updateArrows, games])

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({ left: direction * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <section aria-label={title} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          <Link to={seeAllTo} className="mr-2 text-sm font-semibold text-secondary hover:underline">
            See all
          </Link>
          <Button size="icon" aria-label={`Previous ${title} games`} disabled={!canPrev} onClick={() => scrollBy(-1)}>
            <ChevronLeft className="size-5" />
          </Button>
          <Button size="icon" aria-label={`Next ${title} games`} disabled={!canNext} onClick={() => scrollBy(1)}>
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className={`${itemClass} aspect-[3/4] rounded-sm`} />
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-4">
          <p className="text-destructive">{title} failed to load.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {games && games.length === 0 && <p className="text-muted-foreground">No games here yet.</p>}

      {games && games.length > 0 && (
        <ul
          ref={trackRef}
          onScroll={updateArrows}
          className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pt-3 pb-6 [scrollbar-width:none] md:mx-0 md:scroll-px-0 md:px-0"
        >
          {games.slice(0, limit).map((game) => (
            <li key={game.id} className={itemClass}>
              <GameBox game={game} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
