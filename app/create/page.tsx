"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createCertificate, uploadImage,uploadUser, getSupabaseClient } from "@/lib/supabase"

export default function CreateCertificate() {
 
  const router = useRouter()
  const qrRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null);
  const [certificateId, setCertificateId] = useState("")
  const [formData, setFormData] = useState({
    typeser: "أمانة محافظة الطائف",
    thelogo: "",
    name: "",
    id_number: "",
    nationality: "",
    profession: "",
    certificate_number: "",
    issue_date: "",
    expiry_date: "",
    program_type: "",
    program_end_date: "",
    facility_name: "",
    facility_number: "",
    license_number: "",
    gender: "ذكر",
    municipality: "",
    issue_date_gregorian: "",
    expiry_date_gregorian: "",
  })

  const [photo, setPhoto] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [qrGenerated, setQrGenerated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storageError, setStorageError] = useState<boolean>(false)
  const [supabaseAvailable, setSupabaseAvailable] = useState(true)
  const [verificationUrl, setVerificationUrl] = useState("")

  useEffect(() => {
    setIsClient(true)
    const client = getSupabaseClient()
    if (!client) {
      setSupabaseAvailable(false)
    }
  }, [])

  useEffect(() => {
    const newId = uuidv4()
    setCertificateId(newId)
    setVerificationUrl(`${window.location.origin}/verify/${newId}`)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 const municipalityLogos = {
  "أمانة منطقة الرياض": "riyadh.jpg",
  "أمانة محافظة جدة": "jeddah.jpg",
  "أمانة العاصمة المقدسة": "makah.jpg",
  "أمانة منطقة المدينة المنورة": "madinah.png",
  "أمانة محافظة الطائف": "Taif.jpg",
  "أمانة محافظة نجران": "Najran.jpg",
  "أمانة منطقة عسير": "assir.jpg"
}

const handleTypeserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedValue = e.target.value
  const logo = municipalityLogos[selectedValue] || ""

  setFormData((prev) => ({
    ...prev,
    typeser: selectedValue,
    thelogo: logo,
  }))
}


  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateQRCodeImage = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas")
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png")
        setQrCode(dataURL)
        setQrGenerated(true)
        return dataURL
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  setError(null)
  setStorageError(false)

  // ✅ تحقق من اختيار "الأمانة"
  if (!formData.thelogo || formData.thelogo.trim() === "") {
  setError("يرجى تحديد قيمة حقل \"الأمانة\" قبل المتابعة.");
  setTimeout(() => { // استخدام setTimeout لضمان تحديث DOM
    errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 0);
  setIsSubmitting(false);
  return;
}
 
  try {
    const certificateData = {
      id: certificateId,
      ...formData,
      photo_url: null,
      qr_code_url: null,
    }

    const client = getSupabaseClient()
    if (!client) {
      setError("متغيرات البيئة الخاصة بـ Supabase غير متوفرة. لا يمكن حفظ الشهادة في قاعدة البيانات.")
      setIsSubmitting(false)
      return
    }

    try {
      if (photo) {
        const photoUrl = await uploadUser(photo, `photo_${certificateId}`)
        if (photoUrl) certificateData.photo_url = photoUrl
      }

      const qrCodeDataUrl = generateQRCodeImage()
      if (qrCodeDataUrl) {
        const qrCodeUrl = await uploadImage(qrCodeDataUrl, `qrcode_${certificateId}`)
        if (qrCodeUrl) certificateData.qr_code_url = qrCodeUrl
      }
    } catch (uploadError) {
      console.error("Error uploading images:", uploadError)
      setStorageError(true)
    }

    const newCertificate = await createCertificate(certificateData)
    if (!newCertificate) {
      throw new Error("فشل في إنشاء الشهادة. يرجى المحاولة مرة أخرى.")
    }

    const actualVerificationUrl = `${window.location.origin}/verify/${newCertificate.id}`
    setVerificationUrl(actualVerificationUrl)

    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas")
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png")
        setQrCode(dataURL)
        setQrGenerated(true)
      }
    }

    router.push(`/certificates`)
  } catch (err) {
    console.error("Error creating certificate:", err)
    setError(err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الشهادة. يرجى المحاولة مرة أخرى.")
  } finally {
    setIsSubmitting(false)
  }
}
  return (
    <div className="Cairo max-w-4xl mx-auto p-4 bg-gray-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-teal-700">إنشاء شهادة صحية جديدة</h1>
          <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        {!supabaseAvailable && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تنبيه: متغيرات البيئة غير متوفرة</AlertTitle>
            <AlertDescription>
              متغيرات البيئة الخاصة بـ Supabase غير متوفرة. لا يمكن حفظ الشهادة في قاعدة البيانات. يمكنك استخدام رمز QR
              للتحقق من الشهادة، ولكن لن يتم حفظ البيانات.
            </AlertDescription>
          </Alert>
        )}

        {error && (
  <Alert ref={errorRef} variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>خطأ</AlertTitle>
    <AlertDescription>{error}</AlertDescription>
  </Alert>
)}

        {storageError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>تنبيه</AlertTitle>
            <AlertDescription>
              هناك مشكلة في تخزين الصور. يرجى التأكد من إنشاء bucket بإسم "certificates" في لوحة تحكم Supabase وجعله
              عاماً (public).
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">البيانات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeser">الأمانة </Label>
<select
  id="typeser"
  name="typeser"
  value={formData.typeser}
  onChange={handleTypeserChange}
  required
  className="w-full p-2 border rounded-md text-right"
>
  <option value="أمانة منطقة الرياض">أمانة منطقة الرياض</option>
  <option value="أمانة محافظة جدة">أمانة محافظة جدة</option>
  <option value="أمانة العاصمة المقدسة">أمانة العاصمة المقدسة</option>
  <option value="أمانة منطقة المدينة المنورة">أمانة منطقة المدينة المنورة</option>
  <option value="أمانة محافظة الطائف">أمانة محافظة الطائف</option>
  <option value="أمانة محافظة نجران">أمانة محافظة نجران</option>
  <option value="أمانة منطقة عسير">أمانة منطقة عسير</option> {/* أضفنا هذا السطر */}
</select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل الاسم الكامل"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="id_number">رقم الهوية</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل رقم الهوية"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">الجنسية</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل الجنسية"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">المهنة</Label>
                <Input
                  id="profession"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل المهنة"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange as any}
                  required
                  className="w-full p-2 border rounded-md text-right"
                >
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipality">البلدية</Label>
                <Input
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم البلدية"
                  className="text-right"
                />
              </div>
            </div>
          </div>

          {/* Certificate Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">بيانات الشهادة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certificate_number">رقم الشهادة الصحية</Label>
                <Input
                  id="certificate_number"
                  name="certificate_number"
                  value={formData.certificate_number}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل رقم الشهادة"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date">تاريخ اصدار الشهادة الصحية (هجري)</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  value={formData.issue_date || ""}
                  onChange={handleInputChange}
                  placeholder="مثال: 1445/05/15"
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">تاريخ انتهاء الشهادة الصحية (هجري)</Label>
                <Input
                  id="expiry_date"
                  name="expiry_date"
                  value={formData.expiry_date || ""}
                  onChange={handleInputChange}
                  placeholder="مثال: 1446/05/15"
                  className="text-right"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issue_date_gregorian">تاريخ إصدار الشهادة (ميلادي)</Label>
                <Input
                  id="issue_date_gregorian"
                  name="issue_date_gregorian"
                  value={formData.issue_date_gregorian}
                  onChange={handleInputChange}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date_gregorian">تاريخ انتهاء الشهادة (ميلادي)</Label>
                <Input
                  id="expiry_date_gregorian"
                  name="expiry_date_gregorian"
                  value={formData.expiry_date_gregorian}
                  onChange={handleInputChange}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program_type">نوع البرنامج التفتيش</Label>
                <Input
                  id="program_type"
                  name="program_type"
                  value={formData.program_type}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل نوع البرنامج"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program_end_date">تاريخ انتهاء البرنامج</Label>
                <Input
                  id="program_end_date"
                  name="program_end_date"
                  value={formData.program_end_date || ""}
                  onChange={handleInputChange}
                  placeholder="مثال: 1447/05/15"
                  className="text-right"
                  required
                />
              </div>
            </div>
          </div>

          {/* Facility Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">بيانات المنشأة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facility_name">اسم المنشأة</Label>
                <Input
                  id="facility_name"
                  name="facility_name"
                  value={formData.facility_name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسم المنشأة"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facility_number">رقم المنشأة</Label>
                <Input
                  id="facility_number"
                  name="facility_number"
                  value={formData.facility_number}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم المنشأة"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number">رقم الرخصة</Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم الرخصة"
                  className="text-right"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">الصور</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="photo">الصورة الشخصية</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-gray-300 p-1 w-40 h-48 relative">
                    {photo ? (
                      <Image src={photo || "/placeholder.svg"} alt="الصورة الشخصية" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrCode">رمز QR (يتم توليده تلقائياً)</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-gray-300 p-1 w-40 h-40 relative flex items-center justify-center">
                    <div ref={qrRef} className="w-full h-full flex items-center justify-center">
                      {isClient && (
                        <QRCodeCanvas
                          value={verificationUrl}
                          size={150}
                          level="H"
                          includeMargin={true}
                        />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    سيتم توليد رمز QR تلقائياً يحتوي على رابط للتحقق من صحة الشهادة
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-2 rounded-md"
              disabled={isSubmitting || !supabaseAvailable}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> جاري الإنشاء...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> إنشاء الشهادة
                </>
              )}
            </Button>
          </div>

          {!supabaseAvailable && (
            <div className="text-center text-red-500 mt-4">
              لا يمكن إنشاء الشهادة بسبب عدم توفر متغيرات البيئة الخاصة بـ Supabase.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}