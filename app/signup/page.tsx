'use client'

import { SignupForm } from '@/components/auth/SignupForm'
import { Logo } from '@/components/layout/Logo'
import { PublicRoute } from '@/components/auth/ProtectedRoute'
import { Card } from '@/components/ui/card'

export default function SignupPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 p-12 text-white">
          <Logo size="md" />
          <div>
            <h1 className="text-4xl font-bold leading-tight mb-4">Join your campus community</h1>
            <p className="text-purple-100 text-lg max-w-md">
              Register with your college enrollment ID and verify to start buying and selling on campus.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Create account</h2>
              <p className="text-muted-foreground">College student registration</p>
            </div>
            <Card className="p-6 border border-border shadow-lg">
              <SignupForm />
            </Card>
          </div>
        </div>
      </div>
    </PublicRoute>
  )
}
