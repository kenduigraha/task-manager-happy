// Presentation Layer - Task List Component
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TaskCard } from "./task-card"
import { useAuth } from "@/lib/auth-context"
import { getTaskUseCase } from "@/data/factories/factory"
import type { Task, TaskStatus } from "@/domain/entities/task"

interface TaskListProps {
  filter: TaskStatus | "all"
  refreshTrigger: number
  onTasksChange: () => void
}

export function TaskList({ filter, refreshTrigger, onTasksChange }: TaskListProps) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadTasks() {
      if (!user) return

      setIsLoading(true)
      setError("")
      try {
        const taskUseCase = getTaskUseCase()
        let loadedTasks: Task[]

        if (filter === "all") {
          loadedTasks = await taskUseCase.getTasksByUserId(user.id)
        } else {
          loadedTasks = await taskUseCase.getTasksByStatus(user.id, filter)
        }

        setTasks(loadedTasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tasks")
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [user, filter, refreshTrigger])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            {filter === "all"
              ? "No tasks yet. Create one to get started!"
              : `No ${filter} tasks. Try a different filter!`}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onTasksChange={onTasksChange} />
      ))}
    </div>
  )
}
