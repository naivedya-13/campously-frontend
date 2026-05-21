'use client'

import React, { createContext, useState, useCallback, useEffect, useContext } from 'react'
import { notificationsApi, type ApiNotification } from '@/lib/api/notificationsApi'
import { getSocket } from '@/lib/socket'
import { AuthContext } from '@/context/AuthContext'

export interface AppNotification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  link?: string
  createdAt: string
}

interface NotificationContextType {
  notifications: AppNotification[]
  unreadCount: number
  isLoading: boolean
  refresh: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

function mapNotification(n: ApiNotification): AppNotification {
  return {
    id: String(n.id),
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    link: n.link,
    createdAt: n.createdAt,
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated ?? false

  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    setIsLoading(true)
    try {
      const data = await notificationsApi.list()
      setNotifications(data.notifications.map(mapNotification))
      setUnreadCount(data.unreadCount)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const socket = getSocket()
    if (!socket || !isAuthenticated) return

    const onNotification = (n: ApiNotification) => {
      setNotifications((prev) => [mapNotification(n), ...prev])
      setUnreadCount((c) => c + 1)
    }

    socket.on('notification', onNotification)
    return () => {
      socket.off('notification', onNotification)
    }
  }, [isAuthenticated])

  const markAsRead = useCallback(async (id: string) => {
    await notificationsApi.markRead(parseInt(id, 10))
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await notificationsApi.markAllRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading, refresh, markAsRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = React.useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider')
  return ctx
}
