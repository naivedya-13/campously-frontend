import { apiClient } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export interface ProductsResponse {
  products: ApiProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export async function fetchProducts(params?: Record<string, string | number>) {
  const res = await apiClient.get<ProductsResponse>('/products', { params })
  return res.data
}

export const productsApi = {
  search: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ProductsResponse>('/products/search', { params })
    return res.data
  },
  getById: async (id: number) => {
    const res = await apiClient.get<ApiProduct>(`/products/${id}`)
    return res.data
  },
  featured: async (limit = 8) => {
    const res = await apiClient.get<{ products: ApiProduct[] }>('/products/featured', {
      params: { limit },
    })
    return res.data
  },
  trending: async (limit = 8) => {
    const res = await apiClient.get<{ products: ApiProduct[] }>('/products/trending', {
      params: { limit },
    })
    return res.data
  },
  related: async (id: number) => {
    const res = await apiClient.get<{ products: ApiProduct[] }>(`/products/related/${id}`)
    return res.data
  },
}
