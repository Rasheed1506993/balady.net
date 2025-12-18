import { createClient } from "@supabase/supabase-js"
import { fastGetCertificateById } from "./supabase-optimized"

// تعريف عميل Supabase مع التعامل مع حالات عدم توفر متغيرات البيئة
let supabaseClient: ReturnType<typeof createClient> | null = null

// Cache للبيانات المتكررة
const dataCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 دقائق

// دالة للحصول على عميل Supabase مع التعامل مع الأخطاء
export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  // تأكد من أن متغيرات البيئة متوفرة
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // إذا لم تكن متغيرات البيئة متوفرة، أرجع null
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Missing Supabase environment variables")
    return null
  }

  // إنشاء عميل Supabase مع تحسينات الأداء وحفظ الجلسة
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // حفظ الجلسة في localStorage
      autoRefreshToken: true, // تجديد الرمز المميز تلقائياً
      detectSessionInUrl: true, // اكتشاف الجلسة في الرابط
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      storageKey: "balady-auth-token", // مفتاح مخصص للتخزين
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "cache-control": "max-age=300", // cache لمدة 5 دقائق
      },
    },
  })
  return supabaseClient
}

// إنشاء عميل Supabase للاستخدام في جانب العميل (مع التعامل مع الأخطاء)
export const supabase = getSupabaseClient()

// نوع بيانات الشهادة
export interface Certificate {
  id: string
  typeser: string
  thelogo: string
  name: string
  id_number: string
  nationality: string
  profession: string
  certificate_number: string
  issue_date: string
  expiry_date: string
  program_type: string
  program_end_date: string
  photo_url?: string | null
  qr_code_url?: string | null
  created_at?: string
  updated_at?: string
  facility_name?: string
  facility_number?: string
  license_number?: string
  gender?: string
  municipality?: string
  issue_date_gregorian?: string
  expiry_date_gregorian?: string
}

// دالة مساعدة للتحقق من صحة Cache
function isCacheValid(cacheKey: string): boolean {
  const cached = dataCache.get(cacheKey)
  if (!cached) return false
  return Date.now() - cached.timestamp < CACHE_DURATION
}

// دالة مساعدة للحصول من Cache
function getFromCache<T>(cacheKey: string): T | null {
  if (isCacheValid(cacheKey)) {
    return dataCache.get(cacheKey)?.data || null
  }
  return null
}

// دالة مساعدة للحفظ في Cache
function saveToCache(cacheKey: string, data: any): void {
  dataCache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  })
}

// دالة لتحميل الصورة إلى Supabase Storage مع تحسينات
export async function uploadImage(
  file: string, // Base64 encoded image
  path: string,
): Promise<string | null> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // تحسين: تحويل Base64 إلى Blob بشكل أكثر كفاءة
    const base64Data = file.split(",")[1]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: "image/png" })

    // تحميل الملف مع تحسينات
    const fileName = `${path}_${Date.now()}.png`
    const { data, error } = await client.storage.from("certificates").upload(fileName, blob, {
      contentType: "image/png",
      upsert: true,
      cacheControl: "3600", // cache لمدة ساعة
    })

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    // إنشاء URL للصورة
    const { data: urlData } = client.storage.from("certificates").getPublicUrl(fileName)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return null
  }
}

export async function uploadUser(
  file: string, // Base64 encoded image (with data URL prefix)
  path: string,
): Promise<string | null> {
  try {
    const client = getSupabaseClient()
    if (!client) throw new Error("Supabase client not available")

    // استخراج MIME type وبيانات base64
    const matches = file.match(/^data:(.+);base64,(.+)$/)
    if (!matches) throw new Error("Invalid base64 string format")

    const mimeType = matches[1]
    const base64Data = matches[2]

    // تحسين: تحويل أكثر كفاءة
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    // تحديد الامتداد من الـ MIME type
    const extension = mimeType.split("/")[1]
    const fileName = `${path}_${Date.now()}.${extension}`

    const { data, error } = await client.storage.from("certificates").upload(fileName, blob, {
      contentType: mimeType,
      upsert: true,
      cacheControl: "3600",
    })

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    const { data: urlData } = client.storage.from("certificates").getPublicUrl(fileName)
    return urlData.publicUrl
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return null
  }
}

// دالة لإنشاء شهادة جديدة مع تحسينات
export async function createCertificate(certificate: Certificate): Promise<Certificate | null> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    const { data, error } = await client.from("certificates").insert([certificate]).select().single()

    if (error) {
      console.error("Error creating certificate:", error)
      return null
    }

    // تنظيف cache عند إضافة بيانات جديدة
    dataCache.clear()

    return data
  } catch (error) {
    console.error("Error in createCertificate:", error)
    return null
  }
}

// تحديث دالة جلب الشهادة مع استخدام النسخة السريعة للتحقق
export async function getCertificateById(id: string): Promise<Certificate | null> {
  try {
    // استخدام النسخة السريعة للتحقق
    const fastResult = await fastGetCertificateById(id)
    if (fastResult) {
      return fastResult
    }

    // العودة للطريقة العادية في حالة الفشل
    const cacheKey = `certificate_${id}`

    // التحقق من Cache أولاً
    const cachedData = getFromCache<Certificate>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    const { data, error } = await client.from("certificates").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching certificate:", error)
      return null
    }

    // حفظ في Cache
    if (data) {
      saveToCache(cacheKey, data)
    }

    return data
  } catch (error) {
    console.error("Error in getCertificateById:", error)
    return null
  }
}

// دالة للحصول على جميع الشهادات مع cache وpagination
export async function getAllCertificates(page = 0, limit = 50): Promise<Certificate[]> {
  try {
    const cacheKey = `certificates_${page}_${limit}`

    // التحقق من Cache أولاً
    const cachedData = getFromCache<Certificate[]>(cacheKey)
    if (cachedData) {
      return cachedData
    }

    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
      return []
    }

    const { data, error } = await client
      .from("certificates")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1)

    if (error) {
      console.error("Error fetching certificates:", error)
      return []
    }

    const result = data || []

    // حفظ في Cache
    saveToCache(cacheKey, result)

    return result
  } catch (error) {
    console.error("Error in getAllCertificates:", error)
    return []
  }
}

export async function updateCertificate(id: string, updates: Partial<Certificate>): Promise<boolean> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // نستثني حقل qr_code_url من التحديث
    const { qr_code_url, ...updateData } = updates

    const { error } = await client.from("certificates").update(updateData).eq("id", id)

    if (error) {
      console.error("Error updating certificate:", error)
      return false
    }

    // تنظيف cache عند التحديث
    dataCache.delete(`certificate_${id}`)
    // تنظيف cache للقوائم أيضاً
    for (const key of dataCache.keys()) {
      if (key.startsWith("certificates_")) {
        dataCache.delete(key)
      }
    }

    return true
  } catch (error) {
    console.error("Error in updateCertificate:", error)
    return false
  }
}

// دالة لحذف شهادة بواسطة المعرف مع تحسينات
export async function deleteCertificate(id: string): Promise<boolean> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // 1. جلب بيانات الشهادة أولاً للحصول على روابط الملفات
    const { data: certificate, error: fetchError } = await client
      .from("certificates")
      .select("photo_url, qr_code_url")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching certificate:", fetchError)
      return false
    }

    // 2. حذف الملفات من التخزين إذا كانت موجودة
    if (certificate) {
      const extractFileName = (url: string) => {
        if (!url) return null
        const parts = url.split("/")
        return parts[parts.length - 1]
      }

      const filesToDelete = [extractFileName(certificate.photo_url), extractFileName(certificate.qr_code_url)].filter(
        Boolean,
      )

      if (filesToDelete.length > 0) {
        const { error: storageError } = await client.storage.from("certificates").remove(filesToDelete)

        if (storageError) {
          console.error("Error deleting files:", storageError)
        }
      }
    }

    // 3. حذف سجل الشهادة من قاعدة البيانات
    const { error: deleteError } = await client.from("certificates").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting certificate:", deleteError)
      return false
    }

    // تنظيف cache عند الحذف
    dataCache.delete(`certificate_${id}`)
    // تنظيف cache للقوائم أيضاً
    for (const key of dataCache.keys()) {
      if (key.startsWith("certificates_")) {
        dataCache.delete(key)
      }
    }

    return true
  } catch (error) {
    console.error("Error in deleteCertificate:", error)
    return false
  }
}

// دالة لتنظيف Cache يدوياً
export function clearCache(): void {
  dataCache.clear()
}

// تحسين دالة signOut لتكون أكثر موثوقية:

export async function signOut() {
  const client = getSupabaseClient()
  if (!client) return { error: { message: "Supabase client not available" } }

  try {
    // تسجيل الخروج من Supabase
    const { error } = await client.auth.signOut()

    // تنظيف الـ cache المحلي
    clearCache()

    // تنظيف localStorage بشكل شامل
    if (typeof window !== "undefined") {
      // إزالة جميع مفاتيح Supabase
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes("supabase") || key.includes("balady") || key.includes("sb-"))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))

      // تنظيف sessionStorage أيضاً
      sessionStorage.clear()
    }

    // إعادة تعيين عميل Supabase لضمان التنظيف الكامل
    supabaseClient = null

    return { error }
  } catch (error) {
    console.error("Error in signOut:", error)

    // في حالة الخطأ، نقوم بالتنظيف المحلي على أي حال
    clearCache()
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }
    supabaseClient = null

    return { error: error as any }
  }
}

// دالة للتحقق من حالة المصادقة مع استرجاع الجلسة المحفوظة
export async function getSession() {
  const client = getSupabaseClient()
  if (!client) return { data: { session: null }, error: { message: "Supabase client not available" } }

  const { data, error } = await client.auth.getSession()
  return { data, error }
}

// دالة للحصول على المستخدم الحالي
export async function getCurrentUser() {
  const client = getSupabaseClient()
  if (!client) return { data: { user: null }, error: { message: "Supabase client not available" } }

  const { data, error } = await client.auth.getUser()
  return { data, error }
}

// دالة للاستماع لتغييرات حالة المصادقة
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const client = getSupabaseClient()
  if (!client) return { data: { subscription: null } }

  const { data } = client.auth.onAuthStateChange(callback)
  return { data }
}

// دالة لتسجيل الدخول مع حفظ الجلسة
export async function signIn(email: string, password: string) {
  const client = getSupabaseClient()
  if (!client) return { error: { message: "Supabase client not available" } }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  // إذا تم تسجيل الدخول بنجاح، سيتم حفظ الجلسة تلقائياً
  if (data.session) {
    console.log("Session saved successfully")
  }

  return { data, error }
}
