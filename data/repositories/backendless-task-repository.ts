// Data Layer - Backendless Task Repository
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "../../domain/entities/task"
import type { ITaskRepository } from "../../domain/usecases/task-usecase"

export class BackendlessTaskRepository implements ITaskRepository {
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

  private getHeaders(): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("backendless-user-token") : null

    return {
      "Content-Type": "application/json",
      "X-Backendless-Application-Id": this.appId,
      "X-Backendless-REST-API-Key": this.apiKey,
      ...(token ? { "user-token": token } : {}),
    }
  }

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    try {
      const response = await fetch(`${this.apiUrl}/api/data/Tasks`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId,
          title: input.title,
          description: input.description,
          status: input.status || "todo",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create task")
      }

      const data = await response.json()
      return {
        id: data.objectId,
        userId,
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt: new Date(data.created),
        updatedAt: new Date(data.updated),
      }
    } catch (error) {
      throw new Error(`Backendless create task failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/data/Tasks/${taskId}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error("Failed to fetch task")
      }

      const data = await response.json()
      return {
        id: data.objectId,
        userId: data.userId,
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt: new Date(data.created),
        updatedAt: new Date(data.updated),
      }
    } catch (error) {
      console.error("Error fetching task:", error)
      return null
    }
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      const whereClause = encodeURIComponent(`userId = '${userId}'`)
      const response = await fetch(`${this.apiUrl}/api/data/Tasks?where=${whereClause}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      return (data || []).map((task: any) => ({
        id: task.objectId,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: new Date(task.created),
        updatedAt: new Date(task.updated),
      }))
    } catch (error) {
      console.error("Error fetching tasks by user:", error)
      return []
    }
  }

  async getTasksByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    try {
      const whereClause = encodeURIComponent(`userId = '${userId}' AND status = '${status}'`)
      const response = await fetch(`${this.apiUrl}/api/data/Tasks?where=${whereClause}`, {
        method: "GET",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      return (data || []).map((task: any) => ({
        id: task.objectId,
        userId: task.userId,
        title: task.title,
        description: task.description,
        status: task.status,
        createdAt: new Date(task.created),
        updatedAt: new Date(task.updated),
      }))
    } catch (error) {
      console.error("Error fetching tasks by status:", error)
      return []
    }
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    try {
      const response = await fetch(`${this.apiUrl}/api/data/Tasks/${taskId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to update task")
      }

      const data = await response.json()
      return {
        id: data.objectId,
        userId: data.userId,
        title: data.title,
        description: data.description,
        status: data.status,
        createdAt: new Date(data.created),
        updatedAt: new Date(data.updated),
      }
    } catch (error) {
      throw new Error(`Backendless update task failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/data/Tasks/${taskId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })

      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
    } catch (error) {
      throw new Error(`Backendless delete task failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }
}
