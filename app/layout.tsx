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
    <html lang="ar" dir="rtl">
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

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="https://apps.balady.gov.sa/BALADYCDN/Content/images/fav.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://apps.balady.gov.sa/BALADYCDN/Content/images/fav.png" />

        {/* CSS Files */}
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/icons/fontawesome5/css/all.css" rel="stylesheet" type="text/css" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/select2/css/select2.min.css" rel="stylesheet" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/css/app.min.css" rel="stylesheet" type="text/css" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/unified_identity_assets/css/app.min.css" rel="stylesheet" type="text/css" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.calendars.picker.css" rel="stylesheet" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/Validation.css" rel="stylesheet" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/DataTables/jquery.dataTables.min.css" rel="stylesheet" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/DataTables/Style.css" rel="stylesheet" />
        <link href="https://apps.balady.gov.sa/BALADYCDN/Content/style.css?v=1" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" type="text/css" href="https://apps.balady.gov.sa/BALADYCDN/Content/enhancement.css?v=388833" />

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
      <body className={"loged-user loaded"}>
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

        {/* JavaScript Files - Loaded in order */}
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/js/jquery.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.plugin.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.calendars.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.calendars.plus.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.calendars.picker.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/HijriDatePicker/jquery.calendars.ummalqura.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/select2/js/select2.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/select2/js/i18n/ar.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/parsleyjs/parsley.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/parsleyjs/i18n/ar.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/plugins/DataTables/jquery.dataTables.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/health/issue/lib/sweetalert2/sweetalert2.all.min.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/health/issue/Content/js/app.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/unified_identity_assets/js/app.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/startup.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/Message.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/Validation.js" strategy="afterInteractive" />
        <Script src="https://apps.balady.gov.sa/BALADYCDN/Content/Support.js?v=388833" strategy="afterInteractive" />

        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-69XYTDF1T2" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-69XYTDF1T2');
          `}
        </Script>

        {/* Muneer Loader */}
        <Script type="module" src="https://muneer.cx/static/v3/js/loader.min.js?cid=7e6f57f5-43a9-4c2b-97bc-bf2ff14b14c7" id="muneer-loader-js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
