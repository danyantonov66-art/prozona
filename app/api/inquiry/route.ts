import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { specialistId, name, email, phone, message, city, categoryId } = body

    if (!name || !email || !message || !city || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let specialist = null
    if (specialistId) {
      specialist = await prisma.specialist.findUnique({
        where: { id: specialistId },
        include: { user: true }
      })
      if (!specialist) {
        return NextResponse.json({ error: "Specialist not found" }, { status: 404 })
      }
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        specialistId: specialistId || null,
        name,
        email,
        phone: phone || null,
        message,
        city,
        categoryId: Number(categoryId),
        status: "PENDING",
      },
    })

    // ✅ Изпрати имейл известие до специалиста
    if (specialist?.user?.email) {
      const specialistName = specialist.businessName || specialist.user.name || "Специалист"
      const dashboardUrl = `https://www.prozona.bg/bg/specialist/dashboard`

      await resend.emails.send({
        from: "ProZona <office@prozona.bg>",
        to: specialist.user.email,
        subject: `📩 Ново запитване от ${name} — ProZona`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
                <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
              </div>
            </div>

            <h1 style="color: #1DB954; font-size: 24px; margin-bottom: 8px;">
              📩 Ново запитване!
            </h1>
            <p style="color: #cccccc; font-size: 16px; margin-bottom: 24px;">
              Здравей, ${specialistName}! Имаш ново запитване от клиент в ProZona.
            </p>

            <div style="background: #151528; border: 1px solid #1DB954/30; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #888; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">От</p>
              <p style="color: #ffffff; font-size: 16px; font-weight: bold; margin: 0 0 16px;">${name}</p>

              <p style="color: #888; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">Град</p>
              <p style="color: #ffffff; font-size: 16px; margin: 0 0 16px;">📍 ${city}</p>

              <p style="color: #888; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">Съобщение</p>
              <p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin: 0; background: #0D0D1A; padding: 12px; border-radius: 8px;">${message}</p>
            </div>

            <div style="background: #1DB954/10; border: 1px solid #333; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <p style="color: #888; font-size: 13px; margin: 0 0 4px;">
                🔒 Контактите на клиента са скрити. Отключи запитването с 1 кредит за да видиш телефон и имейл.
              </p>
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}"
                style="background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                Виж запитването →
              </a>
            </div>

            <p style="color: #444; font-size: 12px; text-align: center; margin-top: 32px;">
              ProZona.bg — Платформата за професионални услуги в България
            </p>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error("Inquiry create error:", error)
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}