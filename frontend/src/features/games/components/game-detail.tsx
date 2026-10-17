import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NotFoundError } from '@/lib/mock-db'

import { useGame } from '../api/use-games'
import type { Game, GameSelection } from '../types'
import { GameInfo } from './game-info'

type GameDetailProps = {
  gameId: number
  /** The buy action, e.g. an add to cart button from the cart feature */
  renderAction: (selection: GameSelection, game: Game) => ReactNode
  /** Extra links for admins (edit) */
  adminActions?: (game: Game) => ReactNode
}

export function GameDetail({ gameId, renderAction, adminActions }: GameDetailProps) {
  const { data: game, isLoading, error, refetch } = useGame(gameId)

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr]">
        <Skeleton className="mx-auto aspect-[3/4] w-3/5 rounded-sm md:w-full" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24" />
        </div>
      </div>
    )
  }

  if (error || !game) {
    const notFound = error instanceof NotFoundError
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{notFound ? 'Game not found' : 'The game failed to load'}</h1>
        {notFound ? (
          <Button asChild variant="outline">
            <Link to="/games">Browse games</Link>
          </Button>
        ) : (
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        )}
      </div>
    )
  }

  return <GameDetailView key={game.id} game={game} renderAction={renderAction} adminActions={adminActions} />
}

type GameDetailViewProps = Omit<GameDetailProps, 'gameId'> & { game: Game }

function GameDetailView({ game, renderAction, adminActions }: GameDetailViewProps) {
  return (
    <article className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:gap-12">
      <div className="md:sticky md:top-8 md:self-start">
        <img
          src={game.coverUrl}
          alt={`${game.title} box art`}
          className="mx-auto aspect-[3/4] w-3/5 rounded-sm border object-cover md:w-full"
        />
      </div>
      <GameInfo game={game} renderAction={renderAction} adminActions={adminActions?.(game)} />
    </article>
  )
}
