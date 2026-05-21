'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  value?: string
  onSearch: (query: string) => void
  onClear?: () => void
  placeholder?: string
  debounceMs?: number
}

export function SearchBar({
  value,
  onSearch,
  onClear,
  placeholder = 'Search products...',
  debounceMs = 300,
}: SearchBarProps) {
  const [query, setQuery] = useState(value ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (value !== undefined) setQuery(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setQuery(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onSearch(next), debounceMs)
  }

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery('')
    onClear?.()
    onSearch('')
  }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
