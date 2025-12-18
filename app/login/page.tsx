"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import LogoLoading from "@/components/logo-loading"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()

  // التحقق من وجود جلسة نشطة عند تحميل الصفحة
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data } = await getSession()
        if (data?.session) {
          // إذا كان المستخدم مسجل دخوله مسبقاً، توجيهه للصفحة الرئيسية
          router.push("/")
          return
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setCheckingSession(false)
      }
    }

    checkExistingSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError(error.message || "فشل تسجيل الدخول. يرجى التحقق من البيانات المدخلة.")
        setIsLoading(false)
      } else if (data.session) {
        // تسجيل الدخول نجح والجلسة محفوظة
        router.push("/")
      }
    } catch (err) {
      setError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.")
      setIsLoading(false)
    }
  }

  // عرض شاشة التحميل أثناء التحقق من الجلسة
  if (checkingSession) {
    return <LogoLoading size="large" message="جاري التحقق من الجلسة..." />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="Cairo max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-teal-700 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600">أدخل بياناتك للوصول إلى النظام</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ في تسجيل الدخول</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="أدخل بريدك الإلكتروني"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              كلمة المرور
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pr-10"
                placeholder="أدخل كلمة المرور"
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                جاري تسجيل الدخول...
              </div>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">سيتم حفظ جلستك تلقائياً ولن تحتاج لتسجيل الدخول مرة أخرى</p>
        </div>
      </div>
    </div>
  )
}
