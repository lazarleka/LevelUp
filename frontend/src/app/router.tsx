import { createBrowserRouter } from 'react-router'

import { Home } from '@/app/routes/home'
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
      { path: '/sign-in', element: <SignIn /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
