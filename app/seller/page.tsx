'use client'

import { TrendingUp, Package, DollarSign, Star, Plus } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'

export default function SellerPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login to access seller dashboard</h1>
          <Button asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  const mockStats = {
    totalListings: 8,
    totalSales: 12,
    totalEarnings: 145000,
    rating: 4.8
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-500">
            <Link href="/seller/add-product">
              <Plus className="h-5 w-5 mr-2" />
              Add New Product
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Listings</p>
                <p className="text-3xl font-bold">{mockStats.totalListings}</p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Sales</p>
                <p className="text-3xl font-bold">{mockStats.totalSales}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-3xl font-bold">₹{mockStats.totalEarnings.toLocaleString('en-IN')}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Seller Rating</p>
                <p className="text-3xl font-bold">{mockStats.rating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/seller/products">View My Products</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/seller/orders">View Orders</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/seller/analytics">View Analytics</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/seller/settings">Seller Settings</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <h3 className="text-lg font-bold mb-4">Seller Tips</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>✓ Add clear product descriptions and images</li>
              <li>✓ Respond to buyer messages quickly</li>
              <li>✓ Price competitively compared to others</li>
              <li>✓ Maintain high seller ratings</li>
            </ul>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
