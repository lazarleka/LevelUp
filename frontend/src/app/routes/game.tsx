import { Pencil } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button'
import { GameDetail } from '@/features/games/components/game-detail'
import { isComingSoon } from '@/features/games/types'
import { useCurrentUser } from '@/features/users/api/use-users'

export function Game() {
  const { id } = useParams()
  const gameId = Number(id)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()

  return (
    <GameDetail
      gameId={gameId}
      renderAction={({ game, platform, edition, unitPrice }) => (
        <AddToCartButton
          item={{ gameId: game.id, title: game.title, coverUrl: game.coverUrl, platform, edition, unitPrice, quantity: 1 }}
          signedIn={Boolean(user)}
          onSignInRequired={() => navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`)}
          disabled={!game.inStock}
          label={isComingSoon(game) ? 'Pre-order' : 'Add to cart'}
        />
      )}
      adminActions={
        user?.role === 'admin' && (
          <Button asChild variant="outline" className="self-start">
            <Link to={`/admin/games/${gameId}/edit`}>
              <Pencil />
              Edit game
            </Link>
          </Button>
        )
      }
    />
  )
}
