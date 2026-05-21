'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/utils/formatters'

interface PriceSliderProps {
  min?: number
  max?: number
  value?: [number, number]
  onPriceChange?: (min: number, max: number) => void
}

export function PriceSlider({ min = 0, max = 100000, value, onPriceChange }: PriceSliderProps) {
  const [internalRange, setInternalRange] = useState<[number, number]>([min, max])
  const priceRange = value ?? internalRange

  const updateRange = (next: [number, number]) => {
    if (!value) setInternalRange(next)
    onPriceChange?.(next[0], next[1])
  }

  const handleSliderChange = (next: number[]) => {
    updateRange([next[0], next[1]])
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMin = parseInt(e.target.value) || 0
    if (nextMin <= priceRange[1]) {
      updateRange([nextMin, priceRange[1]])
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextMax = parseInt(e.target.value) || max
    if (nextMax >= priceRange[0]) {
      updateRange([priceRange[0], nextMax])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Price Range</h3>
      
      <Slider
        min={min}
        max={max}
        step={100}
        value={priceRange}
        onValueChange={handleSliderChange}
        className="w-full"
      />

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Min</label>
          <Input
            type="number"
            value={priceRange[0]}
            onChange={handleMinChange}
            min={min}
            max={priceRange[1]}
            className="text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1 block">Max</label>
          <Input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxChange}
            min={priceRange[0]}
            max={max}
            className="text-sm"
          />
        </div>
      </div>

      <div className="text-sm font-semibold">
        {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
      </div>
    </div>
  )
}
