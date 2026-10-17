import { useState } from 'react'

import { RequireAuth } from '@/app/require-auth'
import { useGameActions } from '@/app/use-game-actions'
import { Button } from '@/components/ui/button'
import { CartView } from '@/features/cart/components/cart-view'
import { useGame } from '@/features/games/api/use-games'
import { GameCaseDialog } from '@/features/games/components/game-case-dialog'

type OpenedGame = {
  gameId: number
  origin: DOMRect
}

export function Cart() {
  const [opened, setOpened] = useState<OpenedGame | null>(null)

  return (
    <RequireAuth>
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">Your cart</h1>
        <CartView onOpenGame={(gameId, origin) => setOpened({ gameId, origin })} />
        {opened && <CartGamePreview key={opened.gameId} opened={opened} onClosed={() => setOpened(null)} />}
      </section>
    </RequireAuth>
  )
}

// The route connects cart items to the games feature without cross-feature imports.
function CartGamePreview({ opened, onClosed }: { opened: OpenedGame; onClosed: () => void }) {
  const { data: game, isLoading, error, refetch } = useGame(opened.gameId)
  const { renderAction, adminActions } = useGameActions()

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <p role="status" className="text-sm text-muted-foreground">
          Loading game…
        </p>
        <Button variant="outline" size="sm" onClick={onClosed}>
          Cancel
        </Button>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <p role="alert" className="text-sm text-destructive">
          Game details could not be loaded.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
        <Button variant="ghost" size="sm" onClick={onClosed}>
          Close
        </Button>
      </div>
    )
  }

  return (
    <GameCaseDialog
      game={game}
      originRect={opened.origin}
      onClosed={onClosed}
      renderAction={renderAction}
      adminActions={adminActions}
    />
  )
}
