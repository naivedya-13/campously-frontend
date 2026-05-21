'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { VerifyOtpForm } from '@/components/auth/VerifyOtpForm'
import { Card } from '@/components/ui/card'

function VerifyContent() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-background dark:to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 text-white">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Verify enrollment</h1>
          <p className="text-muted-foreground">Confirm your college student identity</p>
        </div>
        <Card className="p-6 border border-border shadow-lg">
          <VerifyOtpForm />
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/signup" className="text-purple-600">Sign up again</Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
