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
  /** Tighter spacing for the open case, keeping all details visible together. */
  compact?: boolean
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
export function GameInfo({
  game,
  renderAction,
  adminActions,
  titleAs: Title = 'h1',
  titleId,
  compact = false,
}: GameInfoProps) {
  const [platform, setPlatform] = useState<Platform>(game.platforms[0] ?? 'ps5')
  const [edition, setEdition] = useState<Edition>('standard')

  const basePrice = edition === 'deluxe' && game.deluxePrice !== null ? game.deluxePrice : game.price
  const unitPrice = finalPrice(basePrice, game.discountPercent)
  const comingSoon = isComingSoon(game)
  const onSale = game.discountPercent > 0

  return (
    <div
      className={cn(
        'flex flex-col',
        compact
          ? 'gap-3 text-sm [&_fieldset_button]:min-h-8 [&_fieldset_button]:px-3 [&_fieldset_button]:py-1'
          : 'gap-6',
      )}
    >
      <div className={cn('flex flex-col', compact ? 'gap-1' : 'gap-2')}>
        <p className={cn('text-muted-foreground', compact ? 'pr-8 text-xs' : 'text-sm')}>
          {game.publisher} · {genreLabels[game.genre]} · PEGI {game.pegi}
        </p>
        <Title
          id={titleId}
          className={cn('leading-tight font-bold', compact ? 'pr-6 text-2xl' : 'text-3xl md:text-4xl')}
        >
          {game.title}
        </Title>
        {game.rating > 0 ? (
          <p className="flex items-center gap-2 text-sm" aria-label={`Rated ${game.rating} out of 5`}>
            <span className="flex" aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'size-4',
                    i < Math.round(game.rating) ? 'fill-primary text-primary' : 'text-border',
                  )}
                />
              ))}
            </span>
            <span className="font-semibold">{game.rating.toFixed(1)}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No ratings yet</p>
        )}
      </div>

      <div className={cn(compact ? 'grid grid-cols-[1.4fr_1fr] gap-3' : 'flex flex-col gap-6')}>
        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className={cn('text-sm font-semibold', compact ? 'mb-1' : 'mb-2')}>Platform</legend>
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

        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className={cn('text-sm font-semibold', compact ? 'mb-1' : 'mb-2')}>Edition</legend>
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
      </div>

      <div className="flex flex-col gap-1">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={cn('font-heading font-bold', compact ? 'text-3xl' : 'text-4xl')}>
            {formatPrice(unitPrice)}
          </span>
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
            <span className="text-secondary">
              Pre-order · releases {releaseFormat.format(new Date(game.releaseDate))}
            </span>
          ) : game.inStock ? (
            <span className="rounded-sm bg-highlight px-2 py-1 text-highlight-foreground">In stock</span>
          ) : (
            <span className="text-destructive">Out of stock</span>
          )}
        </p>
      </div>

      {renderAction({ game, platform, edition, unitPrice }, game)}

      {adminActions}

      <div className={cn('flex flex-col border-t', compact ? 'gap-1 pt-3' : 'gap-2 pt-6')}>
        <h2 className={cn('font-bold', compact ? 'text-lg' : 'text-xl')}>About this game</h2>
        <p className={cn('max-w-prose', compact ? 'text-sm leading-snug' : 'leading-relaxed')}>
          {game.description}
        </p>
        {!comingSoon && (
          <p className="text-sm text-muted-foreground">
            Released {releaseFormat.format(new Date(game.releaseDate))}
          </p>
        )}
      </div>
    </div>
  )
}
