import { createClient } from "@supabase/supabase-js"

// تعريف عميل Supabase مع التعامل مع حالات عدم توفر متغيرات البيئة
let supabaseClient: ReturnType<typeof createClient> | null = null

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

  // إنشاء عميل Supabase
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
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

// دالة لتحميل الصورة إلى Supabase Storage
export async function uploadImage(
  file: string, // Base64 encoded image
  path: string,
): Promise<string | null> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // تحويل Base64 إلى Blob
    const base64Data = file.split(",")[1]
    const blob = await fetch(`data:image/png;base64,${base64Data}`).then((res) => res.blob())

    // تحميل الملف - نفترض أن bucket "certificates" موجود مسبقاً
    const fileName = `${path}_${Date.now()}.png`
    const { data, error } = await client.storage.from("certificates").upload(fileName, blob, {
      contentType: "image/png",
      upsert: true,
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

    const mimeType = matches[1] // مثل: image/jpeg أو image/webp
    const base64Data = matches[2]
    const blob = await fetch(`data:${mimeType};base64,${base64Data}`).then(res => res.blob())

    // تحديد الامتداد من الـ MIME type
    const extension = mimeType.split("/")[1] // مثل: jpeg أو png
    const fileName = `${path}_${Date.now()}.${extension}`

    const { data, error } = await client.storage.from("certificates").upload(fileName, blob, {
      contentType: mimeType,
      upsert: true,
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


// دالة لإنشاء شهادة جديدة
export async function createCertificate(
  certificate: Certificate // ← تغيير من Omit إلى Certificate كامل
): Promise<Certificate | null> {
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

    return data
  } catch (error) {
    console.error("Error in createCertificate:", error)
    return null
  }
}

// دالة محسنة لجلب الشهادة بواسطة المعرف مع تحسينات الأداء
export async function getCertificateById(id: string): Promise<Certificate | null> {
  // التحقق من صحة المعرف قبل أي عملية
  if (!id || typeof id !== 'string') {
    console.error('Invalid certificate ID');
    return null;
  }

  try {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase client not available");
    }

    // استخدام استعلام أكثر كفاءة مع تحديد الحقول المطلوبة فقط
    const { data, error } = await client
      .from("certificates")
      .select(`
        id,
        typeser,
        thelogo,
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
        qr_code_url,
        created_at,
        updated_at,
        facility_name,
        facility_number,
        license_number,
        gender,
        municipality,
        issue_date_gregorian,
        expiry_date_gregorian
      `)
      .eq("id", id)
      .single()
      .throwOnError(); // تحويل الأخطاء تلقائياً إلى exceptions

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // تحسين معالجة روابط الصور
    const processImageUrl = async (url: string | null | undefined) => {
      if (!url || url.includes("?")) return url;
      
      try {
        const fileName = url.split("/").pop() || "";
        const { data: publicUrlData } = client.storage
          .from("certificates")
          .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      } catch (e) {
        console.error("Error processing image URL:", e);
        return url;
      }
    };

    // معالجة روابط الصور بشكل متوازي
    const [photoUrl, qrCodeUrl] = await Promise.all([
      processImageUrl(data.photo_url),
      processImageUrl(data.qr_code_url)
    ]);

    return {
      ...data,
      photo_url: photoUrl || data.photo_url,
      qr_code_url: qrCodeUrl || data.qr_code_url
    };

  } catch (error) {
    console.error("Error in getCertificateById:", error);
    return null;
  }
}
// دالة للحصول على جميع الشهادات

export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
      return []
    }

    const { data, error } = await client.from("certificates").select("*").order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching certificates:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllCertificates:", error)
    return []
  }
}

export async function updateCertificate(
  id: string,
  updates: Partial<Certificate>
): Promise<boolean> {
  try {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error("Supabase client not available")
    }

    // نستثني حقل qr_code_url من التحديث
    const { qr_code_url, ...updateData } = updates

    const { error } = await client
      .from("certificates")
      .update(updateData)
      .eq("id", id)

    if (error) {
      console.error("Error updating certificate:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateCertificate:", error)
    return false
  }
}

// دالة لحذف شهادة بواسطة المعرف
// دالة لحذف شهادة بواسطة المعرف
export async function deleteCertificate(id: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase client not available");
    }

    // 1. جلب بيانات الشهادة أولاً للحصول على روابط الملفات
    const { data: certificate, error: fetchError } = await client
      .from("certificates")
      .select("photo_url, qr_code_url")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching certificate:", fetchError);
      return false;
    }

    // 2. حذف الملفات من التخزين إذا كانت موجودة
    if (certificate) {
      // دالة مساعدة لاستخراج اسم الملف من الرابط
      const extractFileName = (url: string) => {
        if (!url) return null;
        const parts = url.split('/');
        return parts[parts.length - 1];
      };

      const photoFile = extractFileName(certificate.photo_url);
      const qrFile = extractFileName(certificate.qr_code_url);

      // حذف الصورة الشخصية إذا كانت موجودة
      if (photoFile) {
        const { error: photoError } = await client
          .storage
          .from("certificates")
          .remove([photoFile]);

        if (photoError) {
          console.error("Error deleting photo:", photoError);
          // يمكنك اختيار ما إذا كنت تريد المتابعة أو الإيقاف هنا
        }
      }

      // حذف صورة QR Code إذا كانت موجودة
      if (qrFile) {
        const { error: qrError } = await client
          .storage
          .from("certificates")
          .remove([qrFile]);

        if (qrError) {
          console.error("Error deleting QR code:", qrError);
          // يمكنك اختيار ما إذا كنت تريد المتابعة أو الإيقاف هنا
        }
      }
    }

    // 3. حذف سجل الشهادة من قاعدة البيانات
    const { error: deleteError } = await client
      .from("certificates")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting certificate:", deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteCertificate:", error);
    return false;
  }
}



// دالة لتسجيل الدخول
export async function signIn(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) return { error: { message: "Supabase client not available" } };

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

// دالة لتسجيل الخروج
export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return { error: { message: "Supabase client not available" } };

  const { error } = await client.auth.signOut();
  return { error };
}

// دالة للتحقق من حالة المصادقة
export async function getSession() {
  const client = getSupabaseClient();
  if (!client) return { data: { session: null }, error: { message: "Supabase client not available" } };

  const { data, error } = await client.auth.getSession();
  return { data, error };
}