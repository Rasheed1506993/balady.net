// app/verify/[id]/loading.tsx
import Image from "next/image"

export default function VerifyLoading() {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative flex flex-col items-center justify-center">
        {/* دائرة نبض شفافة */}
        <span className="absolute inline-flex h-12 w-12 rounded-full bg-grey opacity-75 animate-ping"></span>

        {/* الشعار */}
        <div className="relative">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={200}
            height={200}
            priority
            className="w-48 h-auto"
          />
        </div>
      </div>
    </div>
  
  )
}