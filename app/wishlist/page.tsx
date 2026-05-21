'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { useWishlist } from '@/context/WishlistContext'

export default function WishlistPage() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" asChild className="p-0">
              <Link href="/explore">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-4xl font-bold">My Wishlist</h1>
          </div>

          <div className="flex items-center justify-center min-h-[400px] flex-col gap-4 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-3xl font-bold">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Save items you like and come back to them anytime. Start adding items to your wishlist!
            </p>
            <Button asChild size="lg">
              <Link href="/explore">
                Explore Products
              </Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" asChild className="p-0">
            <Link href="/explore">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">My Wishlist</h1>
          <span className="text-muted-foreground text-lg">({items.length} items)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
