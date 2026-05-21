import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        404
      </h1>
      <p className="mt-4 text-xl text-muted-foreground">Page not found</p>
      <Button asChild className="mt-8">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  )
}
