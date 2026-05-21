'use client'

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const MAX_FILES = 6
const MAX_SIZE_MB = 5

export interface LocalImage {
  id: string
  file: File
  preview: string
}

interface ProductImageUploadProps {
  images: LocalImage[]
  onChange: (images: LocalImage[]) => void
}

export function ProductImageUpload({ images, onChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  const addFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return
    setError('')

    const next = [...images]
    for (const file of Array.from(fileList)) {
      if (next.length >= MAX_FILES) {
        setError(`Maximum ${MAX_FILES} images allowed`)
        break
      }
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed')
        continue
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB`)
        continue
      }
      next.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
      })
    }
    onChange(next)
  }

  const removeImage = (id: string) => {
    const removed = images.find((i) => i.id === id)
    if (removed) URL.revokeObjectURL(removed.preview)
    onChange(images.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Product photos</label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onDrop={(e) => {
          e.preventDefault()
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer',
          'hover:border-purple-400 hover:bg-purple-50/50 transition'
        )}
      >
        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="font-medium">Click to upload or drag and drop</p>
        <p className="text-xs text-muted-foreground mt-1">
          PNG, JPG, WEBP up to {MAX_SIZE_MB}MB · max {MAX_FILES} images
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted"
            >
              <img
                src={img.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-purple-400 transition"
            >
              <ImageIcon className="h-6 w-6 mb-1" />
              <span className="text-xs">Add more</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
