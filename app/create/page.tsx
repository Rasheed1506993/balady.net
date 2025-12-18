"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { v4 as uuidv4 } from "uuid"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createCertificate, uploadImage, uploadUser, getSupabaseClient } from "@/lib/supabase"

// تحسين: مكون الحقل محسن
const FormField = ({
  id,
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  type = "text",
}: {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  type?: string
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="text-right"
      type={type}
    />
  </div>
)

// تحسين: مكون القائمة المنسدلة محسن
const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  required = false,
}: {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  required?: boolean
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border rounded-md text-right"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

export default function CreateCertificate() {
  const router = useRouter()
  const qrRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const [certificateId, setCertificateId] = useState("")
  const [formData, setFormData] = useState({
    typeser: "",
    thelogo: "nothing",
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [storageError, setStorageError] = useState<boolean>(false)
  const [supabaseAvailable, setSupabaseAvailable] = useState(true)
  const [verificationUrl, setVerificationUrl] = useState("")

  // تحسين: خيارات الأمانات مع useMemo
  const municipalityOptions = useMemo(
    () => [
      { value: "أمانة منطقة الرياض", label: "أمانة منطقة الرياض" },
      { value: "أمانة محافظة جدة", label: "أمانة محافظة جدة" },
      { value: "أمانة العاصمة المقدسة", label: "أمانة العاصمة المقدسة" },
      { value: "أمانة منطقة المدينة المنورة", label: "أمانة منطقة المدينة المنورة" },
      { value: "أمانة محافظة الطائف", label: "أمانة محافظة الطائف" },
      { value: "أمانة محافظة نجران", label: "أمانة محافظة نجران" },
      { value: "أمانة منطقة عسير", label: "أمانة منطقة عسير" },
      { value: "أمانة الباحة", label: "أمانة الباحة" },
    
    ],
    [],
  )

  const genderOptions = useMemo(
    () => [
      { value: "ذكر", label: "ذكر" },
      { value: "أنثى", label: "أنثى" },
    ],
    [],
  )

  // تحسين: خريطة الشعارات مع useMemo
  const municipalityLogos = useMemo(
    () => ({
      "أمانة منطقة الرياض": "riyadh.jpg",
      "أمانة محافظة جدة": "jeddah.jpg",
      "أمانة العاصمة المقدسة": "makah.jpg",
      "أمانة منطقة المدينة المنورة": "madinah.png",
      "أمانة محافظة الطائف": "Taif.jpg",
      "أمانة محافظة نجران": "Najran.jpg",
      "أمانة منطقة عسير": "assir.jpg",
      "أمانة الباحة": "amantalbaha.png",
      
    }),
    [],
  )

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

  // تحسين: دالة تغيير البيانات مع useCallback
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  // تحسين: دالة تغيير الأمانة مع useCallback
  const handleTypeserChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value
    //  const logo = municipalityLogos[selectedValue] || ""
        const logo = "nothing"



      setFormData((prev) => ({
        ...prev,
        typeser: selectedValue,
        thelogo: logo,
      }))
    },
    [municipalityLogos],
  )

  // تحسين: دالة رفع الصورة مع useCallback
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // التحقق من حجم الملف (أقل من 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً. يرجى اختيار صورة أصغر من 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  // تحسين: دالة توليد QR مع useCallback
  const generateQRCodeImage = useCallback(() => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector("canvas")
      if (canvas) {
        const dataURL = canvas.toDataURL("image/png")
        return dataURL
      }
    }
    return null
  }, [])

  // تحسين: دالة الإرسال مع useCallback
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setIsSubmitting(true)
      setError(null)
      setStorageError(false)

      // التحقق من اختيار "الأمانة"
      if (!formData.thelogo || formData.thelogo.trim() === "") {
        setError('يرجى تحديد قيمة حقل "الأمانة" قبل المتابعة.')
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 0)
        setIsSubmitting(false)
        return
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
          // رفع الصور بشكل متوازي
          const uploadPromises = []

          if (photo) {
            uploadPromises.push(uploadUser(photo, `photo_${certificateId}`))
          } else {
            uploadPromises.push(Promise.resolve(null))
          }

          const qrCodeDataUrl = generateQRCodeImage()
          if (qrCodeDataUrl) {
            uploadPromises.push(uploadImage(qrCodeDataUrl, `qrcode_${certificateId}`))
          } else {
            uploadPromises.push(Promise.resolve(null))
          }

          const [photoUrl, qrCodeUrl] = await Promise.all(uploadPromises)

          if (photoUrl) certificateData.photo_url = photoUrl
          if (qrCodeUrl) certificateData.qr_code_url = qrCodeUrl
        } catch (uploadError) {
          console.error("Error uploading images:", uploadError)
          setStorageError(true)
        }

        const newCertificate = await createCertificate(certificateData)
        if (!newCertificate) {
          throw new Error("فشل في إنشاء الشهادة. يرجى المحاولة مرة أخرى.")
        }

        router.push(`/certificates`)
      } catch (err) {
        console.error("Error creating certificate:", err)
        setError(err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الشهادة. يرجى المحاولة مرة أخرى.")
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, certificateId, photo, generateQRCodeImage, router],
  )

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
              <SelectField
                id="typeser"
                name="typeser"
                label="الأمانة"
                value={formData.typeser}
                onChange={handleTypeserChange}
                options={municipalityOptions}
                required
              />

              <FormField
                id="name"
                name="name"
                label="الاسم الكامل"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="أدخل الاسم الكامل"
              />

              <FormField
                id="id_number"
                name="id_number"
                label="رقم الهوية"
                value={formData.id_number}
                onChange={handleInputChange}
                required
                placeholder="أدخل رقم الهوية"
              />

              <FormField
                id="nationality"
                name="nationality"
                label="الجنسية"
                value={formData.nationality}
                onChange={handleInputChange}
                required
                placeholder="أدخل الجنسية"
              />

              <FormField
                id="profession"
                name="profession"
                label="المهنة"
                value={formData.profession}
                onChange={handleInputChange}
                required
                placeholder="أدخل المهنة"
              />

              <SelectField
                id="gender"
                name="gender"
                label="الجنس"
                value={formData.gender}
                onChange={handleInputChange as any}
                options={genderOptions}
                required
              />

              <FormField
                id="municipality"
                name="municipality"
                label="البلدية"
                value={formData.municipality}
                onChange={handleInputChange}
                placeholder="أدخل اسم البلدية"
              />
            </div>
          </div>

          {/* Certificate Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">بيانات الشهادة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="certificate_number"
                name="certificate_number"
                label="رقم الشهادة الصحية"
                value={formData.certificate_number}
                onChange={handleInputChange}
                required
                placeholder="أدخل رقم الشهادة"
              />

              <FormField
                id="issue_date"
                name="issue_date"
                label="تاريخ اصدار الشهادة الصحية (هجري)"
                value={formData.issue_date}
                onChange={handleInputChange}
                required
                placeholder="مثال: 1445/05/15"
              />

              <FormField
                id="expiry_date"
                name="expiry_date"
                label="تاريخ انتهاء الشهادة الصحية (هجري)"
                value={formData.expiry_date}
                onChange={handleInputChange}
                required
                placeholder="مثال: 1446/05/15"
              />

              <FormField
                id="issue_date_gregorian"
                name="issue_date_gregorian"
                label="تاريخ إصدار الشهادة (ميلادي)"
                value={formData.issue_date_gregorian}
                onChange={handleInputChange}
              />

              <FormField
                id="expiry_date_gregorian"
                name="expiry_date_gregorian"
                label="تاريخ انتهاء الشهادة (ميلادي)"
                value={formData.expiry_date_gregorian}
                onChange={handleInputChange}
              />

              <FormField
                id="program_type"
                name="program_type"
                label="نوع البرنامج التفتيش"
                value={formData.program_type}
                onChange={handleInputChange}
                required
                placeholder="أدخل نوع البرنامج"
              />

              <FormField
                id="program_end_date"
                name="program_end_date"
                label="تاريخ انتهاء البرنامج"
                value={formData.program_end_date}
                onChange={handleInputChange}
                required
                placeholder="مثال: 1447/05/15"
              />
            </div>
          </div>

          {/* Facility Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">بيانات المنشأة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="facility_name"
                name="facility_name"
                label="اسم المنشأة"
                value={formData.facility_name}
                onChange={handleInputChange}
                placeholder="أدخل اسم المنشأة"
              />

              <FormField
                id="facility_number"
                name="facility_number"
                label="رقم المنشأة"
                value={formData.facility_number}
                onChange={handleInputChange}
                placeholder="أدخل رقم المنشأة"
              />

              <FormField
                id="license_number"
                name="license_number"
                label="رقم الرخصة"
                value={formData.license_number}
                onChange={handleInputChange}
                placeholder="أدخل رقم الرخصة"
              />
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
                      {isClient && <QRCodeCanvas value={verificationUrl} size={150} level="H" includeMargin={true} />}
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
