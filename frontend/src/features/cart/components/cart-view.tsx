import { useState } from 'react'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCart, useRemoveCartItem, useUpdateCartItem } from '../api/use-cart'
import { MAX_QUANTITY, cartCount, cartTotal } from '../types'
import type { CartItem } from '../types'

const formatPrice = (value: number) => `€${value.toFixed(2)}`

const platformLabels: Record<CartItem['platform'], string> = {
  ps5: 'PS5',
  'xbox-series': 'Xbox Series',
  switch: 'Switch',
  pc: 'PC',
}

// The full cart: one row per item, quantity stepper, remove, total and checkout.
export function CartView() {
  const { data: items, isLoading, error, refetch } = useCart()
  const [checkoutNote, setCheckoutNote] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-destructive">Your cart failed to load.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <ShoppingCart className="size-12 text-muted-foreground" />
        <p className="text-lg font-semibold">Your cart is empty</p>
        <Button asChild>
          <Link to="/games">Browse games</Link>
        </Button>
      </div>
    )
  }

  const count = cartCount(items)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <ul className="flex flex-col divide-y border-y">
        {items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}
      </ul>

      {/* Sticks to the bottom of the screen on phones, a side panel on desktop. */}
      <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t bg-background px-4 py-4 md:-mx-6 md:px-6 lg:top-8 lg:mx-0 lg:rounded-lg lg:border lg:p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">
            Total ({count} {count === 1 ? 'item' : 'items'})
          </span>
          <span className="font-heading text-3xl font-bold">{formatPrice(cartTotal(items))}</span>
        </div>
        <Button size="lg" className="h-12 w-full text-base" onClick={() => setCheckoutNote(true)}>
          Checkout
        </Button>
        {checkoutNote && (
          <p role="status" className="text-sm text-muted-foreground">
            Checkout is coming soon. Your cart is saved.
          </p>
        )}
      </div>
    </div>
  )
}

type CartRowProps = {
  item: CartItem
}

function CartRow({ item }: CartRowProps) {
  const update = useUpdateCartItem()
  const remove = useRemoveCartItem()
  const setQuantity = (quantity: number) => update.mutate({ id: item.id, quantity })

  return (
    <li className="flex gap-4 py-4">
      <Link to={`/games/${item.gameId}`} className="shrink-0">
        <img src={item.coverUrl} alt={`${item.title} box art`} className="aspect-[3/4] w-20 rounded-sm border object-cover md:w-24" />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/games/${item.gameId}`} className="font-semibold hover:underline">
              {item.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              {platformLabels[item.platform]} · {item.edition === 'deluxe' ? 'Deluxe' : 'Standard'} edition
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => remove.mutate(item.id)}
            disabled={remove.isPending}
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center rounded-md border" role="group" aria-label={`Quantity of ${item.title}`}>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1 || update.isPending}
              onClick={() => setQuantity(item.quantity - 1)}
              className="flex size-9 items-center justify-center hover:bg-accent disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={item.quantity >= MAX_QUANTITY || update.isPending}
              onClick={() => setQuantity(item.quantity + 1)}
              className="flex size-9 items-center justify-center hover:bg-accent disabled:opacity-40"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <div className="text-right">
            <p className="font-heading text-xl font-bold">{formatPrice(item.unitPrice * item.quantity)}</p>
            {item.quantity > 1 && <p className="text-xs text-muted-foreground">{formatPrice(item.unitPrice)} each</p>}
          </div>
        </div>
      </div>
    </li>
  )
}
