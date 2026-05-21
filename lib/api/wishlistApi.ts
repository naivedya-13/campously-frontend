import { request } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export const wishlistApi = {
  get: () => request<{ items: ApiProduct[]; itemCount: number }>('/wishlist'),
  toggle: (productId: number) =>
    request<{ added: boolean; removed: boolean; items: ApiProduct[] }>('/wishlist/toggle', {
      method: 'POST',
      data: { productId },
    }),
  remove: (id: number) =>
    request<{ items: ApiProduct[] }>(`/wishlist/remove/${id}`, { method: 'DELETE' }),
}
