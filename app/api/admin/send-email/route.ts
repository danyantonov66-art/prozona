// app/api/admin/send-email/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { to, name, type, specialistId } = await request.json()

    if (!to || !name || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const editProfileUrl = `https://www.prozona.bg/bg/specialist/profile/edit`

    if (type === "complete_profile") {
      await resend.emails.send({
        from: "ProZona <office@prozona.bg>",
        to,
        subject: "⚠️ Моля попълни профила си в ProZona",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0D1A; color: #ffffff; padding: 40px; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-block; background: #1DB954; padding: 12px 24px; border-radius: 8px;">
                <span style="color: #0D0D1A; font-size: 24px; font-weight: bold;">PZ ProZona</span>
              </div>
            </div>

            <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">
              Здравей, ${name}! ☀️ Хубав и успешен ден ти желаем!
            </h1>

            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
              Забелязахме, че профилът ти в <strong style="color: #1DB954;">ProZona</strong> все още не е напълно попълнен.
            </p>

            <p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              За да бъдеш <strong style="color: #1DB954;">верифициран</strong> и да започнеш да получаваш запитвания от клиенти, трябва да попълниш:
            </p>

            <div style="background: #151528; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #ff6b6b; font-size: 18px; margin-right: 12px;">❌</span>
                <span style="color: #ffffff; font-size: 15px;"><strong>Категория и подкатегория</strong> — в какво се специализираш</span>
              </div>
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #ffd93d; font-size: 18px; margin-right: 12px;">⚠️</span>
                <span style="color: #cccccc; font-size: 15px;">Описание на услугите ти</span>
              </div>
              <div style="display: flex; align-items: center;">
                <span style="color: #ffd93d; font-size: 18px; margin-right: 12px;">⚠️</span>
                <span style="color: #cccccc; font-size: 15px;">Профилна снимка</span>
              </div>
            </div>

            <p style="color: #cccccc; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              Специалистите с попълнен профил получават <strong style="color: #1DB954;">3 пъти повече запитвания</strong> от клиенти.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${editProfileUrl}"
                style="background: #1DB954; color: #0D0D1A; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
                ✅ Попълни профила си →
              </a>
            </div>

            <p style="color: #666; font-size: 13px; text-align: center; margin-top: 32px;">
              Ако имаш въпроси, пиши ни на <a href="mailto:office@prozona.bg" style="color: #1DB954;">office@prozona.bg</a>
            </p>
            <p style="color: #444; font-size: 12px; text-align: center;">
              ProZona.bg — Платформата за професионални услуги в България
            </p>
          </div>
        `
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send email error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}