'use client'

import { X } from 'lucide-react'
import { PriceSlider } from './PriceSlider'
import { Button } from '@/components/ui/button'
import type { ProductCondition, ProductCategory } from '@/types/product'

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void
  isOpen?: boolean
  onClose?: () => void
}

export interface FilterState {
  condition: ProductCondition[]
  category: ProductCategory[]
  priceMin: number
  priceMax: number
  rating: number
  sortBy: 'recent' | 'price-low' | 'price-high' | 'rating' | 'popular'
}

const conditions: { id: ProductCondition; label: string }[] = [
  { id: 'brand-new', label: 'Brand New' },
  { id: 'like-new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' }
]

const categories: { id: ProductCategory; label: string }[] = [
  { id: 'textbooks', label: 'Textbooks' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'sports', label: 'Sports' },
  { id: 'other', label: 'Other' }
]

const sortOptions: { id: FilterState['sortBy']; label: string }[] = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
  { id: 'popular', label: 'Most Popular' }
]

export function FilterPanel({ onFilterChange, isOpen = true, onClose }: FilterPanelProps) {
  const [filters, setFilters] = React.useState<FilterState>({
    condition: [],
    category: [],
    priceMin: 0,
    priceMax: 100000,
    rating: 0,
    sortBy: 'recent'
  })

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFilterChange?.(updated)
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      condition: [],
      category: [],
      priceMin: 0,
      priceMax: 100000,
      rating: 0,
      sortBy: 'recent'
    }
    setFilters(resetFilters)
    onFilterChange?.(resetFilters)
  }

  const toggleCondition = (condition: ProductCondition) => {
    const updated = filters.condition.includes(condition)
      ? filters.condition.filter(c => c !== condition)
      : [...filters.condition, condition]
    handleFilterChange({ condition: updated })
  }

  const toggleCategory = (category: ProductCategory) => {
    const updated = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category]
    handleFilterChange({ category: updated })
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-6 h-fit sticky top-20 ${isOpen ? '' : 'hidden'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        {onClose && (
          <button onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-semibold mb-3">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map(option => (
            <label key={option.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.id}
                checked={filters.sortBy === option.id}
                onChange={() => handleFilterChange({ sortBy: option.id })}
                className="w-4 h-4"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-border">
        <PriceSlider
          min={0}
          max={100000}
          onPriceChange={(min, max) => handleFilterChange({ priceMin: min, priceMax: max })}
        />
      </div>

      {/* Condition */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          {conditions.map(condition => (
            <label key={condition.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.condition.includes(condition.id)}
                onChange={() => toggleCondition(condition.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{condition.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-semibold mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
                className="w-4 h-4"
              />
              <span className="text-sm">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6 pb-6 border-b border-border">
        <h3 className="font-semibold mb-3">Rating</h3>
        <div className="space-y-2">
          {[4.5, 4, 3.5, 3].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.rating === rating}
                onChange={() => handleFilterChange({ rating })}
                className="w-4 h-4"
              />
              <span className="text-sm">{rating}★ & above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={handleReset}
        className="w-full"
      >
        Reset Filters
      </Button>
    </div>
  )
}

import React from 'react'
