import { useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useGames } from '../api/use-games'
import { finalPrice } from '../types'
import type { GameFilters } from '../types'

type GameShowcaseProps = {
  title: string
  filters: GameFilters
  limit?: number
  /** Time between automatic steps */
  intervalMs?: number
}

/** Each step away from the center shrinks a box by this much. */
const SHRINK = 0.18
/** Gap between boxes, as a share of the center box width. */
const GAP = 0.06
/** Boxes further than this from the center are hidden. */
const MAX_OFFSET = 3
const SWIPE_PX = 40

const scaleAt = (distance: number) => Math.max(0, 1 - SHRINK * distance)

/** Horizontal position of the box `distance` steps from the center, in center-box widths. */
function positionAt(distance: number) {
  let position = 0
  for (let i = 1; i <= distance; i++) position += (scaleAt(i - 1) + scaleAt(i)) / 2 + GAP
  return position
}

/** Shortest signed distance from `active` to `index` on a ring of `count` items. */
function ringOffset(index: number, active: number, count: number) {
  let offset = (index - active) % count
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

// Best sellers as a shelf: one big game in the center, smaller ones on both sides.
// Every few seconds the shelf steps one place to the right; hovering pauses it.
export function GameShowcase({ title, filters, limit = 10, intervalMs = 3000 }: GameShowcaseProps) {
  const { data, isLoading, error, refetch } = useGames(filters)
  const games = (data ?? []).slice(0, limit)
  const count = games.length

  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const swipeStart = useRef<number | null>(null)

  const paused = hovered || focused || reduceMotion

  const step = (direction: 1 | -1) => setActive((i) => (count === 0 ? 0 : (i + direction + count) % count))

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(query.matches)
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Moving "to the right" means the game on the left of the center becomes the new center.
  useEffect(() => {
    if (paused || count < 2) return
    const timer = setInterval(() => {
      if (!document.hidden) setActive((i) => (i - 1 + count) % count)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [paused, count, intervalMs])

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') swipeStart.current = event.clientX
  }
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const delta = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(delta) > SWIPE_PX) step(delta > 0 ? -1 : 1)
  }

  const centerGame = games[active]

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      className="flex flex-col gap-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        <div className="flex items-center gap-2">
          <Button size="icon" aria-label="Previous game" disabled={count < 2} onClick={() => step(-1)}>
            <ChevronLeft className="size-5" />
          </Button>
          <Button size="icon" aria-label="Next game" disabled={count < 2} onClick={() => step(1)}>
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="mx-auto aspect-[3/4] w-[44%] rounded-sm md:w-60" />}

      {error && (
        <div className="flex items-center gap-4">
          <p className="text-destructive">{title} failed to load.</p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {count > 0 && (
        <div
          className="relative -mx-4 touch-pan-y overflow-hidden px-4 md:mx-0 md:px-0"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {/* The center box sets the height; the others are laid over it. */}
          <div className="invisible mx-auto aspect-[3/4] w-[44%] md:w-60" aria-hidden="true" />
          <ul aria-live={paused ? 'polite' : 'off'}>
            {games.map((game, index) => {
              const offset = ringOffset(index, active, count)
              const distance = Math.abs(offset)
              const visible = distance <= MAX_OFFSET
              const isCenter = offset === 0
              const x = Math.sign(offset) * positionAt(distance) * 100

              const onClick = (event: MouseEvent) => {
                // A side box first comes to the center; the center box opens the game.
                if (isCenter) return
                event.preventDefault()
                setActive(index)
              }

              return (
                <li
                  key={game.id}
                  aria-hidden={!isCenter}
                  className="absolute inset-x-0 bottom-0 mx-auto w-[44%] origin-bottom transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:w-60"
                  style={{
                    transform: `translateX(${x}%) scale(${scaleAt(distance)})`,
                    opacity: visible ? 1 : 0,
                    zIndex: 10 - distance,
                  }}
                >
                  <Link
                    to={`/games/${game.id}`}
                    tabIndex={isCenter ? 0 : -1}
                    onClick={onClick}
                    className="group block rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <img
                      src={game.coverUrl}
                      alt={`${game.title} box art`}
                      draggable={false}
                      className={`aspect-[3/4] w-full rounded-sm border object-cover transition-[filter,box-shadow] duration-700 ${
                        isCenter ? 'shadow-xl' : 'brightness-75 group-hover:brightness-90'
                      }`}
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {centerGame && (
        <div key={centerGame.id} className="flex animate-in flex-col items-center gap-1 text-center duration-500 fade-in slide-in-from-bottom-2">
          <p className="text-sm text-muted-foreground">
            #{active + 1} best seller · {centerGame.publisher}
          </p>
          <Link to={`/games/${centerGame.id}`} className="font-heading text-2xl font-bold hover:underline md:text-3xl">
            {centerGame.title}
          </Link>
          <p className="font-heading text-xl font-bold">
            €{finalPrice(centerGame.price, centerGame.discountPercent).toFixed(2)}
            {centerGame.discountPercent > 0 && (
              <span className="ml-2 text-sm font-medium text-muted-foreground line-through">
                €{centerGame.price.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      )}
    </section>
  )
}
