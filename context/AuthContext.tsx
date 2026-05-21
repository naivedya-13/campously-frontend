'use client'

import React, { createContext, useState, useCallback } from 'react'
import type { User } from '@/types/user'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    // Dummy login implementation
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      university: 'Stanford University',
      verified: true,
      joinedDate: new Date().toISOString(),
      role: 'buyer'
    }
    setUser(mockUser)
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // Dummy signup implementation
    const mockUser: User = {
      id: Math.random().toString(),
      name,
      email,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      university: 'Stanford University',
      verified: false,
      joinedDate: new Date().toISOString(),
      role: 'buyer'
    }
    setUser(mockUser)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateProfile }}>
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
