'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Share2, MessageCircle, Star, MapPin, Shield, Zap } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { products } from '@/data/products'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, calculateDiscount, formatCondition, formatDate } from '@/utils/formatters'

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const product = products.find(p => p.id === params.id)
  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push('/explore')}>Browse Products</Button>
        </div>
      </MainLayout>
    )
  }

  const isSaved = isInWishlist(product.id)
  const discount = product.originalPrice ? calculateDiscount(product.originalPrice, product.price) : 0
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      image: product.images[0]
    })
    router.push('/cart')
  }

  const handleWishlistToggle = () => {
    if (isSaved) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      router.push('/auth/login')
    } else {
      router.push('/chat')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-muted rounded-xl overflow-hidden h-96 md:h-full max-h-96 md:max-h-[600px]">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white font-bold px-4 py-2 rounded-full text-lg">
                  -{discount}%
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full text-sm">
                  Featured
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index ? 'border-purple-600' : 'border-border'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Condition */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              </div>
              <div className="inline-block bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full text-sm">
                {formatCondition(product.condition)}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="border-b border-t border-border py-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl font-bold text-purple-600">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-semibold">Save {formatPrice(product.originalPrice! - product.price)}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Seller Info */}
            <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="h-16 w-16 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold text-lg">{product.sellerName}</p>
                <p className="text-sm text-muted-foreground mb-2">Seller • Verified</p>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    {product.rating}/5 Seller Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Location & Posted Date */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-semibold">{product.location}</p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Posted</p>
                <p className="font-semibold">{formatDate(product.postedDate)}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted transition"
                >
                  −
                </button>
                <span className="px-4 py-2 border-l border-r border-border">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-muted transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                onClick={handleAddToCart}
              >
                <Zap className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlistToggle}
                className="flex-1"
              >
                <Heart
                  className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`}
                />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Contact Seller */}
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={handleContactSeller}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Seller
            </Button>

            {/* Share Button */}
            <Button
              size="lg"
              variant="ghost"
              className="w-full"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Share Product
            </Button>

            {/* Trust Badges */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-2">Safe Transaction Guaranteed</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Verified seller</li>
                <li>✓ Meet on campus</li>
                <li>✓ Secure payment options</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-border pt-12">
            <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
