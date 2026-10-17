import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { genres, pegiRatings, platforms } from '../types'
import type { GameFilters, GameSort, Genre, Pegi, Platform } from '../types'

const sorts: GameSort[] = ['newest', 'price-asc', 'price-desc', 'rating', 'best-selling']

const oneOf = <T extends string | number>(list: readonly T[], value: unknown): T | undefined =>
  list.find((item) => String(item) === value)

const toNumber = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : undefined
}

function readFilters(params: URLSearchParams): GameFilters {
  return {
    search: params.get('search') ?? undefined,
    platform: oneOf<Platform>(platforms, params.get('platform')),
    genre: oneOf<Genre>(genres, params.get('genre')),
    minPrice: toNumber(params.get('minPrice')),
    maxPrice: toNumber(params.get('maxPrice')),
    maxPegi: oneOf<Pegi>(pegiRatings, params.get('maxPegi')),
    onSale: params.get('onSale') === 'true' || undefined,
    comingSoon: params.get('comingSoon') === 'true' || undefined,
    sort: oneOf<GameSort>(sorts, params.get('sort')),
  }
}

/** Catalog filters stored in the URL, so a filtered page can be shared and Back works. */
export function useGameFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => readFilters(params), [params])

  const setFilters = useCallback(
    (changes: Partial<GameFilters>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          for (const [key, value] of Object.entries(changes)) {
            if (value === undefined || value === '' || value === false) next.delete(key)
            else next.set(key, String(value))
          }
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const clearFilters = useCallback(() => {
    setParams((current) => {
      const next = new URLSearchParams()
      const sort = current.get('sort')
      if (sort) next.set('sort', sort)
      return next
    })
  }, [setParams])

  return { filters, setFilters, clearFilters }
}

/** Number of active filters, not counting search and sort. */
export function countActiveFilters(filters: GameFilters) {
  const { search: _search, sort: _sort, ...rest } = filters
  return Object.values(rest).filter((value) => value !== undefined).length
}
