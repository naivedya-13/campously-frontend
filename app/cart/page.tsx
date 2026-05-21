'use client'

import { Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/utils/formatters'

export default function CartPage() {
  const { user } = useAuth()
  const { items, removeItem, updateQuantity, getTotal } = useCart()
  const total = getTotal()

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px] flex-col gap-4 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start adding items to your cart and checkout when you&apos;re ready
            </p>
            <Button asChild size="lg">
              <Link href="/explore">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" asChild className="p-0">
            <Link href="/explore">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.productId} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <Link href={`/product/${item.productId}`} className="hover:text-purple-600 transition">
                      <h3 className="font-semibold line-clamp-2 mb-2">{item.productName}</h3>
                    </Link>
                    <p className="text-lg font-bold text-purple-600">{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-muted transition"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 border-l border-r border-border text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-muted transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">Subtotal</p>
                    <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24 space-y-4">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="space-y-3 py-4 border-y border-border">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-3xl font-bold text-purple-600">{formatPrice(total)}</span>
              </div>

              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                onClick={() => user ? window.location.href = '/checkout' : window.location.href = '/auth/login'}
              >
                Proceed to Checkout
              </Button>

              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link href="/explore">
                  Continue Shopping
                </Link>
              </Button>

              {/* Promo Code */}
              <div className="pt-4 border-t border-border">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                  <Button variant="outline" size="sm">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
