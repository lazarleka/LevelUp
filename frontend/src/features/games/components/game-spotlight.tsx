import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGame } from '../api/use-games'
import { finalPrice, isComingSoon, platformLabels } from '../types'

type GameSpotlightProps = {
  gameId: number
}

const releaseFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// One featured game at the top of the home page: big box, short pitch and one action.
export function GameSpotlight({ gameId }: GameSpotlightProps) {
  const { data: game, isLoading, error } = useGame(gameId)

  if (isLoading) return <Skeleton className="h-96 rounded-lg" />
  if (error || !game) return null

  const comingSoon = isComingSoon(game)
  const price = finalPrice(game.price, game.discountPercent)

  return (
    <section className="grid items-center gap-6 rounded-lg bg-brand p-6 text-brand-foreground md:grid-cols-[minmax(0,280px)_1fr] md:gap-12 md:p-12">
      <img
        src={game.coverUrl}
        alt={`${game.title} box art`}
        className="mx-auto aspect-[3/4] w-1/2 rounded-sm object-cover md:w-full"
      />
      <div className="flex flex-col items-start gap-4">
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          {comingSoon ? `Pre-order · releases ${releaseFormat.format(new Date(game.releaseDate))}` : 'Featured'}
        </p>
        <h1 className="text-4xl leading-none font-bold md:text-5xl">{game.title}</h1>
        <p className="max-w-prose text-brand-foreground/80">{game.description}</p>
        <div className="flex flex-wrap gap-2">
          {game.platforms.map((platform) => (
            <Badge key={platform} className="bg-brand-foreground/15 text-brand-foreground">
              {platformLabels[platform]}
            </Badge>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-4">
          <span className="font-heading text-3xl font-bold">€{price.toFixed(2)}</span>
          <Button asChild size="lg">
            <Link to={`/games/${game.id}`}>{comingSoon ? 'Pre-order now' : 'View game'}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
