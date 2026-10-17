import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'

import { finalPrice, isComingSoon, platformLabels } from '../types'
import type { Game } from '../types'

type GameBoxProps = {
  game: Game
}

const formatPrice = (value: number) => `€${value.toFixed(2)}`

// A game shown as its full portrait box, like on a shop shelf (see DESIGN.md).
export function GameBox({ game }: GameBoxProps) {
  const price = finalPrice(game.price, game.discountPercent)
  const onSale = game.discountPercent > 0
  const comingSoon = isComingSoon(game)

  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex flex-col gap-2 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="relative overflow-hidden rounded-sm border bg-muted transition-[translate,border-color] duration-200 group-hover:-translate-y-1 group-hover:border-primary motion-reduce:transition-none">
        <img src={game.coverUrl} alt={`${game.title} box art`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
        {comingSoon ? (
          <span className="absolute top-2 left-2 rounded-sm border bg-background px-2 py-1 text-xs font-semibold text-foreground">
            Pre-order
          </span>
        ) : onSale && (
          <span className="absolute top-2 left-2 rounded-sm bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            −{game.discountPercent}%
          </span>
        )}
      </div>
      <h3 className="line-clamp-2 text-base leading-tight font-semibold">{game.title}</h3>
      <div className="flex flex-wrap gap-1">
        {game.platforms.map((platform) => (
          <Badge key={platform} variant="secondary">
            {platformLabels[platform]}
          </Badge>
        ))}
      </div>
      <p className="font-heading text-lg font-bold">
        {formatPrice(price)}
        {onSale && (
          <span className="ml-2 text-sm font-medium text-muted-foreground line-through">{formatPrice(game.price)}</span>
        )}
      </p>
    </Link>
  )
}
