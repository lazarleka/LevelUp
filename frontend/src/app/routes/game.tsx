import { useParams } from 'react-router'

import { useGameActions } from '@/app/use-game-actions'
import { GameDetail } from '@/features/games/components/game-detail'

// Full game page, for links from the cart and direct visits. The shop itself opens games in a case dialog.
export function Game() {
  const { id } = useParams()
  const { renderAction, adminActions } = useGameActions()

  return <GameDetail gameId={Number(id)} renderAction={renderAction} adminActions={adminActions} />
}
