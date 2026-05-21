import { apiClient } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export const sellerApi = {
  products: () =>
    apiClient.get<{ products: ApiProduct[] }>('/seller/products').then((r) => r.data),
  createProduct: (data: Record<string, unknown>) =>
    apiClient
      .post<{ product: ApiProduct }>('/seller/products', data)
      .then((r) => r.data),
  updateProduct: (id: number, data: Record<string, unknown>) =>
    apiClient
      .patch<{ product: ApiProduct }>(`/seller/products/${id}`, data)
      .then((r) => r.data),
  deleteProduct: (id: number) =>
    apiClient
      .delete<{ message: string }>(`/seller/products/${id}`)
      .then((r) => r.data),
}
