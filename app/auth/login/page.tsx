'use client'

import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Login to your Campusly account</p>
          </div>

          <Card className="p-6 border border-border">
            <LoginForm />
          </Card>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-semibold mb-2">Demo Account</p>
            <p className="text-xs text-blue-800 mb-2">Use any email and password to test the app</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
