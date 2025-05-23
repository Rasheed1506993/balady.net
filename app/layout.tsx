import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next" // أضفنا استيراد Viewport
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "الشهادة الصحية الموحدة",
  description: "نظام الشهادة الصحية الموحدة",
  generator: "v0.dev",
}

// أضفنا كائن Viewport الجديد
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // يمكنك إضافة المزيد من الخصائص إذا لزم الأمر
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={inter.className}>
      <head>
        {/* يمكنك إضافة أي عناصر إضافية للـ head هنا */}
        <link href="https://yabalady.net/files/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="https://yabalady.net/files/css/app.min.css" rel="stylesheet" type="text/css" />
      
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}