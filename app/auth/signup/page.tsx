'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { SignupForm } from '@/components/auth/SignupForm'
import { Card } from '@/components/ui/card'

export default function SignupPage() {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Join Campusly</h1>
            <p className="text-muted-foreground">Create your account and start shopping on campus</p>
          </div>

          <Card className="p-6 border border-border">
            <SignupForm />
          </Card>

          {/* Benefits */}
          <div className="mt-6 space-y-3">
            <div className="flex gap-3 text-sm">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-muted-foreground">Buy and sell items from your campus</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-muted-foreground">Save up to 70% on textbooks</span>
            </div>
            <div className="flex gap-3 text-sm">
              <span className="text-green-600 font-bold">✓</span>
              <span className="text-muted-foreground">Safe and verified transactions</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
