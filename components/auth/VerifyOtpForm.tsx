'use client'

import React, { useState, useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { OTPInput, OTPInputContext } from 'input-otp'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

function Slot({ index, className }: { index: number; className?: string }) {
  const inputOTPContext = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      className={cn(
        'relative flex h-12 w-10 items-center justify-center rounded-lg border border-border text-lg font-semibold transition-all',
        isActive && 'z-10 border-purple-500 ring-2 ring-purple-500/30',
        className
      )}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-foreground" />
        </div>
      )}
    </div>
  )
}

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp, pendingEnrollmentId } = useAuth()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const enrollmentId =
    searchParams.get('enrollmentId') || pendingEnrollmentId || ''

  const handleVerify = async () => {
    if (!enrollmentId) {
      setError('Missing enrollment ID. Please sign up again.')
      return
    }
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')
    try {
      await verifyOtp(enrollmentId, otp)
      setSuccess(true)
      setTimeout(() => router.push('/explore'), 1200)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>
        <h2 className="text-xl font-bold text-green-700">Verified!</h2>
        <p className="text-muted-foreground">Redirecting to marketplace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent for enrollment
        </p>
        <p className="mt-1 font-mono font-semibold text-purple-700">{enrollmentId || '—'}</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <OTPInput maxLength={6} value={otp} onChange={setOtp}>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Slot key={i} index={i} />
            ))}
          </div>
        </OTPInput>
      </div>

      <Button
        onClick={handleVerify}
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
      >
        {loading ? 'Verifying...' : 'Verify Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-purple-600 hover:text-purple-700">
          Back to login
        </Link>
      </p>
    </div>
  )
}
