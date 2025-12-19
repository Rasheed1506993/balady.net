//components/navbar-menu.tsx
"use client"

import React, { useState } from "react";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

type NavItem = { title: string; href?: string; items?: NavItem[] }

const MenuItem: React.FC<{ item: NavItem; level?: number; isOpen?: boolean; onToggle?: () => void }> = ({ item, level = 0, isOpen, onToggle }) => {
  return (
    <li className={`relative ${level > 0 ? 'pl-4' : ''}`}>
      {item.items ? (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggle?.();
            }}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            className="flex items-center justify-between w-full py-2 text-right hover:text-white transition-colors outline-none focus:outline-none"
            style={{
              color: level === 0 ? '#fff' : '#000000',
              fontWeight: level === 0 ? '600' : 'normal',
              fontSize: level === 0 ? '14px' : '12px'
            }}
          >
            <div className="flex items-center justify-end">
              <span className="font-doto">{item.title}</span>
              {level === 0 && (
                <span className={`mr-1 text-xs transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              )}
            </div>
          </button>

          {isOpen && (
            <ul className={`mt-1 ${level === 0 ? 'bg-white p-3 rounded-none right-0 w-56 mt-1 shadow-lg' : 'mt-1 space-y-4'} text-xs font-hel-sm`}>
              {item.items.map((child: NavItem, idx: number) => (
                <MenuItem
                  key={idx}
                  item={child}
                  level={level + 1}
                  isOpen={true} // Always open children if parent is open
                />
              ))}
            </ul>
          )}
        </>
      ) : (
        <a
          href={item.href}
          className="flex items-center text-xs font-hel-sm py-1"
          style={{ color: '#808080', fontWeight: level === 0 ? '600' : 'normal' }}
        >
          <ChevronLeftIcon className="h-3 w-3 ml-1" />
          {item.title}
        </a>
      )}
    </li>
  );
};


function NavList({ isMobile = false }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null); // لإغلاق/فتح عنصر واحد فقط

  const toggleItem = (index: number) => {
    setOpenIndex(prev => prev === index ? null : index);
  };
  const menuData = [
    {
      title: "عن بلدي",
      items: [
        {
          title: "من نحن",
          items: [
            { title: "من نحن", href: "https://balady.gov.sa/node/10671" },
            { title: "الهيكل التنظيمي", href: "https://balady.gov.sa/node/11036" },
            { title: "الهيكل الإستراتيجي للوزارة", href: "https://balady.gov.sa/node/11038" },
            { title: "السياسات والاستراتيجيات", href: "https://balady.gov.sa/node/11014" },
            { title: "أهداف التنمية المستدامة", href: "https://balady.gov.sa/node/11004" },
            { title: "الشركاء", href: "https://balady.gov.sa/node/10903" },
            { title: "الوظائف", href: "https://balady.gov.sa/node/10982" },
            { title: "تواصل معنا", href: "https://balady.gov.sa/node/11217" }
          ]
        },
        {
          title: "المشاركة الإلكترونية",
          items: [
            { title: "الاستشارات", href: "https://balady.gov.sa/node/11215" },
            { title: "البيانات المفتوحة", href: "https://balady.gov.sa/node/11190" },
            { title: "التغذية الراجعة", href: "https://balady.gov.sa/node/11205" },
            { title: "التطوير المشترك والأفكار", href: "https://balady.gov.sa/node/11281" },
            { title: "وسائل التواصل الاجتماعي", href: "https://balady.gov.sa/node/11022" }
          ]
        },
        {
          title: "الأخبار والفعاليات",
          items: [
            { title: "الأخبار", href: "https://balady.gov.sa/ar/news.html" },
            { title: "الفعاليات", href: "https://balady.gov.sa/events-list" }
          ]
        },
        {
          title: "المنافسات والميزانية",
          items: [
            { title: "المنافسات والمشتريات", href: "https://balady.gov.sa/node/10981" },
            { title: "الميزانية والإنفاق", href: "https://balady.gov.sa/node/11050" }
          ]
        }
      ]
    },
    {
      title: "مركز المعرفة",
      items: [
        {
          title: "مبادرات وشراكات",
          items: [
            { title: "المبادرات", href: "https://balady.gov.sa/node/10897" },
            { title: "الشراكات", href: "https://balady.gov.sa/node/10903" },
            { title: "منصة استطلاع", href: "https://balady.gov.sa/" },
            { title: "منصة تفاعل", href: "https://balady.gov.sa/" }
          ]
        },
        {
          title: "بيانات وإحصائيات",
          items: [
            { title: "البيانات المفتوحة", href: "https://balady.gov.sa/node/11190" },
            { title: "الوثائق والتقارير", href: "https://balady.gov.sa/prints" },
            { title: "إحصائيات ومؤشرات المنصة", href: "https://balady.gov.sa/node/11180" }
          ]
        }
      ]
    },
    {
      title: "الخدمات",
      items: [
        {
          title: "الصفحات الشخصية",
          items: [
            { title: "إدارة الطلبات", href: "https://balady.gov.sa/node/11106" },
            { title: "إدارة الرخص", href: "https://balady.gov.sa/node/11108" },
            { title: "لوحة التحكم", href: "https://balady.gov.sa/" }
          ]
        },
        {
          title: "المنظمات والأنظمة",
          items: [
            { title: "منصة رسم إشغال مرافق الإيواء", href: "https://balady.gov.sa/node/10767" },
            { title: "منصة رسم تقديم منتجات التبغ", href: "https://balady.gov.sa/node/10800" },
            { title: "نظام المكاتب الهندسية", href: "https://balady.gov.sa/node/10721" },
            { title: "تصنيف مقدمي خدمات المدن", href: "https://balady.gov.sa/node/10635" }
          ]
        },
        {
          title: "التفويض البلدي الإلكتروني",
          items: [
            { title: "إضافة منشأة إلى مدير حساب", href: "https://balady.gov.sa/node/10794" },
            { title: "الاستعلام عن طلبات منشأة", href: "https://balady.gov.sa/node/10792" },
            { title: "الاستعلام عن مفوضي منشأة", href: "https://balady.gov.sa/node/10793" }
          ]
        },
        {
          title: "الرخص التجارية",
          items: [
            { title: "إصدار رخصة تجارية", href: "https://balady.gov.sa/node/11010" },
            { title: "تجديد رخصة نشاط تجاري", href: "https://balady.gov.sa/node/10485" },
            { title: "إلغاء رخصة نشاط تجاري", href: "https://balady.gov.sa/node/10492" }
          ]
        },
        {
          title: "الرخص الإنشائية",
          items: [
            { title: "إصدار رخصة بناء", href: "https://balady.gov.sa/node/10472" },
            { title: "خدمة إصدار رخصة تسوير أراضي فضاء", href: "https://balady.gov.sa/node/10538" }
          ]
        },
        {
          title: "الشهادات الصحية",
          items: [
            { title: "إصدار شهادة صحية", href: "https://balady.gov.sa/node/10592" },
            { title: "تجديد شهادة صحية", href: "https://balady.gov.sa/node/10596" }
          ]
        },
        {
          title: "خدمات تنسيق المشروعات",
          items: [
            { title: "خدمات تنسيق أعمال البنية التحتية", href: "https://balady.gov.sa/node/10497" },
            { title: "خدمات تنسيق المشروعات الكبرى", href: "https://balady.gov.sa/node/11535" }
          ]
        },
        {
          title: "خدمات التقارير المساحية",
          items: [
            { title: "إصدار تقرير مساحي", href: "https://balady.gov.sa/node/10747" }
          ]
        },
        {
          title: "تحديث الصكوك",
          items: [
            { title: "تحديث صك إلكتروني", href: "https://balady.gov.sa/node/11580" }
          ]
        },
        {
          title: "قائمة الخدمات",
          href: "https://balady.gov.sa/node/10895"
        }
      ]
    },
    {
      title: "الاستعلامات",
      items: [
        {
          title: "الاستعلامات العامة",
          items: [
            { title: "الاستعلام عن المخالفة للإجراءات الاحترازية", href: "https://balady.gov.sa/node/11110" },
            { title: "حاسبة الرسوم المعلوماتية", href: "https://balady.gov.sa/node/11112" },
            { title: "الاستعلام عن المكاتب الهندسية", href: "https://balady.gov.sa/node/11114" },
            { title: "الاستعلام عن عقود النظافة", href: "https://balady.gov.sa/node/11116" },
            { title: "أسواق المتاجر المتنقلة", href: "https://balady.gov.sa/node/11118" },
            { title: "الاستعلام عن الإيقافات", href: "https://balady.gov.sa/node/11120" },
            { title: "الاستعلام عن المخالفات", href: "https://balady.gov.sa/node/11122" }
          ]
        },
        {
          title: "الأراضي والبناء",
          items: [
            { title: "استعلام عن رخصة بناء", href: "https://balady.gov.sa/node/11124" },
            { title: "اشتراطات إيصال الخدمات الكهربائية", href: "https://balady.gov.sa/node/11126" },
            { title: "المستكشف الجغرافي", href: "https://balady.gov.sa/node/11130" },
            { title: "مستكشف التغطية لخدمات البنية التحتية", href: "https://balady.gov.sa/node/11132" },
            { title: "الاستعلام عن قرار مساحي", href: "https://balady.gov.sa/node/11632" }
          ]
        },
        {
          title: "الاستعلامات التجارية",
          items: [
            { title: "استعلام عن رخصة نشاط تجاري", href: "https://balady.gov.sa/" },
            { title: "الأنشطة التجارية والاشتراطات البلدية", href: "https://balady.gov.sa/node/11136" },
            { title: "الاستعلام عن مسارات العربات المتجولة", href: "https://balady.gov.sa/node/11138" },
            { title: "الدليل التنظيمي للوحات التجارية لمدينة الرياض", href: "https://balady.gov.sa/node/11142" },
            { title: "الدليل التنظيمي للوحات التجارية لأمانة المدينة المنورة", href: "https://balady.gov.sa/node/11668" }
          ]
        },
        {
          title: "خدمات إكرام الموتى",
          items: [
            { title: "الاستعلام عن مقدمي خدمات نقل وتجهيز الموتى", href: "https://balady.gov.sa/node/10488" },
            { title: "الاستعلام عن قبر متوفي", href: "https://balady.gov.sa/node/10724" },
            { title: "طباعة شهادة دفن", href: "https://balady.gov.sa/node/10477" },
            { title: "الاستعلام عن المقابر", href: "https://balady.gov.sa/node/10729" }
          ]
        }
      ]
    },
    {
      title: "المنصات",
      items: [
        { title: "بوابة الفرص الاستثمارية", href: "https://balady.gov.sa/" },
        { title: "المنصات التفاعلية", href: "https://balady.gov.sa/" }
      ]
    },
    {
      title: "تواصل معنا",
      items: [
        { title: "اتصل بنا", href: "https://balady.gov.sa/node/11316" },
        { title: "بلاغ عن فساد", href: "https://balady.gov.sa/node/11211" },
        { title: "الأسئلة الشائعة", href: "https://balady.gov.sa/node/10902" },
        { title: "الدعم الفني بلغة الإشارة", href: "https://balady.gov.sa/" },
        { title: "دليل الفروع", href: "https://balady.gov.sa/node/11188" },
        { title: "وسائل التواصل الاجتماعي", href: "https://balady.gov.sa/node/11022" },
        { title: "حجز موعد إلكتروني", href: "https://balady.gov.sa/node/10541" }
      ]
    }
  ];

  return (
    <ul
      className={`font-doto ${isMobile ? 'flex flex-col gap-3' : 'hidden lg:flex lg:flex-row lg:items-center lg:gap-6'}`}
      dir="rtl"
    >
      {menuData.map((item, index) => (
        <MenuItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => toggleItem(index)}
        />
      ))}
    </ul>
  );
}


  




export function NavbarBalady() {
  const [openNav, setOpenNav] = useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    // @ts-ignore: third-party component types are incompatible with our usage
    <Navbar
      className="bg-[#f0f4f5] mx-auto max-w-screen-xl px-4 py-3 rounded-none border-none"
      style={{ backgroundColor: "#006463", color: "#ffffff" }}
    >
      <div className="flex items-center justify-between" dir="rtl">
        <a href="https://balady.gov.sa/ar">
          <Image
            src="/images/verify-logo2.png"
            alt="شعار بلدي"
            width={130}
            height={30}
            className="object-contain"
          />
        </a>

        <div className="hidden lg:block">
          <NavList />
        </div>

        <button
          onClick={() => setOpenNav(!openNav)}
          className="lg:hidden p-2 text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-12 ml-[50px]" strokeWidth={2} />
        </button>
      </div>

      <Collapse open={openNav}>
        <div className="lg:hidden">
          <NavList isMobile />
        </div>
      </Collapse>
    </Navbar>

  );
}
