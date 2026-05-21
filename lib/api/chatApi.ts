import { request } from './client'

export interface ApiChat {
  id: number
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  online: boolean
  productId?: number | null
  productName?: string | null
}

export interface ApiMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
}

export const chatApi = {
  listConversations: () => request<{ conversations: ApiChat[] }>('/chat/conversations'),
  createConversation: (participantId: number, productId?: number) =>
    request<{ conversation: ApiChat }>('/chat/conversations', {
      method: 'POST',
      data: { participantId, productId },
    }),
  getMessages: (id: number) =>
    request<{ messages: ApiMessage[] }>(`/chat/conversations/${id}/messages`),
  markAsRead: (id: number) =>
    request<{ message: string }>(`/chat/conversations/${id}/read`, { method: 'PATCH' }),
}
