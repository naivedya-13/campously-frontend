import { request } from './client'

export interface AuthUser {
  id: number
  enrollmentId: string
  name: string
  email: string | null
  avatar: string | null
  bio: string | null
  college: string | null
  department: string | null
  year: number | null
  phone: string | null
  isVerified: boolean
  role: 'STUDENT' | 'ADMIN'
  createdAt?: string
}

export const authApi = {
  login: (enrollmentId: string, password: string) =>
    request<{ token: string; refreshToken: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      data: { enrollmentId, password },
    }),

  register: (body: {
    enrollmentId: string
    name: string
    password: string
    college: string
    department: string
    year: number
    email?: string
  }) =>
    request<{ user: AuthUser; requiresVerification: boolean }>('/auth/register', {
      method: 'POST',
      data: body,
    }),

  verifyOtp: (enrollmentId: string, otp: string) =>
    request<{ token: string; refreshToken: string; user: AuthUser }>('/auth/verify-otp', {
      method: 'POST',
      data: { enrollmentId, otp },
    }),

  refreshToken: () =>
    request<{ token: string; refreshToken: string; user: AuthUser }>('/auth/refresh-token', {
      method: 'POST',
      data: {},
    }),

  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
}
