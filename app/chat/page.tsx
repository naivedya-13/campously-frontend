'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ChatSidebar } from '@/components/chat/ChatSidebar'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { useChat } from '@/context/ChatContext'
import { useAuth } from '@/context/AuthContext'

export default function ChatPage() {
  const { user } = useAuth()
  const { chats, activeChat, messages, setActiveChat, addMessage } = useChat()
  const [searchQuery, setSearchQuery] = useState('')

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login to access messages</h1>
          <a href="/auth/login" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Login
          </a>
        </div>
      </MainLayout>
    )
  }

  const handleSendMessage = (content: string) => {
    if (activeChat) {
      const newMessage = {
        id: Math.random().toString(),
        chatId: activeChat.id,
        senderId: 'user1',
        senderName: 'You',
        content,
        timestamp: new Date().toISOString(),
        read: true
      }
      addMessage(newMessage)
    }
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-80px)] flex bg-background">
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelectChat={setActiveChat}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* Main Chat Area */}
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-xl">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
