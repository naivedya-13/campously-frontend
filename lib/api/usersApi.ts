import { apiClient } from './client'
import type { AuthUser } from './authApi'

export interface SearchUser {
  id: number
  name: string
  enrollmentId: string
  avatar: string
  college?: string | null
  department?: string | null
}

export const usersApi = {
  me: () => apiClient.get<{ user: AuthUser }>('/users/me').then((r) => r.data),
  update: (data: Partial<AuthUser>) =>
    apiClient.patch<{ user: AuthUser }>('/users/me', data).then((r) => r.data),
  updateAvatar: (avatar: string) =>
    apiClient.patch<{ user: AuthUser }>('/users/avatar', { avatar }).then((r) => r.data),
  searchStudents: (q: string) =>
    apiClient
      .get<{ users: SearchUser[] }>('/users/search', { params: { q } })
      .then((r) => r.data),
}
