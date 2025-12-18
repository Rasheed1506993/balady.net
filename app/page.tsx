"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Search, BarChart2, AlertCircle, LogOut, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSupabaseClient, signOut, getSession } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import LogoLoading from "@/components/logo-loading"
import FastLink from "@/components/fast-link"

export default function Home() {
  const [showEnvWarning, setShowEnvWarning] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const client = getSupabaseClient()
      if (!client) {
        setShowEnvWarning(true)
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await getSession()
        if (error) {
          console.error("Error getting session:", error)
        } else if (data?.session) {
          setIsLoggedIn(true)
          setUserEmail(data.session.user?.email || null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Prefetch الصفحات المهمة
    router.prefetch("/certificates")
    router.prefetch("/search")
    router.prefetch("/dashboard")
    router.prefetch("/create")
  }, [router])

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("balady-auth-token")
        localStorage.removeItem(
          "sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] + "-auth-token",
        )
        sessionStorage.clear()
      }

      const { error } = await signOut()

      if (error) {
        console.error("Error signing out:", error)
      }

      setIsLoggedIn(false)
      setUserEmail(null)

      if ("caches" in window) {
        const cacheNames = await caches.keys()
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }

      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Error during logout:", error)
      setIsLoggedIn(false)
      setUserEmail(null)
      router.push("/login")
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return <LogoLoading size="lg" message="جاري تحميل النظام..." />
  }

  return (
    <div className="min-h-screen bg-gray-50 navigation-optimized">
      <div className="Cairo max-w-4xl mx-auto px-4 py-6 container-optimized" dir="rtl">
        {/* شريط المستخدم العلوي */}
        {isLoggedIn && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 p-4 bg-white rounded-lg shadow-sm gap-3 sm:gap-0 card-optimized">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-teal-700" />
              <span className="text-sm text-gray-600">مرحباً،</span>
              <span className="text-sm font-medium text-teal-700 break-all">{userEmail}</span>
            </div>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50 px-3 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-optimized"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  جاري تسجيل الخروج...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  تسجيل الخروج
                </>
              )}
            </Button>
          </div>
        )}

        {/* تنبيه متغيرات البيئة */}
        {showEnvWarning && (
          <Alert variant="destructive" className="mb-6 transition-optimized">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تنبيه: متغيرات البيئة غير متوفرة</AlertTitle>
            <AlertDescription className="text-sm">
              <p>متغيرات البيئة الخاصة بـ Supabase غير متوفرة. بعض الوظائف قد لا تعمل بشكل صحيح.</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-medium">عرض التفاصيل</summary>
                <div className="mt-2 text-xs">
                  <p>للاستخدام الكامل للتطبيق، يرجى التأكد من إضافة متغيرات البيئة التالية:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                  <p className="mt-2">يمكنك استخدام صفحة التحقق العامة من خلال مسح رمز QR.</p>
                </div>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {/* البطاقة الرئيسية */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center card-optimized">
          {/* الشعار */}
          <div className="mb-6">
            <Image
              src="/images/ministries-logos.png"
              alt="الشعارات الرسمية"
              width={300}
              height={90}
              className="mx-auto max-w-full h-auto"
              priority
              loading="eager"
            />
          </div>

          {/* العنوان الرئيسي */}
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-4 leading-tight">
            نظام الشهادة الصحية الموحدة
          </h1>

          {/* الوصف */}
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            مرحباً بك في نظام الشهادة الصحية الموحدة. يمكنك إنشاء شهادة صحية جديدة أو البحث عن شهادة موجودة.
          </p>

          {/* الأزرار الرئيسية - محسنة للتنقل السريع */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 grid-optimized">
            <FastLink href="/create" className="w-full">
              <Button className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-md flex items-center justify-center gap-2 w-full h-full min-h-[3rem] transition-optimized">
                <PlusCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">إنشاء شهادة جديدة</span>
              </Button>
            </FastLink>

            <FastLink href="/certificates" className="w-full">
              <Button
                variant="outline"
                className="border-teal-700 text-teal-700 hover:bg-teal-50 px-4 py-3 rounded-md flex items-center justify-center gap-2 w-full h-full min-h-[3rem] transition-optimized"
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">عرض جميع الشهادات</span>
              </Button>
            </FastLink>

            <FastLink href="/search" className="w-full">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-md flex items-center justify-center gap-2 w-full h-full min-h-[3rem] transition-optimized"
              >
                <Search className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">البحث عن شهادة</span>
              </Button>
            </FastLink>

            <FastLink href="/dashboard" className="w-full">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-3 rounded-md flex items-center justify-center gap-2 w-full h-full min-h-[3rem] transition-optimized"
              >
                <BarChart2 className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">لوحة التحكم</span>
              </Button>
            </FastLink>
          </div>
        </div>

        {/* قسم المعلومات */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm card-optimized">
          <h2 className="text-lg sm:text-xl font-semibold text-teal-700 mb-4">معلومات عن الشهادة الصحية الموحدة</h2>

          <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            <p>الشهادة الصحية الموحدة هي وثيقة رسمية تصدر للعاملين في منشآت الغذاء والصحة العامة.</p>

            <p>تهدف الشهادة إلى ضمان سلامة العاملين صحياً وخلوهم من الأمراض المعدية التي قد تنتقل عن طريق الغذاء.</p>

            <p>يجب تجديد الشهادة سنوياً وإجراء الفحوصات الطبية اللازمة للحصول عليها.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
