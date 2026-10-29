import { createBrowserRouter } from 'react-router'

import { Home } from '@/app/routes/home'
import { Favorites } from '@/app/routes/favorites'
import { FavoritesNav } from '@/app/favorites-nav'
import { AdminGameEdit } from '@/app/routes/admin-game-edit'
import { AdminGameNew } from '@/app/routes/admin-game-new'
import { Cart } from '@/app/routes/cart'
import { Game } from '@/app/routes/game'
import { Games } from '@/app/routes/games'
import { NotFound } from '@/app/routes/not-found'
import { SignIn } from '@/app/routes/sign-in'
import { AppLayout } from '@/components/layout/app-layout'
import { CartButton } from '@/features/cart/components/cart-button'
import { UserMenu } from '@/features/users/components/user-menu'

export const router = createBrowserRouter([
  {
    element: (
      <AppLayout
        actions={
          <>
            <FavoritesNav />
            <CartButton />
            <UserMenu />
          </>
        }
      />
    ),
    children: [
      { path: '/', element: <Home /> },
      { path: '/games', element: <Games /> },
      { path: '/games/:id', element: <Game /> },
      { path: '/cart', element: <Cart /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/sign-in', element: <SignIn /> },
      { path: '/admin/games/new', element: <AdminGameNew /> },
      { path: '/admin/games/:id/edit', element: <AdminGameEdit /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
