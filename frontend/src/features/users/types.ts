export type Role = 'customer' | 'admin'

export type User = {
  id: number
  name: string
  email: string
  role: Role
  createdAt: string
}

export type NewUser = Omit<User, 'id' | 'createdAt'>
