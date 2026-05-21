'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { NewChatDialog } from '@/components/chat/NewChatDialog'

function ChatContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const {
    chats,
    activeChat,
    messages,
    setActiveChat,
    sendMessage,
    isLoading,
    isConnected,
    typingUserId,
    emitTyping,
  } = useChat()
  const [searchQuery, setSearchQuery] = useState('')
  const [newChatOpen, setNewChatOpen] = useState(false)

  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId && chats.length > 0 && !activeChat) {
      const chat = chats.find((c) => c.id === conversationId)
      if (chat) setActiveChat(chat)
    }
  }, [searchParams, chats, activeChat, setActiveChat])

  return (
    <MainLayout>
      <div className="h-[calc(100vh-80px)] flex bg-background">
        {!isConnected && (
          <div className="absolute top-20 left-1/2 z-10 -translate-x-1/2 rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-900">
            Connecting to chat server...
          </div>
        )}

        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onNewChat={() => setNewChatOpen(true)}
        />

        <NewChatDialog open={newChatOpen} onOpenChange={setNewChatOpen} />

        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={messages}
            currentUserId={user?.id || ''}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            isTyping={typingUserId === activeChat.participantId}
            onTyping={emitTyping}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">
                {chats.length === 0
                  ? 'No conversations yet. Click New to message a student.'
                  : 'Select a chat or click New to message someone'}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      }>
        <ChatContent />
      </Suspense>
    </ProtectedRoute>
  )
}
