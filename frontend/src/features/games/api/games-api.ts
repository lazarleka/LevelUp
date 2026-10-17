import { NotFoundError, delay } from '@/lib/mock-db'

import { finalPrice, isComingSoon } from '../types'
import type { Game, GameFilters, GameSort, NewGame } from '../types'

// Official box art, linked from the game's English Wikipedia article (non-free, used there under
// fair use). Fine for a workshop demo; a real shop would use art licensed from the publishers.
const cover = (path: string) => `https://upload.wikimedia.org/wikipedia/en/${path}`

let games: Game[] = [
  {
    id: 1,
    title: 'Grand Theft Auto VI',
    description: 'Return to the state of Leonida in the biggest open world Rockstar has built, following Lucia and Jason.',
    genre: 'action',
    platforms: ['ps5', 'xbox-series'],
    publisher: 'Rockstar Games',
    pegi: 18,
    price: 79.99,
    deluxePrice: 99.99,
    discountPercent: 0,
    releaseDate: '2026-11-19',
    coverUrl: cover('4/46/Grand_Theft_Auto_VI.png'),
    rating: 0,
    soldCount: 0,
    inStock: true,
  },
  {
    id: 2,
    title: 'Ghost of Yōtei',
    description: 'A lone mercenary hunts the outlaws who took everything from her, across the wilds of 1600s Ezo.',
    genre: 'action',
    platforms: ['ps5'],
    publisher: 'Sony Interactive Entertainment',
    pegi: 18,
    price: 69.99,
    deluxePrice: 79.99,
    discountPercent: 20,
    releaseDate: '2025-10-02',
    coverUrl: cover('1/18/Ghost_of_Y%C5%8Dtei_cover_art.png'),
    rating: 4.7,
    soldCount: 1840,
    inStock: true,
  },
  {
    id: 3,
    title: 'EA Sports FC 26',
    description: 'The newest season of club football with updated squads, Career Mode and Ultimate Team.',
    genre: 'sports',
    platforms: ['ps5', 'xbox-series', 'switch', 'pc'],
    publisher: 'Electronic Arts',
    pegi: 3,
    price: 69.99,
    deluxePrice: 99.99,
    discountPercent: 35,
    releaseDate: '2025-09-26',
    coverUrl: cover('2/2f/FC_26_Cover.png'),
    rating: 3.9,
    soldCount: 3120,
    inStock: true,
  },
  {
    id: 4,
    title: 'Mario Kart World',
    description: 'Race across one connected world with up to 24 drivers, from deserts to snowy peaks.',
    genre: 'racing',
    platforms: ['switch'],
    publisher: 'Nintendo',
    pegi: 3,
    price: 79.99,
    deluxePrice: null,
    discountPercent: 0,
    releaseDate: '2025-06-05',
    coverUrl: cover('6/65/Mario_Kart_World_Cover_Artwork.png'),
    rating: 4.6,
    soldCount: 2760,
    inStock: true,
  },
  {
    id: 5,
    title: 'Battlefield 6',
    description: 'All-out warfare with destructible maps, four classes and 64-player Conquest.',
    genre: 'shooter',
    platforms: ['ps5', 'xbox-series', 'pc'],
    publisher: 'Electronic Arts',
    pegi: 18,
    price: 69.99,
    deluxePrice: 99.99,
    discountPercent: 15,
    releaseDate: '2025-10-10',
    coverUrl: cover('8/87/Battlefield_6_cover_art.jpg'),
    rating: 4.3,
    soldCount: 2290,
    inStock: true,
  },
  {
    id: 6,
    title: 'Elden Ring Nightreign',
    description: 'A standalone co-op adventure set in the Elden Ring universe: survive three days with two friends.',
    genre: 'rpg',
    platforms: ['ps5', 'xbox-series', 'pc'],
    publisher: 'Bandai Namco',
    pegi: 16,
    price: 39.99,
    deluxePrice: 54.99,
    discountPercent: 0,
    releaseDate: '2025-05-30',
    coverUrl: cover('f/f0/Elden_Ring_Nightreign_cover_art.png'),
    rating: 4.2,
    soldCount: 1510,
    inStock: true,
  },
  {
    id: 7,
    title: 'Hollow Knight: Silksong',
    description: 'Play as Hornet and climb a haunted kingdom of silk and song in this hand-drawn action adventure.',
    genre: 'adventure',
    platforms: ['ps5', 'xbox-series', 'switch', 'pc'],
    publisher: 'Team Cherry',
    pegi: 7,
    price: 19.99,
    deluxePrice: null,
    discountPercent: 0,
    releaseDate: '2025-09-04',
    coverUrl: cover('0/05/Silksong.jpg'),
    rating: 4.8,
    soldCount: 1980,
    inStock: true,
  },
  {
    id: 8,
    title: 'Sid Meier’s Civilization VII',
    description: 'Build an empire across three ages of history and lead it from antiquity to the modern era.',
    genre: 'strategy',
    platforms: ['ps5', 'xbox-series', 'switch', 'pc'],
    publisher: '2K',
    pegi: 12,
    price: 69.99,
    deluxePrice: 99.99,
    discountPercent: 40,
    releaseDate: '2025-02-11',
    coverUrl: cover('d/d5/Civilization_VII_cover.png'),
    rating: 3.8,
    soldCount: 640,
    inStock: true,
  },
  {
    id: 9,
    title: 'Donkey Kong Bananza',
    description: 'Punch, smash and dig through a world made of destructible terrain in search of Banandium gems.',
    genre: 'family',
    platforms: ['switch'],
    publisher: 'Nintendo',
    pegi: 7,
    price: 69.99,
    deluxePrice: null,
    discountPercent: 10,
    releaseDate: '2025-07-17',
    coverUrl: cover('0/01/Donkey_Kong_Bananza_updated_box_art.png'),
    rating: 4.6,
    soldCount: 1320,
    inStock: true,
  },
  {
    id: 10,
    title: 'Split Fiction',
    description: 'A co-op adventure for two players who jump between sci-fi and fantasy worlds written by the heroes.',
    genre: 'adventure',
    platforms: ['ps5', 'xbox-series', 'switch', 'pc'],
    publisher: 'Electronic Arts',
    pegi: 16,
    price: 49.99,
    deluxePrice: null,
    discountPercent: 25,
    releaseDate: '2025-03-06',
    coverUrl: cover('4/40/Split_Fiction_cover_art.jpg'),
    rating: 4.7,
    soldCount: 1150,
    inStock: false,
  },
  {
    id: 11,
    title: 'Gran Turismo 7',
    description: 'The real driving simulator, with more than 500 cars and classic tracks from around the world.',
    genre: 'racing',
    platforms: ['ps5'],
    publisher: 'Sony Interactive Entertainment',
    pegi: 3,
    price: 59.99,
    deluxePrice: 79.99,
    discountPercent: 50,
    releaseDate: '2022-03-04',
    coverUrl: cover('1/14/Gran_Turismo_7_cover_art.jpg'),
    rating: 4.4,
    soldCount: 870,
    inStock: true,
  },
  {
    id: 12,
    title: 'NBA 2K26',
    description: 'Basketball with improved movement, a new MyCAREER story and the full WNBA roster.',
    genre: 'sports',
    platforms: ['ps5', 'xbox-series', 'switch', 'pc'],
    publisher: '2K',
    pegi: 3,
    price: 69.99,
    deluxePrice: 99.99,
    discountPercent: 0,
    releaseDate: '2025-09-05',
    coverUrl: cover('1/1d/NBA_2K26_Leave_No_Doubt_edition_cover.jpg'),
    rating: 3.6,
    soldCount: 980,
    inStock: true,
  },
]

const sorters: Record<GameSort, (a: Game, b: Game) => number> = {
  newest: (a, b) => b.releaseDate.localeCompare(a.releaseDate),
  'price-asc': (a, b) => finalPrice(a.price, a.discountPercent) - finalPrice(b.price, b.discountPercent),
  'price-desc': (a, b) => finalPrice(b.price, b.discountPercent) - finalPrice(a.price, a.discountPercent),
  rating: (a, b) => b.rating - a.rating,
  'best-selling': (a, b) => b.soldCount - a.soldCount,
}

function matches(game: Game, filters: GameFilters) {
  const price = finalPrice(game.price, game.discountPercent)
  const search = filters.search?.trim().toLowerCase()
  if (search && !game.title.toLowerCase().includes(search)) return false
  if (filters.platform && !game.platforms.includes(filters.platform)) return false
  if (filters.genre && game.genre !== filters.genre) return false
  if (filters.minPrice !== undefined && price < filters.minPrice) return false
  if (filters.maxPrice !== undefined && price > filters.maxPrice) return false
  if (filters.maxPegi !== undefined && game.pegi > filters.maxPegi) return false
  if (filters.onSale && game.discountPercent === 0) return false
  if (filters.comingSoon && !isComingSoon(game)) return false
  return true
}

export const gamesApi = {
  list: (filters: GameFilters = {}) =>
    delay(games.filter((g) => matches(g, filters)).sort(sorters[filters.sort ?? 'newest'])),

  get: (id: number) => {
    const game = games.find((g) => g.id === id)
    if (!game) return Promise.reject(new NotFoundError('Game', id))
    return delay(game)
  },

  create: (input: NewGame) => {
    const game: Game = { ...input, id: Date.now(), rating: 0, soldCount: 0 }
    games = [game, ...games]
    return delay(game)
  },

  update: (id: number, changes: Partial<NewGame>) => {
    games = games.map((g) => (g.id === id ? { ...g, ...changes } : g))
    return gamesApi.get(id)
  },

  remove: (id: number) => {
    games = games.filter((g) => g.id !== id)
    return delay(undefined)
  },
}
