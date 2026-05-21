'use client'

import { Heart, Star } from 'lucide-react'
import Link from 'next/link'
import type { Product } from '@/types/product'
import { formatPrice, calculateDiscount, formatCondition } from '@/utils/formatters'
import { useWishlist } from '@/context/WishlistContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlist()
  const isSaved = isInWishlist(product.id)
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isSaved) {
      removeItem(product.id)
    } else {
      addItem(product)
    }
  }

  if (variant === 'compact') {
    return (
      <Link href={`/product/${product.id}`}>
        <div className="group rounded-lg overflow-hidden bg-card border border-border hover:border-purple-400 transition-all duration-200 cursor-pointer">
          {/* Image Container */}
          <div className="relative overflow-hidden bg-muted h-40 sm:h-48">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {discount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                -{discount}%
              </div>
            )}
            {product.isFeatured && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                Featured
              </div>
            )}
            <button
              onClick={handleWishlistToggle}
              className="absolute bottom-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart
                className={cn('h-5 w-5', isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600')}
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-600 transition">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-lg text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Condition Badge */}
            <div className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-2">
              {formatCondition(product.condition)}
            </div>

            {/* Seller & Rating */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate">{product.sellerName}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group rounded-xl overflow-hidden bg-card border border-border hover:border-purple-400 hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted h-64">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            <div className="flex gap-2">
              {product.isTrending && (
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Trending
                </div>
              )}
              {product.isFeatured && (
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>
            {discount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{discount}%
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-colors',
                isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition min-h-10">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Condition Badge */}
          <div className="inline-block w-fit text-xs font-medium bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full mb-3">
            {formatCondition(product.condition)}
          </div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-3">
            <img
              src={product.sellerAvatar}
              alt={product.sellerName}
              className="h-10 w-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.sellerName}</p>
              <p className="text-xs text-muted-foreground">{product.location}</p>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-3.5 w-3.5',
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
