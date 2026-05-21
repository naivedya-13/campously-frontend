import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const sizes = {
  sm: { height: 48, width: 180 },
  md: { height: 56, width: 210 },
  lg: { height: 72, width: 270 },
} as const

type LogoSize = keyof typeof sizes

interface LogoProps {
  size?: LogoSize
  className?: string
  href?: string
}

export function Logo({ size = 'sm', className, href = '/' }: LogoProps) {
  const { height, width } = sizes[size]

  const image = (
    <Image
      src="/campusly-logo.png"
      alt="Campusly"
      width={width}
      height={height}
      className={cn('h-auto w-auto object-contain', className)}
      style={{ maxHeight: height }}
      priority
    />
  )

  if (!href) {
    return image
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  )
}
