"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NavigationOptimizer() {
  const router = useRouter()

  useEffect(() => {
    // تحسين التنقل السريع
    const optimizeNavigation = () => {
      // Prefetch الصفحات المهمة
      const importantPages = ["/certificates", "/search", "/dashboard", "/create"]

      importantPages.forEach((page) => {
        router.prefetch(page)
      })

      // تحسين الروابط عند hover
      const handleLinkHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest("a")

        if (link && link.href && link.href.startsWith(window.location.origin)) {
          const path = new URL(link.href).pathname
          router.prefetch(path)
        }
      }

      // إضافة مستمع للـ hover
      document.addEventListener("mouseover", handleLinkHover, { passive: true })

      // تنظيف المستمع
      return () => {
        document.removeEventListener("mouseover", handleLinkHover)
      }
    }

    // تشغيل التحسين بعد تحميل الصفحة
    const timer = setTimeout(optimizeNavigation, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [router])

  return null
}
