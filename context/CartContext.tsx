'use client'

import React, { createContext, useState, useCallback, useEffect, useContext } from 'react'
import { cartApi, type CartItemResponse } from '@/lib/api/cartApi'
import { AuthContext } from '@/context/AuthContext'
export interface CartItem {
  id: number
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  total: number
  itemCount: number
  isLoading: boolean
  refreshCart: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  removeItem: (itemId: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  getTotal: () => number
  getProductQuantity: (productId: string | number) => number
  getCartItemId: (productId: string | number) => number | null
  incrementProduct: (productId: number, maxStock?: number) => Promise<void>
  decrementProduct: (productId: number) => Promise<void>
}

export const CartContext = createContext<CartContextType | undefined>(undefined)

function mapItems(items: CartItemResponse[]): CartItem[] {
  return items.map((i) => ({
    id: i.id,
    productId: String(i.productId),
    productName: i.productName,
    price: i.price,
    quantity: i.quantity,
    image: i.image || '/placeholder.svg',
  }))
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext)
  const isAuthenticated = auth?.isAuthenticated ?? false

  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const applyCart = (data: { items: CartItemResponse[]; total: number; itemCount: number }) => {
    setItems(mapItems(data.items))
    setTotal(data.total)
    setItemCount(data.itemCount)
  }

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setTotal(0)
      setItemCount(0)
      return
    }
    setIsLoading(true)
    try {
      const data = await cartApi.get()
      applyCart(data)
    } catch {
      setItems([])
      setTotal(0)
      setItemCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  const addItem = useCallback(
    async (productId: number, quantity = 1) => {
      const data = await cartApi.add(productId, quantity)
      applyCart(data)
    },
    []
  )

  const removeItem = useCallback(async (itemId: number) => {
    const data = await cartApi.remove(itemId)
    applyCart(data)
  }, [])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity < 1) {
      await removeItem(itemId)
      return
    }
    const data = await cartApi.update(itemId, quantity)
    applyCart(data)
  }, [removeItem])

  const clearCart = useCallback(async () => {
    await cartApi.clear()
    setItems([])
    setTotal(0)
    setItemCount(0)
  }, [])

  const getProductQuantity = useCallback(
    (productId: string | number) => {
      const id = String(productId)
      return items.find((i) => i.productId === id)?.quantity ?? 0
    },
    [items]
  )

  const getCartItemId = useCallback(
    (productId: string | number) => {
      const id = String(productId)
      return items.find((i) => i.productId === id)?.id ?? null
    },
    [items]
  )

  const incrementProduct = useCallback(
    async (productId: number, maxStock?: number) => {
      const id = String(productId)
      const item = items.find((i) => i.productId === id)
      const current = item?.quantity ?? 0
      if (maxStock !== undefined && current >= maxStock) {
        throw new Error('Maximum stock reached')
      }
      if (!item) {
        await addItem(productId, 1)
      } else {
        await updateQuantity(item.id, current + 1)
      }
    },
    [items, addItem, updateQuantity]
  )

  const decrementProduct = useCallback(
    async (productId: number) => {
      const id = String(productId)
      const item = items.find((i) => i.productId === id)
      if (!item) return
      if (item.quantity <= 1) {
        await removeItem(item.id)
      } else {
        await updateQuantity(item.id, item.quantity - 1)
      }
    },
    [items, removeItem, updateQuantity]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isLoading,
        refreshCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal: () => total,
        getProductQuantity,
        getCartItemId,
        incrementProduct,
        decrementProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = React.useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
