'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Zap, Users, TrendingUp, Shield, Sparkles, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { homeApi } from '@/lib/api/homeApi'
import { mapProduct } from '@/lib/mappers/product'
import type { Product } from '@/types/product'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [featured, setFeatured] = useState<Product[]>([])
  const [trending, setTrending] = useState<Product[]>([])
  const [testimonials, setTestimonials] = useState<
    Array<{ name: string; university: string; comment: string; rating: number; avatar?: string }>
  >([])
  const [stats, setStats] = useState<Record<string, { value: string; label: string }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    homeApi
      .get()
      .then((data) => {
        setFeatured(data.featured.map(mapProduct))
        setTrending(data.trending.map(mapProduct))
        setTestimonials(data.testimonials)
        setStats(data.stats)
      })
      .finally(() => setLoading(false))
  }, [])

  const statProducts = stats.products_listed?.value || '1200+'
  const statBuyers = stats.happy_buyers?.value || '5000+'
  const statSavings = stats.avg_savings?.value || '70%'

  return (
    <MainLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-purple-50/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                Welcome to Campusly
              </span>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Buy & Sell on Campus</h1>
              <p className="text-xl text-muted-foreground">
                Your trusted marketplace for textbooks, electronics, and everything college students need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500">
                  <Link href="/explore">
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={user ? '/seller/add-product' : '/signup'}>Start Selling</Link>
                </Button>
              </div>
              <div className="flex gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold text-purple-600">{statProducts}</p>
                  <p className="text-sm text-muted-foreground">Products Listed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{statBuyers}</p>
                  <p className="text-sm text-muted-foreground">Happy Buyers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">{statSavings}</p>
                  <p className="text-sm text-muted-foreground">Average Savings</p>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative w-full h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=600&fit=crop"
                  alt="College students"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link href="/explore" className="text-purple-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Loved by Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl bg-card border border-border">
                <div className="flex gap-4 mb-4">
                  <img
                    src={t.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`}
                    alt={t.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.university}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{t.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
