'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useCart } from '@/context/CartContext'
import { ordersApi } from '@/lib/api/ordersApi'
import { formatPrice } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

function CheckoutContent() {
  const router = useRouter()
  const { items, total, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await ordersApi.checkout()
      await refreshCart()
      toast.success('Order placed successfully!')
      router.push(`/orders`)
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 text-center max-w-lg mx-auto mt-12">
        <p className="mb-4">Your cart is empty</p>
        <Button onClick={() => router.push('/explore')}>Browse products</Button>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-4">Order summary</h2>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0">
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold text-lg">
          <span>Total</span>
          <span className="text-purple-600">{formatPrice(total)}</span>
        </div>
      </Card>
      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-blue-500"
        size="lg"
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Place Order'
        )}
      </Button>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <CheckoutContent />
      </MainLayout>
    </ProtectedRoute>
  )
}
