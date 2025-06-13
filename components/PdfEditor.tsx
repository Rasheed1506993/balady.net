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
  // Flag to prevent multiple downloads
  const hasDownloaded = useRef(false);

  /**
   * Modifies the PDF template with certificate data
   * - Loads PDF template
   * - Embeds custom fonts
   * - Adds text fields
   * - Embeds images
   * - Saves the modified PDF
   */
  const modifyPdf = async () => {
    try {
      // Load PDF template
      const existingPdfBytes = await fetch(pdfTemplateUrl).then(res => {
        if (!res.ok) throw new Error(`Failed to load PDF: ${res.status}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      pdfDoc.registerFontkit(fontkit);

      // Load and embed Arabic fonts
      const fontUrl = '/fonts/Cairo-VariableFont_slnt_wght.ttf';
      const fontBytes = await fetch(fontUrl).then(res => {
        if (!res.ok) throw new Error(`Failed to load font: ${res.status}`);
        return res.arrayBuffer();
      });
      
      const fontnameBytes = await fetch('/fonts/Cairo-Regular.ttf').then(res => res.arrayBuffer());
      const customnameFont = await pdfDoc.embedFont(fontnameBytes, { subset: true });
      const customFont = await pdfDoc.embedFont(fontBytes);

      // Get first page and set colors
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const textColor = rgb(0, 0, 0);
      const nameColor = rgb(0.055, 0.447, 0.439);

      /**
       * Draws right-aligned text on the PDF
       * @param text - Text to display
       * @param baseX - X position in inches (from right edge)
       * @param y - Y position in inches
       * @param font - Font to use
       * @param size - Font size
       * @param color - Text color
       */
      const drawRightAlignedText = (text: string, baseX: number, y: number, font: any, size: number, color: any) => {
        const cleanedText = text.trim();
        const textWidth = font.widthOfTextAtSize(cleanedText, size);
        const adjustedX = (baseX * 72) - textWidth; // Convert inches to points and adjust for text width

        firstPage.drawText(cleanedText, {
          x: adjustedX,
          y: y * 72, // Convert inches to points
          font,
          size,
          color,
        });
      };

      // Add all text fields to the PDF
      drawRightAlignedText(certificateData.name, 8.35, 9.56, customnameFont, 18.7, nameColor);
      drawRightAlignedText(certificateData.id_number, 8.2, 8.76, customFont, 11, textColor);
      drawRightAlignedText(certificateData.certificate_number, 8.2, 8.0, customFont, 11, textColor);
      drawRightAlignedText(certificateData.issue_date, 8.2, 7.24, customFont, 11, textColor);
      drawRightAlignedText(certificateData.program_type, 8.2, 6.48, customFont, 11, textColor);
      drawRightAlignedText(certificateData.nationality, 5.0, 8.76, customFont, 11, textColor);
      drawRightAlignedText(certificateData.profession, 5.0, 8.0, customFont, 11, textColor);
      drawRightAlignedText(certificateData.expiry_date, 5.0, 7.24, customFont, 11, textColor);
      drawRightAlignedText(certificateData.program_end_date, 5.0, 6.48, customFont, 11, textColor);

      /**
       * Embeds an image into the PDF with automatic conversion to PNG if needed
       * @param url - Image URL
       * @returns Promise with embedded image or null if failed
       */
      const embedImage = async (url: string) => {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`Failed to load image: ${url} - Status: ${response.status}`);
            return null;
          }

          const contentType = response.headers.get("content-type");
          const imageBuffer = await response.arrayBuffer();

          // Handle different image types
          if (contentType?.includes("image/png")) {
            return await pdfDoc.embedPng(imageBuffer);
          } else if (contentType?.includes("image/jpeg") || contentType?.includes("image/jpg")) {
            return await pdfDoc.embedJpg(imageBuffer);
          } else {
            // Convert unsupported formats to PNG
            const blob = new Blob([imageBuffer], { type: contentType || 'image/*' });
            const convertedBase64 = await convertToPngBase64(blob);
            if (!convertedBase64) return null;

            const pngArrayBuffer = await fetch(convertedBase64).then(res => res.arrayBuffer());
            return await pdfDoc.embedPng(pngArrayBuffer);
          }
        } catch (err) {
          console.error(`Error embedding image: ${url}`, err);
          return null;
        }
      };

      /**
       * Converts any image blob to PNG base64 using canvas
       * @param blob - Image blob
       * @returns Promise with base64 PNG data URL
       */
      const convertToPngBase64 = (blob: Blob) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          const reader = new FileReader();

          reader.onload = () => {
            img.src = reader.result as string;
          };
          reader.onerror = () => reject(null);
          reader.readAsDataURL(blob);

          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(null);
            
            ctx.drawImage(img, 0, 0);
            const pngDataUrl = canvas.toDataURL("image/png");
            resolve(pngDataUrl);
          };
          img.onerror = () => reject(null);
        });
      };

      // Embed profile photo
      const profileImage = await embedImage(certificateData.photo_url || "/images/default.jpg");
      if (profileImage) {
        firstPage.drawImage(profileImage, {
          x: 0.22 * 72,
          y: 8.32 * 72,
          width: 1.62 * 72,
          height: 1.61 * 72,
        });
      }

      // Embed QR code
      const qrCodeImage = await embedImage(certificateData.qr_code_url || "/images/default.jpg");
      if (qrCodeImage) {
        firstPage.drawImage(qrCodeImage, {
          x: 0.22 * 72,
          y: 6.42 * 72,
          width: 1.62 * 72,
          height: 1.61 * 72,
        });
      }

      // Embed logo
      const logoImage = await embedImage(`/images/${certificateData.thelogo}`);
      if (logoImage) {
        firstPage.drawImage(logoImage, {
          x: 5.85 * 72,
          y: 10.0 * 72,
          width: 0.8 * 72,
          height: 0.84 * 72,
        });
      }

      // Embed instructions image
      const instructionsImage = await embedImage("/images/instructions-full.png");
      if (instructionsImage) {
        firstPage.drawImage(instructionsImage, {
          x: 0 * 72,
          y: 0.4 * 72,
          width: 8.5 * 72,
          height: 5.35 * 72,
        });
      }

      // Save and download the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      saveAs(blob, `${certificateData.name || "certificate"}.pdf`);

      // Call completion callback if provided
      onComplete?.();

    } catch (error) {
      console.error("Error modifying PDF:", error);
      alert(`Error generating certificate: ${error instanceof Error ? error.message : String(error)}`);
      onComplete?.();
    }
  };

  // Trigger PDF modification when component mounts or props change
  useEffect(() => {
    if (!hasDownloaded.current && pdfTemplateUrl && certificateData) {
      hasDownloaded.current = true;
      modifyPdf();
    }
  }, [pdfTemplateUrl, certificateData]);

  // This component doesn't render anything
  return null;
};

export default PdfEditor;