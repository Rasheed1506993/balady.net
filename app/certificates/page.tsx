"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, FileDown, ArrowLeft, AlertCircle, Loader2, Trash2, Edit } from "lucide-react"
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
// أضف هذا الاستيراد مع باقي الاستيرادات
import PdfEditor from "@/components/PdfEditor"

// أضف هذه الدالة مع باقي الدوال

export default function CertificatesPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [printingCertificate, setPrintingCertificate] = useState<Certificate | null>(null)

  const fetchCertificates = async () => {
    try {
      setIsLoading(true)
      const data = await getAllCertificates()
      setCertificates(data)
    } catch (err) {
      console.error("Error fetching certificates:", err)
      setError("حدث خطأ أثناء جلب بيانات الشهادات.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const handlePrintCertificate = (certificate: Certificate) => {
  setPrintingCertificate(certificate)
}


  const handleDeleteCertificate = async () => {
    if (!certificateToDelete) return

    try {
      setIsDeleting(true)
      const success = await deleteCertificate(certificateToDelete)

      if (success) {
        setCertificates((prev) => prev.filter((cert) => cert.id !== certificateToDelete))
      } else {
        setError("فشل في حذف الشهادة. يرجى المحاولة مرة أخرى.")
      }
    } catch (err) {
      console.error("Error deleting certificate:", err)
      setError("حدث خطأ أثناء حذف الشهادة.")
    } finally {
      setIsDeleting(false)
      setCertificateToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
      </div>
    )
  }

  return (
    <div className="Cairo max-w-4xl mx-auto p-4 sm:p-6 lg:p-8" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl  text-teal-800 mb-4 sm:mb-0">جميع الشهادات الصحية</h1>
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-teal-700 border-teal-300 hover:bg-teal-50"
        >
          <ArrowLeft className="h-4 w-4" />
          العودة للصفحة الرئيسية
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6 border-red-400 bg-red-50 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="font-bold">خطأ!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {certificates.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md border border-gray-200">
          <h2 className="text-2xl  mb-4 text-gray-700">لا توجد شهادات حاليًا</h2>
          <p className="text-gray-500 mb-6">لم يتم العثور على أي شهادات صحية في النظام. ابدأ بإنشاء واحدة جديدة!</p>
          <Link href="/create" passHref>
            <Button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-3 text-lg rounded-md shadow-sm transition-colors duration-200">
              إنشاء شهادة جديدة
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
              <CardHeader className="bg-teal-700 text-white p-4 flex justify-between items-center">
                <CardTitle className="text-xl ">{certificate.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-gray-700">
                <p>
                  <span className="text-gray-800">رقم الهوية:</span> {certificate.id_number}
                </p>
                <p>
                  <span className="text-gray-800">المهنة:</span> {certificate.profession}
                </p>
                <p>
                  <span className=" text-gray-800">تاريخ الإصدار:</span> {certificate.issue_date}
                </p>
                <p>
                  <span className="text-gray-800">تاريخ الانتهاء:</span> {certificate.expiry_date}
                </p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t">
  <div className="flex flex-wrap gap-2">
    <Button 
      variant="outline" 
      className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
      onClick={() => handlePrintCertificate(certificate)}
    >
      <Eye className="h-4 w-4" /> طباعة الشهادة
    </Button>
    
    <Link href={`/verify/${certificate.id}`} passHref>
      <Button variant="outline" className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50">
        <FileDown className="h-4 w-4" /> التحقق
      </Button>
    </Link>
    
    <Link href={`/edit/${certificate.id}`} passHref>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
      >
        <Edit className="h-4 w-4" /> تعديل
      </Button>
    </Link>
  </div>
  
  <Dialog
    open={deleteDialogOpen && certificateToDelete === certificate.id}
    onOpenChange={(open) => {
      setDeleteDialogOpen(open)
      if (!open) setCertificateToDelete(null)
    }}
  >
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
        onClick={() => {
          setCertificateToDelete(certificate.id)
          setDeleteDialogOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">تأكيد حذف الشهادة</DialogTitle>
        <DialogDescription className="text-gray-600">
          هل أنت متأكد من رغبتك في حذف شهادة <span className="text-teal-800">{certificate.name}</span>؟ هذا الإجراء لا يمكن التراجع عنه.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-4">
        <DialogClose asChild>
          <Button variant="outline" className="w-full sm:w-auto">إلغاء</Button>
        </DialogClose>
        <Button
          variant="destructive"
          onClick={handleDeleteCertificate}
          disabled={isDeleting}
          className="w-full sm:w-auto"
        >
          {isDeleting ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin ml-2" /> جاري الحذف...
            </div>
          ) : (
            <div className="flex items-center">
              <Trash2 className="h-4 w-4 ml-2" /> تأكيد الحذف
            </div>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* أضف هذا داخل الـ return قبل إغلاق div الرئيسية */}
     {printingCertificate && (
  <PdfEditor 
    pdfTemplateUrl="/file/templates.pdf" 
    certificateData={printingCertificate}
    onComplete={() => setPrintingCertificate(null)}
  />
)}
    </div>
  )
}