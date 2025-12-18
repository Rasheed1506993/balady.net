import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "التحقق من الشهادة الصحية - بلدي",
  description: "تحقق من صحة الشهادة الصحية الموحدة",
  robots: {
    index: true,
    follow: true,
  },
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="verify-page-optimized">{children}</div>
}
