// Data Layer - Factory Pattern for Dependency Injection
import { AuthUseCase } from "../../domain/usecases/auth-usecase"
import { TaskUseCase } from "../../domain/usecases/task-usecase"
import { BackendlessAuthRepository } from "../repositories/backendless-auth-repository"
import { TaskRepository } from "../repositories/task-repository"

let authRepository: BackendlessAuthRepository
let taskRepository: TaskRepository
let authUseCase: AuthUseCase
let taskUseCase: TaskUseCase

// Singleton pattern to ensure single instances
export function getAuthRepository(): BackendlessAuthRepository {
  if (!authRepository) {
    authRepository = new BackendlessAuthRepository()
  }
  return authRepository
}

export function getTaskRepository(): TaskRepository {
  if (!taskRepository) {
    taskRepository = new TaskRepository()
  }
  return taskRepository
}

export function getAuthUseCase(): AuthUseCase {
  if (!authUseCase) {
    authUseCase = new AuthUseCase(getAuthRepository())
  }
  return authUseCase
}

export function getTaskUseCase(): TaskUseCase {
  if (!taskUseCase) {
    taskUseCase = new TaskUseCase(getTaskRepository())
  }
  return taskUseCase
}
