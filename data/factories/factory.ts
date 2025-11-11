// Data Layer - Factory Pattern for Dependency Injection
import { AuthUseCase } from "../../domain/usecases/auth-usecase"
import { TaskUseCase } from "../../domain/usecases/task-usecase"
import { BackendlessAuthRepository } from "../repositories/backendless-auth-repository"
import { BackendlessTaskRepository } from "../repositories/backendless-task-repository"

let authRepository: BackendlessAuthRepository
let taskRepository: BackendlessTaskRepository
let authUseCase: AuthUseCase
let taskUseCase: TaskUseCase

// Singleton pattern to ensure single instances
export function getAuthRepository(): BackendlessAuthRepository {
  if (!authRepository) {
    authRepository = new BackendlessAuthRepository()
  }
  return authRepository
}

export function getTaskRepository(): BackendlessTaskRepository {
  if (!taskRepository) {
    taskRepository = new BackendlessTaskRepository()
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
