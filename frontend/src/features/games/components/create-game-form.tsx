import type { ReactNode } from 'react'

import { useCreateGame } from '../api/use-games'
import type { Game } from '../types'
import { GameForm } from './game-form'

type CreateGameFormProps = {
  onCreated: (game: Game) => void
  cancel?: ReactNode
}

export function CreateGameForm({ onCreated, cancel }: CreateGameFormProps) {
  const createGame = useCreateGame()

  return (
    <div className="flex flex-col gap-4">
      <GameForm
        submitLabel="Add game"
        submitting={createGame.isPending}
        onSubmit={(values) => createGame.mutate(values, { onSuccess: onCreated })}
        cancel={cancel}
      />
      {createGame.error && <p className="text-sm text-destructive">The game could not be saved. Please try again.</p>}
    </div>
  )
}
