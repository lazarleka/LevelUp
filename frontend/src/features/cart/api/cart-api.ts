import { NotFoundError, delay } from '@/lib/mock-db'

import { MAX_QUANTITY } from '../types'
import type { CartItem, NewCartItem } from '../types'

// The signed-in user's cart. Starts with one item so the cart page has something to show.
let items: CartItem[] = [
  {
    id: 1,
    gameId: 7,
    title: 'Hollow Knight: Silksong',
    coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/05/Silksong.jpg',
    platform: 'switch',
    edition: 'standard',
    unitPrice: 19.99,
    quantity: 1,
  },
]

const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(1, quantity))

export const cartApi = {
  list: () => delay(items),

  get: (id: number) => {
    const item = items.find((i) => i.id === id)
    if (!item) return Promise.reject(new NotFoundError('Cart item', id))
    return delay(item)
  },

  // Adding the same game, platform and edition again increases the quantity instead of a new row.
  create: (input: NewCartItem) => {
    const existing = items.find(
      (i) => i.gameId === input.gameId && i.platform === input.platform && i.edition === input.edition,
    )
    if (existing) return cartApi.update(existing.id, { quantity: existing.quantity + input.quantity })

    const item: CartItem = { ...input, id: Date.now(), quantity: clampQuantity(input.quantity) }
    items = [...items, item]
    return delay(item)
  },

  update: (id: number, changes: Pick<CartItem, 'quantity'>) => {
    items = items.map((i) => (i.id === id ? { ...i, quantity: clampQuantity(changes.quantity) } : i))
    return cartApi.get(id)
  },

  remove: (id: number) => {
    items = items.filter((i) => i.id !== id)
    return delay(undefined)
  },
}
