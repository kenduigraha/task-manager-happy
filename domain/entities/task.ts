// Domain Layer - Task Entity
export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskInput {
  title: string
  description: string
  status?: TaskStatus
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
}
