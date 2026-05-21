'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Menu, X, Loader2, ShoppingCart } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatters'
import { ProductCard } from '@/components/product/ProductCard'
import { SearchBar } from '@/components/filters/SearchBar'
import { FilterPanel, type FilterState } from '@/components/filters/FilterPanel'
import { Button } from '@/components/ui/button'
import { fetchProducts } from '@/lib/api/productsApi'
import { mapProduct } from '@/lib/mappers/product'
import type { Product, ProductCategory } from '@/types/product'

const defaultFilters: FilterState = {
  condition: [],
  category: [],
  priceMin: 0,
  priceMax: 100000,
  rating: 0,
  sortBy: 'recent',
}

function ExploreContent() {
  const { user } = useAuth()
  const { itemCount, total } = useCart()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    const category = searchParams.get('category')
    setSearchQuery(q)
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category: [category as ProductCategory],
      }))
    }
  }, [searchParams])

  const apiSortBy = filters.sortBy === 'popular' ? 'trending' : filters.sortBy

  const buildParams = useCallback(
    (pageNum: number) => {
      const params: Record<string, string | number> = {
        page: pageNum,
        limit: 12,
        sortBy: apiSortBy,
      }
      if (filters.priceMin > 0) params.minPrice = filters.priceMin
      if (filters.priceMax < 100000) params.maxPrice = filters.priceMax
      if (searchQuery.trim()) params.q = searchQuery.trim()
      if (filters.category[0]) params.category = filters.category[0]
      if (filters.condition[0]) params.condition = filters.condition[0]
      return params
    },
    [apiSortBy, filters, searchQuery]
  )

  const loadProducts = useCallback(
    async (pageNum: number, reset: boolean) => {
      if (reset) setLoading(true)
      else setLoadingMore(true)

      try {
        const result = await fetchProducts(buildParams(pageNum))
        const mapped = result.products.map(mapProduct)
        setProducts((prev) => (reset ? mapped : [...prev, ...mapped]))
        setHasMore(result.pagination.hasMore)
      } catch {
        if (reset) setProducts([])
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [buildParams]
  )

  useEffect(() => {
    setPage(1)
    loadProducts(1, true)
  }, [searchQuery, filters, loadProducts])

  useEffect(() => {
    if (page > 1) loadProducts(page, false)
  }, [page, loadProducts])

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          Filters
        </Button>
      </div>

      {user && itemCount > 0 && (
        <Link
          href="/cart"
          className="flex items-center justify-between gap-4 mb-6 px-4 py-3 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-400 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            </span>
            <div>
              <p className="font-semibold text-purple-900">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-sm text-purple-700">{formatPrice(total)} total</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-purple-600 shrink-0">View Cart →</span>
        </Link>
      )}

      <div className="flex gap-8">
        <aside
          className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}
        >
          <FilterPanel filters={filters} onChange={setFilters} />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-xl">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    disabled={loadingMore}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>
        }
      >
        <ExploreContent />
      </Suspense>
    </MainLayout>
  )
}
