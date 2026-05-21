'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, MapPin, Phone, CreditCard } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useCart } from '@/context/CartContext'
import { ordersApi } from '@/lib/api/ordersApi'
import { formatPrice } from '@/utils/formatters'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

const MEETUP_SPOTS = [
  'Main Library Steps',
  'Student Center Lobby',
  'Cafeteria Entrance',
  'Dorm Common Area',
  'Parking Lot B',
]

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash on Meetup' },
  { id: 'upi', label: 'UPI (Pay at meetup)' },
]

function CheckoutContent() {
  const router = useRouter()
  const { items, total, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [meetupLocation, setMeetupLocation] = useState(MEETUP_SPOTS[0])
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [notes, setNotes] = useState('')

  const handleCheckout = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number for the seller to contact you')
      return
    }
    setLoading(true)
    try {
      const res = await ordersApi.checkout()
      await refreshCart()
      toast.success(
        `Order #${res.order.id} placed! Meet at ${meetupLocation}. Transaction: ${res.order.transactionId}`,
        { duration: 6000 }
      )
      router.push('/orders')
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/cart" className="hover:text-purple-600">
          Cart
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </div>

      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="font-semibold mb-4">Order summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 border-b last:border-0">
              <img
                src={item.image}
                alt={item.productName}
                className="w-16 h-16 rounded-lg object-cover bg-muted"
              />
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
            <span>Total</span>
            <span className="text-purple-600">{formatPrice(total)}</span>
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-purple-600" />
            Campus meetup location
          </h2>
          <select
            value={meetupLocation}
            onChange={(e) => setMeetupLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {MEETUP_SPOTS.map((spot) => (
              <option key={spot} value={spot}>
                {spot}
              </option>
            ))}
          </select>

          <div>
            <label className="font-semibold flex items-center gap-2 mb-2">
              <Phone className="h-5 w-5 text-purple-600" />
              Your phone number
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="font-semibold flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment method
            </label>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:border-purple-400 transition"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-purple-600"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Campus marketplace — pay the seller directly at meetup. No online payment required.
            </p>
          </div>

          <div>
            <label className="font-semibold mb-2 block">Notes for seller (optional)</label>
            <textarea
              placeholder="e.g. Available after 4pm, wearing blue jacket"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
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
              Placing order...
            </>
          ) : (
            `Place Order · ${formatPrice(total)}`
          )}
        </Button>

        <Button variant="outline" size="lg" className="w-full" asChild>
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
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
