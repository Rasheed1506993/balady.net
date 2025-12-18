import LogoLoading from "@/components/logo-loading"

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <LogoLoading size="lg" />
      <p className="mt-4 text-teal-700 font-medium animate-pulse">جاري البحث...</p>
    </div>
  )
}
