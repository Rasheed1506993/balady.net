"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, type ReactNode } from "react"

interface FastLinkProps {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
}

export default function FastLink({ href, children, className, prefetch = true }: FastLinkProps) {
  const router = useRouter()

  const handleMouseEnter = useCallback(() => {
    if (prefetch) {
      router.prefetch(href)
    }
  }, [router, href, prefetch])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // تحسين التنقل للروابط الداخلية
      if (href.startsWith("/")) {
        e.preventDefault()
        router.push(href)
      }
    },
    [router, href],
  )

  return (
    <Link href={href} className={className} onMouseEnter={handleMouseEnter} onClick={handleClick} prefetch={prefetch}>
      {children}
    </Link>
  )
}
