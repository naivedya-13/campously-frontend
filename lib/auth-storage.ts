import type { User } from '@/types/user'
import type { AuthUser } from '@/lib/api'

const TOKEN_KEY = 'campously_token'
const REFRESH_KEY = 'campously_refresh'
const USER_KEY = 'campously_user'
const REMEMBER_KEY = 'campously_remember'

export function mapApiUser(apiUser: AuthUser): User {
  return {
    id: String(apiUser.id),
    enrollmentId: apiUser.enrollmentId,
    name: apiUser.name,
    email: apiUser.email || undefined,
    avatar:
      apiUser.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiUser.enrollmentId}`,
    university: apiUser.college || 'Campus State University',
    college: apiUser.college || undefined,
    department: apiUser.department || undefined,
    year: apiUser.year || undefined,
    verified: apiUser.isVerified,
    joinedDate: apiUser.createdAt || new Date().toISOString(),
    role: apiUser.role === 'ADMIN' ? 'admin' : 'buyer',
    bio: apiUser.bio || undefined,
    phone: apiUser.phone || undefined,
  }
}

export function saveSession(token: string, refreshToken: string, user: User, remember: boolean) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(REFRESH_KEY, refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0')
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(REMEMBER_KEY)
}

export function getStoredToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function shouldRemember() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(REMEMBER_KEY) === '1'
}
