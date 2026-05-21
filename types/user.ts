export type UserRole = 'STUDENT' | 'ADMIN' | 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  enrollmentId: string
  name: string
  email?: string
  avatar: string
  university: string
  college?: string
  department?: string
  year?: number
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
  responseTime: number
  acceptanceRate: number
}

export interface SignupData {
  enrollmentId: string
  name: string
  password: string
  college: string
  department: string
  year: number
  email?: string
}
