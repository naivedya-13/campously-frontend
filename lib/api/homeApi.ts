import { request } from './client'
import type { ApiProduct } from '@/lib/mappers/product'

export const homeApi = {
  get: () =>
    request<{
      featured: ApiProduct[]
      trending: ApiProduct[]
      latest: ApiProduct[]
      categories: Array<{ id: number; name: string; slug: string; icon?: string }>
      banners: Array<{ id: number; title: string; subtitle?: string; imageUrl: string; link?: string }>
      testimonials: Array<{
        id: number
        name: string
        university: string
        comment: string
        rating: number
        avatar?: string
      }>
      stats: Record<string, { value: string; label: string }>
    }>('/home'),

  categories: () =>
    request<{ categories: Array<{ id: number; name: string; slug: string }> }>('/home/categories'),
}
