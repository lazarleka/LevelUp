import { useState } from 'react'
import type { ReactNode } from 'react'
import { Star } from 'lucide-react'

import { cn } from '@/lib/utils'

import { finalPrice, genreLabels, isComingSoon, platformLabels } from '../types'
import type { Edition, Game, GameSelection, Platform } from '../types'

type GameInfoProps = {
  game: Game
  /** The buy action, e.g. an add to cart button from the cart feature */
  renderAction: (selection: GameSelection, game: Game) => ReactNode
  /** Extra links for admins (edit) */
  adminActions?: ReactNode
  /** The page uses h1; inside the game case dialog the title is an h2 */
  titleAs?: 'h1' | 'h2'
  titleId?: string
}

const releaseFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const formatPrice = (value: number) => `€${value.toFixed(2)}`

const optionClass = (selected: boolean) =>
  cn(
    'rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
    selected ? 'border-secondary bg-secondary text-secondary-foreground' : 'hover:bg-accent',
  )

// Everything about one game except its box art: meta, pickers, price, buy action and description.
// Used by the game page and by the game case dialog.
export function GameInfo({ game, renderAction, adminActions, titleAs: Title = 'h1', titleId }: GameInfoProps) {
  const [platform, setPlatform] = useState<Platform>(game.platforms[0] ?? 'ps5')
  const [edition, setEdition] = useState<Edition>('standard')

  const basePrice = edition === 'deluxe' && game.deluxePrice !== null ? game.deluxePrice : game.price
  const unitPrice = finalPrice(basePrice, game.discountPercent)
  const comingSoon = isComingSoon(game)
  const onSale = game.discountPercent > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">
          {game.publisher} · {genreLabels[game.genre]} · PEGI {game.pegi}
        </p>
        <Title id={titleId} className="text-3xl leading-tight font-bold md:text-4xl">
          {game.title}
        </Title>
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
  )
}
