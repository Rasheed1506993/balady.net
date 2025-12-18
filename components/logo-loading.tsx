"use client"

import Image from "next/image"

interface LogoLoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
  message?: string
}

export default function LogoLoading({ size = "md", className = "", message = "جاري التحميل..." }: LogoLoadingProps) {
  const sizeClasses = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-32 h-16",
  }

  const getDimensions = (size: "sm" | "md" | "lg") => {
    switch (size) {
      case "sm":
        return { width: 64, height: 32 }
      case "md":
        return { width: 96, height: 48 }
      case "lg":
        return { width: 128, height: 64 }
      default:
        return { width: 96, height: 48 }
    }
  }

  const dimensions = getDimensions(size)

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
