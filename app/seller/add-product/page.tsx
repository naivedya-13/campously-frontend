'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { homeApi } from '@/lib/api/homeApi'
import { sellerApi } from '@/lib/api/sellerApi'
import { uploadApi } from '@/lib/api/uploadApi'
import {
  ProductImageUpload,
  type LocalImage,
} from '@/components/product/ProductImageUpload'
import { toast } from 'sonner'

function AddProductContent() {
  const router = useRouter()
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string; slug: string }>
  >([])
  const [loading, setLoading] = useState(false)
  const [localImages, setLocalImages] = useState<LocalImage[]>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '1',
    categoryId: '',
    condition: 'GOOD',
    location: 'On Campus',
  })

  useEffect(() => {
    homeApi.categories().then((r) => setCategories(r.categories))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (localImages.length === 0) {
      toast.error('Please add at least one product photo')
      return
    }

    setLoading(true)
    try {
      const imageUrls = await uploadApi.productImages(
        localImages.map((img) => img.file)
      )

      await sellerApi.createProduct({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        stock: parseInt(form.stock, 10),
        categoryId: parseInt(form.categoryId, 10),
        images: imageUrls,
      })

      localImages.forEach((img) => URL.revokeObjectURL(img.preview))
      toast.success('Product listed!')
      router.push('/seller/products')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Add Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <ProductImageUpload images={localImages} onChange={setLocalImages} />

        <Input
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <textarea
          className="w-full border border-border rounded-lg p-3 min-h-[100px] bg-background"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>
        <Input
          type="number"
          placeholder="Original price (₹) optional"
          value={form.originalPrice}
          onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
        />
        <select
          className="w-full border border-border rounded-lg p-2 bg-background"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="w-full border border-border rounded-lg p-2 bg-background"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        >
          <option value="BRAND_NEW">Brand New</option>
          <option value="LIKE_NEW">Like New</option>
          <option value="GOOD">Good</option>
          <option value="FAIR">Fair</option>
        </select>
        <Input
          placeholder="Pickup location (e.g. Main Hostel Gate)"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Uploading & listing...' : 'List Product'}
        </Button>
      </form>
    </div>
  )
}

export default function AddProductPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <AddProductContent />
      </MainLayout>
    </ProtectedRoute>
  )
}
