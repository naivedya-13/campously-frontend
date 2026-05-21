'use client'

import React, { createContext, useState, useCallback } from 'react'
import type { Product } from '@/types/product'

interface WishlistContextType {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([])

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
      const exists = prev.some(i => i.id === product.id)
      if (exists) return prev
      return [...prev, product]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(i => i.id !== productId))
  }, [])

  const isInWishlist = useCallback((productId: string) => {
    return items.some(i => i.id === productId)
  }, [items])

  const clearWishlist = useCallback(() => {
    setItems([])
  }, [])

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = React.useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
