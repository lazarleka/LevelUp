import { SearchX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGames } from '../api/use-games'
import type { Game, GameFilters } from '../types'
import { GameBox } from './game-box'

type GamesGridProps = {
  filters: GameFilters
  onClearFilters?: () => void
  onOpenGame?: (game: Game, origin: DOMRect) => void
}

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'

// Catalog grid with all three states: loading, empty and error.
export function GamesGrid({ filters, onClearFilters, onOpenGame }: GamesGridProps) {
  const { data: games, isLoading, error, refetch } = useGames(filters)

  if (isLoading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: 10 }, (_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-sm" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">Games failed to load.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" />
        <p className="font-semibold">No games match your filters.</p>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {games.length} {games.length === 1 ? 'game' : 'games'}
      </p>
      <ul className={gridClass}>
        {games.map((game) => (
          <li key={game.id}>
            <GameBox game={game} onOpen={onOpenGame} />
          </li>
        ))}
      </ul>
    </div>
  )
}
