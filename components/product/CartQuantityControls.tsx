'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface CartQuantityControlsProps {
  productId: string
  stock: number
  size?: 'sm' | 'md'
  className?: string
}

export function CartQuantityControls({
  productId,
  stock,
  size = 'sm',
  className,
}: CartQuantityControlsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { getProductQuantity, incrementProduct, decrementProduct, addItem } = useCart()
  const [loading, setLoading] = useState(false)

  const qty = getProductQuantity(productId)
  const outOfStock = stock <= 0
  const atMax = qty >= stock

  const requireLogin = () => {
    toast.info('Please log in to continue')
    router.push('/login')
  }

  const run = async (fn: () => Promise<void>) => {
    if (!user) {
      requireLogin()
      return
    }
    if (outOfStock) return
    setLoading(true)
    try {
      await fn()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not update cart')
    } finally {
      setLoading(false)
    }
  }

  const stop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    stop(e)
    run(async () => {
      await addItem(parseInt(productId, 10), 1)
      toast.success('Added to cart')
    })
  }

  const handleDecrement = (e: React.MouseEvent) => {
    stop(e)
    run(() => decrementProduct(parseInt(productId, 10)))
  }

  const handleIncrement = (e: React.MouseEvent) => {
    stop(e)
    run(() => incrementProduct(parseInt(productId, 10), stock))
  }

  if (outOfStock) {
    return (
      <Button
        variant="outline"
        size={size === 'md' ? 'lg' : 'sm'}
        className={cn('flex-1', className)}
        disabled
        onClick={stop}
      >
        Sold Out
      </Button>
    )
  }

  // Step 1: show Add to Cart until item is in cart
  if (qty === 0) {
    return (
      <Button
        variant="outline"
        size={size === 'md' ? 'lg' : 'sm'}
        className={cn('flex-1 w-full', className)}
        disabled={loading}
        onClick={handleAddToCart}
      >
        <ShoppingCart className={size === 'md' ? 'h-5 w-5 mr-2' : 'h-3.5 w-3.5 mr-1'} />
        Add to Cart
      </Button>
    )
  }

  // Step 2: show minus / count / plus
  const btnClass = size === 'md' ? 'px-4 py-3 text-lg' : 'px-3 py-2 text-sm'
  const qtyClass = size === 'md' ? 'px-5 py-3 text-lg min-w-[3rem]' : 'px-3 py-2 text-sm min-w-[2.5rem]'

  return (
    <div
      className={cn(
        'flex items-center border border-purple-400 ring-1 ring-purple-200 rounded-lg overflow-hidden bg-background',
        className
      )}
      onClick={stop}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={loading}
        onClick={handleDecrement}
        className={cn(
          btnClass,
          'hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed font-bold'
        )}
      >
        <Minus className={size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} />
      </button>
      <span
        className={cn(
          qtyClass,
          'border-x border-border text-center font-semibold tabular-nums bg-purple-50 text-purple-900'
        )}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={loading || atMax}
        onClick={handleIncrement}
        className={cn(
          btnClass,
          'hover:bg-muted transition disabled:opacity-40 disabled:cursor-not-allowed font-bold text-purple-600'
        )}
      >
        <Plus className={size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} />
      </button>
    </div>
  )
}
