import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { useGame, useUpdateGame } from '../api/use-games'
import type { Game } from '../types'
import { GameForm } from './game-form'

type EditGameFormProps = {
  gameId: number
  onSaved: (game: Game) => void
  cancel?: ReactNode
}

export function EditGameForm({ gameId, onSaved, cancel }: EditGameFormProps) {
  const { data: game, isLoading, error } = useGame(gameId)
  const updateGame = useUpdateGame()

  if (isLoading) return <Skeleton className="h-96 max-w-2xl" />
  if (error || !game) return <p className="text-destructive">This game could not be loaded.</p>

  const { id: _id, rating: _rating, soldCount: _soldCount, ...values } = game

  return (
    <div className="flex flex-col gap-4">
      <GameForm
        defaultValues={values}
        submitLabel="Save changes"
        submitting={updateGame.isPending}
        onSubmit={(changes) => updateGame.mutate({ id: gameId, changes }, { onSuccess: onSaved })}
        cancel={cancel}
      />
      {updateGame.error && <p className="text-sm text-destructive">Changes could not be saved. Please try again.</p>}
    </div>
  )
}
