import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: '1',
    name: 'Engineering Mathematics - Volume 1 & 2',
    description: 'Complete set of engineering mathematics volumes with all solutions. Minimal writing on pages. Great for engineering students.',
    price: 450,
    originalPrice: 1200,
    images: [
      'https://images.unsplash.com/photo-150784272343-583f20270319?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1543432471-0b1a31df4ee5?w=500&h=500&fit=crop'
    ],
    category: 'textbooks',
    condition: 'like-new',
    sellerId: 'seller1',
    sellerName: 'Priya Sharma',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    rating: 4.8,
    reviews: 24,
    postedDate: '2024-05-15',
    location: 'Stanford Campus',
    isFeatured: true
  },
  {
    id: '2',
    name: 'MacBook Air M1 2020',
    description: 'Barely used MacBook Air with M1 chip. Perfect condition, comes with original box and charger. Never dropped, no scratches.',
    price: 75000,
    originalPrice: 99900,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
    ],
    category: 'electronics',
    condition: 'brand-new',
    sellerId: 'seller2',
    sellerName: 'Alex Johnson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    rating: 4.9,
    reviews: 42,
    postedDate: '2024-05-10',
    location: 'Berkeley Campus',
    isFeatured: true
  },
  {
    id: '3',
    name: 'Study Table with Chair',
    description: 'Wooden study table with storage and comfortable chair. Good condition. Seat height adjustable. Easy to move.',
    price: 2500,
    originalPrice: 5000,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop'
    ],
    category: 'furniture',
    condition: 'good',
    sellerId: 'seller3',
    sellerName: 'Maria Garcia',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    rating: 4.5,
    reviews: 15,
    postedDate: '2024-05-12',
    location: 'MIT Campus'
  },
  {
    id: '4',
    name: 'Basic Chemistry Textbook',
    description: 'General Chemistry textbook, 12th edition. Used for one semester only. Notes on margins but no highlighting.',
    price: 299,
    originalPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1507842872343-583f20270319?w=500&h=500&fit=crop'
    ],
    category: 'textbooks',
    condition: 'good',
    sellerId: 'seller4',
    sellerName: 'James Wilson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    rating: 4.3,
    reviews: 8,
    postedDate: '2024-05-18',
    location: 'Harvard Campus'
  },
  {
    id: '5',
    name: 'Nike Air Max 90 Sneakers',
    description: 'Genuine Nike Air Max 90 in size 10. Worn 3-4 times only. Comes with original box and receipt.',
    price: 5000,
    originalPrice: 8500,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop'
    ],
    category: 'clothing',
    condition: 'like-new',
    sellerId: 'seller5',
    sellerName: 'Emma Davis',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    rating: 4.7,
    reviews: 18,
    postedDate: '2024-05-14',
    location: 'Yale Campus'
  },
  {
    id: '6',
    name: 'ASUS TUF Gaming Laptop',
    description: 'High-performance ASUS gaming laptop. RTX 3060, 16GB RAM, 512GB SSD. Used for 6 months, excellent for gaming and coding.',
    price: 65000,
    originalPrice: 110000,
    images: [
      'https://images.unsplash.com/photo-1588544921519-2b51201b391d?w=500&h=500&fit=crop'
    ],
    category: 'electronics',
    condition: 'good',
    sellerId: 'seller6',
    sellerName: 'Raj Patel',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raj',
    rating: 4.6,
    reviews: 22,
    postedDate: '2024-05-11',
    location: 'Stanford Campus',
    isTrending: true
  },
  {
    id: '7',
    name: 'Calculus Textbook 3rd Edition',
    description: 'Calculus textbook with practice problems and solutions. Used for one year. Some highlighting but pages are clean.',
    price: 350,
    originalPrice: 950,
    images: [
      'https://images.unsplash.com/photo-1507842872343-583f20270319?w=500&h=500&fit=crop'
    ],
    category: 'textbooks',
    condition: 'fair',
    sellerId: 'seller7',
    sellerName: 'Lisa Chen',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
    rating: 4.2,
    reviews: 9,
    postedDate: '2024-05-16',
    location: 'Princeton Campus'
  },
  {
    id: '8',
    name: 'Bicycle - Mountain Bike',
    description: 'Trek mountain bike in perfect condition. 21-speed, suspension front. Ideal for campus and trails.',
    price: 12000,
    originalPrice: 25000,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop'
    ],
    category: 'sports',
    condition: 'like-new',
    sellerId: 'seller8',
    sellerName: 'David Miller',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    rating: 4.8,
    reviews: 19,
    postedDate: '2024-05-13',
    location: 'Columbia Campus'
  },
  {
    id: '9',
    name: 'Organic Chemistry Solutions Manual',
    description: 'Complete solutions manual for organic chemistry. Perfect for studying and solving practice problems.',
    price: 199,
    originalPrice: 450,
    images: [
      'https://images.unsplash.com/photo-1507842872343-583f20270319?w=500&h=500&fit=crop'
    ],
    category: 'textbooks',
    condition: 'brand-new',
    sellerId: 'seller9',
    sellerName: 'Sarah Thompson',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    rating: 4.9,
    reviews: 31,
    postedDate: '2024-05-17',
    location: 'MIT Campus',
    isTrending: true
  },
  {
    id: '10',
    name: 'iPad Pro 11-inch 2021',
    description: 'iPad Pro with Apple Pencil. 256GB storage. Lightly used, no scratches. Great for digital notes and design.',
    price: 42000,
    originalPrice: 71000,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop'
    ],
    category: 'electronics',
    condition: 'like-new',
    sellerId: 'seller10',
    sellerName: 'Jennifer Lee',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jennifer',
    rating: 4.7,
    reviews: 25,
    postedDate: '2024-05-09',
    location: 'Stanford Campus'
  },
  {
    id: '11',
    name: 'Physics Lab Equipment Set',
    description: 'Complete physics lab equipment set. Used for one semester. All pieces included and functional.',
    price: 1800,
    originalPrice: 4500,
    images: [
      'https://images.unsplash.com/photo-1575952235199-7ac99cda2014?w=500&h=500&fit=crop'
    ],
    category: 'other',
    condition: 'good',
    sellerId: 'seller11',
    sellerName: 'Michael Brown',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    rating: 4.4,
    reviews: 12,
    postedDate: '2024-05-19',
    location: 'Harvard Campus'
  },
  {
    id: '12',
    name: 'Desk Lamp - LED',
    description: 'Modern LED desk lamp with adjustable brightness. Perfect for studying. Hardly used, excellent condition.',
    price: 899,
    originalPrice: 2500,
    images: [
      'https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=500&h=500&fit=crop'
    ],
    category: 'furniture',
    condition: 'brand-new',
    sellerId: 'seller12',
    sellerName: 'Victoria White',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=victoria',
    rating: 4.6,
    reviews: 16,
    postedDate: '2024-05-08',
    location: 'Yale Campus'
  }
]
