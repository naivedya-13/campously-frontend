'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Hash, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'
interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    enrollmentId: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('')
  }

  const submitLogin = async (enrollmentId: string, password: string) => {
    setLoading(true)
    setError('')
    try {
      await login(enrollmentId, password, rememberMe)
      onSuccess?.()
      router.push('/explore')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.data.requiresVerification) {
          router.push(`/verify?enrollmentId=${enrollmentId}`)
          return
        }
        setError(err.message)
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.enrollmentId || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!/^\d{5,10}$/.test(formData.enrollmentId.trim())) {
      setError('Please enter a valid enrollment ID')
      return
    }

    await submitLogin(formData.enrollmentId.trim(), formData.password)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Enrollment ID</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="enrollmentId"
              inputMode="numeric"
              placeholder="467936"
              value={formData.enrollmentId}
              onChange={handleChange}
              disabled={loading}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-border"
            />
            Remember me
          </label>
          <Link href="/login" className="text-sm text-purple-600 hover:text-purple-700">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-purple-600 hover:text-purple-700">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
