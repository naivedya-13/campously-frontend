'use client'

import { useState, useMemo } from 'react'
import { Menu, X } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProductCard } from '@/components/product/ProductCard'
import { SearchBar } from '@/components/filters/SearchBar'
import { FilterPanel, type FilterState } from '@/components/filters/FilterPanel'
import { Button } from '@/components/ui/button'
import { products } from '@/data/products'
import type { Product } from '@/types/product'

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    condition: [],
    category: [],
    priceMin: 0,
    priceMax: 100000,
    rating: 0,
    sortBy: 'recent'
  })
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product: Product) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !product.name.toLowerCase().includes(query) &&
          !product.description.toLowerCase().includes(query) &&
          !product.sellerName.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Price range
      if (product.price < filters.priceMin || product.price > filters.priceMax) {
        return false
      }

      // Condition
      if (filters.condition.length > 0 && !filters.condition.includes(product.condition)) {
        return false
      }

      // Category
      if (filters.category.length > 0 && !filters.category.includes(product.category)) {
        return false
      }

      // Rating
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false
      }

      return true
    })

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price)
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price)
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating)
      case 'popular':
        return filtered.sort((a, b) => b.reviews - a.reviews)
      case 'recent':
      default:
        return filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    }
  }, [searchQuery, filters])

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Products</h1>
          <p className="text-muted-foreground">
            Browse {filteredProducts.length} products available on Campusly
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search products, sellers, categories..."
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mb-6 md:hidden flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full"
          >
            {showFilters ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Hide Filters
              </>
            ) : (
              <>
                <Menu className="mr-2 h-4 w-4" />
                Show Filters
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterPanel
              onFilterChange={setFilters}
              isOpen={true}
            />
          </div>

          {/* Mobile Filters Modal */}
          {showFilters && (
            <div className="fixed inset-0 z-40 md:hidden bg-black/50" onClick={() => setShowFilters(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-background overflow-y-auto" onClick={e => e.stopPropagation()}>
                <FilterPanel
                  onFilterChange={(newFilters) => {
                    setFilters(newFilters)
                    setShowFilters(false)
                  }}
                  isOpen={showFilters}
                  onClose={() => setShowFilters(false)}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setFilters({
                      condition: [],
                      category: [],
                      priceMin: 0,
                      priceMax: 100000,
                      rating: 0,
                      sortBy: 'recent'
                    })
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
