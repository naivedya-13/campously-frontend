'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { MainLayout } from '@/components/layout/MainLayout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Settings</h1>
          <Card className="p-6 space-y-4">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/profile">Edit Profile</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/orders">Order History</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/seller">Seller Dashboard</Link>
            </Button>
          </Card>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
