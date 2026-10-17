import { useState } from 'react'
import type { ReactNode } from 'react'
import { Star } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { NotFoundError } from '@/lib/mock-db'
import { cn } from '@/lib/utils'

import { useGame } from '../api/use-games'
import { finalPrice, genreLabels, isComingSoon, platformLabels } from '../types'
import type { Edition, Game, GameSelection, Platform } from '../types'

type GameDetailProps = {
  gameId: number
  /** The buy action, e.g. an add to cart button from the cart feature */
  renderAction: (selection: GameSelection, game: Game) => ReactNode
  /** Extra links for admins (edit) */
  adminActions?: ReactNode
}

const releaseFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const formatPrice = (value: number) => `€${value.toFixed(2)}`

const optionClass = (selected: boolean) =>
  cn(
    'rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    selected ? 'border-secondary bg-secondary text-secondary-foreground' : 'hover:bg-accent',
  )

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
  const [platform, setPlatform] = useState<Platform>(game.platforms[0] ?? 'ps5')
  const [edition, setEdition] = useState<Edition>('standard')

  const basePrice = edition === 'deluxe' && game.deluxePrice !== null ? game.deluxePrice : game.price
  const unitPrice = finalPrice(basePrice, game.discountPercent)
  const comingSoon = isComingSoon(game)
  const onSale = game.discountPercent > 0

  return (
    <article className="grid gap-8 md:grid-cols-[minmax(0,360px)_1fr] md:gap-12">
      <div className="md:sticky md:top-8 md:self-start">
        <img
          src={game.coverUrl}
          alt={`${game.title} box art`}
          className="mx-auto aspect-[3/4] w-3/5 rounded-sm border object-cover md:w-full"
        />
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {game.publisher} · {genreLabels[game.genre]} · PEGI {game.pegi}
          </p>
          <h1 className="text-3xl leading-tight font-bold md:text-4xl">{game.title}</h1>
          {game.rating > 0 ? (
            <p className="flex items-center gap-2 text-sm" aria-label={`Rated ${game.rating} out of 5`}>
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn('size-4', i < Math.round(game.rating) ? 'fill-primary text-primary' : 'text-border')}
                  />
                ))}
              </span>
              <span className="font-semibold">{game.rating.toFixed(1)}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No ratings yet</p>
          )}
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold">Platform</legend>
          <div className="flex flex-wrap gap-2">
            {game.platforms.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={platform === option}
                className={optionClass(platform === option)}
                onClick={() => setPlatform(option)}
              >
                {platformLabels[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold">Edition</legend>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={edition === 'standard'}
              className={optionClass(edition === 'standard')}
              onClick={() => setEdition('standard')}
            >
              Standard
            </button>
            {game.deluxePrice !== null && (
              <button
                type="button"
                aria-pressed={edition === 'deluxe'}
                className={optionClass(edition === 'deluxe')}
                onClick={() => setEdition('deluxe')}
              >
                Deluxe
              </button>
            )}
          </div>
        </fieldset>

        <div className="flex flex-col gap-1">
          <p className="flex items-baseline gap-3">
            <span className="font-heading text-4xl font-bold">{formatPrice(unitPrice)}</span>
            {onSale && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(basePrice)}</span>
                <span className="rounded-sm bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                  −{game.discountPercent}%
                </span>
              </>
            )}
          </p>
          <p className="text-sm font-medium">
            {comingSoon ? (
              <span className="text-secondary">Pre-order · releases {releaseFormat.format(new Date(game.releaseDate))}</span>
            ) : game.inStock ? (
              <span className="rounded-sm bg-highlight px-2 py-1 text-highlight-foreground">In stock</span>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </p>
        </div>

        {renderAction({ game, platform, edition, unitPrice }, game)}

        {adminActions}

        <div className="flex flex-col gap-2 border-t pt-6">
          <h2 className="text-xl font-bold">About this game</h2>
          <p className="max-w-prose leading-relaxed">{game.description}</p>
          {!comingSoon && (
            <p className="text-sm text-muted-foreground">Released {releaseFormat.format(new Date(game.releaseDate))}</p>
          )}
        </div>
      </div>
    </article>
  )
}
