// Presentation Layer - Dashboard Page
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { TaskList } from "@/components/task-list"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import type { TaskStatus } from "@/domain/entities/task"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all")
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground">Welcome, {user.name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              logout()
              router.push("/login")
            }}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">My Tasks</h2>
              <p className="text-muted-foreground mt-1">Manage and organize your tasks</p>
            </div>
            <CreateTaskDialog onTaskCreated={() => setRefreshTrigger((r) => r + 1)} />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {["all", "todo", "in-progress", "done"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status as TaskStatus | "all")}
                className="capitalize"
              >
                {status === "in-progress" ? "In Progress" : status}
              </Button>
            ))}
          </div>

          {/* Task List */}
          <TaskList
            filter={statusFilter}
            refreshTrigger={refreshTrigger}
            onTasksChange={() => setRefreshTrigger((r) => r + 1)}
          />
        </div>
      </main>
    </div>
  )
}
