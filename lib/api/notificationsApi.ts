import { request } from './client'

export interface ApiNotification {
  id: number
  title: string
  message: string
  type: string
  read: boolean
  link?: string
  createdAt: string
}

export const notificationsApi = {
  list: () =>
    request<{ notifications: ApiNotification[]; unreadCount: number }>('/notifications'),
  markRead: (id: number) =>
    request<{ message: string }>(`/notifications/read/${id}`, { method: 'PATCH' }),
  markAllRead: () =>
    request<{ message: string }>('/notifications/read-all', { method: 'PATCH' }),
}
