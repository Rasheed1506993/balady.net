"use client";

import React, { useEffect, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import fontkit from "@pdf-lib/fontkit";

interface PdfEditorProps {
  pdfTemplateUrl: string;
  certificateData: any;
  onComplete?: () => void;
}

const PdfEditor = ({ pdfTemplateUrl, certificateData, onComplete }: PdfEditorProps) => {
  const hasDownloaded = useRef(false);

  const modifyPdf = async () => {
    try {
      const existingPdfBytes = await fetch(pdfTemplateUrl).then(res => {
        if (!res.ok) throw new Error(`فشل تحميل ملف PDF: ${res.status}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      const fontUrl = '/fonts/Cairo-VariableFont_slnt_wght.ttf';
      const fontBytes = await fetch(fontUrl).then(res => {
        if (!res.ok) throw new Error(`فشل تحميل الخط: ${res.status}`);
        return res.arrayBuffer();
      });

      const customFont = await pdfDoc.embedFont(fontBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const textColor = rgb(0, 0, 0);
      const nameColor = rgb(0.055, 0.447, 0.439);

      // ✅ دالة لمحاذاة النص إلى اليمين
      const drawRightAlignedText = (text, baseX, y, font, size, color) => {
        const cleanedText = text.trim();
        const textWidth = font.widthOfTextAtSize(cleanedText, size);
        const adjustedX = (baseX * 72) - textWidth;

        firstPage.drawText(cleanedText, {
          x: adjustedX,
          y: y * 72,
          font,
          size,
          color,
        });
      };

      // ✅ النصوص بعد تطبيق محاذاة اليمين
      drawRightAlignedText(certificateData.name, 8.35, 9.56, customFont, 18.7, nameColor);
      drawRightAlignedText(certificateData.id_number, 8.2, 8.76, customFont, 11, textColor);
      drawRightAlignedText(certificateData.certificate_number, 8.2, 8.0, customFont, 11, textColor);
      drawRightAlignedText(certificateData.issue_date, 8.2, 7.24, customFont, 11, textColor);
      drawRightAlignedText(certificateData.program_type, 8.2, 6.48, customFont, 11, textColor);
      drawRightAlignedText(certificateData.nationality, 5.0, 8.76, customFont, 11, textColor);
      drawRightAlignedText(certificateData.profession, 5.0, 8.0, customFont, 11, textColor);
      drawRightAlignedText(certificateData.expiry_date, 5.0, 7.24, customFont, 11, textColor);
      drawRightAlignedText(certificateData.program_end_date, 5.0, 6.48, customFont, 11, textColor);

      // 🧠 دالة تضمين الصورة مع التحويل التلقائي عند الحاجة
      const embedImage = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`فشل تحميل الصورة: ${url} - Status: ${response.status}`);
            return null;
          }

          const contentType = response.headers.get("content-type");
          const imageBuffer = await response.arrayBuffer();

          if (contentType?.includes("image/png")) {
            return await pdfDoc.embedPng(imageBuffer);
          } else if (contentType?.includes("image/jpeg") || contentType?.includes("image/jpg")) {
            return await pdfDoc.embedJpg(imageBuffer);
          } else {
            const blob = new Blob([imageBuffer], { type: contentType || 'image/*' });
            const convertedBase64 = await convertToPngBase64(blob);
            if (!convertedBase64) return null;

            const pngArrayBuffer = await fetch(convertedBase64).then(res => res.arrayBuffer());
            return await pdfDoc.embedPng(pngArrayBuffer);
          }
        } catch (err) {
          console.error(`❌ خطأ أثناء تضمين الصورة: ${url}`, err);
          return null;
        }
      };

      // 🛠️ تحويل أي صورة إلى PNG base64 باستخدام canvas
      const convertToPngBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();

          reader.onload = () => {
            img.src = reader.result;
          };
          reader.onerror = () => reject(null);
          reader.readAsDataURL(blob);

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL("image/png");
            resolve(pngDataUrl);
          };
          img.onerror = () => reject(null);
        });
      };

      // 📸 الصورة الشخصية
      const image1 = await embedImage(certificateData.photo_url || "/images/default.jpg");
      if (image1) {
        firstPage.drawImage(image1, {
          x: 0.22 * 72,
          y: 8.32 * 72,
          width: 1.62 * 72,
          height: 1.61 * 72,
        });
      }

      // 📸 رمز الاستجابة السريع
      const image2 = await embedImage(certificateData.qr_code_url || "/images/default.jpg");
      if (image2) {
        firstPage.drawImage(image2, {
          x: 0.22 * 72,
          y: 6.42 * 72,
          width: 1.62 * 72,
          height: 1.61 * 72,
        });
      }

      // 🏢 الشعار
      const imglogo = await embedImage(`/images/${certificateData.thelogo}`);
      if (imglogo) {
        firstPage.drawImage(imglogo, {
          x: 5.85 * 72,
          y: 10.0 * 72,
          width: 0.8 * 72,
          height: 0.84 * 72,
        });
      }

      // 📋 صورة التعليمات
      const imagefot = await embedImage("/images/instructions-full.png");
      if (imagefot) {
        firstPage.drawImage(imagefot, {
          x: 0 * 72,
          y: 0.4 * 72,
          width: 8.5 * 72,
          height: 5.35 * 72,
        });
      }



      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      saveAs(blob, `${certificateData.name || "certificate"}.pdf`);

      if (onComplete) {
        onComplete();
      }

    } catch (error) {
      console.error("❌ خطأ في تعديل ملف PDF:", error);
      alert(`حدث خطأ أثناء تعديل الشهادة: ${error.message}`);
      if (onComplete) {
        onComplete();
      }
    }
  };

  useEffect(() => {
    if (!hasDownloaded.current && pdfTemplateUrl && certificateData) {
      hasDownloaded.current = true;
      modifyPdf();
    }
  }, [pdfTemplateUrl, certificateData]);

  return null;
};

export default PdfEditor;