'use client'

import { Search, MessageCirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Chat } from '@/types/chat'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatDate } from '@/utils/formatters'

interface ChatSidebarProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  searchQuery?: string
  onSearch?: (query: string) => void
  onNewChat?: () => void
}

export function ChatSidebar({
  chats,
  activeChat,
  onSelectChat,
  searchQuery = '',
  onSearch,
  onNewChat,
}: ChatSidebarProps) {
  const filteredChats = chats.filter(chat =>
    chat.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full md:w-72 border-r border-border bg-muted/30 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Messages</h2>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1 text-purple-600 border-purple-200 hover:bg-purple-50"
            onClick={onNewChat}
          >
            <MessageCirclePlus className="h-4 w-4" />
            New
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No chats yet
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={cn(
                  'w-full p-4 flex items-start gap-3 hover:bg-muted transition text-left',
                  activeChat?.id === chat.id && 'bg-purple-50 dark:bg-purple-950'
                )}
              >
                {/* Avatar & Status */}
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.participantAvatar}
                    alt={chat.participantName}
                    className="h-12 w-12 rounded-full"
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{chat.participantName}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {chat.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {chat.unread > 0 && (
                  <div className="flex-shrink-0 bg-purple-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
