import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  const inq = await prisma.inquiry.findUnique({
    where: { id },
    include: {
      specialist: { include: { user: { select: { name: true, email: true } } } },
      Category: { select: { name: true } },
    },
  })

  if (!inq || !inq.specialist?.user?.email) {
    return NextResponse.json({ error: "Inquiry or specialist not found" }, { status: 404 })
  }

  const specialistEmail = inq.specialist.user.email
  const specialistName = inq.specialist.user.name || "Специалист"

  // Изпрати email чрез съществуващия email endpoint
  try {
    await fetch(`${process.env.NEXTAUTH_URL}/api/admin/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: specialistEmail,
        subject: `🔔 Имате ново запитване в ProZona`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1DB954;">Здравейте, ${specialistName}!</h2>
            <p>Имате <strong>чакащо запитване</strong> от клиент в ProZona, което все още не е получило отговор.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; color: #888;">Клиент:</td>
                <td style="padding: 8px; color: #fff;">${inq.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #888;">Категория:</td>
                <td style="padding: 8px; color: #fff;">${inq.Category?.name || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #888;">Град:</td>
                <td style="padding: 8px; color: #fff;">${inq.city}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #888;">Дата:</td>
                <td style="padding: 8px; color: #fff;">${new Date(inq.createdAt).toLocaleDateString("bg-BG")}</td>
              </tr>
            </table>
            <a href="${process.env.NEXTAUTH_URL}/bg/specialist/inquiries" 
               style="display: inline-block; background: #1DB954; color: black; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Виж запитването →
            </a>
            <p style="margin-top: 20px; color: #888; font-size: 12px;">
              Това е автоматично напомняне от ProZona.bg
            </p>
          </div>
        `,
      }),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }

  return NextResponse.redirect(
    `${process.env.NEXTAUTH_URL}/bg/admin/inquiries/${id}?reminded=1`
  )
}