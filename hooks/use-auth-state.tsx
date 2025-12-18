"use client"

import { useState, useEffect } from "react"
import { getSession, onAuthStateChange } from "@/lib/supabase"

export function useAuthState() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data, error } = await getSession()

        if (mounted) {
          if (error) {
            console.error("Error getting session:", error)
            setIsLoggedIn(false)
            setUserEmail(null)
          } else if (data?.session) {
            setIsLoggedIn(true)
            setUserEmail(data.session.user?.email || null)
          } else {
            setIsLoggedIn(false)
            setUserEmail(null)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        if (mounted) {
          setIsLoggedIn(false)
          setUserEmail(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    // التحقق الأولي
    checkAuth()

    // الاستماع لتغييرات حالة المصادقة
    const { data: subscription } = onAuthStateChange((event, session) => {
      if (mounted) {
        if (event === "SIGNED_OUT" || !session) {
          setIsLoggedIn(false)
          setUserEmail(null)
        } else if (event === "SIGNED_IN" && session) {
          setIsLoggedIn(true)
          setUserEmail(session.user?.email || null)
        }
      }
    })

    return () => {
      mounted = false
      if (subscription?.subscription) {
        subscription.subscription.unsubscribe()
      }
    }
  }, [])

  return {
    isLoggedIn,
    userEmail,
    isLoading,
    setIsLoggedIn,
    setUserEmail,
  }
}
