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
 * center: closed case in its place on screen
 * open:   cover swinging open, disc already in its tray
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
const CASE_DEPTH = 24

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
function caseLayout(viewport: { width: number; height: number }, narrow: boolean, infoHeight: number) {
  if (narrow) {
    // A small case in the space above the sheet.
    const room = Math.max(64, viewport.height - infoHeight)
    const width = Math.min(viewport.width * 0.42, Math.max(32, room - 32) * 0.72)
    const height = width / 0.72
    return { width, height, left: (viewport.width - width) / 2, top: (room - height) / 2 }
  }
  const height = Math.min(viewport.height * 0.9, 780)
  const width = Math.min(height * 0.8, viewport.width * 0.46)
  return { width, height, left: (viewport.width - width) / 2, top: (viewport.height - height) / 2 }
}

// A game opened like a real DVD case: it flies out of the clicked box, the cover swings open and
// the disc (with the box art as its label) spins in the tray. On wide screens the other half of the
// case shows the game info; on phones the info slides up from the bottom as a sheet.
export function GameCaseDialog({
  game,
  originRect,
  onClosed,
  renderAction,
  adminActions,
}: GameCaseDialogProps) {
  const viewport = useViewport()
  const narrow = viewport.width < NARROW_PX
  const [infoHeight, setInfoHeight] = useState(480)
  const infoRef = useRef<HTMLDivElement>(null)
  const { width: w, height: h, left, top } = caseLayout(viewport, narrow, infoHeight)

  const [phase, setPhase] = useState<Phase>('origin')
  const [reduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }
  const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))

  // The disc is ready from the first frame; start spinning after the cover opens.
  useEffect(() => {
    if (!game) return
    clearTimers()
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

  // Reserve only the space the full mobile information actually needs.
  useEffect(() => {
    const node = infoRef.current
    if (!node || !narrow || !game) return
    const observer = new ResizeObserver(() => setInfoHeight(node.getBoundingClientRect().height))
    observer.observe(node)
    return () => observer.disconnect()
  }, [game, narrow])

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

  const isOpen = phase === 'open' || phase === 'spin'
  const transition = (ms: number) =>
    reduceMotion ? 'none' : `transform ${ms}ms ${EASE}, opacity ${ms}ms ${EASE}`

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
    transformOrigin: '75% 50%',
    transform: isOpen
      ? `translateX(${w / 2}px) rotateX(3deg) rotateY(-3deg)`
      : `translateX(0px) rotateX(6deg) rotateY(${phase === 'origin' ? -16 : -24}deg)`,
    transition: transition(OPEN_MS),
  }
  const halfFirst: CSSProperties = { left: 0, top: 0, width: w, height: h }
  const halfSecond: CSSProperties = { left: w, top: 0, width: w, height: h }

  // The cover hinges on the spine: closed it lies flipped over the base half.
  const coverStyle: CSSProperties = {
    ...halfFirst,
    transformOrigin: 'right center',
    transform: isOpen ? 'rotateY(-7deg)' : 'rotateY(180deg)',
    transition: transition(OPEN_MS),
  }

  const disc = Math.min(w, h) * 0.8

  const info = (
    <GameInfo
      key={game.id}
      game={game}
      titleAs="h2"
      compact
      renderAction={renderAction}
      adminActions={adminActions?.(game)}
    />
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
          className="theme-case-dark fixed inset-0 z-50 overflow-hidden outline-none"
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
              <CaseShell style={halfSecond}>
                <div className="absolute inset-0 overflow-hidden rounded-lg border-4 border-secondary/30 bg-card text-foreground shadow-inner">
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
                        className="flex h-full flex-col justify-center p-5 md:p-6 lg:p-8"
                        style={{ opacity: isOpen ? 1 : 0, transition: transition(OPEN_MS) }}
                      >
                        {info}
                      </div>
                      {closeButton}
                    </>
                  )}
                </div>
              </CaseShell>

              {/* A molded spine with three raised hinge barrels joins the two halves. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-1 w-3 rounded-full border-x border-secondary/30 bg-linear-to-r from-brand via-secondary/40 to-brand shadow-inner"
                style={{ left: w - 6, transform: 'translateZ(14px)' }}
              >
                {[12, 50, 88].map((position) => (
                  <span
                    key={position}
                    className="absolute left-0 h-[8%] w-full rounded-sm border-y border-secondary/40 bg-linear-to-r from-brand via-secondary/50 to-brand shadow-lg"
                    style={{ top: `${position - 4}%` }}
                  />
                ))}
              </div>

              {/* Cover half: box art outside, disc tray inside. */}
              <div className="absolute [transform-style:preserve-3d]" style={coverStyle}>
                <CaseShell style={{ position: 'absolute', inset: 0 }}>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border-4 border-secondary/30 bg-background [backface-visibility:hidden]"
                  >
                    <div className="absolute inset-3 rounded-lg border border-secondary/20 bg-linear-to-br from-secondary/15 via-brand to-brand shadow-inner" />
                    <div className="absolute inset-x-6 top-6 flex items-center justify-between font-heading text-[clamp(7px,1vw,12px)] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>LevelUp</span>
                      <span>Game disc</span>
                    </div>
                    {/* Tray ring molded into the plastic. */}
                    <div
                      className="absolute rounded-full border-4 border-secondary/30 bg-brand shadow-inner ring-1 ring-secondary/10"
                      style={{
                        width: disc * 1.06,
                        height: disc * 1.06,
                      }}
                    />
                    {[0, 90, 180, 270].map((angle) => (
                      <span
                        key={angle}
                        className="absolute h-3 w-6 rounded-sm border border-secondary/40 bg-linear-to-b from-secondary/30 to-brand shadow-lg"
                        style={{ transform: `rotate(${angle}deg) translateY(${-disc * 0.55}px)` }}
                      />
                    ))}
                    <div
                      className="relative rounded-full shadow-2xl"
                      style={{
                        width: disc,
                        height: disc,
                      }}
                    >
                      <img
                        src={game.coverUrl}
                        alt=""
                        loading="eager"
                        decoding="sync"
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
                </CaseShell>

                <div
                  aria-hidden="true"
                  className="absolute inset-0 overflow-hidden rounded-lg border-4 border-secondary/50 bg-brand shadow-2xl shadow-brand/60 [backface-visibility:hidden]"
                  // Place the printed art outside the shell's back face so plastic cannot hide it.
                  style={{ transform: `rotateY(180deg) translateZ(${CASE_DEPTH + 1}px)` }}
                >
                  <img src={game.coverUrl} alt="" className="h-full w-full object-cover" />
                  <span className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-inset ring-brand-foreground/25" />
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-[5%] border-r border-brand/40 bg-linear-to-r from-brand-foreground/40 via-brand/25 to-transparent" />
                  <span className="pointer-events-none absolute inset-0 bg-linear-to-tr from-brand/20 via-transparent to-brand-foreground/20" />
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-brand-foreground/30" />
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
                transform: isOpen ? 'none' : 'translateY(100%)',
                transition: reduceMotion ? 'none' : `transform ${SHEET_MS}ms ${EASE}`,
              }}
            >
              <div ref={infoRef} className="px-4 py-5">
                {info}
              </div>
              {closeButton}
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/** Solid plastic shell: a raised front, a back and four perpendicular edge faces. */
function CaseShell({ children, style }: { children: ReactNode; style: CSSProperties }) {
  const depth = CASE_DEPTH
  return (
    <div className="absolute rounded-lg [transform-style:preserve-3d]" style={style}>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-lg border border-secondary/40 bg-brand shadow-2xl"
        style={{ transform: `translateZ(${-depth}px)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 border border-secondary/40 bg-linear-to-r from-brand via-secondary/60 to-brand"
        style={{ width: depth, transformOrigin: 'left center', transform: 'rotateY(90deg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 border border-secondary/40 bg-linear-to-r from-brand via-secondary/50 to-brand"
        style={{ width: depth, transformOrigin: 'right center', transform: 'rotateY(-90deg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 border border-secondary/30 bg-secondary/40"
        style={{ height: depth, transformOrigin: 'center top', transform: 'rotateX(-90deg)' }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 border border-secondary/30 bg-brand"
        style={{ height: depth, transformOrigin: 'center bottom', transform: 'rotateX(90deg)' }}
      />
      <div
        className="absolute inset-0 rounded-lg [transform-style:preserve-3d]"
        style={{ transform: 'translateZ(1px)' }}
      >
        {children}
      </div>
    </div>
  )
}
