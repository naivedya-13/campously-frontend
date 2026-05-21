'use client'

import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/utils/formatters'

interface PriceSliderProps {
  min?: number
  max?: number
  onPriceChange?: (min: number, max: number) => void
}

export function PriceSlider({ min = 0, max = 100000, onPriceChange }: PriceSliderProps) {
  const [priceRange, setPriceRange] = useState([min, max])

  const handleSliderChange = (value: number[]) => {
    setPriceRange(value)
    onPriceChange?.(value[0], value[1])
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]])
      onPriceChange?.(value, priceRange[1])
    }
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || max
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value])
      onPriceChange?.(priceRange[0], value)
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
