export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  university: string
  verified: boolean
  joinedDate: string
  role: UserRole
  bio?: string
  phone?: string
  location?: string
  rating?: number
  sellerRating?: number
}

export interface SellerProfile extends User {
  totalSold: number
  totalEarnings: number
  responseTime: number // in minutes
  acceptanceRate: number
}
