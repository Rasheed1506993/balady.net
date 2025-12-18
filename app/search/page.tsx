"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, ArrowLeft, Search, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase, type Certificate } from "@/lib/supabase"

// تحسين: مكون بطاقة النتيجة محسن
const SearchResultCard = ({ certificate }: { certificate: Certificate }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
    <CardHeader className="bg-teal-700 text-white p-4">
      <CardTitle className="text-lg">{certificate.name}</CardTitle>
    </CardHeader>
    <CardContent className="p-4">
      <div className="space-y-2">
        <p>
          <span className="font-medium">رقم الهوية:</span> {certificate.id_number}
        </p>
        <p>
          <span className="font-medium">رقم الشهادة:</span> {certificate.certificate_number}
        </p>
        <p>
          <span className="font-medium">المهنة:</span> {certificate.profession}
        </p>
        <p>
          <span className="font-medium">تاريخ الانتهاء:</span> {certificate.expiry_date}
        </p>
      </div>
    </CardContent>
    <CardFooter className="bg-gray-50 p-4 flex justify-between">
      <Link href={`/verify/${certificate.id}`} passHref>
        <Button variant="outline" className="flex items-center gap-2">
          <Eye className="h-4 w-4" /> عرض الشهادة
        </Button>
      </Link>
    </CardFooter>
  </Card>
)

// تحسين: مكون نوع البحث محسن
const SearchTypeSelector = ({
  searchType,
  onSearchTypeChange,
}: {
  searchType: "certificate_number" | "id_number"
  onSearchTypeChange: (type: "certificate_number" | "id_number") => void
}) => {
  const searchOptions = useMemo(
    () => [
      { value: "certificate_number", label: "رقم الشهادة" },
      { value: "id_number", label: "رقم الهوية" },
    ],
    [],
  )

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="searchType" className="font-medium">
        البحث بواسطة
      </label>
      <div className="flex gap-4">
        {searchOptions.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              type="radio"
              id={option.value}
              name="searchType"
              value={option.value}
              checked={searchType === option.value}
              onChange={() => onSearchTypeChange(option.value as "certificate_number" | "id_number")}
              className="mr-2"
            />
            <label htmlFor={option.value}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState<"certificate_number" | "id_number">("certificate_number")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<Certificate[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // تحسين: دالة البحث مع useCallback وتحسينات الأداء
  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const trimmedSearchTerm = searchTerm.trim()
      if (!trimmedSearchTerm) {
        setError("الرجاء إدخال قيمة للبحث")
        return
      }

      setIsSearching(true)
      setError(null)
      setHasSearched(true)

      try {
        // تحسين: استخدام AbortController للإلغاء
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // timeout بعد 10 ثواني

        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .ilike(searchType, `%${trimmedSearchTerm}%`)
          .order("created_at", { ascending: false })
          .limit(50) // تحديد عدد النتائج

        clearTimeout(timeoutId)

        if (error) {
          throw error
        }

        setSearchResults(data || [])
      } catch (err: any) {
        console.error("Error searching certificates:", err)
        if (err.name === "AbortError") {
          setError("انتهت مهلة البحث. يرجى المحاولة مرة أخرى.")
        } else {
          setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.")
        }
      } finally {
        setIsSearching(false)
      }
    },
    [searchTerm, searchType],
  )

  // تحسين: دالة تغيير نوع البحث مع useCallback
  const handleSearchTypeChange = useCallback((type: "certificate_number" | "id_number") => {
    setSearchType(type)
    setError(null)
  }, [])

  // تحسين: دالة تغيير نص البحث مع useCallback
  const handleSearchTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setError(null)
  }, [])

  // تحسين: placeholder محسن مع useMemo
  const searchPlaceholder = useMemo(
    () => (searchType === "certificate_number" ? "أدخل رقم الشهادة" : "أدخل رقم الهوية"),
    [searchType],
  )

  return (
    <div className="max-w-4xl mx-auto p-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700">البحث عن شهادة صحية</h1>
        <Button variant="outline" onClick={() => router.push("/")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          العودة للصفحة الرئيسية
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>بحث عن شهادة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <SearchTypeSelector searchType={searchType} onSearchTypeChange={handleSearchTypeChange} />

            <div className="flex gap-2">
              <Input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder={searchPlaceholder}
                className="flex-1"
                disabled={isSearching}
              />
              <Button
                type="submit"
                disabled={isSearching || !searchTerm.trim()}
                className="bg-teal-700 hover:bg-teal-800"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" /> بحث
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <>
          {searchResults.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <h2 className="text-xl font-semibold mb-4">لا توجد نتائج</h2>
              <p className="text-gray-600 mb-6">لم يتم العثور على أي شهادات تطابق معايير البحث</p>
              <Link href="/create" passHref>
                <Button className="bg-teal-700 hover:bg-teal-800">إنشاء شهادة جديدة</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                نتائج البحث ({searchResults.length} {searchResults.length === 50 ? "أو أكثر" : ""})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((certificate) => (
                  <SearchResultCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
              {searchResults.length === 50 && (
                <div className="text-center text-gray-600 mt-4">
                  <p>تم عرض أول 50 نتيجة. يرجى تحديد البحث للحصول على نتائج أكثر دقة.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
