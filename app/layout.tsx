import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import AuthGuard from "@/components/AuthGuard"
import NavigationOptimizer from "@/components/navigation-optimizer"

// تحسين تحميل الخط
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // تحسين عرض الخط
  preload: true,
})

export const metadata: Metadata = {
  title: "نظام الشهادة الصحية الموحدة - بلدي",
  description: "نظام إدارة الشهادات الصحية الموحدة للعاملين في منشآت الغذاء والصحة العامة",
  keywords: "شهادة صحية, بلدي, صحة عامة, غذاء, وزارة الصحة",
  generator: "v0.dev",
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "cache-control": "public, max-age=31536000, immutable",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={inter.className}>
      <head>
        {/* تحسين تحميل الخطوط مع preload */}
        <link
          rel="preload"
          href="/fonts/Cairo-VariableFont_slnt_wght.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link rel="preload" href="/fonts/Cairo-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />

        {/* تحميل CSS بشكل مباشر */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="/css/app.min.css" rel="stylesheet" type="text/css" />

        {/* تحسين الأداء */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* DNS prefetch للموارد الخارجية */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//blob.v0.dev" />

        {/* Preconnect للموارد المهمة */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* تحسين التنقل */}
        <link rel="prefetch" href="/certificates" />
        <link rel="prefetch" href="/search" />
        <link rel="prefetch" href="/dashboard" />
        <link rel="prefetch" href="/create" />
      </head>
      <body className={inter.className + " performance-optimized navigation-optimized"}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange={true}
        >
          <NavigationOptimizer />
          <AuthGuard>
            <div className="scroll-optimized navigation-smooth">{children}</div>
          </AuthGuard>
        </ThemeProvider>

        {/* تحسين الأداء والتنقل */}
        <Script id="performance-navigation-optimization" strategy="afterInteractive">
          {`
            // تحسين التنقل والأداء
            (function() {
              // تحسين التنقل السريع
              const prefetchLinks = () => {
                const links = document.querySelectorAll('a[href^="/"]');
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const link = entry.target;
                      const href = link.getAttribute('href');
                      if (href && !link.dataset.prefetched) {
                        const linkEl = document.createElement('link');
                        linkEl.rel = 'prefetch';
                        linkEl.href = href;
                        document.head.appendChild(linkEl);
                        link.dataset.prefetched = 'true';
                      }
                    }
                  });
                }, { rootMargin: '50px' });

                links.forEach(link => observer.observe(link));
              };

              // تحسين الصور
              const optimizeImages = () => {
                const images = document.querySelectorAll('img[data-src]');
                if ('IntersectionObserver' in window) {
                  const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                      if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                      }
                    });
                  });
                  images.forEach(img => imageObserver.observe(img));
                }
              };

              // تحسين التمرير
              const optimizeScrolling = () => {
                let ticking = false;
                const updateScroll = () => {
                  ticking = false;
                };
                
                window.addEventListener('scroll', () => {
                  if (!ticking) {
                    requestAnimationFrame(updateScroll);
                    ticking = true;
                  }
                }, { passive: true });
              };

              // تشغيل التحسينات
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                  prefetchLinks();
                  optimizeImages();
                  optimizeScrolling();
                });
              } else {
                prefetchLinks();
                optimizeImages();
                optimizeScrolling();
              }

              // تحسين الذاكرة
              window.addEventListener('beforeunload', () => {
                // تنظيف المستمعين
                window.removeEventListener('scroll', null);
              });
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
