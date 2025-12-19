"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession, onAuthStateChange } from "@/lib/supabase"
import LogoLoading from "@/components/logo-loading"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      // المسارات العامة التي لا تحتاج مصادقة
      const publicPaths = ["/login", "/verify", "/public-verify"]

      const isPublicPath = publicPaths.some((path) => pathname?.startsWith(path))

      if (isPublicPath) {
        setLoading(false)
        return
      }

      // التحقق من الجلسة المحفوظة
      const { data, error } = await getSession()

      if (error) {
        console.error("Error checking session:", error)
        router.push("/login")
        return
      }

      if (!data?.session) {
        router.push("/login")
      } else {
        setIsAuthenticated(true)
        setLoading(false)
      }
    }

    checkAuth()

    // الاستماع لتغييرات حالة المصادقة
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true)
        setLoading(false)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        router.push("/login")
      } else if (event === "TOKEN_REFRESHED") {
        // تم تجديد الرمز المميز بنجاح
        console.log("Token refreshed successfully")
      }
    })

    // تنظيف المستمع عند إلغاء تحميل المكون
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [pathname, router])

  if (loading) {
    return <LogoLoading size="lg"/>
  }

  return <>{children}</>
}
