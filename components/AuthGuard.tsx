// components/AuthGuard.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

// تأكد من استخدام export default هنا
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const publicPaths = [
        "/login",
        "/verify",
      ]

      const isPublicPath = publicPaths.some(path => 
        pathname?.startsWith(path)
      )

      if (isPublicPath) {
        setLoading(false)
        return
      }

      const { data } = await getSession()
      
      if (!data?.session) {
        router.push("/login")
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
      </div>
    )
  }

  return <>{children}</>
}