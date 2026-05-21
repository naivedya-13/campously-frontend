import { request } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export interface CartItemResponse {
  id: number
  productId: number
  quantity: number
  productName: string
  price: number
  image: string
  product?: ApiProduct
}

export interface CartResponse {
  items: CartItemResponse[]
  total: number
  itemCount: number
}

export const cartApi = {
  get: () => request<CartResponse>('/cart'),
  add: (productId: number, quantity = 1) =>
    request<CartResponse>('/cart/add', { method: 'POST', data: { productId, quantity } }),
  update: (itemId: number, quantity: number) =>
    request<CartResponse>('/cart/update', { method: 'PATCH', data: { itemId, quantity } }),
  remove: (id: number) =>
    request<CartResponse>(`/cart/remove/${id}`, { method: 'DELETE' }),
  clear: () => request<CartResponse>('/cart/clear', { method: 'DELETE' }),
}
