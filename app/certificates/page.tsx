"use client"

import { useEffect, useState, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, FileDown, ArrowLeft, AlertCircle, Loader2, Trash2, Edit, Search, Filter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getAllCertificates, deleteCertificate, type Certificate } from "@/lib/supabase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"

// تحسين: تحميل PdfEditor بشكل ديناميكي مع تحسينات إضافية
const PdfEditor = dynamic(() => import("@/components/PdfEditor"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-teal-700 mx-auto mb-4" />
        <p className="text-center text-gray-600">جاري تحضير الطباعة...</p>
      </div>
    </div>
  ),
})

// مكون البطاقة محسن مع memo
const CertificateCard = memo(
  ({
    certificate,
    onPrint,
    onDelete,
    isDeleting,
  }: {
    certificate: Certificate
    onPrint: (cert: Certificate) => void
    onDelete: (id: string, name: string) => void
    isDeleting: boolean
  }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handlePrintClick = useCallback(() => {
      onPrint(certificate)
    }, [certificate, onPrint])

    const handleDeleteClick = useCallback(() => {
      onDelete(certificate.id, certificate.name)
      setIsDialogOpen(false)
    }, [certificate.id, certificate.name, onDelete])

    const isCurrentlyDeleting = isDeleting && certificate.id

    return (
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 will-change-transform">
        <CardHeader className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-4">
          <CardTitle className="text-lg Cairo truncate">{certificate.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 text-gray-700">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="Cairo text-gray-800">رقم الهوية:</span>
              <span className="text-gray-600 font-mono">{certificate.id_number}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="Cairo text-gray-800">المهنة:</span>
              <span className="text-gray-600">{certificate.profession}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="Cairo text-gray-800">تاريخ الإصدار:</span>
              <span className="text-gray-600">{certificate.issue_date}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="Cairo text-gray-800">تاريخ الانتهاء:</span>
              <span className="text-gray-600">{certificate.expiry_date}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-3 border-t">
          <div className="flex flex-col w-full gap-2">
            {/* أزرار العمليات */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50 transition-colors"
                onClick={handlePrintClick}
              >
                <Eye className="h-3 w-3 ml-1" />
                <span className="text-xs">طباعة</span>
              </Button>

              <Link href={`/verify/${certificate.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-200 hover:bg-green-50 transition-colors"
                >
                  <FileDown className="h-3 w-3 ml-1" />
                  <span className="text-xs">تحقق</span>
                </Button>
              </Link>

              <Link href={`/edit/${certificate.id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  <Edit className="h-3 w-3 ml-1" />
                  <span className="text-xs">تعديل</span>
                </Button>
              </Link>
            </div>

            {/* زر الحذف مع Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-colors"
                  disabled={isCurrentlyDeleting}
                >
                  {isCurrentlyDeleting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin ml-1" />
                      <span className="text-xs">جاري الحذف...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-3 w-3 ml-1" />
                      <span className="text-xs">حذف الشهادة</span>
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
  <DialogHeader>
    <DialogTitle className="Cairo text-right text-red-600 flex items-center gap-2">
      <AlertCircle className="h-5 w-5" />
      تأكيد حذف الشهادة
    </DialogTitle>
    <DialogDescription asChild>
      <div className="text-right mt-4 space-y-2">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 Cairo">
            هل أنت متأكد من رغبتك في حذف شهادة{" "}
            <span className="font-bold text-teal-800 Cairo">"{certificate.name}"</span>؟
          </p>
          
          <div className="mt-4 space-y-2 Cairo">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">رقم الهوية:</span>
              <span className="Cairo">{certificate.id_number}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">المهنة:</span>
              <span className="Cairo">{certificate.profession}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ الإصدار:</span>
              <span className="Cairo">{certificate.issue_date}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ الانتهاء:</span>
              <span className="Cairo">{certificate.expiry_date}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 p-3 rounded-lg border border-red-100">
          <p className="text-red-600 Cairo text-sm flex items-center">
            <AlertCircle className="h-4 w-4" />
            ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه
          </p>
        </div>
      </div>
    </DialogDescription>
  </DialogHeader>
  <DialogFooter className="gap-2 mt-4">
    <DialogClose asChild>
      <Button 
      variant="outline"
      disabled={isCurrentlyDeleting}
      className="bg-red-50 Cairo"
      >
        إلغاء
      </Button>
    </DialogClose>
    <Button 
      variant="outline" 
      onClick={handleDeleteClick} 
      disabled={isCurrentlyDeleting}
      className="bg-red-600 Cairo gap-2"
    >
      {isCurrentlyDeleting ? (
        <>
          <Loader2 className="Cairo h-4 w-4 animate-spin" />
          جاري الحذف...
        </>
      ) : (
        <>
          <Trash2 className="Cairo h-4 w-4" />
          تأكيد الحذف
        </>
      )}
    </Button>
  </DialogFooter>
</DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    )
  },
)

CertificateCard.displayName = "CertificateCard"

// مكون البحث والفلترة
const SearchAndFilter = memo(
  ({
    searchTerm,
    onSearchChange,
    totalCount,
    filteredCount,
  }: {
    searchTerm: string
    onSearchChange: (term: string) => void
    totalCount: number
    filteredCount: number
  }) => {
    return (
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="البحث في الشهادات..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              عرض {filteredCount} من أصل {totalCount} شهادة
            </span>
          </div>
        </div>
      </div>
    )
  },
)

SearchAndFilter.displayName = "SearchAndFilter"

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [printingCertificate, setPrintingCertificate] = useState<Certificate | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // تحسين: جلب البيانات مع useCallback
  const fetchCertificates = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getAllCertificates()
      setCertificates(data)
    } catch (err) {
      console.error("Error fetching certificates:", err)
      setError("حدث خطأ أثناء جلب بيانات الشهادات.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  // إخفاء رسائل النجاح بعد 5 ثوان
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // تحسين: فلترة الشهادات مع useMemo
  const filteredCertificates = useMemo(() => {
    if (!searchTerm.trim()) return certificates

    const term = searchTerm.toLowerCase().trim()
    return certificates.filter(
      (cert) =>
        cert.name.toLowerCase().includes(term) ||
        cert.id_number.includes(term) ||
        cert.profession.toLowerCase().includes(term) ||
        cert.certificate_number.toLowerCase().includes(term),
    )
  }, [certificates, searchTerm])

  // تحسين: دالة الطباعة مع useCallback
  const handlePrintCertificate = useCallback((certificate: Certificate) => {
    setPrintingCertificate(certificate)
  }, [])

  // تحسين: دالة الحذف مع useCallback
  const handleDeleteCertificate = useCallback(async (certificateId: string, certificateName: string) => {
    try {
      setDeletingId(certificateId)
      setError(null)

      const success = await deleteCertificate(certificateId)

      if (success) {
        setCertificates((prev) => prev.filter((cert) => cert.id !== certificateId))
        setSuccessMessage(`تم حذف شهادة "${certificateName}" بنجاح.`)
      } else {
        setError("فشل في حذف الشهادة. يرجى المحاولة مرة أخرى.")
      }
    } catch (err) {
      console.error("Error deleting certificate:", err)
      setError("حدث خطأ أثناء حذف الشهادة.")
    } finally {
      setDeletingId(null)
    }
  }, [])

  // تحسين: دالة إغلاق الطباعة
  const handlePrintComplete = useCallback(() => {
    setPrintingCertificate(null)
  }, [])

  // تحسين: دالة البحث
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  // مكون التحميل محسن
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="mb-4 animate-bounce">
            <Image
              src="/images/logo.svg"
              alt="logo"
              width={128}
              height={128}
              priority
              className="w-32 h-auto"
            />
          </div>

        </div>
      </div>
    )
  }

  return (
    <div className="Cairo max-w-7xl mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-4 sm:mb-0">جميع الشهادات الصحية</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-teal-700 border-teal-300 hover:bg-teal-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للصفحة الرئيسية
        </Button>
      </div>

      {/* رسالة النجاح */}
      {successMessage && (
        <Alert className="mb-6 border-green-400 bg-green-50 text-green-700 animate-in slide-in-from-top duration-300">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">تم بنجاح!</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* رسالة الخطأ */}
      {error && (
        <Alert
          variant="destructive"
          className="mb-6 border-red-400 bg-red-50 text-red-700 animate-in slide-in-from-top duration-300"
        >
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">خطأ!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
          <div className="mb-4">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          </div>
          <h2 className="text-2xl Cairo mb-4 text-gray-700">لا توجد شهادات حاليًا</h2>
          <p className="text-gray-500 mb-6">لم يتم العثور على أي شهادات صحية في النظام. ابدأ بإنشاء واحدة جديدة!</p>
          <Link href="/create" passHref>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 text-lg rounded-md shadow-sm transition-colors duration-200">
              إنشاء شهادة جديدة
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* البحث والفلترة */}
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            totalCount={certificates.length}
            filteredCount={filteredCertificates.length}
          />

          {/* عرض الشهادات */}
          {filteredCertificates.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl Cairo mb-4 text-gray-700">لا توجد نتائج للبحث</h2>
              <p className="text-gray-500 mb-4">لم يتم العثور على شهادات تطابق كلمة البحث "{searchTerm}"</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="text-teal-700 border-teal-300 hover:bg-teal-50"
              >
                مسح البحث
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onPrint={handlePrintCertificate}
                  onDelete={handleDeleteCertificate}
                  isDeleting={deletingId === certificate.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* تحميل PdfEditor فقط عند الحاجة */}
      {printingCertificate && (
        <PdfEditor
          pdfTemplateUrl="/file/templates.pdf"
          certificateData={printingCertificate}
          onComplete={handlePrintComplete}
        />
      )}
    </div>
  )
}
