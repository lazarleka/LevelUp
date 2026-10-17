export const platforms = ['ps5', 'xbox-series', 'switch', 'pc'] as const
export type Platform = (typeof platforms)[number]

export const genres = ['action', 'adventure', 'rpg', 'sports', 'racing', 'shooter', 'strategy', 'family'] as const
export type Genre = (typeof genres)[number]

export const pegiRatings = [3, 7, 12, 16, 18] as const
export type Pegi = (typeof pegiRatings)[number]

export const platformLabels: Record<Platform, string> = {
  ps5: 'PS5',
  'xbox-series': 'Xbox Series',
  switch: 'Switch',
  pc: 'PC',
}

export const genreLabels: Record<Genre, string> = {
  action: 'Action',
  adventure: 'Adventure',
  rpg: 'RPG',
  sports: 'Sports',
  racing: 'Racing',
  shooter: 'Shooter',
  strategy: 'Strategy',
  family: 'Family',
}

export type Game = {
  id: number
  title: string
  description: string
  genre: Genre
  platforms: Platform[]
  publisher: string
  pegi: Pegi
  /** Standard edition price in EUR, before discount */
  price: number
  /** Deluxe edition price in EUR, before discount; null when there is no Deluxe edition */
  deluxePrice: number | null
  /** 0–90; above 0 means the game is on sale */
  discountPercent: number
  /** ISO date; a future date means "coming soon" (pre-order) */
  releaseDate: string
  /** Portrait box art, 3:4 */
  coverUrl: string
  /** Average customer rating, 0–5 */
  rating: number
  soldCount: number
  inStock: boolean
}

export type NewGame = Omit<Game, 'id' | 'rating' | 'soldCount'>

export type GameSort = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'best-selling'

export const sortLabels: Record<GameSort, string> = {
  newest: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Best rated',
  'best-selling': 'Best selling',
}

export type GameFilters = {
  search?: string
  platform?: Platform
  genre?: Genre
  minPrice?: number
  maxPrice?: number
  /** Maximum PEGI age, e.g. 12 shows games rated 3, 7 and 12 */
  maxPegi?: Pegi
  onSale?: boolean
  comingSoon?: boolean
  sort?: GameSort
}

/** Price after the discount, rounded to cents. */
export function finalPrice(price: number, discountPercent: number) {
  return Math.round(price * (100 - discountPercent)) / 100
}

export function isComingSoon(game: Game, today = new Date().toISOString().slice(0, 10)) {
  return game.releaseDate > today
}
