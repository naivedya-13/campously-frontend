'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Package, DollarSign, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { dashboardApi } from '@/lib/api/dashboardApi'

function SellerContent() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof dashboardApi.seller>> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.seller().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Seller Dashboard</h1>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-500">
          <Link href="/seller/add-product">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Listings</p>
          <p className="text-3xl font-bold">{stats.totalListings}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Sales</p>
          <p className="text-3xl font-bold">{stats.totalSales}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Earnings</p>
          <p className="text-3xl font-bold">₹{stats.totalEarnings.toLocaleString('en-IN')}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground">Active Orders</p>
          <p className="text-3xl font-bold">{stats.activeOrders}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/seller/products">My Products</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/seller/orders">Seller Orders</Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function SellerPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <SellerContent />
      </MainLayout>
    </ProtectedRoute>
  )
}
