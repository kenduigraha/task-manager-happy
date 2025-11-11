import type { User, AuthCredentials } from "../../domain/entities/user"
import type { IAuthRepository } from "../../domain/usecases/auth-usecase"

const users: Map<string, User & { password: string }> = new Map()

export class AuthRepository implements IAuthRepository {
  async signup(credentials: AuthCredentials, name: string): Promise<User> {
    const existingUser = Array.from(users.values()).find((u) => u.email === credentials.email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const user: User & { password: string } = {
      id: Math.random().toString(36).substr(2, 9),
      email: credentials.email,
      name,
      password: credentials.password,
      createdAt: new Date(),
    }

    users.set(user.id, user)
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(credentials: AuthCredentials): Promise<User> {
    const user = Array.from(users.values()).find((u) => u.email === credentials.email)
    if (!user || user.password !== credentials.password) {
      throw new Error("Invalid email or password")
    }
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    const user = users.get(userId)
    if (!user) return null
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
