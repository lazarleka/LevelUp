import { createBrowserRouter } from 'react-router'

import { Home } from '@/app/routes/home'
import { Games } from '@/app/routes/games'
import { NotFound } from '@/app/routes/not-found'
import { AppLayout } from '@/components/layout/app-layout'
import { CartButton } from '@/features/cart/components/cart-button'

export const router = createBrowserRouter([
  {
    element: <AppLayout actions={<CartButton />} />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/games', element: <Games /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
