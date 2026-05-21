'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ordersApi, type OrderResponse } from '@/lib/api/ordersApi'
import { formatPrice, formatDate } from '@/utils/formatters'
import { Card } from '@/components/ui/card'

function OrdersContent() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.list().then((r) => setOrders(r.orders)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Link href="/explore" className="text-purple-600 font-semibold">
            Start shopping
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o.id} className="p-6">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Order #{o.id}</span>
                <span className="text-sm px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {formatDate(o.createdAt)} · {o.transactionId}
              </p>
              <p className="font-bold text-lg">{formatPrice(o.total)}</p>
              <ul className="mt-2 text-sm text-muted-foreground">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.productName} × {i.quantity}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <OrdersContent />
      </MainLayout>
    </ProtectedRoute>
  )
}
