import { NotFoundError, delay } from '@/lib/mock-db'

import type { NewUser, User } from '../types'

let users: User[] = [
  { id: 1, name: 'Marko Vuković', email: 'marko@levelup.me', role: 'admin', createdAt: '2026-01-12' },
  { id: 2, name: 'Ana Radović', email: 'ana.radovic@gmail.com', role: 'customer', createdAt: '2026-02-03' },
  { id: 3, name: 'Nikola Popović', email: 'nikola.p@gmail.com', role: 'customer', createdAt: '2026-03-21' },
  { id: 4, name: 'Jelena Đukanović', email: 'jelena.dj@outlook.com', role: 'customer', createdAt: '2026-04-08' },
  { id: 5, name: 'Stefan Kovačević', email: 'stefan.k@gmail.com', role: 'customer', createdAt: '2026-05-15' },
  { id: 6, name: 'Milica Bulatović', email: 'milica.b@yahoo.com', role: 'customer', createdAt: '2026-06-30' },
  { id: 7, name: 'Luka Marković', email: 'luka.markovic@gmail.com', role: 'customer', createdAt: '2026-08-02' },
  { id: 8, name: 'Teodora Lekić', email: 'teodora.l@gmail.com', role: 'customer', createdAt: '2026-09-19' },
]

// Mock session: who is signed in. Next workshop this becomes a real token from the backend.
let currentUserId: number | null = null

export const usersApi = {
  list: () => delay(users),

  get: (id: number) => {
    const user = users.find((u) => u.id === id)
    if (!user) return Promise.reject(new NotFoundError('User', id))
    return delay(user)
  },

  create: (input: NewUser) => {
    const user: User = { ...input, id: Date.now(), createdAt: new Date().toISOString().slice(0, 10) }
    users = [...users, user]
    return delay(user)
  },

  update: (id: number, changes: Partial<NewUser>) => {
    users = users.map((u) => (u.id === id ? { ...u, ...changes } : u))
    return usersApi.get(id)
  },

  remove: (id: number) => {
    users = users.filter((u) => u.id !== id)
    return delay(undefined)
  },

  // Mock sign in: any known email works, the password is not checked.
  signIn: (email: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) return Promise.reject(new Error('No account with that email'))
    currentUserId = user.id
    return delay(user)
  },

  signOut: () => {
    currentUserId = null
    return delay(undefined)
  },

  me: () => delay(users.find((u) => u.id === currentUserId) ?? null),
}
