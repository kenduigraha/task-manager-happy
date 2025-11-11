// Domain Layer - Authentication Use Cases
import type { User, AuthCredentials } from "../entities/user"

export interface IAuthRepository {
  signup(credentials: AuthCredentials, name: string): Promise<User>
  login(credentials: AuthCredentials): Promise<User>
  getCurrentUser(userId: string): Promise<User | null>
}

export class AuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async signup(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error("Email, password, and name are required")
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters")
    }
    return this.authRepository.signup({ email, password }, name)
  }

  async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }
    return this.authRepository.login({ email, password })
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    return this.authRepository.getCurrentUser(userId)
  }
}
