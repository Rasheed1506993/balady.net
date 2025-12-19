"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import "@/styles/frutiger.css";
import "@/styles/menu-interactions.css";

export function BaladyHeader() {
  const [hideNavbarBrandLogo, setHideNavbarBrandLogo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function onLoaded() {
      setHideNavbarBrandLogo(true);
    }

    if (document.readyState === "complete") {
      onLoaded();
    } else {
      window.addEventListener("load", onLoaded);
    }

    function initBootstrap() {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (!w.$) return;
      const $ = w.$;

      $(".mainHeader .dropdown-toggle").attr("data-toggle", "dropdown");
      $(".mainHeader .dropdown-toggle").removeAttr("data-bs-toggle");
      $(".mainHeader .navbar-toggler").attr("data-toggle", "collapse");
      $(".mainHeader .navbar-toggler").removeAttr("data-bs-toggle");
      $(".mainHeader .navbar-toggler").attr(
        "data-target",
        "#navbarSupportedContent"
      );
      $(".mainHeader .navbar-toggler").removeAttr("data-bs-target");
    }

    initBootstrap();
    const id = setTimeout(initBootstrap, 800);
    const id2 = setTimeout(() => {
      if (typeof window === "undefined") return;
      const w = window as any;
      if (!w.$) return;
      const $ = w.$;
      $(".mainHeader .dropdown-toggle").attr("data-toggle", "dropdown");
      $(".mainHeader .dropdown-toggle").removeAttr("data-bs-toggle");
      $(".mainHeader .navbar-toggler").attr("data-toggle", "collapse");
      $(".mainHeader .navbar-toggler").removeAttr("data-bs-toggle");
      $(".mainHeader .navbar-toggler").attr("data-target", "#navbarSupportedContent");
      $(".mainHeader .navbar-toggler").removeAttr("data-bs-target");
    }, 3500);

    return () => {
      clearTimeout(id);
      clearTimeout(id2);
      window.removeEventListener("load", onLoaded);
    };
  }, []);

  return (
    <div className="site-header-cont">
      {/* SVG Library */}
      <svg className="svg-library d-none" xmlns="http://www.w3.org/2000/svg">
        {/* SVG symbols will be added here if needed */}
      </svg>

      <header className={`site-header inner-header-login ${isScrolled ? "scrolled" : ""}`}>
        <div className="container-fluid">
          <nav className="navbar navbar-expand-lg">
            <a className="navbar-brand" href="https://balady.gov.sa/ar">
              <img className="logo" alt="logo" src="https://apps.balady.gov.sa/BALADYCDN/Content/Images/logo-light.svg" style={{ height: "40px" }} />
            </a>

            {/* هيدر بلدي */}
            <header className="mainHeader">
              <div className="container-fluid">
                <div className="row align-items-center">
                  {/* يمين: شعار + منيو */}
                  <div className="col d-flex columns">
                    {/* الشعار الرئيسي */}
                    <div className="region region--header">
                      <div
                        id="block-sitebranding"
                        className="clearfix site-branding block block-system block-system-branding-block"
                      >
                        <a
                          href="https://balady.gov.sa/ar"
                          rel="home"
                          className="site-branding__logo"
                        >
                          <Image
                            src="/baledy/themes/custom/balady_new/logo.svg"
                            alt="الرئيسية"
                            width={160}
                            height={40}
                            style={{ height: "auto" }}
                          />
                        </a>
                      </div>
                    </div>

                    {/* منيو رئيسية */}
                    <nav className="navbar navbar-expand-lg position-static header-mobile-container ml-auto">
                      {/* زر الهامبرجر */}
                      <button
                        className="navbar-toggler"
                        type="button"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="#000000"
                          viewBox="0 0 30 30"
                          width="30px"
                          height="30px"
                        >
                          <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z" />
                        </svg>
                      </button>

                      <div
                        className="navbar-collapse collapse"
                        id="navbarSupportedContent"
                        style={{}}
                      >
                        <ul className="menu" aria-hidden="false" style={{ fontWeight: "900", fontSize: "19px" }}>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-1" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>عن بلدي</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-1" aria-hidden="false">
                                  <span>من نحن</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/about-balady" data-drupal-link-system-path="node/10671">من نحن</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/11036" data-drupal-link-system-path="node/11036">الهيكل التنظيمي</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/11038" data-drupal-link-system-path="node/11038">الهيكل الإستراتيجي للوزارة </a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/11014" data-drupal-link-system-path="node/11014">السياسات والاستراتيجيات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-5" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/11004" data-drupal-link-system-path="node/11004">أهداف التنمية المستدامة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-6" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/rules" data-drupal-link-system-path="rules">الأنظمة واللوائح</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-7" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/10982" data-drupal-link-system-path="node/10982">الوظائف</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-8" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/11217" data-drupal-link-system-path="node/11217">تواصل معنا</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-2" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/e_participation" data-drupal-link-system-path="node/11024">المشاركة الإلكترونية</a>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/consultations" data-drupal-link-system-path="consultations">الاستشارات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/12029" data-drupal-link-system-path="node/12029">بيان المشاركة الالكترونية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/11190" data-drupal-link-system-path="node/11190">البيانات المفتوحة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/feedback" data-drupal-link-system-path="node/11205">التغذية الراجعة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-5" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/development-and-ideas" data-drupal-link-system-path="node/11281">التطوير المشترك والأفكار</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-6" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/11022" data-drupal-link-system-path="node/11022">وسائل التواصل الاجتماعي</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-3" aria-hidden="false">
                                  <span>الأخبار والفعاليات</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/news" data-drupal-link-system-path="node/11152">الأخبار</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/events-list" data-drupal-link-system-path="events-list">الفعاليات</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-4" aria-hidden="false">
                                  <span>المنافسات والميزانية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/10981" data-drupal-link-system-path="node/10981">المنافسات والمشتريات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/budget-statistics" data-drupal-link-system-path="budget-statistics">الميزانية والإنفاق</a>
                                    </li>
                                  </ul>

                                </li>
                              </ul>

                            </div>
                          </li>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-2" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>مركز المعرفة</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-1" aria-hidden="false">
                                  <span>مبادرات وشراكات</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/initiatives" data-drupal-link-system-path="node/10897">المبادرات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/partners" data-drupal-link-system-path="node/10903">الشراكات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://istitlaa.ncc.gov.sa/ar/Municipality/momra/Pages/default.aspx">منصة استطلاع</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://eparticipation.my.gov.sa/">منصة تفاعل</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-2" aria-hidden="false">
                                  <span>بيانات وإحصائيات</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/11190" data-drupal-link-system-path="node/11190">البيانات المفتوحة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/e_participation/feedback/11180" data-drupal-link-system-path="node/11180">إحصائيات ومؤشرات المنصة</a>
                                    </li>
                                  </ul>

                                </li>
                              </ul>

                            </div>
                          </li>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-3" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>الخدمات</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-1" aria-hidden="false">
                                  <span>الصفحات الشخصية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/11106">إدارة الطلبات</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/11108">إدارة الرخص</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://apps.balady.gov.sa/dashboardclient/dashboard">لوحة التحكم</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-2" aria-hidden="false">
                                  <span>المنظمات والأنظمة</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10767">منصة رسم إشغال مرافق الإيواء</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10800">منصة رسم تقديم منتجات التبغ</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/products/10721" data-drupal-link-system-path="products/10721">بلدي أعمال</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/products/10635" data-drupal-link-system-path="products/10635">تصنيف مقدمي خدمات المدن</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-3" aria-hidden="false">
                                  <span>التفويض البلدي الإلكتروني</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10794">إضافة منشأة إلى مدير حساب</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10792">الاستعلام عن طلبات منشأة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10793">الاستعلام عن مفوضي منشأة</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-4" aria-hidden="false">
                                  <span>الرخص التجارية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/11010">إصدار رخصة تجارية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10485">تجديد رخصة نشاط تجاري</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10492">إلغاء رخصة نشاط تجاري</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-5" aria-hidden="false">
                                  <span>الرخص الإنشائية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10472">إصدار رخصة بناء</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10538">خدمة إصدار رخصة تسوير أراضي فضاء</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-6" aria-hidden="false">
                                  <span>الشهادات الصحية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10592">إصدار شهادة صحية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10596">تجديد شهادة صحية</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-7" aria-hidden="false">
                                  <span>خدمات تنسيق المشروعات</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/products/10497" data-drupal-link-system-path="products/10497">خدمات تنسيق أعمال البنية التحتية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/products/11535" data-drupal-link-system-path="products/11535">خدمات تنسيق المشروعات الكبرى</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-8" aria-hidden="false">
                                  <span>خدمات التقارير المساحية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/services/10747">إصدار تقرير مساحي</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-level-1 menu-count-9" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/services" data-drupal-link-system-path="node/10895">قائمة الخدمات</a>
                                </li>
                              </ul>

                            </div>
                          </li>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-4" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>الاستعلامات</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-1" aria-hidden="false">
                                  <span>الاستعلامات العامة</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/node/18920" data-drupal-link-system-path="node/18920">العقود النموذجية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%A7%D9%84%D9%85%D8%AE%D8%A7%D9%84%D9%81%D8%A9-%D9%84%D9%84%D8%A5%D8%AC%D8%B1%D8%A7%D8%A1%D8%A7%D8%AA-%D8%A7%D9%84%D8%A7%D8%AD%D8%AA%D8%B1%D8%A7%D8%B2%D9%8A%D8%A9" data-drupal-link-system-path="node/11110">الاستعلام عن المخالفة للإجراءات الاحترازية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D8%A7%D9%84%D8%B1%D8%B3%D9%88%D9%85-%D8%A7%D9%84%D9%85%D8%B9%D9%84%D9%88%D9%85%D8%A7%D8%AA%D9%8A%D8%A9" data-drupal-link-system-path="node/11112">حاسبة الرسوم المعلوماتية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%A7%D9%84%D9%85%D9%83%D8%A7%D8%AA%D8%A8-%D8%A7%D9%84%D9%87%D9%86%D8%AF%D8%B3%D9%8A%D8%A9" data-drupal-link-system-path="node/11114">الاستعلام عن المكاتب الهندسية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-5" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%B9%D9%82%D9%88%D8%AF-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%81%D8%A9" data-drupal-link-system-path="node/11116">الاستعلام عن عقود النظافة</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-6" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A3%D8%B3%D9%88%D8%A7%D9%82-%D8%A7%D9%84%D9%85%D8%AA%D8%A7%D8%AC%D8%B1-%D8%A7%D9%84%D9%85%D8%AA%D9%86%D9%82%D9%84%D8%A9" data-drupal-link-system-path="node/11118">أسواق المتاجر المتنقلة</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-2" aria-hidden="false">
                                  <span>الأراضي والبناء</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://architsaudi.dasc.gov.sa/">الاستعلام عن العمارة السعودية </a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%B1%D8%AE%D8%B5%D8%A9-%D8%A8%D9%86%D8%A7%D8%A1" data-drupal-link-system-path="node/11124">استعلام عن رخصة بناء</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D9%83%D8%B4%D9%81-%D8%A7%D9%84%D8%AC%D8%BA%D8%B1%D8%A7%D9%81%D9%8A" data-drupal-link-system-path="node/11130">المستكشف الجغرافي</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D9%85%D8%B3%D8%AA%D9%83%D8%B4%D9%81-%D8%A7%D9%84%D8%AA%D8%BA%D8%B7%D9%8A%D8%A9-%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D8%AA%D8%AD%D8%AA%D9%8A%D8%A9" data-drupal-link-system-path="node/11132">مستكشف التغطية لخدمات البنية التحتية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-5" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%AA%D9%82%D8%B1%D9%8A%D8%B1-%D9%85%D8%B3%D8%A7%D8%AD%D9%8A" data-drupal-link-system-path="node/11632">الاستعلام عن تقرير مساحي</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-3" aria-hidden="false">
                                  <span>الاستعلامات التجارية</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://commercial.balady.gov.sa/OperationalLicenseForBoards/Inquiry">الاستعلام عن الرخص التشغيلية للوحات الدعائية والاعلانية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%B1%D8%AE%D8%B5%D8%A9-%D9%86%D8%B4%D8%A7%D8%B7-%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A" data-drupal-link-system-path="node/11134">استعلام عن رخصة نشاط تجاري</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A3%D9%86%D8%B4%D8%B7%D8%A9-%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A%D8%A9-%D9%88%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D8%B7%D8%A7%D8%AA-%D8%A7%D9%84%D8%A8%D9%84%D8%AF%D9%8A%D8%A9" data-drupal-link-system-path="node/11136">الأنشطة التجارية والاشتراطات البلدية</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D9%85%D8%B3%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D8%AA%D8%AC%D9%88%D9%84%D8%A9" data-drupal-link-system-path="node/11138">الاستعلام عن مسارات العربات المتجولة</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-item--expanded  menu-level-1 menu-count-4" aria-hidden="false">
                                  <span>خدمات إكرام الموتى</span>
                                  <ul className="menu" aria-hidden="false">
                                    <li className="menu-item menu-level-2 menu-count-1" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D9%85%D9%82%D8%AF%D9%85%D9%8A-%D8%AE%D8%AF%D9%85%D8%A7%D8%AA-%D9%86%D9%82%D9%84-%D9%88%D8%AA%D8%AC%D9%87%D9%8A%D8%B2-%D8%A7%D9%84%D9%85%D9%88%D8%AA%D9%89-%D8%A7%D9%84%D8%AC%D9%87%D8%A7%D8%AA-%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D9%8A%D8%A9" data-drupal-link-system-path="node/10488">الاستعلام عن مقدمي خدمات نقل وتجهيز الموتى (الجهات الخيرية)</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-2" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D9%82%D8%A8%D8%B1-%D9%85%D8%AA%D9%88%D9%81%D9%8A" data-drupal-link-system-path="node/10724">الاستعلام عن قبر متوفي</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-3" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%B7%D8%A8%D8%A7%D8%B9%D8%A9-%D8%B4%D9%87%D8%A7%D8%AF%D8%A9-%D8%AF%D9%81%D9%86" data-drupal-link-system-path="node/10477">طباعة شهادة دفن</a>
                                    </li>
                                    <li className="menu-item menu-level-2 menu-count-4" aria-hidden="false">
                                      <a href="https://balady.gov.sa/ar/services/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B9%D9%84%D8%A7%D9%85-%D8%B9%D9%86-%D8%A7%D9%84%D9%85%D9%82%D8%A7%D8%A8%D8%B1" data-drupal-link-system-path="node/10729">الاستعلام عن المقابر</a>
                                    </li>
                                  </ul>

                                </li>
                                <li className="menu-item menu-level-1 menu-count-5" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/products/%D8%A7%D9%84%D8%AF%D9%84%D9%8A%D9%84-%D8%A7%D9%84%D8%AA%D9%86%D8%B8%D9%8A%D9%85%D9%8A-%D9%84%D9%84%D9%88%D8%AD%D8%A7%D8%AA-%D8%A7%D9%84%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A%D8%A9" data-drupal-link-system-path="node/11704">الدليل التنظيمي للوحات التجارية</a>
                                </li>
                              </ul>

                            </div>
                          </li>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-5" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>المنصات</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-level-1 menu-count-1" aria-hidden="false">
                                  <a href="https://furas.momra.gov.sa/">بوابة الفرص الاستثمارية</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-2" aria-hidden="false">
                                  <a href="https://socinvest.momah.gov.sa">منصة تحدي الاستثمار الاجتماعي للقطاع البلدي والإسكان</a>
                                </li>
                              </ul>

                            </div>
                          </li>
                          <li className="menu-item menu-item--expanded  dropdown menu-item-first menu-level-0 menu-count-6" aria-hidden="false">
                            <a className=" dropdown-toggle" href="#" role="button" aria-expanded="false" aria-hidden="false" data-toggle="dropdown">
                              <span>تواصل معنا</span>
                            </a>
                            <div className="dropdown-menu">
                              <ul className="menu" aria-hidden="false">
                                <li className="menu-item menu-level-1 menu-count-1" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/form/contact-us" data-drupal-link-system-path="node/11316">اتصل بنا</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-2" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/node/11211" data-drupal-link-system-path="node/11211">بلاغ عن فساد إلى (نزاهة)</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-3" aria-hidden="false">
                                  <a href="https://momah.gov.sa/ar/report-corruption">الإبلاغ عن شبهة فساد</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-4" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/faq" data-drupal-link-system-path="node/10902">الأسئلة الشائعة</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-5" aria-hidden="false">
                                  <a href="https://deaf.dga.gov.sa/">الدعم الفني بلغة الإشارة</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-6" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/node/11188" data-drupal-link-system-path="node/11188">دليل الأمانات</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-7" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/e_participation/11022" data-drupal-link-system-path="node/11022">وسائل التواصل الإجتماعي</a>
                                </li>
                                <li className="menu-item menu-level-1 menu-count-8" aria-hidden="false">
                                  <a href="https://balady.gov.sa/ar/services/%D8%AD%D8%AC%D8%B2-%D9%85%D9%88%D8%B9%D8%AF-%D8%A5%D9%84%D9%83%D8%AA%D8%B1%D9%88%D9%86%D9%8A" data-drupal-link-system-path="node/10541">حجز موعد إلكتروني</a>
                                </li>
                              </ul>

                            </div>
                          </li>
                        </ul>
                        {/* Mobile Components Footer */}
                        <div className="mobile-menu-footer">
                          {/* Search */}
                          <div className="header-search-mobile">
                            <a
                              role="button"
                              className="search-link d-flex flex-column align-items-center text-white"
                              id="searchBtnMobile"
                              aria-label="بحث"
                              href="#headerSearch"
                              data-toggle="modal"
                            >
                              <i className="fa fa-search mb-1" style={{ fontSize: "1.2rem" }} />
                              <span className="small">بحث</span>
                            </a>
                          </div>

                          {/* Settings */}
                          <div className="webAccessability-ddl-mobile dropdown">
                            <a
                              className="align-items-center btn d-flex flex-column p-0 shadow-none text-white"
                              id="webAccessabilityBtnAncorBtnMobile"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fa fa-cog mb-1" style={{ fontSize: "1.2rem" }} />
                              <span className="small">الإعدادات</span>
                            </a>
                            {/* Dropdown menu copy if needed, or share the same one */}
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* يسار: بحث + إعدادات */}
                  <div className="header-left header-left_hide">
                    <div className="region-header-left d-flex align-items-center justify-content-end">
                      {/* بحث */}
                      <div className="header-search headersearch_hide">
                        <a
                          role="button"
                          className="search-link align-items-center btn d-flex flex-column pt-1 p-0 shadow-none"
                          id="searchBtn"
                          aria-label="بحث"
                          href="#headerSearch"
                          data-toggle="modal"
                        >
                          <i className="fa fa-search" />
                          <span>بحث</span>
                        </a>
                      </div>

                      {/* إمكانية الوصول */}
                      <div
                        id="webAccessabilityBtnAncor"
                        className="dropdown webAccessability-ddl webAccessability_hide"
                      >
                        <a
                          className="align-items-center btn d-flex flex-column pt-1 text-white p-0 shadow-none"
                          id="webAccessabilityBtnAncorBtn"
                          href="#"
                          role="button"
                          data-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa fa-cog" />
                          <span>الإعدادات</span>
                        </a>

                        <ul className="accesability shadow-lg dropdown-menu">
                          <li className="font-size custom-toggle">
                            <span className="small text-center"> حجم الخط</span>
                            <div className="font-size-content">
                              <button className="big" aria-label="big">
                                أ+
                              </button>
                              <button className="normal" aria-label="Normal">
                                أ
                              </button>
                              <button className="small" aria-label="small">
                                أ-
                              </button>
                            </div>
                          </li>
                          <li className="custom-toggle">
                            <button className="print-page" aria-label="الطباعة">
                              <span className="small text-body">الطباعة</span>
                              <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="#6c757d"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_231_6413)">
                                  <path
                                    d="M7.39838 9.62458C7.13373 8.22471 7.11198 7.30214 7.2918 6.04077C7.36249 5.54493 7.76829 5.16693 8.26619 5.11261C11.0531 4.80859 12.9285 4.80048 15.7051 5.10727C16.2167 5.16379 16.6267 5.56231 16.6847 6.07374C16.8283 7.34307 16.81 8.26025 16.5963 9.62458"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M7.00713 16.8904C5.80797 16.8203 4.85718 15.8255 4.85718 14.6087V13C4.85718 11.2857 5.42527 9.83404 7.71432 9.57145C11.0648 9.18709 12.9362 9.19171 16.2858 9.57145C18.5566 9.82889 19.1429 11.2857 19.1429 13V14.6087C19.1429 15.8255 18.1922 16.8203 16.993 16.8904"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M16.6202 15.4192C16.8965 16.0814 17.0419 16.9741 17.1045 17.8277C17.1481 18.4237 16.6822 18.922 16.0859 18.9619C13.0409 19.1661 10.9589 19.1667 7.91381 18.9621C7.31766 18.922 6.85192 18.424 6.89553 17.8281C6.95791 16.9758 7.10295 16.0849 7.37825 15.4229C7.65189 14.765 8.36728 14.4975 9.07507 14.4151C11.1997 14.1677 12.756 14.1606 14.9289 14.4145C15.6341 14.4969 16.3469 14.764 16.6202 15.4192Z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_231_6413">
                                    <rect width="16" height="16" fill="white" transform="translate(4 4)" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </button>
                          </li>
                          <li className="custom-toggle">
                            <div className="switcher">
                              <label htmlFor="toggle-0">
                                <span className="small">تبيان الألوان</span>
                                <input type="checkbox" id="toggle-0" />
                                <span>
                                  <small></small>
                                </span>
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>

                      {/* Modal Search */}
                      <div
                        className="fade modal modal-search"
                        id="headerSearch"
                        tabIndex={-1}
                        aria-labelledby="headerSearch"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header container justify-content-end">
                              <button
                                type="button"
                                className="close text-white"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                إغلاق <span aria-hidden="true">×</span>
                              </button>
                            </div>
                            <div className="modal-body pb-0 px-0">
                              <div className="container">
                                <div className="modal-search-title">
                                  <div className="slogan-title text-white mb-4">
                                    نساعدك للوصول إلى ما تبحث عنه
                                  </div>
                                </div>
                                <div className="search-api-form search px-5">
                                  <form
                                    className="form-search"
                                    action="solr-serach-v1"
                                    method="get"
                                    id="form-solr-serach"
                                    acceptCharset="UTF-8"
                                  >
                                    <div className="form-item-search">
                                      <input
                                        className="form-autocomplete form-text form-control ui-autocomplete-input"
                                        type="text"
                                        id="edit-search-api-fulltext"
                                        name="search_api_fulltext"
                                        defaultValue=""
                                        size={30}
                                        maxLength={128}
                                        placeholder="ابحث عن ما تريد"
                                        autoComplete="off"
                                      />
                                      <button
                                        type="submit"
                                        className="btn btn-sm btn-primary px-5"
                                        data-search-url="https://balady.gov.sa"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          const input = document.getElementById(
                                            "edit-search-api-fulltext"
                                          ) as HTMLInputElement;
                                          if (input?.value) {
                                            window.location.href = `https://balady.gov.sa/solr-serach-v1?search_api_fulltext=${encodeURIComponent(input.value)}`;
                                          }
                                        }}
                                      >
                                        بحث
                                      </button>
                                    </div>
                                  </form>
                                  <a
                                    href="https://balady.gov.sa/solr-serach-v1"
                                    className="btn btn-white mx-3"
                                  >
                                    البحث المتقدم
                                  </a>
                                </div>
                              </div>
                              <div className="modal-search-suggestions">
                                <div className="container py-5">
                                  <div className="suggestions-content px-5">
                                    <h3 className="text-dark mb-4">اقتراحات</h3>
                                    <div className="row mb-5">
                                      {/* يمكن إضافة اقتراحات البحث هنا */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>




                </div>
              </div>
            </header>
          </nav>
        </div>
        <span className="clr" />
      </header>
    </div>
  );
}
