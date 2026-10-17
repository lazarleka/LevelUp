import { Skeleton } from '@/components/ui/skeleton'

import { useGames } from '../api/use-games'
import type { GameFilters } from '../types'
import { GameBox } from './game-box'

type GamesGridProps = {
  filters: GameFilters
}

const gridClass = 'mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5'

// Catalog grid with all three states: loading, empty and error.
export function GamesGrid({ filters }: GamesGridProps) {
  const { data: games, isLoading, error } = useGames(filters)

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
    return <p className="mt-6 text-destructive">Games failed to load. Please try again.</p>
  }

  if (!games || games.length === 0) {
    return <p className="mt-6 text-muted-foreground">No games match your search.</p>
  }

  return (
    <ul className={gridClass}>
      {games.map((game) => (
        <li key={game.id}>
          <GameBox game={game} />
        </li>
      ))}
    </ul>
  )
}
