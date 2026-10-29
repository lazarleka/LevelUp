import type { Favorite } from '../types'

export const favoritesStorageKey = (userId: number) => `levelup.favorites.${userId}`

function readFavorites(userId: number): Favorite[] {
  if (!Number.isInteger(userId) || userId <= 0) throw new Error('Sign in to save favorites.')
  const stored = localStorage.getItem(favoritesStorageKey(userId))
  if (!stored) return []
  let parsed: unknown
  try {
    parsed = JSON.parse(stored)
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const favorites = parsed.filter(
    (item): item is Favorite =>
      typeof item === 'object' &&
      item !== null &&
      'gameId' in item &&
      typeof item.gameId === 'number' &&
      Number.isInteger(item.gameId) &&
      item.gameId > 0 &&
      'savedAt' in item &&
      typeof item.savedAt === 'string' &&
      Number.isFinite(Date.parse(item.savedAt)),
  )
  return [...new Map(favorites.map((item) => [item.gameId, item])).values()]
}

// Browser persistence is scoped to each mock account. Replace with authenticated API calls later.
export const favoritesApi = {
  list: async (userId: number) => readFavorites(userId),
  set: async (userId: number, gameId: number, saved: boolean) => {
    if (!Number.isInteger(gameId) || gameId <= 0) throw new Error('Invalid game.')
    const current = readFavorites(userId)
    const existing = current.find((item) => item.gameId === gameId)
    const remaining = current.filter((item) => item.gameId !== gameId)
    const next = saved ? [existing ?? { gameId, savedAt: new Date().toISOString() }, ...remaining] : remaining
    localStorage.setItem(favoritesStorageKey(userId), JSON.stringify(next))
    return next
  },
}
