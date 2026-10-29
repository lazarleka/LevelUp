import { Heart } from 'lucide-react'
import { NavLink } from 'react-router'

import { useFavorites } from '@/features/favorites/api/use-favorites'
import { useCurrentUser } from '@/features/users/api/use-users'

export function FavoritesNav() {
  const { data: user } = useCurrentUser()
  const { data: favorites } = useFavorites(user?.id ?? null)
  const count = favorites?.length ?? 0
  return (
    <NavLink
      to="/favorites"
      aria-label={`Favorites${count > 0 ? ` (${count})` : ''}`}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-brand-foreground/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:bg-brand-foreground/15"
    >
      <Heart className="size-5" />
      {count > 0 && (
        <span className="absolute top-0 right-0 flex min-w-5 items-center justify-center rounded-full bg-brand-foreground px-1 text-xs font-semibold text-brand">
          {count}
        </span>
      )}
    </NavLink>
  )
}
