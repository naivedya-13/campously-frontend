'use client'

import React, { createContext, useState, useCallback } from 'react'
import type { Chat, Message } from '@/types/chat'

interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  setActiveChat: (chat: Chat) => void
  addMessage: (message: Message) => void
  createChat: (chat: Chat) => void
  getUnreadCount: () => number
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      participantId: 'seller1',
      participantName: 'Priya Sharma',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      lastMessage: 'Is this still available?',
      lastMessageTime: new Date().toISOString(),
      unread: 2,
      online: true
    },
    {
      id: '2',
      participantId: 'buyer2',
      participantName: 'Alex Johnson',
      participantAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      lastMessage: 'Thanks for the quick delivery!',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unread: 0,
      online: false
    }
  ])
  
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const setActiveChatHandler = useCallback((chat: Chat) => {
    setActiveChat(chat)
    // Load messages for this chat (dummy data)
    const dummyMessages: Message[] = [
      {
        id: '1',
        chatId: chat.id,
        senderId: chat.participantId,
        senderName: chat.participantName,
        content: 'Hi, is this textbook still available?',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: true
      },
      {
        id: '2',
        chatId: chat.id,
        senderId: 'user1',
        senderName: 'You',
        content: 'Yes, it is! Condition is like new.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: true
      },
      {
        id: '3',
        chatId: chat.id,
        senderId: chat.participantId,
        senderName: chat.participantName,
        content: 'Great! Can we meet on campus?',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        read: true
      }
    ]
    setMessages(dummyMessages)
    // Mark chat as read
    setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: 0 } : c))
  }, [])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message])
    // Update chat's last message
    setChats(prev => prev.map(c => 
      c.id === message.chatId 
        ? { ...c, lastMessage: message.content, lastMessageTime: message.timestamp }
        : c
    ))
  }, [])

  const createChat = useCallback((chat: Chat) => {
    setChats(prev => [chat, ...prev])
  }, [])

  const getUnreadCount = useCallback(() => {
    return chats.reduce((total, chat) => total + chat.unread, 0)
  }, [chats])

  return (
    <ChatContext.Provider value={{ chats, activeChat, messages, setActiveChat: setActiveChatHandler, addMessage, createChat, getUnreadCount }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = React.useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}
