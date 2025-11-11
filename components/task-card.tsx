// Presentation Layer - Task Card Component
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditTaskDialog } from "./edit-task-dialog"
import { getTaskUseCase } from "@/data/factories/factory"
import type { Task } from "@/domain/entities/task"

interface TaskCardProps {
  task: Task
  onTasksChange: () => void
}

export function TaskCard({ task, onTasksChange }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this task?")) return

    setIsDeleting(true)
    try {
      const taskUseCase = getTaskUseCase()
      await taskUseCase.deleteTask(task.id)
      onTasksChange()
    } catch (err) {
      console.error("Failed to delete task:", err)
      alert("Failed to delete task")
    } finally {
      setIsDeleting(false)
    }
  }

  const statusColors = {
    todo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle>{task.title}</CardTitle>
            <CardDescription className="mt-2">{task.description}</CardDescription>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize whitespace-nowrap ${statusColors[task.status]}`}
          >
            {task.status === "in-progress" ? "In Progress" : task.status}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Created {new Date(task.createdAt).toLocaleDateString()}</p>
          <div className="flex gap-2">
            <EditTaskDialog task={task} onTaskUpdated={onTasksChange} />
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
