'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, Heart, Package, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { dashboardApi } from '@/lib/api/dashboardApi'
import { formatPrice } from '@/utils/formatters'
import { mapProduct } from '@/lib/mappers/product'
import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'

function DashboardContent() {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardApi.buyer>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.buyer().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!data) return null

  const recentlyViewed = (data.recentlyViewed || []).map(mapProduct) as Product[]

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <Card className="p-6 mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-2xl font-bold mb-2">Your campus marketplace hub</h2>
        <p className="text-muted-foreground">Orders, wishlist, and cart synced from the server</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Cart Items</p>
          <p className="text-3xl font-bold">{data.cartCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Wishlist</p>
          <p className="text-3xl font-bold">{data.wishlistCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-3xl font-bold">{data.orderCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-3xl font-bold">{formatPrice(data.totalSpent)}</p>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Button variant="outline" asChild>
            <Link href="/orders">View All</Link>
          </Button>
        </div>
        <Card>
          {data.recentOrders.length === 0 ? (
            <p className="p-6 text-muted-foreground">No orders yet</p>
          ) : (
            <div className="divide-y">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="p-4 flex justify-between">
                  <span>{o.product}</span>
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                  <span className="text-sm text-muted-foreground">{o.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {recentlyViewed.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentlyViewed.map((p) => (
              <ProductCard key={p.id} product={p} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <DashboardContent />
      </MainLayout>
    </ProtectedRoute>
  )
}
