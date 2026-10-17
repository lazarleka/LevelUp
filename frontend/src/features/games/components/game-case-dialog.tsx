import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { X } from 'lucide-react'
import { Dialog } from 'radix-ui'

import { cn } from '@/lib/utils'

import type { Game, GameSelection } from '../types'
import { GameInfo } from './game-info'

type GameCaseDialogProps = {
  /** The game to show; null keeps the dialog closed */
  game: Game | null
  /** Where the clicked box is on screen; the case flies out from there and back */
  originRect: DOMRect | null
  onClosed: () => void
  renderAction: (selection: GameSelection, game: Game) => ReactNode
  adminActions?: (game: Game) => ReactNode
}

/**
 * origin: closed case on top of the clicked box
 * center: closed case in its place on screen
 * open:   cover swung open, disc not in yet
 * spin:   disc in the tray, spinning
 */
type Phase = 'origin' | 'center' | 'open' | 'spin'

const FLY_MS = 450
const OPEN_MS = 650
const DISC_MS = 300
const SHEET_MS = 450
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'
/** Below this width the info leaves the case and slides up as a bottom sheet. */
const NARROW_PX = 768
/** Share of the screen height the sheet covers, collapsed and expanded. */
const SHEET_HEIGHT = 0.62
const SHEET_EXPANDED = 0.9
const SWIPE_PX = 30

function useViewport() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/** Size and position of one half of the case (the halves open side by side). */
function caseLayout(viewport: { width: number; height: number }, narrow: boolean) {
  if (narrow) {
    // A small case in the space above the sheet.
    const room = viewport.height * (1 - SHEET_HEIGHT)
    const width = Math.min(viewport.width * 0.44, (room - 32) * 0.72)
    const height = width / 0.72
    return { width, height, left: (viewport.width - width) / 2, top: (room - height) / 2 }
  }
  let height = Math.min(viewport.height * 0.82, 620)
  let width = height * 0.72
  if (width * 2 > viewport.width * 0.94) {
    width = viewport.width * 0.47
    height = width / 0.72
  }
  return { width, height, left: (viewport.width - width) / 2, top: (viewport.height - height) / 2 }
}

// A game opened like a real DVD case: it flies out of the clicked box, the cover swings open and
// the disc (with the box art as its label) spins in the tray. On wide screens the other half of the
// case shows the game info; on phones the info slides up from the bottom as a sheet.
export function GameCaseDialog({ game, originRect, onClosed, renderAction, adminActions }: GameCaseDialogProps) {
  const viewport = useViewport()
  const narrow = viewport.width < NARROW_PX
  const { width: w, height: h, left, top } = caseLayout(viewport, narrow)

  const [phase, setPhase] = useState<Phase>('origin')
  const [expanded, setExpanded] = useState(false)
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const timers = useRef<number[]>([])
  const swipeStart = useRef<number | null>(null)

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

  // Opening sequence: fly into place, swing the cover open, drop the disc in.
  useEffect(() => {
    if (!game) return
    clearTimers()
    setExpanded(false)
    if (reduceMotion) {
      setPhase('spin')
      return
    }
    setPhase('origin')
    // A short pause so the browser paints the case at the origin before it starts to fly.
    // (A timer rather than animation frames, which a background tab never runs.)
    later(30, () => setPhase('center'))
    later(30 + FLY_MS, () => setPhase('open'))
    later(30 + FLY_MS + OPEN_MS, () => setPhase('spin'))
    return clearTimers
  }, [game, reduceMotion])

  // Closing runs the same steps backwards, then unmounts.
  const requestClose = () => {
    clearTimers()
    if (reduceMotion) return onClosed()
    setExpanded(false)
    setPhase('open')
    later(DISC_MS, () => setPhase('center'))
    later(DISC_MS + OPEN_MS, () => setPhase(originRect ? 'origin' : 'center'))
    later(DISC_MS + OPEN_MS + FLY_MS, onClosed)
  }

  // Sheet handle: tap toggles, swipe up expands, swipe down collapses (or closes when collapsed).
  const onHandleDown = (event: PointerEvent) => {
    swipeStart.current = event.clientY
  }
  const onHandleUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return
    const delta = event.clientY - swipeStart.current
    swipeStart.current = null
    if (delta < -SWIPE_PX) setExpanded(true)
    else if (delta > SWIPE_PX) {
      if (expanded) setExpanded(false)
      else requestClose()
    } else setExpanded((value) => !value)
  }

  if (!game) return null

  const isOpen = phase === 'open' || phase === 'spin'
  const transition = (ms: number) => (reduceMotion ? 'none' : `transform ${ms}ms ${EASE}, opacity ${ms}ms ${EASE}`)

  // The closed case sits exactly over the clicked box, then flies into place.
  const flyTransform =
    phase === 'origin' && originRect
      ? `translate(${originRect.left - left}px, ${originRect.top - top}px) scale(${originRect.width / w}, ${originRect.height / h})`
      : 'none'

  // Open, the whole case shifts so both halves are centered; closed, only the base half is.
  const bookStyle: CSSProperties = {
    left: -w,
    top: 0,
    width: 2 * w,
    height: h,
    transform: isOpen ? `translateX(${w / 2}px)` : 'none',
    transition: transition(OPEN_MS),
  }
  const halfFirst: CSSProperties = { left: 0, top: 0, width: w, height: h }
  const halfSecond: CSSProperties = { left: w, top: 0, width: w, height: h }

  // The cover hinges on the spine: closed it lies flipped over the base half.
  const coverStyle: CSSProperties = {
    ...halfFirst,
    transformOrigin: 'right center',
    transform: isOpen ? 'none' : 'rotateY(180deg)',
    transition: transition(OPEN_MS),
  }

  const disc = Math.min(w, h) * 0.8
  const sheetHeight = viewport.height * (expanded ? SHEET_EXPANDED : SHEET_HEIGHT)

  const info = (
    <GameInfo key={game.id} game={game} titleAs="h2" renderAction={renderAction} adminActions={adminActions?.(game)} />
  )

  const closeButton = (
    <Dialog.Close
      aria-label="Close"
      className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <X className="size-5" />
    </Dialog.Close>
  )

  return (
    <Dialog.Root open onOpenChange={(open) => !open && requestClose()}>
      <Dialog.Portal>
        {/* The catalog stays visible behind, darkened and blurred. */}
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-brand/75 backdrop-blur-sm"
          style={{ opacity: phase === 'origin' ? 0 : 1, transition: transition(FLY_MS) }}
        />

        <Dialog.Content
          aria-describedby={undefined}
          onEscapeKeyDown={(event) => {
            event.preventDefault()
            requestClose()
          }}
          // The content covers the screen; a click on its empty area counts as outside the case.
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) requestClose()
          }}
          className="fixed inset-0 z-50 overflow-hidden outline-none"
        >
          <Dialog.Title className="sr-only">{game.title}</Dialog.Title>

          <div
            className="absolute [perspective:2200px]"
            style={{
              left,
              top,
              width: w,
              height: h,
              transformOrigin: '0 0',
              transform: flyTransform,
              transition: transition(FLY_MS),
            }}
          >
            <div className="absolute [transform-style:preserve-3d]" style={bookStyle}>
              {/* Base half: the game info on wide screens, the case insert on phones. */}
              <div
                className="theme-case-dark absolute overflow-hidden rounded-r-lg border-4 border-brand bg-card text-foreground shadow-2xl"
                style={halfSecond}
              >
                {narrow ? (
                  <img
                    src={game.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ opacity: isOpen ? 0.6 : 0, transition: transition(OPEN_MS) }}
                  />
                ) : (
                  <>
                    <div
                      className="h-full overflow-y-auto p-6 md:p-8"
                      style={{ opacity: isOpen ? 1 : 0, transition: transition(OPEN_MS) }}
                    >
                      {info}
                    </div>
                    {closeButton}
                  </>
                )}
              </div>

              {/* Cover half: box art outside, disc tray inside. */}
              <div className="absolute [transform-style:preserve-3d]" style={coverStyle}>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center rounded-l-lg border-4 border-brand bg-brand [backface-visibility:hidden]"
                >
                  {/* Tray ring molded into the plastic. */}
                  <div
                    className="absolute rounded-full border-2 border-secondary/40 bg-secondary/15"
                    style={{ width: disc * 1.06, height: disc * 1.06 }}
                  />
                  <div
                    className="relative rounded-full shadow-2xl"
                    style={{
                      width: disc,
                      height: disc,
                      opacity: phase === 'spin' ? 1 : 0,
                      transform: phase === 'spin' ? 'scale(1)' : 'scale(0.85)',
                      transition: transition(DISC_MS),
                    }}
                  >
                    <img
                      src={game.coverUrl}
                      alt=""
                      className={cn(
                        'h-full w-full rounded-full border-4 border-secondary/40 object-cover',
                        phase === 'spin' && !reduceMotion && 'animate-[spin_8s_linear_infinite]',
                      )}
                    />
                    {/* Light catching the disc; it stays still while the label turns underneath. */}
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-conic from-transparent via-card/30 to-transparent mix-blend-screen" />
                    {/* Center hole and clamp ring. */}
                    <div className="absolute top-1/2 left-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-secondary/50 bg-brand" />
                    <div className="absolute top-1/2 left-1/2 size-[8%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/30" />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden rounded-lg border-4 border-brand bg-brand shadow-2xl [backface-visibility:hidden]"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Phones: the info slides up from the bottom once the case is open. */}
          {narrow && (
            <section
              aria-label={`${game.title} details`}
              className="theme-case-dark absolute inset-x-0 bottom-0 flex flex-col rounded-t-2xl border-t border-border bg-card text-foreground shadow-2xl"
              style={{
                height: sheetHeight,
                transform: isOpen ? 'none' : 'translateY(100%)',
                transition: reduceMotion ? 'none' : `transform ${SHEET_MS}ms ${EASE}, height ${SHEET_MS}ms ${EASE}`,
              }}
            >
              <button
                type="button"
                aria-label={expanded ? 'Show less' : 'Show more'}
                aria-expanded={expanded}
                onPointerDown={onHandleDown}
                onPointerUp={onHandleUp}
                onPointerCancel={() => (swipeStart.current = null)}
                className="flex h-8 w-full shrink-0 touch-none items-center justify-center focus-visible:outline-none"
              >
                <span className="h-1.5 w-12 rounded-full bg-muted-foreground/60" />
              </button>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">{info}</div>
              {closeButton}
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
