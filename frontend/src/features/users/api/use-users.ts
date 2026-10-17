import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { usersApi } from './users-api'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.list(),
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['users', 'me'],
    queryFn: () => usersApi.me(),
  })
}

export function useSignIn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => usersApi.signIn(email),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'me'] }),
  })
}

export function useSignOut() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usersApi.signOut(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', 'me'] }),
  })
}
