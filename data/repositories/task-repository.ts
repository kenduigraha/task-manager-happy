// Data Layer - Task Repository Implementation
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "../../domain/entities/task"
import type { ITaskRepository } from "../../domain/usecases/task-usecase"

// Mock storage (replace with database in production)
const tasks: Map<string, Task> = new Map()

export class TaskRepository implements ITaskRepository {
  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title: input.title,
      description: input.description,
      status: input.status || "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    tasks.set(task.id, task)
    return task
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return tasks.get(taskId) || null
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return Array.from(tasks.values()).filter((t) => t.userId === userId)
  }

  async getTasksByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return Array.from(tasks.values()).filter((t) => t.userId === userId && t.status === status)
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const task = tasks.get(taskId)
    if (!task) {
      throw new Error("Task not found")
    }
    const updated: Task = {
      ...task,
      ...input,
      updatedAt: new Date(),
    }
    tasks.set(taskId, updated)
    return updated
  }

  async deleteTask(taskId: string): Promise<void> {
    tasks.delete(taskId)
  }
}
