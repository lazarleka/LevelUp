import { useRef } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'

import { finalPrice, isComingSoon, platformLabels } from '../types'
import type { Game } from '../types'

type GameBoxProps = {
  game: Game
  /** Opens the game in place (the case dialog) instead of going to its page */
  onOpen?: (game: Game, origin: DOMRect) => void
}

const formatPrice = (value: number) => `€${value.toFixed(2)}`

// A game shown as its full portrait box, like on a shop shelf (see DESIGN.md).
export function GameBox({ game, onOpen }: GameBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const price = finalPrice(game.price, game.discountPercent)
  const onSale = game.discountPercent > 0
  const comingSoon = isComingSoon(game)

  const onClick = (event: MouseEvent) => {
    // Ctrl/Cmd/Shift-click still opens the full page in a new tab or window.
    if (!onOpen || !boxRef.current || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    onOpen(game, boxRef.current.getBoundingClientRect())
  }

  return (
    <Link
      to={`/games/${game.id}`}
      onClick={onClick}
      className="group flex flex-col gap-2 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div ref={boxRef} className="relative aspect-[3/4] [perspective:900px] [perspective-origin:50%_70%]">
        <div className="absolute inset-2 [--case-depth:clamp(10px,1.2vw,18px)] [transform:rotateY(-16deg)] [transform-style:preserve-3d] transition-transform duration-300 ease-out group-hover:[transform:translateY(-8px)_rotateY(-24deg)] group-focus-visible:[transform:translateY(-8px)_rotateY(-24deg)] motion-reduce:transition-none motion-reduce:group-hover:[transform:rotateY(-16deg)] motion-reduce:group-focus-visible:[transform:rotateY(-16deg)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-sm border border-secondary bg-brand [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg) translateZ(calc(var(--case-depth) / 2))' }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 flex items-center justify-center overflow-hidden rounded-sm border border-brand bg-secondary text-secondary-foreground [backface-visibility:hidden]"
            style={{
              width: 'var(--case-depth)',
              transformOrigin: 'left center',
              transform: 'translateZ(calc(var(--case-depth) / 2)) rotateY(-90deg)',
            }}
          >
            <span className="absolute inset-0 bg-linear-to-r from-brand/70 via-transparent to-background/20" />
            <span className="relative max-h-[85%] truncate font-heading text-[clamp(6px,0.7vw,10px)] font-bold tracking-wider [writing-mode:vertical-rl]">
              {game.title}
            </span>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 rounded-sm border border-secondary bg-brand [backface-visibility:hidden]"
            style={{
              width: 'var(--case-depth)',
              transformOrigin: 'right center',
              transform: 'translateZ(calc(var(--case-depth) / 2)) rotateY(90deg)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 border border-secondary bg-secondary [backface-visibility:hidden]"
            style={{
              height: 'var(--case-depth)',
              transformOrigin: 'center top',
              transform: 'translateZ(calc(var(--case-depth) / 2)) rotateX(90deg)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 border border-secondary bg-brand [backface-visibility:hidden]"
            style={{
              height: 'var(--case-depth)',
              transformOrigin: 'center bottom',
              transform: 'translateZ(calc(var(--case-depth) / 2)) rotateX(-90deg)',
            }}
          />
          <div
            className="absolute inset-0 overflow-hidden rounded-sm border border-brand bg-brand shadow-lg shadow-brand/20 [backface-visibility:hidden] transition-shadow duration-300 group-hover:shadow-xl group-focus-visible:shadow-xl motion-reduce:transition-none"
            style={{ transform: 'translateZ(calc(var(--case-depth) / 2))' }}
          >
            <img
              src={game.coverUrl}
              alt={`${game.title} box art`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-background/25"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[5%] border-r border-brand/30 bg-linear-to-r from-background/30 via-brand/15 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/10 via-transparent to-background/20"
            />
            {comingSoon ? (
              <span className="absolute top-2 left-2 rounded-sm border border-highlight-foreground/20 bg-highlight px-2 py-1 text-xs font-semibold text-highlight-foreground">
                Pre-order
              </span>
            ) : (
              onSale && (
                <span className="absolute top-2 left-2 rounded-sm bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                  −{game.discountPercent}%
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <h3 className="line-clamp-2 text-base leading-tight font-semibold transition-colors group-hover:text-primary group-focus-visible:text-primary">
        {game.title}
      </h3>
      <div className="flex flex-wrap gap-1">
        {game.platforms.map((platform) => (
          <Badge key={platform} variant="accent" className="border-primary/15">
            {platformLabels[platform]}
          </Badge>
        ))}
      </div>
      <p className="font-heading text-lg font-bold text-primary">
        {formatPrice(price)}
        {onSale && (
          <span className="ml-2 text-sm font-medium text-muted-foreground line-through">
            {formatPrice(game.price)}
          </span>
        )}
      </p>
    </Link>
  )
}
