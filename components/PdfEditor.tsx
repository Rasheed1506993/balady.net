"use client"

import React, { useEffect, useRef, useCallback, useMemo } from "react"
import { PDFDocument, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

interface PdfEditorProps {
  pdfTemplateUrl: string
  certificateData: any
  onComplete?: () => void
}

const PdfEditor = ({ pdfTemplateUrl, certificateData, onComplete }: PdfEditorProps) => {
  const hasDownloaded = useRef(false)
  const fontCache = useRef<Map<string, any>>(new Map())
  const imageCache = useRef<Map<string, any>>(new Map())

  const colors = useMemo(
    () => ({
      text: rgb(0, 0, 0),
      name: rgb(0.055, 0.447, 0.439),
    }),
    [],
  )

  const downloadFile = useCallback((blob: Blob, filename: string) => {
    try {
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("خطأ في تحميل الملف:", error)
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    }
  }, [])

  const loadFont = useCallback(async (pdfDoc: any, fontUrl: string) => {
    if (fontCache.current.has(fontUrl)) {
      return fontCache.current.get(fontUrl)
    }
    try {
      const fontBytes = await fetch(fontUrl).then((res) => {
        if (!res.ok) throw new Error(`فشل تحميل الخط: ${res.status}`)
        return res.arrayBuffer()
      })
      const customFont = await pdfDoc.embedFont(fontBytes, { subset: true })
      fontCache.current.set(fontUrl, customFont)
      return customFont
    } catch (error) {
      console.error("خطأ في تحميل الخط:", error)
      return null
    }
  }, [])

  const getDefaultImage = useCallback(async (pdfDoc: any, originalUrl: string) => {
    try {
      let defaultImageUrl = "/images/photo.png"
      if (originalUrl?.includes("qr")) {
        defaultImageUrl = "/images/qr-code.png"
      } else if (originalUrl?.includes("logo") || originalUrl?.includes(".jpg")) {
        defaultImageUrl = "/images/riyadh.jpg"
      }
      const response = await fetch(defaultImageUrl, { cache: "force-cache" })
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer()
        if (defaultImageUrl.endsWith(".png")) {
          return await pdfDoc.embedPng(imageBuffer)
        } else {
          return await pdfDoc.embedJpg(imageBuffer)
        }
      }
    } catch (error) {
      console.error("فشل في تحميل الصورة الافتراضية:", error)
    }
    return null
  }, [])

  const convertToPng = useCallback(
    (imageBuffer: ArrayBuffer, contentType: string | null): Promise<ArrayBuffer | null> => {
      return new Promise((resolve) => {
        try {
          const blob = new Blob([imageBuffer], { type: contentType || "image/*" })
          const img = new Image()
          const reader = new FileReader()

          reader.onload = () => {
            img.src = reader.result as string
          }
          reader.onerror = () => resolve(null)
          reader.readAsDataURL(blob)

          img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              canvas.toBlob((blob) => {
                if (blob) {
                  blob.arrayBuffer().then(resolve).catch(() => resolve(null))
                } else {
                  resolve(null)
                }
              }, "image/png")
            } else {
              resolve(null)
            }
          }

          img.onerror = () => resolve(null)
        } catch (error) {
          console.error("خطأ في تحويل الصورة:", error)
          resolve(null)
        }
      })
    },
    [],
  )

  const embedImage = useCallback(
    async (pdfDoc: any, url: string) => {
      if (!url) return null
      if (imageCache.current.has(url)) {
        return imageCache.current.get(url)
      }
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(url, {
          method: "GET",
          mode: "cors",
          cache: "force-cache",
          signal: controller.signal,
          headers: { Accept: "image/*" },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.warn(`فشل تحميل الصورة: ${url} - Status: ${response.status}`)
          return await getDefaultImage(pdfDoc, url)
        }

        const contentType = response.headers.get("content-type")
        const imageBuffer = await response.arrayBuffer()
        let embeddedImage

        if (contentType?.includes("image/png")) {
          embeddedImage = await pdfDoc.embedPng(imageBuffer)
        } else if (contentType?.includes("image/jpeg") || contentType?.includes("image/jpg")) {
          embeddedImage = await pdfDoc.embedJpg(imageBuffer)
        } else {
          const convertedImage = await convertToPng(imageBuffer, contentType)
          if (convertedImage) {
            embeddedImage = await pdfDoc.embedPng(convertedImage)
          }
        }

        if (embeddedImage) {
          imageCache.current.set(url, embeddedImage)
        }

        return embeddedImage
      } catch (err) {
        console.error(`❌ خطأ أثناء تضمين الصورة: ${url}`, err)
        return await getDefaultImage(pdfDoc, url)
      }
    },
    [convertToPng, getDefaultImage],
  )

  const drawRightAlignedText = useCallback(
    (page: any, text: string, baseX: number, y: number, font: any, size: number, color: any) => {
      if (!text || !font) return
      const cleanedText = text.trim()
      const textWidth = font.widthOfTextAtSize(cleanedText, size)
      const adjustedX = baseX * 72 - textWidth
      page.drawText(cleanedText, {
        x: adjustedX,
        y: y * 72,
        font,
        size,
        color,
      })
    },
    [],
  )

  const modifyPdf = useCallback(async () => {
    try {
      const existingPdfBytes = await fetch(pdfTemplateUrl, { cache: "force-cache" }).then((res) => {
        if (!res.ok) throw new Error(`فشل تحميل ملف PDF: ${res.status}`)
        return res.arrayBuffer()
      })

      const pdfDoc = await PDFDocument.load(existingPdfBytes)
      pdfDoc.registerFontkit(fontkit)

      const customFont = await loadFont(pdfDoc, "/fonts/Cairo-Regular.ttf")
      if (!customFont) throw new Error("فشل في تحميل الخط")

      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      // طرح 0.19 من كل قيم y
      const textData = [
        { text: certificateData.name, x: 8.35, y: 9.56 - 0.23, size: 15.7, color: colors.name },
        { text: certificateData.id_number, x: 8.2, y: 8.76 - 0.23, size: 11, color: colors.text },
        { text: certificateData.certificate_number, x: 8.2, y: 8.0 - 0.23, size: 11, color: colors.text },
        { text: certificateData.issue_date, x: 8.2, y: 7.24 - 0.23, size: 11, color: colors.text },
        { text: certificateData.program_type, x: 8.2, y: 6.48 - 0.23, size: 11, color: colors.text },
        { text: certificateData.nationality, x: 5.0, y: 8.76 - 0.23, size: 11, color: colors.text },
        { text: certificateData.profession, x: 5.0, y: 8.0 - 0.23, size: 11, color: colors.text },
        { text: certificateData.expiry_date, x: 5.0, y: 7.24 - 0.23, size: 11, color: colors.text },
        { text: certificateData.program_end_date, x: 5.0, y: 6.48 - 0.23, size: 11, color: colors.text },
      ]

      textData.forEach(({ text, x, y, size, color }) => {
        drawRightAlignedText(firstPage, text, x, y, customFont, size, color)
      })

      const [image1Result, image2Result, imglogoResult] = await Promise.allSettled([
        embedImage(pdfDoc, certificateData.photo_url || "/images/photo.png"),
        embedImage(pdfDoc, certificateData.qr_code_url || "/images/qr-code.png"),
        certificateData.thelogo !== "nothing"
          ? embedImage(pdfDoc, `/images/${certificateData.thelogo}`)
          : Promise.resolve(null),
      ])

      const image1 = image1Result.status === "fulfilled" ? image1Result.value : null
      const image2 = image2Result.status === "fulfilled" ? image2Result.value : null
      const imglogo = imglogoResult.status === "fulfilled" ? imglogoResult.value : null

      const imageData = [
        { image: image1, x: 0.22, y: 8.32 - 0.19, width: 1.62, height: 1.61, name: "photo" },
        { image: image2, x: 0.22, y: 6.42 - 0.19, width: 1.62, height: 1.61, name: "qr" },
        ...(imglogo
          ? [{ image: imglogo, x: 5.85, y: 10.0, width: 0.8, height: 0.84, name: "logo" }]
          : []),
      ]

      imageData.forEach(({ image, x, y, width, height, name }) => {
        if (image) {
          try {
            firstPage.drawImage(image, {
              x: x * 72,
              y: y * 72,
              width: width * 72,
              height: height * 72,
            })
          } catch (error) {
            console.warn(`تعذر رسم الصورة ${name}:`, error)
          }
        } else {
          console.warn(`الصورة ${name} غير متوفرة، سيتم تخطيها`)
        }
      })

      const modifiedPdfBytes = await pdfDoc.save()
      const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" })

      const filename = `${certificateData.name || "certificate"}.pdf`
      downloadFile(blob, filename)

      if (onComplete) onComplete()
    } catch (error) {
      console.error("❌ خطأ في تعديل ملف PDF:", error)
      if (error instanceof Error) {
        alert(`حدث خطأ أثناء تعديل الشهادة: ${error.message}`)
      } else {
        alert(`حدث خطأ أثناء تعديل الشهادة: ${String(error)}`)
      }
      if (onComplete) onComplete()
    }
  }, [pdfTemplateUrl, certificateData, onComplete, loadFont, embedImage, drawRightAlignedText, colors, downloadFile])

  useEffect(() => {
    if (!hasDownloaded.current && pdfTemplateUrl && certificateData) {
      hasDownloaded.current = true
      modifyPdf()
    }
  }, [modifyPdf, pdfTemplateUrl, certificateData])

  useEffect(() => {
    return () => {
      fontCache.current.clear()
      imageCache.current.clear()
    }
  }, [])

  return null
}

export default React.memo(PdfEditor)
