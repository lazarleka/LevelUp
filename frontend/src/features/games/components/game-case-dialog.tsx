import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
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
 * center: closed case in the middle of the screen
 * open:   cover swung open, disc not in yet
 * spin:   disc in the tray, spinning
 */
type Phase = 'origin' | 'center' | 'open' | 'spin'

const FLY_MS = 450
const OPEN_MS = 650
const DISC_MS = 300
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function useViewport() {
  const [size, setSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return size
}

/** Size of one half of the case: side by side on wide screens, stacked on phones. */
function caseSize(viewport: { width: number; height: number }, wide: boolean) {
  if (wide) {
    let height = Math.min(viewport.height * 0.82, 620)
    let width = height * 0.72
    if (width * 2 > viewport.width * 0.94) {
      width = viewport.width * 0.47
      height = width / 0.72
    }
    return { width, height }
  }
  const width = Math.min(viewport.width * 0.9, 380)
  const height = Math.min(viewport.height * 0.45, width * 1.05)
  return { width, height }
}

// A game opened like a real DVD case: it flies out of the clicked box, the cover swings open, the
// disc (with the box art as its label) spins in the tray, and the other half shows the game info.
export function GameCaseDialog({
  game,
  originRect,
  onClosed,
  renderAction,
  adminActions,
}: GameCaseDialogProps) {
  const viewport = useViewport()
  const wide = viewport.width >= 768
  const { width: w, height: h } = caseSize(viewport, wide)

  const [phase, setPhase] = useState<Phase>('origin')
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

  // Opening sequence: fly to the center, swing the cover open, drop the disc in.
  useEffect(() => {
    if (!game) return
    clearTimers()
    if (reduceMotion) {
      setPhase('spin')
      return
    }
    setPhase('origin')
    // Two frames so the browser paints the case at the origin before it starts to fly.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase('center')
        later(FLY_MS, () => setPhase('open'))
        later(FLY_MS + OPEN_MS, () => setPhase('spin'))
      }),
    )
    return () => {
      cancelAnimationFrame(frame)
      clearTimers()
    }
  }, [game, reduceMotion])

  // Closing runs the same steps backwards, then unmounts.
  const requestClose = () => {
    clearTimers()
    if (reduceMotion) return onClosed()
    setPhase('open')
    later(DISC_MS, () => setPhase('center'))
    later(DISC_MS + OPEN_MS, () => setPhase(originRect ? 'origin' : 'center'))
    later(DISC_MS + OPEN_MS + FLY_MS, onClosed)
  }

  if (!game) return null

  const left = (viewport.width - w) / 2
  const top = (viewport.height - h) / 2
  const isOpen = phase === 'open' || phase === 'spin'
  const transition = (ms: number) => (reduceMotion ? 'none' : `transform ${ms}ms ${EASE}, opacity ${ms}ms ${EASE}`)

  // The closed case sits exactly over the clicked box, then flies to the center.
  const flyTransform =
    phase === 'origin' && originRect
      ? `translate(${originRect.left - left}px, ${originRect.top - top}px) scale(${originRect.width / w}, ${originRect.height / h})`
      : 'none'

  // Open, the whole case shifts so both halves are centered; closed, only the base half is.
  const bookStyle: CSSProperties = wide
    ? { left: -w, top: 0, width: 2 * w, height: h, transform: isOpen ? `translateX(${w / 2}px)` : 'none' }
    : { left: 0, top: -h, width: w, height: 2 * h, transform: isOpen ? `translateY(${h / 2}px)` : 'none' }

  const halfFirst: CSSProperties = { left: 0, top: 0, width: w, height: h }
  const halfSecond: CSSProperties = wide ? { left: w, top: 0, width: w, height: h } : { left: 0, top: h, width: w, height: h }

  // The cover hinges on the spine: closed it lies flipped over the base half.
  const coverStyle: CSSProperties = {
    ...halfFirst,
    transformOrigin: wide ? 'right center' : 'center bottom',
    transform: isOpen ? 'none' : wide ? 'rotateY(180deg)' : 'rotateX(-180deg)',
    transition: transition(OPEN_MS),
  }
  const outsideFace: CSSProperties = { transform: wide ? 'rotateY(180deg)' : 'rotateX(180deg)' }

  const disc = Math.min(w, h) * 0.8

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
          className="fixed z-50 outline-none [perspective:2200px]"
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
          <Dialog.Title className="sr-only">{game.title}</Dialog.Title>

          <div className="absolute [transform-style:preserve-3d]" style={{ ...bookStyle, transition: transition(OPEN_MS) }}>
            {/* Base half: the game info, revealed when the cover swings open. */}
            <div
              className={cn(
                'theme-case-dark absolute overflow-hidden border-4 border-brand bg-card text-foreground shadow-2xl',
                wide ? 'rounded-r-lg' : 'rounded-b-lg',
              )}
              style={halfSecond}
            >
              <div
                className="h-full overflow-y-auto p-6 md:p-8"
                style={{ opacity: isOpen ? 1 : 0, transition: transition(OPEN_MS) }}
              >
                <GameInfo
                  key={game.id}
                  game={game}
                  titleAs="h2"
                  renderAction={renderAction}
                  adminActions={adminActions?.(game)}
                />
              </div>
              <Dialog.Close
                aria-label="Close"
                className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>

            {/* Cover half: box art outside, disc tray inside. */}
            <div className="absolute [transform-style:preserve-3d]" style={coverStyle}>
              <div
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 flex items-center justify-center border-4 border-brand bg-brand [backface-visibility:hidden]',
                  wide ? 'rounded-l-lg' : 'rounded-t-lg',
                )}
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
                style={outsideFace}
              >
                <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
