'use client'

import React, { createContext, useState, useCallback, useEffect } from 'react'
import type { User, SignupData } from '@/types/user'
import { authApi } from '@/lib/api/authApi'
import { usersApi } from '@/lib/api/usersApi'
import { ApiError } from '@/lib/api/client'
import {
  mapApiUser,
  saveSession,
  clearSession,
  getStoredToken,
  getStoredUser,
  shouldRemember,
} from '@/lib/auth-storage'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  pendingEnrollmentId: string | null
  login: (enrollmentId: string, password: string, remember?: boolean) => Promise<void>
  signup: (data: SignupData) => Promise<{ requiresVerification: boolean }>
  verifyOtp: (enrollmentId: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<void>
  setPendingEnrollmentId: (id: string | null) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingEnrollmentId, setPendingEnrollmentId] = useState<string | null>(null)

  const restoreSession = useCallback(async () => {
    const storedUser = getStoredUser()
    const token = getStoredToken()

    if (!token || !storedUser) {
      setIsLoading(false)
      return
    }

    setUser(storedUser)

    try {
      const res = await authApi.refreshToken()
      const mapped = mapApiUser(res.user)
      saveSession(res.token, res.refreshToken, mapped, shouldRemember())
      setUser(mapped)
    } catch {
      if (!shouldRemember()) {
        clearSession()
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  const login = useCallback(async (enrollmentId: string, password: string, remember = false) => {
    try {
      const res = await authApi.login(enrollmentId, password)
      const mapped = mapApiUser(res.user)
      saveSession(res.token, res.refreshToken, mapped, remember)
      setUser(mapped)
      setPendingEnrollmentId(null)
    } catch (err) {
      if (err instanceof ApiError && err.data.requiresVerification) {
        setPendingEnrollmentId(enrollmentId)
        throw err
      }
      throw err
    }
  }, [])

  const signup = useCallback(async (data: SignupData) => {
    const res = await authApi.register(data)
    setPendingEnrollmentId(data.enrollmentId)
    return { requiresVerification: res.requiresVerification }
  }, [])

  const verifyOtp = useCallback(async (enrollmentId: string, otp: string) => {
    const res = await authApi.verifyOtp(enrollmentId, otp)
    const mapped = mapApiUser(res.user)
    saveSession(res.token, res.refreshToken, mapped, true)
    setUser(mapped)
    setPendingEnrollmentId(null)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // clear local session even if API fails
    }
    clearSession()
    setUser(null)
    setPendingEnrollmentId(null)
  }, [])

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    const res = await usersApi.update({
      name: updates.name,
      bio: updates.bio,
      phone: updates.phone,
      department: updates.department,
      college: updates.university || updates.college,
      year: updates.year,
      email: updates.email,
    })
    const mapped = mapApiUser(res.user)
    const token = getStoredToken()
    if (token) {
      const refresh = localStorage.getItem('campously_refresh') || ''
      saveSession(token, refresh, mapped, shouldRemember())
    }
    setUser(mapped)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingEnrollmentId,
        login,
        signup,
        verifyOtp,
        logout,
        updateProfile,
        setPendingEnrollmentId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
