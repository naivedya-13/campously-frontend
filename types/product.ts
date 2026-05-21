export type ProductCondition = 'brand-new' | 'like-new' | 'good' | 'fair'
export type ProductCategory = 'textbooks' | 'electronics' | 'furniture' | 'clothing' | 'sports' | 'other'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: ProductCategory
  condition: ProductCondition
  sellerId: string
  sellerName: string
  sellerAvatar: string
  rating: number
  reviews: number
  postedDate: string
  location: string
  stock: number
  isFeatured?: boolean
  isTrending?: boolean
}

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  image: string
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}
