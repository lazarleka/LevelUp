import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { NotFoundError } from '@/lib/mock-db'

import type { GameFilters, NewGame } from '../types'
import { gamesApi } from './games-api'

export function useGames(filters: GameFilters = {}, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: ['games', filters],
    queryFn: () => gamesApi.list(filters),
    enabled: options.enabled,
    // Keep showing the last results while new filters load, so the grid does not flash.
    placeholderData: keepPreviousData,
  })
}

export function useGame(id: number) {
  return useQuery({
    queryKey: ['games', id],
    queryFn: () => gamesApi.get(id),
    // A missing game will not appear on a retry, so show "not found" right away.
    retry: (failures, error) => !(error instanceof NotFoundError) && failures < 3,
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
