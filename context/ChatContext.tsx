'use client'

import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useContext,
  useRef,
} from 'react'
import type { Chat, Message } from '@/types/chat'
import { chatApi, type ApiChat } from '@/lib/api/chatApi'
import { connectSocket, disconnectSocket, getSocket } from '@/lib/socket'
import { AuthContext } from '@/context/AuthContext'
import { getStoredToken } from '@/lib/auth-storage'

interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  messages: Message[]
  isLoading: boolean
  isConnected: boolean
  typingUserId: string | null
  setActiveChat: (chat: Chat) => void
  sendMessage: (content: string) => void
  startConversation: (participantId: number, productId?: number) => Promise<Chat>
  getUnreadCount: () => number
  emitTyping: (isTyping: boolean) => void
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined)

function mapApiChat(c: ApiChat): Chat {
  return {
    id: String(c.id),
    productId: c.productId,
    productName: c.productName,
    participantId: c.participantId,
    participantName: c.participantName,
    participantAvatar: c.participantAvatar,
    lastMessage: c.lastMessage,
    lastMessageTime: c.lastMessageTime,
    unread: c.unread,
    online: c.online,
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  const user = auth?.user ?? null
  const isAuthenticated = auth?.isAuthenticated ?? false

  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChatState] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUserId, setTypingUserId] = useState<string | null>(null)
  const activeChatRef = useRef<Chat | null>(null)
  activeChatRef.current = activeChat

  const loadConversations = useCallback(async () => {
    const res = await chatApi.listConversations()
    setChats(res.conversations.map(mapApiChat))
  }, [])

  const loadMessages = useCallback(async (conversationId: string) => {
    setIsLoading(true)
    try {
      const res = await chatApi.getMessages(parseInt(conversationId, 10))
      setMessages(res.messages)
      await chatApi.markAsRead(parseInt(conversationId, 10))
      const socket = getSocket()
      socket?.emit('mark_read', conversationId)
      setChats((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !user) {
      disconnectSocket()
      setChats([])
      setMessages([])
      setActiveChatState(null)
      setIsConnected(false)
      return
    }

    const token = getStoredToken()
    if (!token) return

    const socket = connectSocket(token)

    const onConnect = () => {
      setIsConnected(true)
      void loadConversations()
    }

    const onDisconnect = () => setIsConnected(false)

    const onNewMessage = (msg: Message) => {
      const currentActive = activeChatRef.current
      const isActive = currentActive?.id === msg.chatId
      const isFromOther = msg.senderId !== user.id

      if (isActive) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev
          return [...prev, msg]
        })
        if (isFromOther) {
          socket.emit('mark_read', msg.chatId)
        }
      }

      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== msg.chatId) return c
          return {
            ...c,
            lastMessage: msg.content,
            lastMessageTime: msg.timestamp,
            unread: isFromOther && !isActive ? c.unread + 1 : isActive ? 0 : c.unread,
          }
        })
      )

      if (isActive) {
        setActiveChatState((prev) =>
          prev
            ? {
                ...prev,
                lastMessage: msg.content,
                lastMessageTime: msg.timestamp,
                unread: 0,
              }
            : prev
        )
      }
    }

    const onConversationUpdated = (convo: ApiChat) => {
      const mapped = mapApiChat(convo)
      setChats((prev) => {
        const exists = prev.find((c) => c.id === mapped.id)
        if (exists) {
          return prev.map((c) => (c.id === mapped.id ? mapped : c))
        }
        return [mapped, ...prev]
      })
    }

    const onUserOnline = ({ userId }: { userId: number }) => {
      setChats((prev) =>
        prev.map((c) =>
          c.participantId === String(userId) ? { ...c, online: true } : c
        )
      )
      setActiveChatState((prev) =>
        prev?.participantId === String(userId) ? { ...prev, online: true } : prev
      )
    }

    const onUserOffline = ({ userId }: { userId: number }) => {
      setChats((prev) =>
        prev.map((c) =>
          c.participantId === String(userId) ? { ...c, online: false } : c
        )
      )
      setActiveChatState((prev) =>
        prev?.participantId === String(userId) ? { ...prev, online: false } : prev
      )
    }

    const onTyping = ({
      userId,
      isTyping,
    }: {
      conversationId: string
      userId: number
      isTyping: boolean
    }) => {
      if (isTyping && String(userId) !== user.id) {
        setTypingUserId(String(userId))
      } else {
        setTypingUserId(null)
      }
    }

    const onMessagesRead = ({ conversationId }: { conversationId: number }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.chatId === String(conversationId) ? { ...m, read: true } : m
        )
      )
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('new_message', onNewMessage)
    socket.on('conversation_updated', onConversationUpdated)
    socket.on('user_online', onUserOnline)
    socket.on('user_offline', onUserOffline)
    socket.on('user_typing', onTyping)
    socket.on('messages_read', onMessagesRead)

    if (socket.connected) onConnect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('new_message', onNewMessage)
      socket.off('conversation_updated', onConversationUpdated)
      socket.off('user_online', onUserOnline)
      socket.off('user_offline', onUserOffline)
      socket.off('user_typing', onTyping)
      socket.off('messages_read', onMessagesRead)
    }
  }, [isAuthenticated, user, loadConversations])

  const setActiveChat = useCallback(
    (chat: Chat) => {
      setActiveChatState(chat)
      const socket = getSocket()
      if (socket) {
        socket.emit('join_conversation', chat.id)
      }
      void loadMessages(chat.id)
    },
    [loadMessages]
  )

  const sendMessage = useCallback(
    (content: string) => {
      if (!activeChat || !user) return
      const socket = getSocket()
      if (!socket?.connected) return

      socket.emit(
        'send_message',
        { conversationId: activeChat.id, content },
        (response: { error?: string }) => {
          if (response?.error) console.error(response.error)
        }
      )
    },
    [activeChat, user]
  )

  const startConversation = useCallback(
    async (participantId: number, productId?: number) => {
      const res = await chatApi.createConversation(participantId, productId)
      const chat = mapApiChat(res.conversation)
      setChats((prev) => {
        if (prev.some((c) => c.id === chat.id)) {
          return prev.map((c) => (c.id === chat.id ? chat : c))
        }
        return [chat, ...prev]
      })
      const socket = getSocket()
      socket?.emit('join_conversation', chat.id)
      setActiveChatState(chat)
      setMessages([])
      return chat
    },
    []
  )

  const emitTyping = useCallback(
    (isTyping: boolean) => {
      if (!activeChat) return
      getSocket()?.emit('typing', {
        conversationId: activeChat.id,
        isTyping,
      })
    },
    [activeChat]
  )

  const getUnreadCount = useCallback(() => {
    return chats.reduce((total, chat) => total + chat.unread, 0)
  }, [chats])

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        isLoading,
        isConnected,
        typingUserId,
        setActiveChat,
        sendMessage,
        startConversation,
        getUnreadCount,
        emitTyping,
      }}
    >
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
