import { RequireAuth } from '@/app/require-auth'
import { CartView } from '@/features/cart/components/cart-view'

export function Cart() {
  return (
    <RequireAuth>
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold md:text-4xl">Your cart</h1>
        <CartView />
      </section>
    </RequireAuth>
  )
}
