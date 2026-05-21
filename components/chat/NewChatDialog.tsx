'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, MessageCirclePlus, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { usersApi, type SearchUser } from '@/lib/api/usersApi'
import { useChat } from '@/context/ChatContext'
import { toast } from 'sonner'

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewChatDialog({ open, onOpenChange }: NewChatDialogProps) {
  const { startConversation, setActiveChat } = useChat()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState<number | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await usersApi.searchStudents(q.trim())
      setResults(data.users)
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      return
    }
    const t = setTimeout(() => search(query), 300)
    return () => clearTimeout(t)
  }, [query, open, search])

  const handleStartChat = async (student: SearchUser) => {
    setStarting(student.id)
    try {
      const chat = await startConversation(student.id)
      setActiveChat(chat)
      onOpenChange(false)
      toast.success(`Chat started with ${student.name}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not start chat')
    } finally {
      setStarting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCirclePlus className="h-5 w-5 text-purple-600" />
            New message
          </DialogTitle>
          <DialogDescription>
            Search by name or enrollment ID to message another student on campus.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Name or enrollment ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1">
          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
            </div>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No students found
            </p>
          )}
          {!loading && query.length < 2 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Type at least 2 characters to search
            </p>
          )}
          {results.map((student) => (
            <button
              key={student.id}
              type="button"
              disabled={starting === student.id}
              onClick={() => handleStartChat(student)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{student.name}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {student.enrollmentId}
                  {student.department ? ` · ${student.department}` : ''}
                </p>
              </div>
              {starting === student.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              ) : (
                <span className="text-xs font-medium text-purple-600">Message</span>
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
