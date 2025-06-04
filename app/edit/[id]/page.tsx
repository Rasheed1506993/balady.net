"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCertificateById, updateCertificate, uploadUser } from "@/lib/supabase"
import Image from "next/image"

export default function EditCertificate() {
  const router = useRouter()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    typeser: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState("")

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const certificate = await getCertificateById(id as string)
        if (certificate) {
          setFormData({
            typeser: certificate.typeser || "",
            thelogo: certificate.thelogo || "",
            name: certificate.name || "",
            id_number: certificate.id_number || "",
            nationality: certificate.nationality || "",
            profession: certificate.profession || "",
            certificate_number: certificate.certificate_number || "",
            issue_date: certificate.issue_date || "",
            expiry_date: certificate.expiry_date || "",
            program_type: certificate.program_type || "",
            program_end_date: certificate.program_end_date || "",
            facility_name: certificate.facility_name || "",
            facility_number: certificate.facility_number || "",
            license_number: certificate.license_number || "",
            gender: certificate.gender || "ذكر",
            municipality: certificate.municipality || "",
            issue_date_gregorian: certificate.issue_date_gregorian || "",
            expiry_date_gregorian: certificate.expiry_date_gregorian || "",
          })
          setCurrentPhotoUrl(certificate.photo_url || "")
        }
      } catch (err) {
        console.error("Error loading certificate:", err)
        setError("حدث خطأ أثناء تحميل بيانات الشهادة")
      }
    }
    loadCertificate()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value
    let logo = ""

    if (selectedValue === "أمانة محافظة الطائف") {
      logo = "Taif.jpg"
    } else if (selectedValue === "أمانة محافظة نجران") {
      logo = "Najran.jpg"
    }

    setFormData(prev => ({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      let photoUrl = currentPhotoUrl
      
      if (photo) {
        const newPhotoUrl = await uploadUser(photo, `photo_${id}`)
        if (newPhotoUrl) photoUrl = newPhotoUrl
      }

      const updatedData = {
        ...formData,
        photo_url: photoUrl,
        // qr_code_url مستثنى من التحديث
      }

      const success = await updateCertificate(id as string, updatedData)
      
      if (success) {
        router.push("/certificates")
      } else {
        setError("فشل في تحديث الشهادة. يرجى المحاولة مرة أخرى.")
      }
    } catch (err) {
      console.error("Error updating certificate:", err)
      setError("حدث خطأ أثناء تحديث الشهادة. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="Cairo max-w-4xl mx-auto p-4 bg-gray-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-teal-700">تعديل الشهادة الصحية</h1>
          <Button variant="outline" onClick={() => router.push("/certificates")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            العودة
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4 text-teal-700">البيانات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="typeser">الأمانة</Label>
                <select
                  id="typeser"
                  name="typeser"
                  value={formData.typeser}
                  onChange={handleTypeserChange}
                  required
                  className="w-full p-2 border rounded-md text-right"
                >
                  <option value="أمانة محافظة الطائف">أمانة محافظة الطائف</option>
                  <option value="أمانة محافظة نجران">أمانة محافظة نجران</option>
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
                      <Image src={photo} alt="الصورة الشخصية" fill className="object-cover" />
                    ) : currentPhotoUrl ? (
                      <Image src={currentPhotoUrl} alt="الصورة الحالية" fill className="object-cover" />
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
                <Label htmlFor="qrCode">رمز QR</Label>
                <div className="border border-gray-300 p-1 w-40 h-40 relative flex items-center justify-center bg-gray-100">
                  <p className="text-sm text-gray-500 text-center">
                    لا يمكن تعديل رمز QR، يتم إنشاؤه تلقائياً عند الإنشاء
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> جاري التحديث...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> تحديث الشهادة
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}