// Data Layer - Backendless Authentication Repository
import type { User, AuthCredentials } from "../../domain/entities/user"
import type { IAuthRepository } from "../../domain/usecases/auth-usecase"

export class BackendlessAuthRepository implements IAuthRepository {
  private apiUrl: string
  private appId: string
  private apiKey: string

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_BACKENDLESS_URL || ""
    this.appId = process.env.NEXT_PUBLIC_BACKENDLESS_APP_ID || ""
    this.apiKey = process.env.NEXT_PUBLIC_BACKENDLESS_API_KEY || ""

    if (!this.apiUrl || !this.appId || !this.apiKey) {
      throw new Error(
        "Missing Backendless credentials. Ensure NEXT_PUBLIC_BACKENDLESS_URL, NEXT_PUBLIC_BACKENDLESS_APP_ID, and NEXT_PUBLIC_BACKENDLESS_API_KEY are set.",
      )
    }
  }

  async signup(credentials: AuthCredentials, name: string): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Backendless-Application-Id": this.appId,
          "X-Backendless-REST-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: name,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data = await response.json()
      return {
        id: data.objectId,
        email: data.email,
        name: data.name || "",
        createdAt: new Date(),
      }
    } catch (error) {
      throw new Error(`Backendless signup failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const response = await fetch(`${this.apiUrl}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Backendless-Application-Id": this.appId,
          "X-Backendless-REST-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          login: credentials.email,
          password: credentials.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data = await response.json()
      // Store user token in localStorage for authenticated requests
      if (typeof window !== "undefined") {
        localStorage.setItem("backendless-user-token", data["user-token"])
      }

      return {
        id: data.objectId,
        email: data.email,
        name: data.name || "",
        createdAt: new Date(data.created),
      }
    } catch (error) {
      throw new Error(`Backendless login failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("backendless-user-token") : null

      if (!token) {
        return null
      }

      const response = await fetch(`${this.apiUrl}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Backendless-Application-Id": this.appId,
          "X-Backendless-REST-API-Key": this.apiKey,
          "user-token": token,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          if (typeof window !== "undefined") {
            localStorage.removeItem("backendless-user-token")
          }
          return null
        }
        throw new Error("Failed to fetch user")
      }

      const data = await response.json()
      return {
        id: data.objectId,
        email: data.email,
        name: data.name || "",
        createdAt: new Date(data.created),
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      return null
    }
  }
}
