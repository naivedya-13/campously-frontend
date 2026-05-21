'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Hash, Lock, Eye, EyeOff, Building2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { ApiError } from '@/lib/api'

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter()
  const { signup } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    enrollmentId: '',
    name: '',
    college: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const {
      enrollmentId,
      name,
      college,
      department,
      year,
      password,
      confirmPassword,
    } = formData

    if (!enrollmentId || !name || !college || !department || !year || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!/^\d{5,10}$/.test(enrollmentId.trim())) {
      setError('Please enter a valid enrollment ID')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await signup({
        enrollmentId: enrollmentId.trim(),
        name,
        password,
        college,
        department,
        year: parseInt(year, 10),
      })
      onSuccess?.()
      router.push(`/verify?enrollmentId=${encodeURIComponent(enrollmentId.trim())}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
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
        <label className="text-sm font-medium">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">College</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            name="college"
            placeholder="Campus State University"
            value={formData.college}
            onChange={handleChange}
            disabled={loading}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Department</label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              name="department"
              placeholder="Computer Science"
              value={formData.department}
              onChange={handleChange}
              disabled={loading}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            disabled={loading}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            className="pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700">
          Login
        </Link>
      </p>
    </form>
  )
}
