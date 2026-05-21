'use client'

import { Mail, MapPin, Building2, Calendar, Edit2, Save, X } from 'lucide-react'
import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { formatDate } from '@/utils/formatters'

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || ''
  })

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Please login to view your profile</h1>
          <Button asChild>
            <a href="/auth/login">Login</a>
          </Button>
        </div>
      </MainLayout>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile(formData)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        {/* Profile Header Card */}
        <Card className="p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center md:items-start">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-32 w-32 rounded-full mb-4"
              />
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {user.verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">{user.name}</h2>

              {!isEditing ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="h-5 w-5" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building2 className="h-5 w-5" />
                      <span>{user.university}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-5 w-5" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span>Joined {formatDate(user.joinedDate)}</span>
                    </div>
                  </div>

                  <Button onClick={() => setIsEditing(true)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium block mb-2">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Your campus location"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Buyer Rating</p>
            <p className="text-3xl font-bold text-purple-600">{user.rating || 'N/A'}</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Role</p>
            <p className="text-3xl font-bold capitalize text-blue-600">{user.role}</p>
          </Card>

          <Card className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Account Status</p>
            <p className="text-3xl font-bold text-green-600">{user.verified ? 'Verified' : 'Pending'}</p>
          </Card>
        </div>

        {/* Account Settings */}
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-6">Account Settings</h3>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Preferences
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}
