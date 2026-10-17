import { Link, useNavigate } from 'react-router'

import { RequireAuth } from '@/app/require-auth'
import { Button } from '@/components/ui/button'
import { CreateGameForm } from '@/features/games/components/create-game-form'

export function AdminGameNew() {
  const navigate = useNavigate()

  return (
    <RequireAuth role="admin">
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">Add a game</h1>
        <CreateGameForm
          onCreated={(game) => navigate(`/games/${game.id}`)}
          cancel={
            <Button asChild variant="ghost" size="lg">
              <Link to="/games">Cancel</Link>
            </Button>
          }
        />
      </section>
    </RequireAuth>
  )
}
