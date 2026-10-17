import { Link, useNavigate, useParams } from 'react-router'

import { RequireAuth } from '@/app/require-auth'
import { Button } from '@/components/ui/button'
import { EditGameForm } from '@/features/games/components/edit-game-form'

export function AdminGameEdit() {
  const { id } = useParams()
  const gameId = Number(id)
  const navigate = useNavigate()

  return (
    <RequireAuth role="admin">
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">Edit game</h1>
        <EditGameForm
          gameId={gameId}
          onSaved={(game) => navigate(`/games/${game.id}`)}
          cancel={
            <Button asChild variant="ghost" size="lg">
              <Link to={`/games/${gameId}`}>Cancel</Link>
            </Button>
          }
        />
      </section>
    </RequireAuth>
  )
}
