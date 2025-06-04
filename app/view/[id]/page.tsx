"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getCertificateById, type Certificate } from "@/lib/supabase"
import { useEffect, useState, use } from "react"
import PdfEditor from "@/components/PdfEditor"

export default function ViewCertificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [certificateData, setCertificateData] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCertificate() {
      try {
        setIsLoading(true)
        const certificate = await getCertificateById(id)

        if (!certificate) {
          setError("لم يتم العثور على الشهادة المطلوبة")
          return
        }

        setCertificateData(certificate)
      } catch (err) {
        console.error("Error fetching certificate:", err)
        setError("حدث خطأ أثناء جلب بيانات الشهادة")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchCertificate()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  if (error || !certificateData) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center" dir="rtl">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>خطأ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <h1 className="text-2xl font-bold mb-4">لم يتم العثور على بيانات الشهادة</h1>
        <p className="mb-6">يرجى إنشاء شهادة جديدة أولاً</p>
        <Button onClick={() => router.push("/create")} className="bg-teal-700 hover:bg-teal-800">
          إنشاء شهادة جديدة
        </Button>
      </div>
    )
  }

  return (
    <PdfEditor pdfTemplateUrl="/file/templates.pdf" certificateData={certificateData} />
  )
}