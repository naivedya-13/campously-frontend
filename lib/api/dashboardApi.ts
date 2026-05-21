import { request } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export const dashboardApi = {
  buyer: () =>
    request<{
      cartCount: number
      cartTotal: number
      wishlistCount: number
      orderCount: number
      totalSpent: number
      recentOrders: Array<{ id: number; status: string; total: number; product: string }>
      notifications: unknown[]
      recentChats: unknown[]
      recentlyViewed: ApiProduct[]
    }>('/dashboard/buyer'),

  seller: () =>
    request<{
      totalListings: number
      totalSales: number
      totalEarnings: number
      activeOrders: number
      topProducts: ApiProduct[]
      recentBuyers: unknown[]
    }>('/dashboard/seller'),
}
