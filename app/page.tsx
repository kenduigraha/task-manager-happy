// Presentation Layer - Home Page (Entry Point)
"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-balance">Task Manager</h1>
          <p className="text-xl text-muted-foreground">Organize your tasks with clean architecture</p>
        </div>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => router.push("/login")} variant="default">
            Login
          </Button>
          <Button size="lg" onClick={() => router.push("/signup")} variant="outline">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}
