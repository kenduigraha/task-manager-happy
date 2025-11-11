// Domain Layer - User Entity
export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export interface AuthCredentials {
  email: string
  password: string
}
