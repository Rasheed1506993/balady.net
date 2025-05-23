"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Phone, MapPin, AtSign, ArrowLeft, FileDown, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCertificateById, type Certificate } from "@/lib/supabase"

const preloadImages = async (): Promise<void> => {
  const images = Array.from(document.querySelectorAll('img'));
  await Promise.all(images.map(img => {
    if (img.complete) return Promise.resolve();

    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error(`فشل تحميل الصورة: ${img.src}`));
      // إضافة timeout احتياطي
      setTimeout(() => reject(new Error('انتهى وقت انتظار تحميل الصورة')), 5000);
    });
  }));
};

export default function ViewCertificate({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [certificateData, setCertificateData] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
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


  const handleExportPDF = async () => {

    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      await preloadImages()

      const [jsPDFModule, html2canvasModule] = await Promise.all([
        import("jspdf"),
        import("html2canvas")
      ])

      const jsPDF = jsPDFModule.default
      const html2canvas = html2canvasModule.default
      const element = document.getElementById("full-certificate-container")

      if (!element) throw new Error("Element not found")

      const originalStyles = {
        width: element.style.width,
        height: element.style.height,
        position: element.style.position,
        overflow: element.style.overflow,
      }

      // Use a consistent size for PDF export
      const fixedWidth = 794      // Equivalent to 210mm for A4 portrait
      const fixedHeight = 1122    // Equivalent to 297mm for A4 portrait

      element.style.width = `${fixedWidth}px`
      element.style.height = "auto" // Let height be determined by content
      element.style.position = "absolute"
      element.style.overflow = "visible"

      const canvas = await html2canvas(element, {
        scale: 2, // Maintain a good resolution for PDF
        useCORS: true,
        allowTaint: true,
        logging: false,
        scrollY: -window.scrollY,
        width: fixedWidth,
        windowWidth: fixedWidth,
      })

      element.style.width = originalStyles.width
      element.style.height = originalStyles.height
      element.style.position = originalStyles.position
      element.style.overflow = originalStyles.overflow

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(canvas, "JPEG", 0, 0, imgWidth, imgHeight)
      pdf.save("الشهادة_الصحية_الموحدة.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("حدث خطأ أثناء التصدير")
    } finally {
      setIsExporting(false)
    }
  }


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
    <div className="max-w-2xl mx-auto bg-gray-100 p-4 print:p-0" dir="rtl">
      <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-2 mb-4 text-center sm:text-right">
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          العودة للصفحة الرئيسية
        </Button>

        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="bg-blue-600 hover:bg-blue-700 shadow-md w-full sm:w-auto"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري التصدير...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" /> تصدير PDF
            </>
          )}
        </Button>
      </div>

      <div id="full-certificate-container" className="bg-white print:shadow-none">

        <div id="certificate-top" className="bg-white rounded-md overflow-hidden shadow-sm border mb-4" dir="rtl">

          <div>
            <Image
              src="/images/header.jpg"
              alt="رأس الشهادة الصحية الموحدة"
              width={1000}
              height={200}
              className="w-full h-auto"
            />
          </div>

          <div
            className="relative w-full max-w-full mx-auto p-4 rounded-md overflow-hidden"
          >
            {/* Background Image as an actual Image component for better control */}
            <Image
              src="/images/backgroundimage2.jpg"
              alt="خلفية الشهادة"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 z-0"
            />

            <div className="relative z-10">
              <div className="px-6 py-3">
                <h2 className="text-xl text-center md:text-right text-teal-700 font-bold font-doto">
                  {certificateData.name}
                </h2>
              </div>
              <div className="flex flex-col md:flex-row-reverse">

                <div className="w-full md:w-1/3 pt-2 px-4 pb-4 flex flex-col items-center gap-4 justify-start relative">
                  <div className="w-[130px] h-[160px] flex items-center justify-center shadow-md relative">
                    <Image
                      src={certificateData.photo_url || "/images/photo.png"}
                      alt="صورة شخصية"
                      width={130}
                      height={160}
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="w-[130px] h-[130px] flex items-center justify-center shadow-md relative">
                    <Image
                      src={certificateData.qr_code_url || "/images/qr-code.png"}
                      alt="رمز QR"
                      width={130}
                      height={130}
                      className="object-contain rounded-sm"
                    />
                  </div>
                </div>

                <div className="w-full md:w-2/3 p-0 overflow-x-auto">
                  <table className="w-full min-w-[350px]">
                    <tbody>
                      {[
                        ["الجنسية", certificateData.nationality, "رقم الهوية", certificateData.id_number],
                        ["المهنة", certificateData.profession, "رقم الشهادة الصحية", certificateData.certificate_number],
                        ["تاريخ نهاية الشهادة الصحية", certificateData.expiry_date, "تاريخ إصدار الشهادة الصحية", certificateData.issue_date],
                        ["تاريخ انتهاء البرنامج التفتيش", certificateData.program_end_date, "نوع البرنامج التفتيش", certificateData.program_type],
                      ].map(([label1, value1, label2, value2], i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 sm:py-3 sm:px-4">
                            <div className="font-noto-semibold text-xs text-black/90">{label1}</div>
                            <div className="font-noto-semibold text-xs text-black/60 bg-white">{value1}</div>
                          </td>
                          <td className="py-2 px-3 sm:py-3 sm:px-4">
                            <div className="font-noto-semibold text-xs text-black/90">{label2}</div>
                            <div className="font-noto-semibold text-xs text-black/60 bg-white">{value2}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Image
              src="/images/hfooter.jpg"
              alt="تذييل الشهادة الصحية الموحدة"
              width={1000}
              height={150}
              className="w-full h-auto"
            />
          </div>
        </div>

        <div id="certificate-instructions" dir="ltr">
          <Image
            src="/images/instructions-full.png"
            alt="تعليمات وإرشادات الشهادة الصحية"
            width={1000}
            height={600}
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
    </div>
  )
}