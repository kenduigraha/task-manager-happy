// Unit Tests - Task Use Case
import { TaskUseCase } from "@/domain/usecases/task-usecase"
import type { ITaskRepository } from "@/domain/usecases/task-usecase"
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "@/domain/entities/task"

class MockTaskRepository implements ITaskRepository {
  private tasks: Map<string, Task> = new Map()

  async createTask(userId: string, input: CreateTaskInput): Promise<Task> {
    const task: Task = {
      id: "1",
      userId,
      title: input.title,
      description: input.description,
      status: input.status || "todo",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tasks.set(task.id, task)
    return task
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.tasks.get(taskId) || null
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.userId === userId)
  }

  async getTasksByUserIdAndStatus(userId: string, status: TaskStatus): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((t) => t.userId === userId && t.status === status)
  }

  async updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
    const task = this.tasks.get(taskId)
    if (!task) throw new Error("Task not found")
    const updated = { ...task, ...input, updatedAt: new Date() }
    this.tasks.set(taskId, updated)
    return updated
  }

  async deleteTask(taskId: string): Promise<void> {
    if (!this.tasks.has(taskId)) throw new Error("Task not found")
    this.tasks.delete(taskId)
  }
}

describe("TaskUseCase", () => {
  let taskUseCase: TaskUseCase
  let mockRepository: MockTaskRepository

  beforeEach(() => {
    mockRepository = new MockTaskRepository()
    taskUseCase = new TaskUseCase(mockRepository)
  })

  describe("createTask", () => {
    it("should validate userId is provided", async () => {
      await expect(taskUseCase.createTask("", { title: "Test", description: "Test Description" })).rejects.toThrow("User ID is required")
    })

    it("should validate title is required", async () => {
      await expect(taskUseCase.createTask("user1", { title: "", description: "" })).rejects.toThrow("Task title is required")
    })

    it("should validate description length", async () => {
      await expect(
        taskUseCase.createTask("user1", {
          title: "Test",
          description: "a".repeat(501),
        }),
      ).rejects.toThrow("Description must not exceed 500 characters")
    })

    it("should create task successfully", async () => {
      const result = await taskUseCase.createTask("user1", {
        title: "Test Task",
        description: "Test Description",
      })
      expect(result).toEqual(
        expect.objectContaining({
          title: "Test Task",
          description: "Test Description",
          status: "todo",
        }),
      )
    })
  })

  describe("updateTask", () => {
    beforeEach(async () => {
      await taskUseCase.createTask("user1", {
        title: "Original",
        description: "Original Description",
      })
    })

    it("should validate taskId is provided", async () => {
      await expect(taskUseCase.updateTask("", { title: "New" })).rejects.toThrow("Task ID is required")
    })

    it("should update task successfully", async () => {
      const result = await taskUseCase.updateTask("1", {
        title: "Updated",
        status: "done",
      })
      expect(result.title).toBe("Updated")
      expect(result.status).toBe("done")
    })

    it("should allow partial updates", async () => {
      const result = await taskUseCase.updateTask("1", {
        status: "in-progress",
      })
      expect(result.title).toBe("Original")
      expect(result.status).toBe("in-progress")
    })

    it("should update description while preserving other fields", async () => {
      const result = await taskUseCase.updateTask("1", {
        description: "New Description",
      })
      expect(result.description).toBe("New Description")
      expect(result.title).toBe("Original")
    })

    it("should update timestamp on modification", async () => {
      const original = await taskUseCase.getTaskById("1")
      await new Promise((resolve) => setTimeout(resolve, 10))
      const updated = await taskUseCase.updateTask("1", {
        title: "Modified",
      })
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(original!.createdAt.getTime())
    })
  })

  describe("deleteTask", () => {
    beforeEach(async () => {
      await taskUseCase.createTask("user1", {
        title: "To Delete",
        description: "Will be deleted",
      })
    })

    it("should validate taskId is provided", async () => {
      await expect(taskUseCase.deleteTask("")).rejects.toThrow("Task ID is required")
    })

    it("should delete task successfully", async () => {
      await taskUseCase.deleteTask("1")
      const tasks = await taskUseCase.getTasksByUserId("user1")
      expect(tasks.length).toBe(0)
    })

    it("should handle deleting non-existent task", async () => {
      await expect(taskUseCase.deleteTask("999")).rejects.toThrow()
    })
  })

  describe("Task retrieval and filtering", () => {
    beforeEach(async () => {
      await taskUseCase.createTask("user1", {
        title: "Todo Task 1",
        description: "First task",
        status: "todo",
      })
      await taskUseCase.createTask("user1", {
        title: "Done Task 1",
        description: "User1 task",
        status: "done",
      })
      await taskUseCase.createTask("user2", {
        title: "Todo Task 2",
        description: "User2 task",
        status: "todo",
      })
    })

    it("should retrieve all tasks for a user", async () => {
      const tasks = await taskUseCase.getTasksByUserId("user1")
      expect(tasks.length).toBe(2)
    })

    it("should filter tasks by status", async () => {
      const todoTasks = await taskUseCase.getTasksByUserIdAndStatus("user1", "todo")
      expect(todoTasks.length).toBe(1)
      expect(todoTasks[0].title).toBe("Todo Task 1")
    })

    it("should isolate tasks between users", async () => {
      const user1Tasks = await taskUseCase.getTasksByUserId("user1")
      const user2Tasks = await taskUseCase.getTasksByUserId("user2")
      expect(user1Tasks).not.toEqual(user2Tasks)
      expect(user2Tasks.length).toBe(1)
    })
  })
})
