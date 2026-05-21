'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Share2, MessageCircle, Star, MapPin, Shield, Zap, Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { productsApi } from '@/lib/api/productsApi'
import { mapProduct } from '@/lib/mappers/product'
import type { Product } from '@/types/product'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/context/ChatContext'
import { formatPrice, calculateDiscount, formatCondition, formatDate } from '@/utils/formatters'
import { toast } from 'sonner'

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { isInWishlist, toggleItem } = useWishlist()
  const { addItem: addToCart } = useCart()
  const { startConversation } = useChat()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [reviews, setReviews] = useState<
    Array<{ id: number; userName: string; rating: number; comment: string; date: string }>
  >([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const id = parseInt(params.id, 10)
        const [data, rel] = await Promise.all([
          productsApi.getById(id),
          productsApi.related(id),
        ])
        const mapped = mapProduct(data)
        setProduct(mapped)
        setReviews(data.reviewList || [])
        setRelated(rel.products.map(mapProduct))
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        </div>
      </MainLayout>
    )
  }

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
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.price)
    : 0

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    try {
      await addToCart(parseInt(product.id, 10), quantity)
      toast.success('Added to cart')
      router.push('/cart')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to add to cart')
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    await toggleItem(parseInt(product.id, 10))
  }

  const handleContactSeller = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    try {
      const chat = await startConversation(parseInt(product.sellerId, 10), parseInt(product.id, 10))
      router.push(`/chat?conversation=${chat.id}`)
    } catch {
      router.push('/chat')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative bg-muted rounded-xl overflow-hidden h-96">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isTrending && (
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Trending
                </span>
              )}
              {product.isFeatured && (
                <span className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 ${
                      selectedImage === i ? 'border-purple-600' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-purple-600 font-medium mb-1 capitalize">
                {product.category} · {formatCondition(product.condition)}
              </p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-purple-600">
                {formatPrice(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                  <span className="text-red-500 font-semibold">{discount}% off</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
              <img
                src={product.sellerAvatar}
                alt={product.sellerName}
                className="h-14 w-14 rounded-full"
              />
              <div>
                <p className="font-semibold text-lg">{product.sellerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Shield className="h-4 w-4" /> Verified campus seller
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{product.location}</span>
              </div>
              <div>
                <p className="text-muted-foreground">Posted</p>
                <p className="font-semibold">{formatDate(product.postedDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-muted"
                >
                  −
                </button>
                <span className="px-4 py-2 border-l border-r">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-2 hover:bg-muted">
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500"
                onClick={handleAddToCart}
              >
                <Zap className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            <Button size="lg" variant="outline" className="w-full" onClick={handleContactSeller}>
              <MessageCircle className="mr-2 h-5 w-5" />
              Contact Seller
            </Button>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{r.userName}</span>
                    <span className="text-yellow-500">{'★'.repeat(r.rating)}</span>
                  </div>
                  <p className="text-muted-foreground">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="border-t border-border pt-12">
            <h2 className="text-3xl font-bold mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
