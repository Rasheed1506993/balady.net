import { createClient } from "@supabase/supabase-js"
import type { Certificate } from "./supabase"

// عميل Supabase محسن للتحقق السريع
let fastClient: ReturnType<typeof createClient> | null = null

// Cache محسن للتحقق السريع
const verifyCache = new Map<string, { data: Certificate; timestamp: number }>()
const VERIFY_CACHE_DURATION = 2 * 60 * 1000 // دقيقتان فقط للتحقق

export function getFastSupabaseClient() {
  if (fastClient) return fastClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables")
    return null
  }

  // إعدادات محسنة للسرعة
  fastClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // لا نحتاج جلسة للتحقق
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    // schema not explicitly set here to avoid typing conflicts with @supabase/supabase-js typings
    realtime: {
      params: {
        eventsPerSecond: 2, // تقليل الأحداث
      },
    },
  })

  return fastClient
}

// دالة التحقق السريع من الشهادة
export async function fastGetCertificateById(id: string): Promise<Certificate | null> {
  try {
    const cacheKey = `verify_${id}`

    // التحقق من Cache أولاً
    const cached = verifyCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < VERIFY_CACHE_DURATION) {
      return cached.data
    }

    const client = getFastSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // جلب الحقول الأساسية فقط للسرعة
    const { data, error } = await client
      .from("certificates")
      .select(`
        id,
        name,
        id_number,
        nationality,
        profession,
        certificate_number,
        issue_date,
        expiry_date,
        program_type,
        program_end_date,
        photo_url,
        typeser,
        municipality,
        gender,
        issue_date_gregorian,
        expiry_date_gregorian,
        facility_name,
        facility_number,
        license_number
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching certificate:", error)
      return null
    }

    // حفظ في Cache
    if (data) {
      verifyCache.set(cacheKey, {
        data: data as Certificate,
        timestamp: Date.now(),
      })
    }

    return data as Certificate
  } catch (error) {
    console.error("Error in fastGetCertificateById:", error)
    return null
  }
}

// تنظيف Cache دورياً
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of verifyCache.entries()) {
    if (now - value.timestamp > VERIFY_CACHE_DURATION) {
      verifyCache.delete(key)
    }
  }
}, 60000) // كل دقيقة
