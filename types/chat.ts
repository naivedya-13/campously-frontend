export interface Message {
  id: string
  chatId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  read: boolean
  image?: string
}

export interface Chat {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  lastMessage: string
  lastMessageTime: string
  unread: number
  online: boolean
}
