// Domain Layer - Task Use Cases
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "../entities/task"

const tasks: Map<string, Task> = new Map()

export interface ITaskRepository {
  createTask(userId: string, input: CreateTaskInput): Promise<Task>
  getTaskById(taskId: string): Promise<Task | null>
  getTasksByUserId(userId: string): Promise<Task[]>
  getTasksByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]>
  updateTask(taskId: string, input: UpdateTaskInput): Promise<Task>
  deleteTask(taskId: string): Promise<void>
}

export class TaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    if (!input.title || input.title.trim().length === 0) {
      throw new Error("Task title is required")
    }
    if (input.description && input.description.length > 500) {
      throw new Error("Description must not exceed 500 characters")
    }
    return this.taskRepository.createTask(userId, input)
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return tasks.get(taskId) || null
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    return this.taskRepository.getTasksByUserId(userId)
  }

  async getTasksByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return Array.from(tasks.values()).filter((t) => t.userId === userId && t.status === status)
  }

  async getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    if (!userId) {
      throw new Error("User ID is required")
    }
    return this.taskRepository.getTasksByUserIdAndStatus(userId, status)
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    if (!taskId) {
      throw new Error("Task ID is required")
    }
    if (input.title !== undefined && input.title.trim().length === 0) {
      throw new Error("Task title cannot be empty")
    }
    if (input.description && input.description.length > 500) {
      throw new Error("Description must not exceed 500 characters")
    }
    return this.taskRepository.updateTask(taskId, input)
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!taskId) {
      throw new Error("Task ID is required")
    }
    return this.taskRepository.deleteTask(taskId)
  }
}
