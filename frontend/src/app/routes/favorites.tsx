import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router'

import { RequireAuth } from '@/app/require-auth'
import { useGameActions } from '@/app/use-game-actions'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFavorites } from '@/features/favorites/api/use-favorites'
import { useGames } from '@/features/games/api/use-games'
import { GameBox } from '@/features/games/components/game-box'
import { GameCaseDialog } from '@/features/games/components/game-case-dialog'
import type { Game } from '@/features/games/types'
import { useCurrentUser } from '@/features/users/api/use-users'

export function Favorites() {
  return (
    <RequireAuth>
      <FavoritesContent />
    </RequireAuth>
  )
}

function FavoritesContent() {
  const { data: user } = useCurrentUser()
  const favorites = useFavorites(user?.id ?? null)
  const games = useGames({}, { enabled: Boolean(user) })
  const { renderAction, adminActions } = useGameActions()
  const [opened, setOpened] = useState<{ game: Game; origin: DOMRect } | null>(null)
  const savedIds = new Set(favorites.data?.map((item) => item.gameId))
  const savedGames = (games.data ?? []).filter((game) => savedIds.has(game.id))

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold md:text-4xl">Your favorites</h1>
          <p className="text-sm text-muted-foreground">Your next adventure, saved for later.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/#catalog">Browse games</Link>
        </Button>
      </div>

      {favorites.isLoading || games.isLoading ? (
        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          aria-label="Loading favorites"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="aspect-[3/4] rounded-sm" />
          ))}
        </div>
      ) : favorites.error || games.error ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" className="text-destructive">
            Your favorites could not be loaded.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              void favorites.refetch()
              void games.refetch()
            }}
          >
            Try again
          </Button>
        </div>
      ) : savedGames.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed bg-muted/50 px-4 py-16 text-center">
          <Heart className="size-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold">No favorites yet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Open a game and tap the heart in its details to keep it here for later.
          </p>
          <Button asChild>
            <Link to="/#catalog">Find your next game</Link>
          </Button>
        </div>
      ) : (
        <>
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {savedGames.length} {savedGames.length === 1 ? 'saved game' : 'saved games'}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {savedGames.map((game) => (
              <li key={game.id}>
                <GameBox game={game} onOpen={(selected, origin) => setOpened({ game: selected, origin })} />
              </li>
            ))}
          </ul>
        </>
      )}

      <GameCaseDialog
        game={opened?.game ?? null}
        originRect={opened?.origin ?? null}
        onClosed={() => setOpened(null)}
        renderAction={renderAction}
        adminActions={adminActions}
      />
    </section>
  )
}
