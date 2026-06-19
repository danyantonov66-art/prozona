import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PDFDocument, rgb } from 'pdf-lib'
// @ts-expect-error - няма официални типове за fontkit
import fontkit from '@pdf-lib/fontkit'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { offer, clientName } = await req.json()
    if (!offer || typeof offer !== 'string') {
      return NextResponse.json({ error: 'Липсва текст на офертата.' }, { status: 400 })
    }

    const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSans-Regular.ttf')
    const fontBytes = fs.readFileSync(fontPath)

    const pdfDoc = await PDFDocument.create()
    pdfDoc.registerFontkit(fontkit)
    const font = await pdfDoc.embedFont(fontBytes)

    const pageWidth = 595.28
    const pageHeight = 841.89
    const margin = 50
    const fontSize = 11
    const lineHeight = 16
    const maxWidth = pageWidth - margin * 2

    function wrapText(text: string): string[] {
      const lines: string[] = []
      for (const rawLine of text.split('\n')) {
        if (rawLine.trim() === '') {
          lines.push('')
          continue
        }
        const words = rawLine.split(' ')
        let current = ''
        for (const word of words) {
          const test = current ? current + ' ' + word : word
          const width = font.widthOfTextAtSize(test, fontSize)
          if (width > maxWidth && current) {
            lines.push(current)
            current = word
          } else {
            current = test
          }
        }
        if (current) lines.push(current)
      }
      return lines
    }

    const lines = wrapText(offer)

    let page = pdfDoc.addPage([pageWidth, pageHeight])
    let y = pageHeight - margin

    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight])
        y = pageHeight - margin
      }
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      })
      y -= lineHeight
    }

    const pdfBytes = await pdfDoc.save()

    // HTTP header-ите поддържат само ASCII — премахваме кирилица и спец. символи изцяло
    const safeName = (clientName || 'klient')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'klient'

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="oferta-${safeName}.pdf"`,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Грешка при генериране на PDF.' }, { status: 500 })
  }
}
