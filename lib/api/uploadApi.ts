import { apiClient } from './client'

export const uploadApi = {
  productImages: async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => formData.append('images', file))

    const res = await apiClient.post<{ urls: string[]; message: string }>(
      '/upload/product-images',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
    return res.data.urls
  },
}
