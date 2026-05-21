import { request } from './client'

export interface OrderResponse {
  id: number
  status: string
  total: number
  transactionId?: string
  createdAt: string
  items: Array<{
    id: number
    productId: number
    productName: string
    quantity: number
    price: number
    image?: string
  }>
}

export const ordersApi = {
  checkout: () =>
    request<{ order: OrderResponse }>('/orders/checkout', { method: 'POST' }),
  list: () => request<{ orders: OrderResponse[] }>('/orders'),
  get: (id: number) => request<{ order: OrderResponse }>(`/orders/${id}`),
  sellerOrders: () => request<{ orders: OrderResponse[] }>('/orders/seller'),
  updateStatus: (id: number, status: string) =>
    request<{ order: OrderResponse }>(`/orders/${id}/status`, {
      method: 'PATCH',
      data: { status },
    }),
}
