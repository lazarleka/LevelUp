import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { NewCartItem } from '../types'
import { cartApi } from './cart-api'

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.list(),
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NewCartItem) => cartApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) => cartApi.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => cartApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })
}
