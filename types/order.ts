export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  productId: string
  productName: string
  buyerId: string
  sellerId: string
  sellerName: string
  price: number
  quantity: number
  status: OrderStatus
  orderDate: string
  deliveryDate?: string
  paymentMethod: string
}
