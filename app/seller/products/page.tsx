'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Plus } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { sellerApi } from '@/lib/api/sellerApi'
import { mapProduct } from '@/lib/mappers/product'
import type { Product } from '@/types/product'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/button'

function SellerProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sellerApi.products().then((r) => setProducts(r.products.map(mapProduct))).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Button asChild>
          <Link href="/seller/add-product"><Plus className="h-4 w-4 mr-2" />Add</Link>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-purple-600" /></div>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">No products listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}

export default function SellerProductsPage() {
  return (
    <ProtectedRoute>
      <MainLayout><SellerProductsContent /></MainLayout>
    </ProtectedRoute>
  )
}
