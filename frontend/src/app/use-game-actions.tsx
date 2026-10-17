import { Pencil } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button'
import type { Game, GameSelection } from '@/features/games/types'
import { isComingSoon } from '@/features/games/types'
import { useCurrentUser } from '@/features/users/api/use-users'

// Connects the games feature to cart and users: the buy button and the admin edit link,
// shared by the game page and the game case dialog.
export function useGameActions() {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()

  const renderAction = ({ game, platform, edition, unitPrice }: GameSelection) => (
    <AddToCartButton
      item={{ gameId: game.id, title: game.title, coverUrl: game.coverUrl, platform, edition, unitPrice, quantity: 1 }}
      signedIn={Boolean(user)}
      onSignInRequired={() =>
        navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`)
      }
      disabled={!game.inStock}
      label={isComingSoon(game) ? 'Pre-order' : 'Add to cart'}
    />
  )

  const adminActions = (game: Game) =>
    user?.role === 'admin' && (
      <Button asChild variant="outline" className="self-start">
        <Link to={`/admin/games/${game.id}/edit`}>
          <Pencil />
          Edit game
        </Link>
      </Button>
    )

  return { renderAction, adminActions }
}
