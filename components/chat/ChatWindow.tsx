'use client'

import { useState, useEffect } from 'react'
import { Send, Phone, Video, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Chat, Message } from '@/types/chat'

interface ChatWindowProps {
  chat: Chat
  messages: Message[]
  currentUserId: string
  onSendMessage: (message: string) => void
  isLoading?: boolean
  isTyping?: boolean
  onTyping?: (isTyping: boolean) => void
}

export function ChatWindow({
  chat,
  messages,
  currentUserId,
  onSendMessage,
  isLoading,
  isTyping,
  onTyping,
}: ChatWindowProps) {
  const [message, setMessage] = useState('')
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(
    null
  )

  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout)
      onTyping?.(false)
    }
  }, [typingTimeout, onTyping])

  const handleTyping = (value: string) => {
    setMessage(value)
    onTyping?.(true)
    if (typingTimeout) clearTimeout(typingTimeout)
    const t = setTimeout(() => onTyping?.(false), 1500)
    setTypingTimeout(t)
  }

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
      onTyping?.(false)
      if (typingTimeout) clearTimeout(typingTimeout)
    }
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="border-b border-border bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={chat.participantAvatar}
              alt={chat.participantName}
              className="h-10 w-10 rounded-full"
            />
            {chat.online && (
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border border-white" />
            )}
          </div>
          <div>
            <p className="font-semibold">{chat.participantName}</p>
            <p className="text-xs text-muted-foreground">
              {isTyping
                ? 'Typing...'
                : chat.online
                  ? 'Active now'
                  : 'Offline'}
              {chat.productName ? ` · ${chat.productName}` : ''}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-purple-600 text-white rounded-tr-none'
                      : 'bg-muted text-foreground rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${isOwn ? 'text-purple-100' : 'text-muted-foreground'}`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {isOwn && msg.read && ' · Seen'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            size="icon"
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
