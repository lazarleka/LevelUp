import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { GameFilters, NewGame } from '../types'
import { gamesApi } from './games-api'

export function useGames(filters: GameFilters = {}) {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: () => gamesApi.list(filters),
  })
}

export function useGame(id: number) {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => gamesApi.get(id),
  })
}

export function useCreateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewGame) => gamesApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  })
}

export function useUpdateGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, changes }: { id: number; changes: Partial<NewGame> }) => gamesApi.update(id, changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  })
}

export function useRemoveGame() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => gamesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  })
}
