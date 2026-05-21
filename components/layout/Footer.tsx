'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-4">
              Campusly
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted college marketplace for buying and selling textbooks, electronics, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="text-muted-foreground hover:text-foreground transition">All Products</Link></li>
              <li><Link href="/explore?category=textbooks" className="text-muted-foreground hover:text-foreground transition">Textbooks</Link></li>
              <li><Link href="/explore?category=electronics" className="text-muted-foreground hover:text-foreground transition">Electronics</Link></li>
              <li><Link href="/explore?category=furniture" className="text-muted-foreground hover:text-foreground transition">Furniture</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Safety Tips</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Contact Us</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Cookie Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition">Sitemap</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Campusly. All rights reserved.</p>
            <p>Made with care for college students</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
