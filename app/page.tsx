'use client'

import { ArrowRight, BookOpen, Zap, Users, TrendingUp, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'
import { products } from '@/data/products'
import { useAuth } from '@/context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const featuredProducts = products.filter(p => p.isFeatured || p.isTrending).slice(0, 4)

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-purple-50/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-full">
                  Welcome to Campusly ✨
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Buy & Sell on Campus
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Your trusted marketplace for textbooks, electronics, furniture, and everything college students need. Save up to 70% off retail prices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  <Link href="/explore">
                    Start Exploring
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href={user ? '/seller/add-product' : '/auth/signup'}>
                    Start Selling
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4">
                <div>
                  <p className="text-3xl font-bold text-purple-600">12K+</p>
                  <p className="text-sm text-muted-foreground">Products Listed</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">5K+</p>
                  <p className="text-sm text-muted-foreground">Happy Buyers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">70%</p>
                  <p className="text-sm text-muted-foreground">Average Savings</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1557821552-17105176677c?w=600&h=600&fit=crop"
                  alt="College students shopping"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Campusly?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;re built by students, for students. Safe, fast, and convenient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Safe & Verified',
                description: 'All sellers are campus-verified. Buy with confidence.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Meet on campus. Get your items instantly.'
              },
              {
                icon: TrendingUp,
                title: 'Great Deals',
                description: 'Save up to 70% compared to retail prices.'
              },
              {
                icon: Users,
                title: 'Active Community',
                description: 'Join thousands of college students.'
              },
              {
                icon: BookOpen,
                title: 'Diverse Selection',
                description: 'Textbooks, electronics, furniture, and more.'
              },
              {
                icon: Sparkles,
                title: 'Easy Selling',
                description: 'List your items in seconds and start earning.'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-purple-300 transition-colors">
                  <Icon className="h-8 w-8 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Latest trending items on campus</p>
            </div>
            <Button asChild variant="outline">
              <Link href="/explore">View All Products</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Shop by Category</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Textbooks', emoji: '📚', color: 'from-blue-500 to-purple-600' },
              { name: 'Electronics', emoji: '💻', color: 'from-purple-500 to-pink-600' },
              { name: 'Furniture', emoji: '🪑', color: 'from-orange-500 to-red-600' },
              { name: 'Clothing', emoji: '👕', color: 'from-green-500 to-teal-600' },
              { name: 'Sports', emoji: '⚽', color: 'from-yellow-500 to-orange-600' },
              { name: 'Other', emoji: '🎁', color: 'from-pink-500 to-rose-600' }
            ].map((category, i) => (
              <Link key={i} href={`/explore?category=${category.name.toLowerCase()}`}>
                <div className={`group relative h-32 rounded-xl bg-gradient-to-br ${category.color} overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-4xl mb-2">{category.emoji}</span>
                    <span className="text-sm font-semibold text-white group-group-hover:translate-y-1 transition">{category.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Students</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of college students who trust Campusly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah',
                university: 'Stanford University',
                rating: 5,
                comment: 'Saved ₹1000 on textbooks! The process was super smooth.',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
              },
              {
                name: 'Mike',
                university: 'MIT',
                rating: 5,
                comment: 'Sold my old laptop within a week. Great platform!',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
              },
              {
                name: 'Priya',
                university: 'Harvard University',
                rating: 5,
                comment: 'Safe transactions and verified sellers. Highly recommended!',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
              }
            ].map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-purple-300 transition-colors">
                <div className="flex gap-4 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.university}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic">{testimonial.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Save Big?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Campusly today and find amazing deals from students on campus.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link href="/explore">
              Browse Products Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  )
}
