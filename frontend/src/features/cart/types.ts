// The cart keeps its own copy of the game data it shows (title, cover, price), so it does not
// import from the games feature. `gameId` is the link to the game.
export type CartPlatform = 'ps5' | 'xbox-series' | 'switch' | 'pc'
export type Edition = 'standard' | 'deluxe'

export type CartItem = {
  id: number
  gameId: number
  title: string
  coverUrl: string
  platform: CartPlatform
  edition: Edition
  /** Price per piece in EUR at the moment it was added, discount included */
  unitPrice: number
  /** 1–10 */
  quantity: number
}

export type NewCartItem = Omit<CartItem, 'id'>

export const MAX_QUANTITY = 10

export function cartTotal(items: CartItem[]) {
  return Math.round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity * 100, 0)) / 100
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}
