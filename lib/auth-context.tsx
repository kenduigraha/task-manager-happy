// Presentation Layer - Auth Context for State Management
"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { getAuthUseCase } from "@/data/factories/factory"
import type { User } from "@/domain/entities/user"

interface AuthContextType {
  user: User | null
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const authUseCase = getAuthUseCase()
    const newUser = await authUseCase.signup(email, password, name)
    setUser(newUser)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const authUseCase = getAuthUseCase()
    const user = await authUseCase.login(email, password)
    setUser(user)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
