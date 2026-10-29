import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { favoritesApi, favoritesStorageKey } from './favorites-api'
import type { Favorite } from '../types'

const favoritesKey = (userId: number | null) => ['favorites', userId]

export function useFavorites(userId: number | null) {
  const queryClient = useQueryClient()
  useEffect(() => {
    if (userId === null) return
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === favoritesStorageKey(userId)) {
        void queryClient.invalidateQueries({ queryKey: favoritesKey(userId) })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [userId, queryClient])

  return useQuery({
    queryKey: favoritesKey(userId),
    queryFn: (): Promise<Favorite[]> => (userId === null ? Promise.resolve([]) : favoritesApi.list(userId)),
    enabled: userId !== null,
    retry: false,
  })
}

export function useSetFavorite(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ gameId, saved }: { gameId: number; saved: boolean }) => {
      if (userId === null) return Promise.reject(new Error('Sign in to save favorites.'))
      return favoritesApi.set(userId, gameId, saved)
    },
    onSuccess: (favorites) => queryClient.setQueryData(favoritesKey(userId), favorites),
  })
}
