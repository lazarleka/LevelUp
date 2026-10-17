import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

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

/** Angle between neighbouring boxes on the ring. */
const STEP_DEG = 22
/** Boxes turned further than this are hidden; 2 steps (44°) on each side stay visible, further ones are only edge-on slivers. */
const MAX_VISIBLE_DEG = 50
/** At least this many boxes must fit on each side of the front one. */
const MIN_SIDE_BOXES = 2
/** How far the front box comes out toward the viewer, as a share of its width.
 * (No z-index here: in Chrome it flattens the 3D ring, so depth alone keeps the front box on top.) */
const FRONT_LIFT = 0.6
/** Extra size of the front box on top of the lift. */
const FRONT_SCALE = 1.18
/** Space between neighbouring boxes on the ring, as a share of the box width. */
const GAP = 0.08
/** Heights fall off along a semicircle this many steps wide: the front box is the tallest. */
const ARC_STEPS = 4
const SWIPE_PX = 40

/** Shortest signed distance from `active` to `index` on a ring of `count` items. */
function ringOffset(index: number, active: number, count: number) {
  let offset = (index - active) % count
  if (offset > count / 2) offset -= count
  if (offset < -count / 2) offset += count
  return offset
}

const mod = (value: number, count: number) => ((value % count) + count) % count

/** Size of a box `distance` steps from the front, so the tops of the boxes trace a semicircle. */
const arcScale = (distance: number) => Math.sqrt(Math.max(0, 1 - (distance / ARC_STEPS) ** 2))

// Best sellers on a 3D ring: one big game in front, the others curve away around it.
// Every few seconds the next game comes to the front; hovering pauses it.
// Each box sits at an angle from its distance to the front game; the one box that wraps from one
// end of the list to the other does so behind the ring, without animation, so nothing flies across.
export function GameShowcase({ title, filters, limit = 10, intervalMs = 3000 }: GameShowcaseProps) {
  const { data, isLoading, error, refetch } = useGames(filters)
  const games = (data ?? []).slice(0, limit)
  const count = games.length

  // How many steps the ring has turned; the front game is `turn` modulo the number of games.
  const [turn, setTurn] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [boxWidth, setBoxWidth] = useState(0)
  const [stageWidth, setStageWidth] = useState(0)
  const sizerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const swipeStart = useRef<number | null>(null)
  const previousOffsets = useRef(new Map<number, number>())

  const paused = hovered || focused || reduceMotion
  const active = count > 0 ? mod(turn, count) : 0
  // Distance from the ring's axis to each box: neighbours side by side with a small gap, but small
  // enough that two boxes still fit on each side of the front one (on phones they overlap a little).
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const naturalRadius = (boxWidth * (0.5 + GAP)) / Math.tan(toRad(STEP_DEG / 2))
  const fittingRadius = (stageWidth / 2 - boxWidth * 0.58) / Math.sin(toRad(STEP_DEG * MIN_SIDE_BOXES))
  const radius = boxWidth > 0 && stageWidth > 0 ? Math.max(0, Math.min(naturalRadius, fittingRadius)) : 0
  const lift = boxWidth * FRONT_LIFT

  // A box is shown only if its whole cover fits inside the stage.
  const fitsOnStage = (offset: number) => {
    const halfWidth = boxWidth * 0.58 * arcScale(Math.abs(offset))
    return radius * Math.sin(toRad(Math.abs(offset) * STEP_DEG)) + halfWidth <= stageWidth / 2
  }

  // Remember where each box was, to spot the one that wraps around.
  useEffect(() => {
    games.forEach((game, index) => previousOffsets.current.set(game.id, ringOffset(index, active, count)))
  })

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(query.matches)
    const onChange = () => setReduceMotion(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const sizer = sizerRef.current
    const stage = stageRef.current
    if (!sizer || !stage) return
    const observer = new ResizeObserver(() => {
      setBoxWidth(sizer.getBoundingClientRect().width)
      setStageWidth(stage.getBoundingClientRect().width)
    })
    observer.observe(sizer)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [count])

  // Advance in the opposite direction: the game right of the front comes to the front.
  useEffect(() => {
    if (paused || count < 2) return
    const timer = setInterval(() => {
      if (!document.hidden) setTurn((t) => t + 1)
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
    // Swiping right pulls the left game to the front.
    if (Math.abs(delta) > SWIPE_PX) setTurn((t) => t + (delta > 0 ? -1 : 1))
  }

  const frontGame = games[active]

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
      <h2 className="border-l-4 border-primary pl-3 text-2xl font-bold md:text-3xl">{title}</h2>

      {isLoading && <Skeleton className="mx-auto aspect-[3/4] w-[26%] rounded-sm md:w-44" />}

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
          ref={stageRef}
          className="relative -mx-4 touch-pan-y overflow-hidden border-y border-primary/10 bg-muted bg-linear-to-br from-accent via-muted to-background px-4 pt-16 pb-10 md:mx-0 md:rounded-xl md:border md:pt-20 md:px-0"
          // Looking from the height of the boxes' bottom edge keeps every box standing on one line.
          style={{
            perspective: `${Math.max(radius * 3, 900)}px`,
            perspectiveOrigin: '50% calc(100% - 2.5rem)',
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {/* The front box sets the size of the stage; the ring is built around it. */}
          <div ref={sizerRef} className="invisible mx-auto aspect-[3/4] w-[26%] md:w-44" aria-hidden="true" />
          <ul
            aria-live={paused ? 'polite' : 'off'}
            className="absolute inset-x-0 top-16 mx-auto aspect-[3/4] md:top-20 w-[26%] [transform-style:preserve-3d] md:w-44"
            style={{ transform: `translateZ(${-radius}px)` }}
          >
            {games.map((game, index) => {
              const offset = ringOffset(index, active, count)
              const isFront = offset === 0
              const angle = offset * STEP_DEG
              const previous = previousOffsets.current.get(game.id)
              const wrapped = previous !== undefined && Math.abs(previous - offset) > 1

              const onClick = (event: MouseEvent) => {
                // A side box first turns to the front; the front box opens the game.
                if (isFront) return
                event.preventDefault()
                setTurn((t) => t + offset)
              }

              return (
                <li
                  key={game.id}
                  aria-hidden={!isFront}
                  className={cn(
                    'absolute inset-0 origin-bottom [transform-style:preserve-3d] motion-reduce:transition-none',
                    !wrapped &&
                      'transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  )}
                  style={{
                    // The front box steps out of the ring toward the viewer, so it reads bigger.
                    transform: `rotateY(${angle}deg) translateZ(${radius + (isFront ? lift : 0)}px) scale(${isFront ? FRONT_SCALE : arcScale(Math.abs(offset))})`,
                    opacity: Math.abs(angle) > MAX_VISIBLE_DEG || !fitsOnStage(offset) ? 0 : 1,
                  }}
                >
                  <Link
                    to={`/games/${game.id}`}
                    tabIndex={isFront ? 0 : -1}
                    onClick={onClick}
                    draggable={false}
                    className="group block h-full rounded-sm [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {/* A closed case with real depth: the ring and case keep their own 3D transforms. */}
                    <div
                      className="relative h-full w-full [transform-style:preserve-3d] transition-transform duration-700 ease-out motion-reduce:transition-none"
                      style={
                        {
                          '--case-depth': `${Math.max(10, boxWidth * 0.09)}px`,
                          transform: 'rotateY(-16deg)',
                        } as CSSProperties
                      }
                    >
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
                        className={cn(
                          'absolute inset-0 overflow-hidden rounded-sm border border-brand bg-brand [backface-visibility:hidden] transition-shadow duration-700 motion-reduce:transition-none',
                          isFront ? 'shadow-2xl shadow-brand/35' : 'shadow-lg shadow-brand/20',
                        )}
                        style={{ transform: 'translateZ(calc(var(--case-depth) / 2))' }}
                      >
                        <img
                          src={game.coverUrl}
                          alt={`${game.title} box art`}
                          draggable={false}
                          className={cn(
                            'h-full w-full object-cover transition-[filter] duration-700 motion-reduce:transition-none',
                            !isFront && 'brightness-90 group-hover:brightness-100',
                          )}
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
                      </div>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {frontGame && (
        <div
          key={frontGame.id}
          className="flex animate-in flex-col items-center gap-1 text-center duration-500 fade-in slide-in-from-bottom-2"
        >
          <p className="text-sm text-muted-foreground">
            #{active + 1} best seller · {frontGame.publisher}
          </p>
          <Link
            to={`/games/${frontGame.id}`}
            className="font-heading text-2xl font-bold hover:underline md:text-3xl"
          >
            {frontGame.title}
          </Link>
          <p className="font-heading text-xl font-bold text-primary">
            €{finalPrice(frontGame.price, frontGame.discountPercent).toFixed(2)}
            {frontGame.discountPercent > 0 && (
              <span className="ml-2 text-sm font-medium text-muted-foreground line-through">
                €{frontGame.price.toFixed(2)}
              </span>
            )}
          </p>
        </div>
      )}
    </section>
  )
}
