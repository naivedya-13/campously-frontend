'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { Logo } from '@/components/layout/Logo'
import { PublicRoute } from '@/components/auth/ProtectedRoute'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-12 text-white">
          <div>
            <Logo size="md" />
          </div>
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Your campus marketplace, built for students
            </h1>
            <p className="text-purple-100 text-lg max-w-md">
              Buy and sell textbooks, electronics, and essentials using your college enrollment ID.
            </p>
          </div>
          <p className="text-sm text-purple-200">Student-only · Verified enrollment</p>
        </div>

        <div className="flex items-center justify-center px-4 py-12 bg-background">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
              <p className="text-muted-foreground">Sign in with your enrollment ID</p>
            </div>
            <Card className="p-6 border border-border shadow-lg">
              <LoginForm />
            </Card>
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}
