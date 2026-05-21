'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ordersApi } from '@/lib/api/ordersApi'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/utils/formatters'

function SellerOrdersContent() {
  const [orders, setOrders] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.sellerOrders().then((r) => setOrders(r.orders as Array<Record<string, unknown>>)).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="animate-spin h-10 w-10 text-purple-600" /></div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Orders</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        orders.map((o) => (
          <Card key={String(o.id)} className="p-6 mb-4">
            <p className="font-semibold">Order #{String(o.id)} — {String(o.status)}</p>
            <p className="text-sm text-muted-foreground">Buyer: {(o.buyer as { name?: string })?.name}</p>
            <p className="font-bold mt-2">{formatPrice(Number(o.total))}</p>
          </Card>
        ))
      )}
    </div>
  )
}

export default function SellerOrdersPage() {
  return (
    <ProtectedRoute>
      <MainLayout><SellerOrdersContent /></MainLayout>
    </ProtectedRoute>
  )
}
