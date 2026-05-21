'use client'

import React, { createContext, useState, useCallback, useEffect, useContext } from 'react'
import type { Product } from '@/types/product'
import { wishlistApi } from '@/lib/api/wishlistApi'
import { mapProduct } from '@/lib/mappers/product'
import { AuthContext } from '@/context/AuthContext'

interface WishlistContextType {
  items: Product[]
  itemCount: number
  isLoading: boolean
  refreshWishlist: () => Promise<void>
  addItem: (product: Product) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  toggleItem: (productId: number) => Promise<boolean>
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated ?? false

  const [items, setItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      return
    }
    setIsLoading(true)
    try {
      const data = await wishlistApi.get()
      setItems(data.items.map(mapProduct))
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  const toggleItem = useCallback(async (productId: number) => {
    const data = await wishlistApi.toggle(productId)
    setItems(data.items.map(mapProduct))
    return data.added
  }, [])

  const addItem = useCallback(
    async (product: Product) => {
      await toggleItem(parseInt(product.id, 10))
    },
    [toggleItem]
  )

  const removeItem = useCallback(async (productId: string) => {
    const data = await wishlistApi.remove(parseInt(productId, 10))
    setItems(data.items.map(mapProduct))
  }, [])

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.id === productId),
    [items]
  )

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isLoading,
        refreshWishlist,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist: () => setItems([]),
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
