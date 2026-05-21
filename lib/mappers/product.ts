import type { Product, ProductCategory, ProductCondition } from '@/types/product'

export interface ApiProduct {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number | null
  stock: number
  condition: string
  category: string
  categoryId?: number
  categoryName?: string
  sellerId: number
  sellerName: string
  sellerAvatar: string
  sellerVerified?: boolean
  rating: number
  reviews: number
  images: string[]
  location: string
  tags?: string[]
  isFeatured?: boolean
  isTrending?: boolean
  postedDate?: string
  createdAt?: string
  reviewList?: Array<{
    id: number
    userName: string
    userAvatar?: string
    rating: number
    comment: string
    date: string
  }>
}

export function mapProduct(p: ApiProduct): Product {
  return {
    id: String(p.id),
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    images: p.images?.length ? p.images : ['/placeholder.svg'],
    category: (p.category || 'other') as ProductCategory,
    condition: (p.condition || 'good') as ProductCondition,
    sellerId: String(p.sellerId),
    sellerName: p.sellerName,
    sellerAvatar: p.sellerAvatar,
    rating: p.rating,
    reviews: p.reviews,
    postedDate: p.postedDate || p.createdAt || new Date().toISOString(),
    location: p.location,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
  }
}
