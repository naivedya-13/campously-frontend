'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { PublicRoute } from '@/components/auth/ProtectedRoute'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-12 text-white">
          <div>
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              Campusly
            </Link>
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
