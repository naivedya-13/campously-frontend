'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Menu, X, Loader2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { SearchBar } from '@/components/filters/SearchBar'
import { FilterPanel, type FilterState } from '@/components/filters/FilterPanel'
import { Button } from '@/components/ui/button'
import { fetchProducts, productsApi } from '@/lib/api/productsApi'
import { mapProduct } from '@/lib/mappers/product'
import type { Product } from '@/types/product'

export default function ExplorePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    condition: [],
    category: [],
    priceMin: 0,
    priceMax: 100000,
    rating: 0,
    sortBy: 'recent',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit: 12,
      sortBy: filters.sortBy,
      minPrice: filters.priceMin,
      maxPrice: filters.priceMax,
    }
    if (searchQuery) params.q = searchQuery
    if (filters.category[0]) params.category = filters.category[0]
    if (filters.condition[0]) params.condition = filters.condition[0]
    return params
  }, [page, filters, searchQuery])

  const loadProducts = useCallback(
    async (reset = false) => {
      const currentPage = reset ? 1 : page
      if (reset) setLoading(true)
      else setLoadingMore(true)

      try {
        const params = { ...queryParams, page: currentPage }
        const result = searchQuery
          ? await productsApi.search(params)
          : await fetchProducts(params)

        const mapped = result.products.map(mapProduct)
        setProducts((prev) => (reset ? mapped : [...prev, ...mapped]))
        setHasMore(result.pagination.hasMore)
      } catch {
        if (reset) setProducts([])
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [queryParams, searchQuery, page]
  )

  useEffect(() => {
    setPage(1)
    loadProducts(true)
  }, [searchQuery, filters])

  useEffect(() => {
    if (page > 1) loadProducts(false)
  }, [page])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              onSearch={(q) => {
                setSearchQuery(q)
                setPage(1)
              }}
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
    </MainLayout>
  )
}
