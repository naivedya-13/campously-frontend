'use client'

import { ShoppingBag, Heart, Package, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/utils/formatters'

export default function DashboardPage() {
  const { user } = useAuth()
  const { items: cartItems } = useCart()
  const { items: wishlistItems } = useWishlist()

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login to access your dashboard</h1>
          <Button asChild>
            <Link href="/auth/login">Login to Continue</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  const mockOrders = [
    {
      id: '1',
      product: 'Engineering Mathematics',
      seller: 'Priya Sharma',
      status: 'Delivered',
      date: '2024-05-15',
      price: 450
    },
    {
      id: '2',
      product: 'iPad Pro 11-inch',
      seller: 'Jennifer Lee',
      status: 'In Transit',
      date: '2024-05-18',
      price: 42000
    }
  ]

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Welcome Card */}
        <Card className="p-6 mb-8 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h2>
          <p className="text-muted-foreground">Manage your orders, wishlist, and account settings</p>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cart Items</p>
                <p className="text-3xl font-bold">{cartItems.length}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Saved Items</p>
                <p className="text-3xl font-bold">{wishlistItems.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                <p className="text-3xl font-bold">{mockOrders.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                <p className="text-3xl font-bold">{formatPrice(mockOrders.reduce((sum, o) => sum + o.price, 0))}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Button variant="outline" asChild>
              <Link href="/orders">View All</Link>
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-sm font-semibold">
                    <th className="px-6 py-4 text-left">Product</th>
                    <th className="px-6 py-4 text-left">Seller</th>
                    <th className="px-6 py-4 text-left">Price</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map(order => (
                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.product}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{order.seller}</td>
                      <td className="px-6 py-4 font-semibold">{formatPrice(order.price)}</td>
                      <td className="px-6 py-4 text-sm">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/explore">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/wishlist">View Wishlist</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/profile">Edit Profile</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">Become a Seller</h3>
                <p className="text-sm text-blue-800 mb-4">Start selling your items on Campusly and earn money</p>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/seller">View Seller Dashboard</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
